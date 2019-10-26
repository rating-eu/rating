import { BaseEntity } from './../../shared';
import {DataRecipientMgm} from '../data-recipient-mgm';
import {SecurityImpactMgm} from '../security-impact-mgm';
import {DataThreatMgm} from '../data-threat-mgm';
import {CompanyProfileMgm} from "../company-profile-mgm";

export class DataOperationMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public processedData?: string,
        public processingPurpose?: string,
        public dataSubject?: string,
        public processingMeans?: string,
        public dataProcessor?: string,
        public companyProfile?: CompanyProfileMgm,
        public recipients?: DataRecipientMgm[],
        public impacts?: SecurityImpactMgm[],
        public threats?: DataThreatMgm[]
    ) {
    }
}