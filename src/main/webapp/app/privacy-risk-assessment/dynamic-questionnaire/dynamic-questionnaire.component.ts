import {
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChange,
    SimpleChanges,
    ViewEncapsulation,
    ViewRef
} from '@angular/core';
import * as _ from 'lodash';
import {GDPRQuestionnaireMgm} from '../../entities/gdpr-questionnaire-mgm';
import {DataOperationMgm, DataOperationMgmService} from '../../entities/data-operation-mgm';
import {GDPRQuestionnairePurpose} from '../../entities/enumerations/GDPRQuestionnairePurpose.enum';
import {GDPRQuestionMgm, GDPRQuestionMgmService} from '../../entities/gdpr-question-mgm';
import {Observable, Subscription} from 'rxjs';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {FormGroup} from '@angular/forms';
import {DynamicQuestionnaireService} from './dynamic-questionnaire.service';
import {DataSharingService} from '../../data-sharing/data-sharing.service';
import {Router} from '@angular/router';
import {DataRecipientMgm} from '../../entities/data-recipient-mgm';
import {DataOperationField} from '../../entities/enumerations/gdpr/DataOperationField.enum';
import {DataRecipientType} from '../../entities/enumerations/gdpr/DataRecipientType.enum';
import {SecurityImpactMgm} from '../../entities/security-impact-mgm';
import {SecurityPillar} from '../../entities/enumerations/gdpr/SecurityPillar.enum';
import {ThreatArea} from '../../entities/enumerations/gdpr/ThreatArea.enum';
import {
    GDPRQuestionnaireStatusMgm,
    GDPRQuestionnaireStatusMgmService
} from '../../entities/gdpr-questionnaire-status-mgm';
import {GDPRMyAnswerMgm} from '../../entities/gdpr-my-answer-mgm';
import {User} from "../../shared";
import {Role} from "../../entities/enumerations/Role.enum";
import {forkJoin} from "rxjs/observable/forkJoin";
import {of} from "rxjs/observable/of";
import {Status} from "../../entities/enumerations/Status.enum";
import {JhiAlertService} from "ng-jhipster";

@Component({
    selector: 'jhi-dynamic-questionnaire',
    templateUrl: './dynamic-questionnaire.component.html',
    styleUrls: ['dynamic-questionnaire.css'],
    encapsulation: ViewEncapsulation.None
})
export class DynamicQuestionnaireComponent implements OnInit, OnChanges, OnDestroy {

    private subscriptions: Subscription[];

    private user: User;
    private role: Role;

    // Properties
    private _dataOperation: DataOperationMgm;
    private _questionnaire: GDPRQuestionnaireMgm;
    private _questions: GDPRQuestionMgm[];
    private _questionsMap: Map<number/*ID*/, GDPRQuestionMgm>;

    public questionsByThreatAreaMap: Map<ThreatArea, GDPRQuestionMgm[]>;

    public purposeEnum = GDPRQuestionnairePurpose;
    public dataOperationFieldEnum = DataOperationField;
    public dataRecipientTypes: DataRecipientType[];
    public form: FormGroup;
    public submitDisabled: boolean = false;

    public securityPillarEnum = SecurityPillar;
    public securityPillars: SecurityPillar[];
    public securityImpactsMap: Map<SecurityPillar, SecurityImpactMgm>;

    public threatAreaEnum = ThreatArea;
    public threatAreas: ThreatArea[];
    private threatAreasQuestionnaireStatus: GDPRQuestionnaireStatusMgm;
    public threatAreasMyAnswersMap: Map<number/*QuestionID*/, GDPRMyAnswerMgm>;

