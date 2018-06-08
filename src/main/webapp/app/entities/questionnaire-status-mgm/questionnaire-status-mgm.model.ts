import { BaseEntity, User } from './../../shared';
import {SelfAssessmentMgm} from '../self-assessment-mgm';
import {QuestionnaireMgm} from '../questionnaire-mgm';
import {MyAnswerMgm} from '../my-answer-mgm';

export enum Status {
    'EMPTY' = 'EMPTY',
    'PENDING' = 'PENDING',
    'FULL' = 'FULL'
}

export class QuestionnaireStatusMgm implements BaseEntity {
    constructor(
        public id?: number,
        public status?: Status,
        public selfAssessment?: SelfAssessmentMgm,
        public questionnaire?: QuestionnaireMgm,
        public user?: User,
        public answers?: MyAnswerMgm[],
    ) {
    }
}