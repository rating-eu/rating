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

import {Mode} from './../entities/enumerations/Mode.enum';
import {Injectable} from '@angular/core';
import {Fraction} from '../utils/fraction.class';
import {Couple} from '../utils/couple.class';
import {ThreatAgentMgm} from '../entities/threat-agent-mgm';
import {AnswerMgm} from '../entities/answer-mgm';
import {Observable} from 'rxjs/Observable';
import {LayoutConfiguration} from '../layouts/model/LayoutConfiguration';
import {SelfAssessmentMgm} from '../entities/self-assessment-mgm';
import {Role} from '../entities/enumerations/Role.enum';
import {QuestionnaireStatusMgm} from "../entities/questionnaire-status-mgm";
import {MyCompanyMgm} from "../entities/my-company-mgm";
import {AccountService, User} from "../shared";
import {Router} from "@angular/router";
import {SessionStorageService} from "ngx-webstorage";
import {RiskBoardStatus} from "../risk-board/risk-board.service";
import {ReplaySubject} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {Account} from '../shared';
import {CompanyBoardStatus} from "../dashboard/models/CompanyBoardStatus";
import {DataOperationMgm} from "../entities/data-operation-mgm";
import {PrivacyBoardStatus} from "../privacy-board/model/privacy-board-status";

@Injectable()
export class DataSharingService {

    private static readonly SELF_ASSESSMENT_KEY = 'selfAssessment';
    private _threatAgentsMap: Map<String, Couple<ThreatAgentMgm, Fraction>>;
    private _identifyThreatAgentsFormDataMap: Map<String, AnswerMgm>;
    private _cisoQuestionnaireStatus: QuestionnaireStatusMgm;
    private _externalQuestionnaireStatus: QuestionnaireStatusMgm;

    // ===Observables-BehaviorSubjects===

    // Application Mode
    private _mode: Mode = null;
    private _modeSubject: ReplaySubject<Mode> = new ReplaySubject<Mode>();

    // User
    private _user: User;
    private _userSubject: ReplaySubject<User> = new ReplaySubject<User>();

    // Account
    private _account: Account;
    private _accountSubject: ReplaySubject<Account> = new ReplaySubject<Account>();

    // MyCompany
    private _myCompany: MyCompanyMgm = null;
    private _myCompanySubject: ReplaySubject<MyCompanyMgm> = new ReplaySubject<MyCompanyMgm>();

    // Role
    private _role: Role = null;
    private _roleSubject: ReplaySubject<Role> = new ReplaySubject<Role>();

    // SelfAssessment
    private _selfAssessment: SelfAssessmentMgm = null;
    private _selfAssessmentSubject: ReplaySubject<SelfAssessmentMgm> = new ReplaySubject<SelfAssessmentMgm>();

    // RiskBoard Status
    private _riskBoardStatus: RiskBoardStatus = null;
    private _riskBoardStatusSubject: ReplaySubject<RiskBoardStatus> = new ReplaySubject<RiskBoardStatus>();

    // Layout Configuration
    private _layoutConfiguration: LayoutConfiguration = null;
    private _layoutConfigurationSubject: ReplaySubject<LayoutConfiguration> = new ReplaySubject<LayoutConfiguration>();

    // CompanyBoardStatus
    private _companyBoardStatus: CompanyBoardStatus = null;
    private _companyBoardStatus$: ReplaySubject<CompanyBoardStatus> = new ReplaySubject<CompanyBoardStatus>();

    // Vulnerability Assessment
    private _vulnerabilityAssessment: QuestionnaireStatusMgm = null;
    private _vulnerabilityAssessmentSubject: ReplaySubject<QuestionnaireStatusMgm> = new ReplaySubject<QuestionnaireStatusMgm>();

    // DataOperation
    private _dataOperation: DataOperationMgm = null;
    private _dataOperationSubject: ReplaySubject<DataOperationMgm> = new ReplaySubject<DataOperationMgm>();

    // PrivacyBoardStatus
    private _privacyBoardStatus: PrivacyBoardStatus = null;
    private _privacyBoardStatusSubject: ReplaySubject<PrivacyBoardStatus> = new ReplaySubject<PrivacyBoardStatus>();