    constructor(private router: Router,
                private questionService: GDPRQuestionMgmService,
                private questionnaireStatusService: GDPRQuestionnaireStatusMgmService,
                private dataOperationMgmService: DataOperationMgmService,
                private dynamicQuestionnaireService: DynamicQuestionnaireService,
                private dataSharingService: DataSharingService,
                private alertService: JhiAlertService,
                private changeDetector: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.subscriptions = [];
        this.dataRecipientTypes = Object.keys(DataRecipientType).map((key) => DataRecipientType[key]);

        this.securityPillars = Object.keys(SecurityPillar).map((key) => SecurityPillar[key]);
        this.securityImpactsMap = new Map();

        this.threatAreas = Object.keys(ThreatArea).map((key) => ThreatArea[key]);
        this.threatAreasMyAnswersMap = new Map();

        this.user = this.dataSharingService.user;
        this.role = this.dataSharingService.role;

        const join$: Observable<[User, Role]> = forkJoin(
            this.dataSharingService.user$
                .timeout(500)
                .catch((err) => {
                    console.warn('User timeout...');
                    return of(this.dataSharingService.user);
                }),
            this.dataSharingService.role$
                .timeout(500)
                .catch((err) => {
                    console.warn('Role timeout...');
                    return of(this.dataSharingService.role);
                })
        );

        this.subscriptions.push(
            join$.subscribe(
                (response: [User, Role]) => {
                    if (!this.user || !this.role) {
                        this.user = response[0];
                        this.role = response[1];
                    }
                }
            )
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this._dataOperation && this._questionnaire && this._questions) {
            const purpose: GDPRQuestionnairePurpose = this._questionnaire.purpose;

            switch (purpose) {
                case GDPRQuestionnairePurpose.OPERATION_CONTEXT: {

                    break;
                }
                case GDPRQuestionnairePurpose.IMPACT_EVALUATION: {
                    if (this.dataOperation.impacts && this.dataOperation.impacts.length) {
                        this.dataOperation.impacts.forEach((impact: SecurityImpactMgm) => {
                            this.securityImpactsMap.set(impact.securityPillar, impact);
                        });

                        this.securityPillars.forEach((securityPillar: SecurityPillar) => {
                            if (this.securityImpactsMap.has(securityPillar)) {
                                // Ok, do nothing!
                            } else {
                                // Create the missing SecurityImpact
                                const securityImpact: SecurityImpactMgm = new SecurityImpactMgm(undefined, securityPillar);

                                this.dataOperation.impacts.push(securityImpact);
                                this.securityImpactsMap.set(securityPillar, securityImpact);
                            }
                        });
                    } else {
                        // Initialize the SecurityImpacts
                        this.dataOperation.impacts = [];

                        this.securityPillars.forEach((securityPillar: SecurityPillar) => {
                            // Create the missing SecurityImpact
                            const securityImpact: SecurityImpactMgm = new SecurityImpactMgm(undefined, securityPillar);

                            this.dataOperation.impacts.push(securityImpact);
                            this.securityImpactsMap.set(securityPillar, securityImpact);
                        });
                    }

                    break;
                }
                case GDPRQuestionnairePurpose.THREAT_LIKELIHOOD: {
                    if (this._dataOperation && this._questionnaire && !this.threatAreasQuestionnaireStatus) {

                        if (this.user && this.role) {
                            this.questionnaireStatusService.findOneByDataOperationQuestionnaireAndRole(
                                this._dataOperation.id, this._questionnaire.id, this.role)
                                .toPromise()
                                .then(
                                    (response: HttpResponse<GDPRQuestionnaireStatusMgm>) => {
                                        this.threatAreasQuestionnaireStatus = response.body;
                                        this.handleThreatAreasQuestionnaireStatus();
                                        this.setOriginalAnswers();
                                    }
                                )
                                .catch((reason: HttpErrorResponse) => {
                                        if (reason.status === 404) {
                                            // Create the QuestionnaireStatus
                                            this.threatAreasQuestionnaireStatus = new GDPRQuestionnaireStatusMgm();
                                            this.threatAreasQuestionnaireStatus.id = undefined;
                                            this.threatAreasQuestionnaireStatus.operation = this._dataOperation;
                                            this.threatAreasQuestionnaireStatus.questionnaire = this._questionnaire;
                                            this.threatAreasQuestionnaireStatus.answers = [];
                                            this.threatAreasQuestionnaireStatus.status = Status.EMPTY;
                                            this.threatAreasQuestionnaireStatus.user = this.user;
                                            this.threatAreasQuestionnaireStatus.role = this.role;

                                            this.handleThreatAreasQuestionnaireStatus();
                                            this.setOriginalAnswers();
                                        }
                                    }
                                );
                        }
                    }

                    break;
                }
            }
        }
    }

