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

package eu.hermeneut.service.impl.completion;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.dto.AssessVulnerabilitiesCompletionDTO;
import eu.hermeneut.domain.enumeration.ContainerType;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;
import eu.hermeneut.domain.enumeration.Role;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.CompanyProfileService;
import eu.hermeneut.service.MyAnswerService;
import eu.hermeneut.service.QuestionnaireStatusService;
import eu.hermeneut.service.completion.CompletionService;
import eu.hermeneut.service.impl.QuestionServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@Transactional
public class CompletionServiceImpl implements CompletionService {

    @Autowired
    private CompanyProfileService companyProfileService;

    @Autowired
    private QuestionnaireStatusService questionnaireStatusService;

    @Autowired
    private QuestionServiceImpl questionService;

    @Autowired
    private MyAnswerService myAnswerService;


    @Override
    public AssessVulnerabilitiesCompletionDTO getAssessVulnerabilitiesCompletion(Long companyProfileID) throws NotFoundException {
        CompanyProfile companyProfile = this.companyProfileService.findOne(companyProfileID);

        if (companyProfile == null) {
            throw new NotFoundException("CompanyProfile not found!");
        }

        QuestionnaireStatus questionnaireStatus = this.questionnaireStatusService
            .findAllByCompanyProfileQuestionnairePurposeAndRole(
                companyProfileID,
                QuestionnairePurpose.SELFASSESSMENT,
                Role.ROLE_CISO)
            .stream()
            .sorted(Comparator.reverseOrder())//Consider only the latest created.
            .findFirst().orElse(null);

        if (questionnaireStatus == null) {
            throw new NotFoundException("QuestionnaireStatus not found!");
        }

        return this.getAssessVulnerabilitiesCompletion(companyProfileID, questionnaireStatus.getId());
    }

    @Override
    public AssessVulnerabilitiesCompletionDTO getAssessVulnerabilitiesCompletion(Long companyProfileID, Long questionnaireStatusID) throws NotFoundException {
        QuestionnaireStatus questionnaireStatus = this.questionnaireStatusService.findOne(questionnaireStatusID);

        if (questionnaireStatus == null) {
            throw new NotFoundException("QuestionnaireStatus not found!");
        }

        AssessVulnerabilitiesCompletionDTO completion = new AssessVulnerabilitiesCompletionDTO();
        completion.setQuestionnaireStatusID(questionnaireStatus.getId());

        Questionnaire questionnaire = questionnaireStatus.getQuestionnaire();

        if (questionnaire != null) {
            List<Question> humanQuestions = this.questionService.findAllByQuestionnaireAndSection(questionnaire, ContainerType.HUMAN);
            List<MyAnswer> humanMyAnswers = this.myAnswerService.findAllByQuestionnaireStatusAndSection(questionnaireStatus, ContainerType.HUMAN);

            if (humanQuestions != null && humanMyAnswers != null) {
                if (!humanQuestions.isEmpty() && !humanMyAnswers.isEmpty()) {
                    completion.setHuman((float) humanMyAnswers.size() / (float) humanQuestions.size());
                }
            }

            List<Question> itQuestions = this.questionService.findAllByQuestionnaireAndSection(questionnaire, ContainerType.IT);
            List<MyAnswer> itMyAnswers = this.myAnswerService.findAllByQuestionnaireStatusAndSection(questionnaireStatus, ContainerType.IT);

            if (itQuestions != null && itMyAnswers != null) {
                if (!itQuestions.isEmpty() && !itMyAnswers.isEmpty()) {
                    completion.setIt((float) itMyAnswers.size() / (float) itQuestions.size());
                }
            }

            List<Question> physicalQuestions = this.questionService.findAllByQuestionnaireAndSection(questionnaire, ContainerType.PHYSICAL);
            List<MyAnswer> physicalMyAnswers = this.myAnswerService.findAllByQuestionnaireStatusAndSection(questionnaireStatus, ContainerType.PHYSICAL);


            if (physicalQuestions != null && physicalMyAnswers != null) {
                if (!physicalQuestions.isEmpty() && !physicalMyAnswers.isEmpty()) {
                    completion.setPhysical((float) physicalMyAnswers.size() / (float) physicalQuestions.size());
                }
            }
        }

        return completion;
    }
}