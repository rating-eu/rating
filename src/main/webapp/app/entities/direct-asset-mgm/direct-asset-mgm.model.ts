import { BaseEntity } from './../../shared';

export class DirectAssetMgm implements BaseEntity {
    constructor(
        public id?: number,
        public asset?: BaseEntity,
        public costs?: BaseEntity[],
        public effects?: BaseEntity[],
    ) {
    }
}