    public submitOperationContext() {
        let dataOperation$: Observable<HttpResponse<DataOperationMgm>>;

        if (this.dataOperation.id) {
            dataOperation$ = this.dataOperationMgmService.update(this.dataOperation);
        } else {
            dataOperation$ = this.dataOperationMgmService.create(this.dataOperation);
        }

        dataOperation$.toPromise().then((operationResponse: HttpResponse<DataOperationMgm>) => {
            this.dataOperation = operationResponse.body;
            this.dataSharingService.dataOperation = this.dataOperation;

            // await can be used only inside async function
            (async () => {
                // Do something before delay
                this.alertService.success('hermeneutApp.messages.saved', null, 'top');

                await this.delay(1000);

                // Do something after
                this.router.navigate(['/privacy-board']);
            })();
        }).catch((reason) => {
            this.alertService.error('hermeneutApp.messages.error', null, 'top');
        });
    }

    public submitSecurityImpacts() {
        if (this._dataOperation.impacts && this.dataOperation.impacts.length) {
            // Filter only the SecurityImpacts with a not null Impact value.
            this._dataOperation.impacts = _.filter(this.dataOperation.impacts, function (securityImpact: SecurityImpactMgm) {
                return securityImpact.impact != null;
            })
        }

        if (this._dataOperation.impacts && this.dataOperation.impacts.length) {
            if (this.dataOperation.id) {
                this.dataOperationMgmService.update(this._dataOperation).toPromise()
                    .then(
                        (operationResponse: HttpResponse<DataOperationMgm>) => {
                            this._dataOperation = operationResponse.body;
                            this.dataSharingService.dataOperation = this._dataOperation;

                            // await can be used only inside async function
                            (async () => {
                                // Do something before delay
                                this.alertService.success('hermeneutApp.messages.saved', null, 'top');

                                await this.delay(1000);

                                // Do something after
                                this.router.navigate(['/privacy-board']);
                            })();
                        }
                    ).catch((reason) => {
                        this.alertService.error('hermeneutApp.messages.error', null, 'top');
                    }
                );
            } else {
                // To perform this step a DataOperation must already exist.
            }
        }
    }

    public submitThreatLikelihood() {
        if (this.threatAreasQuestionnaireStatus && this.threatAreasQuestionnaireStatus.answers) {
            // Keep only the MyAnswers where the answer is NOT NULL!
            this.threatAreasQuestionnaireStatus.answers = _.filter(this.threatAreasQuestionnaireStatus.answers,
                (myAnswer: GDPRMyAnswerMgm) => myAnswer.answer != null);

            let questionnaireStatus$: Observable<HttpResponse<GDPRQuestionnaireStatusMgm>>;

            // Update the QuestionnaireStatus
            if (this.threatAreasQuestionnaireStatus.id) {
                questionnaireStatus$ = this.questionnaireStatusService.update(this.threatAreasQuestionnaireStatus);
            } else { // Create the QuestionnaireStatus
                questionnaireStatus$ = this.questionnaireStatusService.create(this.threatAreasQuestionnaireStatus);
            }

            questionnaireStatus$.toPromise()
                .then((response: HttpResponse<GDPRQuestionnaireStatusMgm>) => {
                    this.threatAreasQuestionnaireStatus = response.body;

                    return this.threatAreasQuestionnaireStatus;
                }).then((value: GDPRQuestionnaireStatusMgm) => {
                    if (value) {
                        this.dataOperationMgmService.find(this._dataOperation.id)
                            .toPromise()
                            .then((operationResponse: HttpResponse<DataOperationMgm>) => {
                                this._dataOperation = operationResponse.body;
                                this.dataSharingService.dataOperation = this._dataOperation;

                                // await can be used only inside async function
                                (async () => {
                                    // Do something before delay
                                    this.alertService.success('hermeneutApp.messages.saved', null, 'top');

                                    await this.delay(1000);

                                    // Do something after
                                    this.router.navigate(['/privacy-board']);
                                })();
                            });
                    }
                }
            ).catch((reason) => {
                this.alertService.error('hermeneutApp.messages.error', null, 'top');
            });
        }
    }

