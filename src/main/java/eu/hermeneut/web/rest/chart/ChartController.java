/*
 * Copyright 2019 HERMENEUT Consortium
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package eu.hermeneut.web.rest.chart;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.enumeration.AnswerLikelihood;
import eu.hermeneut.domain.enumeration.ContainerType;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;
import eu.hermeneut.domain.enumeration.Status;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.*;
import eu.hermeneut.utils.likelihood.answer.AnswerCalculator;
import org.apache.commons.math3.util.Precision;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chart")
public class ChartController {

    @Autowired
    private QuestionnaireStatusService questionnaireStatusService;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private AnswerService answerService;

    @Autowired
    private MyAnswerService myAnswerService;

    @Autowired
    private VulnerabilityAreaService vulnerabilityAreaService;

    @Autowired
    private AnswerCalculator answerCalculator;

    @GetMapping("/radar/vulnerability/{questionnaireStatusID}")
    public Map<Long/*VulnerabilityArea.ID*/, Map<ContainerType, Float/*Vulnerability*/>> getVulnerabilityRadar(@PathVariable Long questionnaireStatusID) throws NotFoundException {

        QuestionnaireStatus questionnaireStatus = this.questionnaireStatusService.findOne(questionnaireStatusID);

        if (questionnaireStatus == null) {
            throw new NotFoundException("QuestionnaireStatus not found!");
        } else if (questionnaireStatus.getRefinement() != null) { // Switch to the Refinement's one
            questionnaireStatus = questionnaireStatus.getRefinement();
        }

        Questionnaire questionnaire = questionnaireStatus.getQuestionnaire();

        if (questionnaire == null) {
            throw new NotFoundException("Questionnaire not found!");
        }

        QuestionnairePurpose purpose = questionnaire.getPurpose();

        if (purpose == null) {
            throw new NotFoundException("QuestionnairePurpose not found!");
        } else if (!QuestionnairePurpose.SELFASSESSMENT.equals(purpose)) {
            throw new IllegalArgumentException("QuestionnairePurpose is not SelfAssessment!");
        }

        Status status = questionnaireStatus.getStatus();

        if (status == null) {
            throw new IllegalArgumentException("Status must not be null!");
        } else if (!Status.FULL.equals(status)) {
            throw new IllegalArgumentException("Status must be FULL");
        }

        List<MyAnswer> myAnswers = this.myAnswerService.findAllByQuestionnaireStatus(questionnaireStatusID);

        if (myAnswers == null || myAnswers.isEmpty()) {
            throw new NotFoundException("MyAnswers not found!");
        }

        List<Question> questions = this.questionService.findAllByQuestionnaire(questionnaire);

        if (questions == null || questions.isEmpty()) {
            throw new NotFoundException("Questions not found!");
        }

        List<VulnerabilityArea> areas = this.vulnerabilityAreaService.findAll();

        // Keep only the Questions belonging to a certain VulnerabilityArea
        if (areas != null && !areas.isEmpty()) {
            Map<Long, VulnerabilityArea> areasMap = areas.stream().parallel().collect(Collectors.toMap(
                VulnerabilityArea::getId,
                Function.identity()
            ));

            questions = questions.stream().parallel().filter((question) -> {
                Set<VulnerabilityArea> vulnerabilityAreas = question.getAreas();

                if (vulnerabilityAreas != null && !vulnerabilityAreas.isEmpty()) {
                    return vulnerabilityAreas.stream().parallel().anyMatch(vulnerabilityArea -> areasMap.containsKey(vulnerabilityArea.getId()));
                } else {
                    return false;
                }
            }).collect(Collectors.toList());
        }

        Map<Long/*AreaID*/, List<Question>> questionsByAreaIDMap = questions.stream().parallel()
            .flatMap(question -> question.getAreas().stream().parallel()
                .map(area -> new AbstractMap.SimpleEntry<VulnerabilityArea, Question>(area, question)))
            .collect(Collectors.groupingBy(o -> o.getKey().getId(), Collectors.mapping(Map.Entry::getValue, Collectors.toList())));

        Map<Long/*AreaID*/, List<MyAnswer>> myAnswersByAreaIDMap = myAnswers.stream().parallel()
            .flatMap(myAnswer -> myAnswer.getQuestion().getAreas().stream().parallel()
                .map(area -> new AbstractMap.SimpleEntry<VulnerabilityArea, MyAnswer>(area, myAnswer)))
            .collect(Collectors.groupingBy(o -> o.getKey().getId(), Collectors.mapping(Map.Entry::getValue, Collectors.toList())));


        Map<Long/*VulnerabilityArea.ID*/, Map<ContainerType, Float/*Vulnerability*/>> vulnerabilitiesByAreaDataSet = new HashMap<>();

        if (areas != null && !areas.isEmpty()) {
            Random random = new Random();

            // Calculate the vulnerability for each AREA by the corresponding MyAnswers previously stored.
            for (VulnerabilityArea area : areas) {
                List<MyAnswer> areaAnswers = myAnswersByAreaIDMap.get(area.getId());

                if (areaAnswers != null && !areaAnswers.isEmpty()) {
                    Set<MyAnswer> answerSet = new HashSet<>(areaAnswers);

                    Map<ContainerType, Float> vulnerabilities = new HashMap<>();

                    vulnerabilities.put(ContainerType.HUMAN, this.answerCalculator.getAnswersVulnerability(answerSet, ContainerType.HUMAN));
                    vulnerabilities.put(ContainerType.IT, this.answerCalculator.getAnswersVulnerability(answerSet, ContainerType.IT));
                    vulnerabilities.put(ContainerType.PHYSICAL, this.answerCalculator.getAnswersVulnerability(answerSet, ContainerType.PHYSICAL));

                    vulnerabilitiesByAreaDataSet.put(area.getId(), vulnerabilities);
                }
            }

            int maxContainerVulnerability = AnswerLikelihood.LOW.getValue() * areas.size();

            Map<ContainerType, Float> totalVulnerabilitiesByContainer = new HashMap<>();
            vulnerabilitiesByAreaDataSet.put(-1L, totalVulnerabilitiesByContainer);

            // Calculate the Total Vulnerability % for each of the containers
            for (ContainerType containerType : ContainerType.values()) {
                if (containerType.equals(ContainerType.INTANGIBLE)) {
                    break;
                }

                float vulnerabilitiesSum = 0F;

                for (VulnerabilityArea area : areas) {
                    Map<ContainerType, Float> vulnerabilities = vulnerabilitiesByAreaDataSet.get(area.getId());

                    if (vulnerabilities != null && !vulnerabilities.isEmpty()) {
                        vulnerabilitiesSum += vulnerabilities.get(containerType);
                    }
                }

                float totalVulnerabilityPercentage = Precision.round(vulnerabilitiesSum / maxContainerVulnerability, 2);
                totalVulnerabilitiesByContainer.put(containerType, totalVulnerabilityPercentage);
            }

        }

        return vulnerabilitiesByAreaDataSet;
    }
}