    constructor(
        private router: Router,
        private sessionStorage: SessionStorageService,
        private accountService: AccountService
    ) {
    }

    set threatAgentsMap(threatAgents: Map<String, Couple<ThreatAgentMgm, Fraction>>) {
        this._threatAgentsMap = threatAgents;
    }

    get threatAgentsMap(): Map<String, Couple<ThreatAgentMgm, Fraction>> {
        return this._threatAgentsMap;
    }

    get identifyThreatAgentsFormDataMap(): Map<String, AnswerMgm> {
        return this._identifyThreatAgentsFormDataMap;
    }

    set identifyThreatAgentsFormDataMap(value: Map<String, AnswerMgm>) {
        this._identifyThreatAgentsFormDataMap = value;
    }

    get cisoQuestionnaireStatus(): QuestionnaireStatusMgm {
        return this._cisoQuestionnaireStatus;
    }

    set cisoQuestionnaireStatus(value: QuestionnaireStatusMgm) {
        this._cisoQuestionnaireStatus = value;
    }

    get externalQuestionnaireStatus(): QuestionnaireStatusMgm {
        return this._externalQuestionnaireStatus;
    }

    set externalQuestionnaireStatus(value: QuestionnaireStatusMgm) {
        this._externalQuestionnaireStatus = value;
    }

    // MyCompany property
    set myCompany(myCompany: MyCompanyMgm) {
        this._myCompany = myCompany;
        this._myCompanySubject.next(this._myCompany);
    }

    get myCompany(): MyCompanyMgm {
        return this._myCompany;
    }

    get myCompany$(): Observable<MyCompanyMgm> {
        return this._myCompanySubject.asObservable();
    }

    // SelfAssessment property
    set selfAssessment(selfAssessment: SelfAssessmentMgm) {
        this._selfAssessment = selfAssessment;
        this.sessionStorage.store(DataSharingService.SELF_ASSESSMENT_KEY, this._selfAssessment);
        this._selfAssessmentSubject.next(this._selfAssessment);
    }

    get selfAssessment(): SelfAssessmentMgm {
        if (!this._selfAssessment) {
            this._selfAssessment = this.sessionStorage.retrieve(DataSharingService.SELF_ASSESSMENT_KEY);
        }

        if (!this._selfAssessment) {
            return null;
        } else {
            let configuration: LayoutConfiguration = this.layoutConfiguration;

            if (!configuration) {
                configuration = new LayoutConfiguration();
            }

            configuration.selfAssessmentId = this._selfAssessment.id.toString();
            configuration.navSubTitle = self.name;

            this.layoutConfiguration = configuration;
            return this._selfAssessment;
        }
    }

    checkSelfAssessment() {
        if (!this.selfAssessment) {
            this.router.navigate(['/my-risk-assessments']);
        }
    }

    get selfAssessment$(): Observable<SelfAssessmentMgm> {
        return this._selfAssessmentSubject.asObservable();
    }

    // Role property
    get role(): Role {
        return this._role;
    }

    set role(role: Role) {
        this._role = role;
        this._roleSubject.next(this._role);
    }

    get role$(): Observable<Role> {
        return this._roleSubject.asObservable();
    }

    // Mode property
    get mode(): Mode {
        return this._mode;
    }

    set mode(mode: Mode) {
        this._mode = mode;
        this._modeSubject.next(this._mode);
    }

    get mode$(): Observable<Mode> {
        return this._modeSubject.asObservable();
    }

    // User property
    get user(): User {
        return this._user;
    }

    set user(user: User) {
        this._user = user;
        this._userSubject.next(this.user);

        if (this._user) {
            this.accountService.get().subscribe((response: HttpResponse<Account>) => {
                if (response) {
                    this.account = response.body;
                } else {
                    this.account = null;
                }
            });
        } else {
            this.account = null;
        }
    }

    get user$(): Observable<User> {
        return this._userSubject.asObservable();
    }

    // Account property
    get account(): Account {
        return this._account;
    }