    @Input()
    set dataOperation(dataOperation: DataOperationMgm) {
        this._dataOperation = dataOperation;
        this.detectChanges();
    }

    get dataOperation(): DataOperationMgm {
        return this._dataOperation;
    }

    @Input()
    set questionnaire(questionnaire: GDPRQuestionnaireMgm) {
        this._questionnaire = questionnaire;

        if (this._questionnaire) {
            this.questionService.getAllByQuestionnaire(this._questionnaire.id).toPromise().then(
                (response: HttpResponse<GDPRQuestionMgm[]>) => {
                    const questionsArray = response.body;

                    this.questions = questionsArray.sort((a, b) => {
                        return a.order - b.order;
                    });

                    this._questionsMap = new Map();
                    this._questions.forEach((question: GDPRQuestionMgm) => {
                        this._questionsMap.set(question.id, question);
                    });

                    // === Begin ChangeDetection Trigger ===
                    let changes: SimpleChanges = new class implements SimpleChanges {
                        [value: string]: SimpleChange;
                    };

                    changes['questions'] = new SimpleChange([], this._questions, true);

                    // Force the ChangeDetection handler
                    this.ngOnChanges(changes);
                    // === End ChangeDetection Trigger ===

                    switch (this._questionnaire.purpose) {
                        case GDPRQuestionnairePurpose.OPERATION_CONTEXT: {
                            this.form = this.dynamicQuestionnaireService.buildOperationContextForm(this.dataOperation, this.questions);

                            break;
                        }
                        case GDPRQuestionnairePurpose.IMPACT_EVALUATION: {
                            this.form = this.dynamicQuestionnaireService.buildImpactEvaluationForm(this.dataOperation, this.questions);

                            break;
                        }
                        case GDPRQuestionnairePurpose.THREAT_LIKELIHOOD: {
                            this.form = this.dynamicQuestionnaireService.buildThreatLikelihoodForm(this.dataOperation, this.questions);

                            this.questionsByThreatAreaMap = new Map();

                            this.threatAreas.forEach((area: ThreatArea) => {
                                this.questionsByThreatAreaMap.set(area, []);
                            });

                            this._questions.forEach((question: GDPRQuestionMgm) => {
                                const area: ThreatArea = question.threatArea;

                                switch (area) {
                                    case ThreatArea.NETWORK_AND_TECHNICAL_RESOURCES:
                                    case ThreatArea.PROCEDURES_RELATED_TO_THE_PROCESSING_OF_PERSONAL_DATA:
                                    case ThreatArea.PEOPLE_INVOLVED_IN_THE_PROCESSING_OF_PERSONAL_DATA:
                                    case ThreatArea.BUSINESS_SECTOR_AND_SCALE_OF_PROCESSING: {
                                        this.questionsByThreatAreaMap.get(area).push(question);
                                        break;
                                    }
                                }
                            });

                            break;
                        }
                    }
                }
            );

            this.detectChanges();
        }
    }

    get questionnaire(): GDPRQuestionnaireMgm {
        return this._questionnaire;
    }

    @Input()
    set questions(questions: GDPRQuestionMgm[]) {
        this._questions = questions;
    }

    get questions(): GDPRQuestionMgm[] {
        return this._questions;
    }

