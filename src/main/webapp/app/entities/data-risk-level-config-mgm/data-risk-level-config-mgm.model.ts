import { BaseEntity } from './../../shared';
import {DataThreatLikelihood} from '../enumerations/gdpr/DataThreatLikelihood.enum';
import {DataImpact} from '../enumerations/gdpr/DataImpact.enum';
import {DataRiskLevel} from '../enumerations/gdpr/DataRiskLevel.enum';

export class DataRiskLevelConfigMgm implements BaseEntity {
    constructor(
        public id?: number,
        public rationale?: string,
        public likelihood?: DataThreatLikelihood,
        public impact?: DataImpact,
        public risk?: DataRiskLevel,
        public operation?: BaseEntity,
    ) {
    }
}