    set account(account: Account) {
        this._account = account;
        this._accountSubject.next(this._account);

        if (this._account) {
            if (this._account['authorities'].includes(Role[Role.ROLE_CISO])) {
                this.role = Role.ROLE_CISO;
            } else if (this._account['authorities'].includes(Role[Role.ROLE_EXTERNAL_AUDIT])) {
                this.role = Role.ROLE_EXTERNAL_AUDIT;
            } else if (this._account['authorities'].includes(Role[Role.ROLE_ADMIN])) {
                this.role = Role.ROLE_ADMIN;
            } else {
                this.role = null;
            }
        } else {
            this.role = null;
        }
    }

    get account$(): Observable<Account> {
        return this._accountSubject.asObservable();
    }

    // RiskBoard Status property
    get riskBoardStatus(): RiskBoardStatus {
        if (!this._riskBoardStatus) {
            this.riskBoardStatus = new RiskBoardStatus();
        }
        return this._riskBoardStatus;
    }

    set riskBoardStatus(status: RiskBoardStatus) {
        this._riskBoardStatus = status;

        if (!this._riskBoardStatus) {
            this.riskBoardStatus = new RiskBoardStatus();
        }

        this._riskBoardStatusSubject.next(this._riskBoardStatus);
    }

    get riskBoardStatus$(): Observable<RiskBoardStatus> {
        return this._riskBoardStatusSubject.asObservable();
    }

    // Layout Configuration property
    get layoutConfiguration(): LayoutConfiguration {
        return this._layoutConfiguration;
    }

    set layoutConfiguration(configuration: LayoutConfiguration) {
        this._layoutConfiguration = configuration;
        this._layoutConfigurationSubject.next(this._layoutConfiguration);
    }

    get layoutConfiguration$(): Observable<LayoutConfiguration> {
        return this._layoutConfigurationSubject.asObservable();
    }

    // CompanyBoardStatus property
    get companyBoardStatus(): CompanyBoardStatus {
        return this._companyBoardStatus;
    }

    set companyBoardStatus(status: CompanyBoardStatus) {
        this._companyBoardStatus = status;
        this._companyBoardStatus$.next(this._companyBoardStatus);
    }

    get companyBoardStatus$(): Observable<CompanyBoardStatus> {
        return this._companyBoardStatus$.asObservable();
    }

    // Vulnerability Assessment Questionnaire Status
    get vulnerabilityAssessment(): QuestionnaireStatusMgm {
        return this._vulnerabilityAssessment;
    }

    set vulnerabilityAssessment(status: QuestionnaireStatusMgm) {
        this._vulnerabilityAssessment = status;
        this._vulnerabilityAssessmentSubject.next(this._vulnerabilityAssessment);
    }

    get vulnerabilityAssessment$(): Observable<QuestionnaireStatusMgm> {
        return this._vulnerabilityAssessmentSubject.asObservable();
    }

    // DataOperation property
    get dataOperation(): DataOperationMgm {
        return this._dataOperation;
    }

    set dataOperation(dataOperationMgm: DataOperationMgm) {
        this._dataOperation = dataOperationMgm;
        this._dataOperationSubject.next(this._dataOperation);
    }

    get dataOperation$(): Observable<DataOperationMgm> {
        return this._dataOperationSubject.asObservable();
    }

    // PrivacyBoard Status property
    get privacyBoardStatus(): PrivacyBoardStatus {
        if (!this._privacyBoardStatus) {
            this._privacyBoardStatus = new PrivacyBoardStatus();
        }

        return this._privacyBoardStatus;
    }

    set privacyBoardStatus(status: PrivacyBoardStatus) {
        this._privacyBoardStatus = status;

        if (!this._privacyBoardStatus) {
            this._privacyBoardStatus = new PrivacyBoardStatus();
        }

        this._privacyBoardStatusSubject.next(this._privacyBoardStatus);
    }

    get privacyBoardStatus$(): Observable<PrivacyBoardStatus>{
        return this._privacyBoardStatusSubject.asObservable();
    }

    clear() {
        this.role = null;
        this.myCompany = null;
        this.selfAssessment = null;
        this.mode = null;
        this.layoutConfiguration = null;
    }
}
