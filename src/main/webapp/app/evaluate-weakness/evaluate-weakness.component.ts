import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiEventManager, JhiAlertService} from 'ng-jhipster';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../entities/self-assessment-mgm';
import {
    AttackStrategyMgm,
    SkillLevel as AttackStrategyDifficulty,
    Frequency,
    ResourceLevel,
    Likelihood
} from '../entities/attack-strategy-mgm/attack-strategy-mgm.model';
import {AttackStrategyMgmService} from '../entities/attack-strategy-mgm/attack-strategy-mgm.service';
import {Principal} from '../shared';
import {LevelMgm, LevelMgmService} from '../entities/level-mgm';
import {PhaseMgm, PhaseMgmService} from '../entities/phase-mgm';
import {Observable} from 'rxjs/Observable';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {isUndefined} from 'util';
import {ThreatAgentMgm, SkillLevel as ThreatAgentSkills} from '../entities/threat-agent-mgm';

@Component({
    selector: 'jhi-evaluate-weakness',
    templateUrl: './evaluate-weakness.component.html',
    styleUrls: [
        './evaluate-weakness.css'
    ]
})
export class EvaluateWeaknessComponent implements OnInit, OnDestroy {
    attackStrategies: AttackStrategyMgm[];
    attackLayers: LevelMgm[];
    cyberKillChainPhases: PhaseMgm[];
    attacksCKC7Matrix: AttackStrategyMgm[][][];

    likelihoodEnum = Likelihood;

    account: Account;
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    selectedSelfAssessment: SelfAssessmentMgm = {};
    selectedThreatAgent: ThreatAgentMgm;

    constructor(private attackStrategyService: AttackStrategyMgmService,
                private jhiAlertService: JhiAlertService,
                private eventManager: JhiEventManager,
                private activatedRoute: ActivatedRoute,
                private principal: Principal,
                private mySelfAssessmentService: SelfAssessmentMgmService,
                private levelService: LevelMgmService,
                private phaseService: PhaseMgmService) {
    }

    ngOnInit() {
        console.log('Evaluate weakness onInit');
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.selectedSelfAssessment = this.mySelfAssessmentService.getSelfAssessment();
        this.registerChangeInEvaluateWeakness();

        const observables: Observable<HttpResponse<any>>[] = [];
        observables.push(this.levelService.query());
        observables.push(this.phaseService.query());
        observables.push(this.attackStrategyService.query());

        forkJoin(observables).toPromise()
            .then((responses: HttpResponse<any>[]) => {
                responses.forEach((value: HttpResponse<any>, index: Number, array: HttpResponse<any>[]) => {
                    switch (index) {
                        case 0: {// attack-layers
                            this.attackLayers = value.body as LevelMgm[];
                            break;
                        }
                        case 1: {// ckc7-phases
                            this.cyberKillChainPhases = value.body as PhaseMgm[];
                            break;
                        }
                        case 2: {// attack-strategies
                            this.attackStrategies = value.body as AttackStrategyMgm[];
                            break;
                        }
                    }
                });

                this.attacksCKC7Matrix = [];

                this.attackStrategies.forEach(((attackStrategy: AttackStrategyMgm) => {
                    attackStrategy.levels.forEach((level: LevelMgm) => {
                        if (isUndefined(this.attacksCKC7Matrix[level.id])) {
                            this.attacksCKC7Matrix[level.id] = [];
                        }

                        attackStrategy.phases.forEach((phase: PhaseMgm) => {
                            if (isUndefined(this.attacksCKC7Matrix[level.id][phase.id])) {
                                this.attacksCKC7Matrix[level.id][phase.id] = [];
                            }

                            this.attacksCKC7Matrix[level.id][phase.id].push(attackStrategy);
                        });
                    });
                }));

                console.log('CKC7 matrix...');
                console.log(JSON.stringify(this.attacksCKC7Matrix));

                console.log('HUMAN-RECONNAISSANCE');
                console.log(JSON.stringify(this.attacksCKC7Matrix[1][1]));
            });
    }

    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: AttackStrategyMgm) {
        return item.id;
    }

    registerChangeInEvaluateWeakness() {
        this.eventSubscriber = this.eventManager.subscribe('WeaknessListModification', (response) => this.ngOnInit());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    threatAgentChanged(threatAgent: ThreatAgentMgm) {
        console.log('ThreatAgent Changed: ' + threatAgent.name);
    }

    isAttackPossible(threatAgentSkills: ThreatAgentSkills, attackStrategyDifficulty: AttackStrategyDifficulty): boolean {

        console.log('ENTER isAttackPossible...');

        console.log(threatAgentSkills); // String
        const threatAgentSkillsValue = ThreatAgentSkills[threatAgentSkills];
        console.log(threatAgentSkillsValue); // Number

        console.log(attackStrategyDifficulty); // String
        const attackStrategyDifficultyValue = AttackStrategyDifficulty[attackStrategyDifficulty];
        console.log(attackStrategyDifficultyValue); // Number

        return threatAgentSkillsValue >= attackStrategyDifficultyValue;
    }

    attackStrategyInitialLikelihood(attackStrategy: AttackStrategyMgm): Likelihood {
        const frequencyValue = Number(Frequency[attackStrategy.frequency]);
        const resourcesValue = Number(ResourceLevel[attackStrategy.resources]);

        const initialLikelihoodMatrix: {} = {
            1: {3: Likelihood.LOW, 2: Likelihood.LOW_MEDIUM, 1: Likelihood.MEDIUM},
            2: {3: Likelihood.LOW_MEDIUM, 2: Likelihood.MEDIUM, 1: Likelihood.MEDIUM_HIGH},
            3: {3: Likelihood.MEDIUM, 2: Likelihood.MEDIUM_HIGH, 1: Likelihood.HIGH}
        };

        console.log('Matrix:');
        console.log(JSON.stringify(initialLikelihoodMatrix));

        // Reducing matrix index by one, since it's zero-based
        const likelihood: Likelihood = initialLikelihoodMatrix[frequencyValue][resourcesValue];
        console.log('Likelihood: ' + likelihood);

        return likelihood;
    }

    attackStrategyColorStyleClass(attackStrategy: AttackStrategyMgm): string {

        // First check if the attack is possible for the selected ThreatAgent
        if (this.selectedThreatAgent) {
            if (this.isAttackPossible(this.selectedThreatAgent.skillLevel, attackStrategy.skill)) {
                // Get the initial likelihood of the AttackStrategy
                const likelihood: Likelihood = this.attackStrategyInitialLikelihood(attackStrategy);

                // TODO update the initial likelihood with the data from the self-assessment answers.

                switch (likelihood) {
                    case Likelihood.LOW: {
                        return 'low';
                    }
                    case Likelihood.LOW_MEDIUM: {
                        return 'low-medium';
                    }
                    case Likelihood.MEDIUM: {
                        return 'medium';
                    }
                    case Likelihood.MEDIUM_HIGH: {
                        return 'medium-high';
                    }
                    case Likelihood.HIGH: {
                        return 'high';
                    }
                }
            }
        }

        // If all the above cases failed, the attack is not possible, hence we show it as disabled.
        return 'disabled';
    }
}
