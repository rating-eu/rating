import { BaseEntity } from './../../shared';

export const enum CostType {
    'BEFORE_THE_ATTACK_STATUS_RESTORATION',
    'INCREASED_SECURITY',
    'LEGAL_LITIGATION_COSTS_AND_ATTORNEY_FEES',
    'NOTIFICATION_AND_REGULATORY_COMPLIANCE_COSTS',
    'LIABILITY_COSTS',
    'CUSTOMER_BREACH_NOTIFICATION_COSTS',
    'POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS',
    'LOST_CUSTOMERS_RECOVERY',
    'PUBLIC_RELATIONS',
    'INCREASE_OF_INSURANCE_PREMIUMS',
    'LOSS_OF_REVENUES',
    'INCREASED_COST_TO_RAISE_DEBT',
    'VALUE_OF_LOST_OR_NOT_FULFILLED_CONTRACT_REVENUES',
    'LOST_OR_NON_FULFILLED_CONTRACTS'
}

export class AttackCostMgm implements BaseEntity {
    constructor(
        public id?: number,
        public type?: CostType,
        public description?: string,
        public costs?: number,
        public directAsset?: BaseEntity,
        public indirectAsset?: BaseEntity,
    ) {
    }
}