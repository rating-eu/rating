import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {HermeneutCompanyProfileMgmModule} from './company-profile-mgm/company-profile-mgm.module';
import {HermeneutDomainOfInfluenceMgmModule} from './domain-of-influence-mgm/domain-of-influence-mgm.module';
import {HermeneutSelfAssessmentMgmModule} from './self-assessment-mgm/self-assessment-mgm.module';
import {HermeneutContainerMgmModule} from './container-mgm/container-mgm.module';
import {HermeneutAssetCategoryMgmModule} from './asset-category-mgm/asset-category-mgm.module';
import {HermeneutMotivationMgmModule} from './motivation-mgm/motivation-mgm.module';
import {HermeneutThreatAgentMgmModule} from './threat-agent-mgm/threat-agent-mgm.module';
import {HermeneutAssetMgmModule} from './asset-mgm/asset-mgm.module';
import {HermeneutAttackStrategyMgmModule} from './attack-strategy-mgm/attack-strategy-mgm.module';
import {HermeneutMitigationMgmModule} from './mitigation-mgm/mitigation-mgm.module';
import {HermeneutQuestionnaireMgmModule} from './questionnaire-mgm/questionnaire-mgm.module';
import {HermeneutQuestionMgmModule} from './question-mgm/question-mgm.module';
import {HermeneutAnswerMgmModule} from './answer-mgm/answer-mgm.module';
import {HermeneutExternalAuditMgmModule} from './external-audit-mgm/external-audit-mgm.module';
import {HermeneutMyAnswerMgmModule} from './my-answer-mgm/my-answer-mgm.module';
import {HermeneutAnswerWeightMgmModule} from './answer-weight-mgm/answer-weight-mgm.module';
import {HermeneutQuestionnaireStatusMgmModule} from './questionnaire-status-mgm/questionnaire-status-mgm.module';
import {HermeneutLevelMgmModule} from './level-mgm/level-mgm.module';
import {HermeneutPhaseMgmModule} from './phase-mgm/phase-mgm.module';
import {HermeneutCompanyGroupMgmModule} from './company-group-mgm/company-group-mgm.module';
import {HermeneutMyAssetMgmModule} from './my-asset-mgm/my-asset-mgm.module';
import {HermeneutDirectAssetMgmModule} from './direct-asset-mgm/direct-asset-mgm.module';
import {HermeneutIndirectAssetMgmModule} from './indirect-asset-mgm/indirect-asset-mgm.module';
import {HermeneutAttackCostMgmModule} from './attack-cost-mgm/attack-cost-mgm.module';


/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        HermeneutCompanyProfileMgmModule,
        HermeneutDomainOfInfluenceMgmModule,
        HermeneutSelfAssessmentMgmModule,
        HermeneutContainerMgmModule,
        HermeneutAssetCategoryMgmModule,
        HermeneutAssetMgmModule,
        HermeneutThreatAgentMgmModule,
        HermeneutMotivationMgmModule,
        HermeneutAttackStrategyMgmModule,
        HermeneutMitigationMgmModule,
        HermeneutQuestionnaireMgmModule,
        HermeneutQuestionMgmModule,
        HermeneutAnswerMgmModule,
        HermeneutExternalAuditMgmModule,
        HermeneutMyAnswerMgmModule,
        HermeneutAnswerWeightMgmModule,
        HermeneutQuestionnaireStatusMgmModule,
        HermeneutLevelMgmModule,
        HermeneutPhaseMgmModule,
        HermeneutCompanyGroupMgmModule,
        HermeneutMyAssetMgmModule,
        HermeneutDirectAssetMgmModule,
        HermeneutIndirectAssetMgmModule,
        HermeneutAttackCostMgmModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutEntityModule {
}