    private detectChanges() {
        if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
            this.changeDetector.detectChanges();
        }
    }

    public isValid(questionID) {
        return this.form.controls[questionID].valid;
    }

    public trackByID(index, question: GDPRQuestionMgm) {
        return question.id;
    }

    ngOnDestroy(): void {
        this.changeDetector.detach();

        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
        }
    }

    back() {
        this.router.navigate(['/privacy-board']);
    }

    addRecipient() {
        if (this.dataOperation && this.form) {
            if (!this.dataOperation.recipients) {
                this.dataOperation.recipients = [];
            }

            this.dataOperation.recipients.push(new DataRecipientMgm());
            this.dynamicQuestionnaireService.addDataRecipient(this.form);

            this.detectChanges();
        }
    }

    removeRecipient(index: number) {
        if (this.dataOperation && this.form) {
            if (this.dataOperation.recipients) {
                const removed: DataRecipientMgm[] = this.dataOperation.recipients.splice(index, 1);
                this.dynamicQuestionnaireService.removeRecipient(this.form, index);

                this.detectChanges();
            }
        }
    }

    handleThreatAreasQuestionnaireStatus() {
        if (this.threatAreasQuestionnaireStatus && this._questions) {
            this.threatAreasMyAnswersMap = new Map();

            if (this.threatAreasQuestionnaireStatus.id) { // Existing QuestionnaireStatus
                if (this.threatAreasQuestionnaireStatus.answers && this.threatAreasQuestionnaireStatus.answers.length) {//Some answers
                    if (this.threatAreasQuestionnaireStatus.answers.length === this._questions.length) {//Full

                        // Restore the existing MyAnswers
                        this.threatAreasQuestionnaireStatus.answers.forEach((myAnswer: GDPRMyAnswerMgm) => {
                            this.threatAreasMyAnswersMap.set(myAnswer.question.id, myAnswer);
                        });
                    } else {
                        // Restore the existing MyAnswers
                        this.threatAreasQuestionnaireStatus.answers.forEach((myAnswer: GDPRMyAnswerMgm) => {
                            this.threatAreasMyAnswersMap.set(myAnswer.question.id, myAnswer);
                        });

                        // Add the missing MyAnswers (as empty)
                        this._questions.forEach((question: GDPRQuestionMgm) => {
                            if (!this.threatAreasMyAnswersMap.has(question.id)) {
                                const myAnswer: GDPRMyAnswerMgm = new GDPRMyAnswerMgm();
                                myAnswer.id = undefined;
                                myAnswer.question = question;
                                myAnswer.answer = null;

                                this.threatAreasMyAnswersMap.set(question.id, myAnswer);

                                // Important: Put the MyAnswer also in the QuestionnaireStatus
                                this.threatAreasQuestionnaireStatus.answers.push(myAnswer);
                            }
                        });
                    }
                } else { // Empty
                    this.threatAreasQuestionnaireStatus.answers = [];

                    this._questions.forEach((question: GDPRQuestionMgm) => {
                        const myAnswer: GDPRMyAnswerMgm = new GDPRMyAnswerMgm();
                        myAnswer.id = undefined;
                        myAnswer.question = question;
                        myAnswer.answer = null;

                        this.threatAreasMyAnswersMap.set(question.id, myAnswer);

                        // Important: Put the MyAnswer also in the QuestionnaireStatus
                        this.threatAreasQuestionnaireStatus.answers.push(myAnswer);
                    });
                }
            } else { // New QuestionnaireStatus
                this.threatAreasQuestionnaireStatus.answers = [];

                this._questions.forEach((question: GDPRQuestionMgm) => {
                    const myAnswer: GDPRMyAnswerMgm = new GDPRMyAnswerMgm();
                    myAnswer.id = undefined;
                    myAnswer.question = question;
                    myAnswer.answer = null;

                    this.threatAreasMyAnswersMap.set(question.id, myAnswer);

                    // Important: Put the MyAnswer also in the QuestionnaireStatus
                    this.threatAreasQuestionnaireStatus.answers.push(myAnswer);
                });
            }

            this.detectChanges();
        }
    }

    /**
     * This method is needed to replace the MyAnswer.answer with the exact same reference to the corresponding answer used
     * while building the radio buttons, otherwise the checked state will not work.
     */
    private setOriginalAnswers() {
        if (this.threatAreasMyAnswersMap && this._questionsMap) {
            this._questionsMap.forEach((question) => {
                const myAnswer: GDPRMyAnswerMgm = this.threatAreasMyAnswersMap.get(question.id);

                if (myAnswer && myAnswer.answer) {
                    if (question.answers) {
                        question.answers.forEach((answer) => {
                            if (myAnswer.answer.id === answer.id) {
                                myAnswer.answer = answer;
                            }
                        });
                    }
                }
            });
        }
    }

    // Delay functions
    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}