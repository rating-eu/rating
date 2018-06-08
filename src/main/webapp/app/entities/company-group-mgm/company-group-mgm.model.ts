import { BaseEntity, User } from './../../shared';

export class CompanyGroupMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public created?: any,
        public modified?: any,
        public user?: User,
        public companyprofile?: BaseEntity,
        public selfassessments?: BaseEntity[],
    ) {
    }
}