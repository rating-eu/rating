// tslint:disable:component-selectorù
import * as _ from 'lodash';

import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { QuestionMgm } from '../../entities/question-mgm';
import { SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { QuestionnaireMgm } from '../../entities/questionnaire-mgm';
import { MyAnswerMgm } from '../../entities/my-answer-mgm';
import { User, AccountService, UserService } from '../../shared';
import { AnswerMgm } from '../../entities/answer-mgm';
import { AssetMgm, AssetMgmService } from '../../entities/asset-mgm';
import { AnswerType } from '../../entities/enumerations/AnswerType.enum';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { IdentifyAssetUtilService } from '../identify-asset.util.service';
import { AssetCategoryMgmService, AssetType } from '../../entities/asset-category-mgm';

@Component({
    selector: 'question-card',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.css'],
    providers: []
})

export class QuestionComponent implements OnInit {
    @Input() public question: QuestionMgm;
    @Input() public questionRenderType: string;
    @Input() public self: SelfAssessmentMgm;
    @Input() public questionnaire: QuestionnaireMgm;
    @Input() public user: User;
    // @Output() public myAnswersComplited = new EventEmitter();
    // @Output() public myAssetsComplited = new EventEmitter();
    public renderType: string;
    private myQuestionAnswer: MyAnswerMgm[] = [];
    public intangible: AnswerMgm[] = [];
    public tangibleCurrent: AnswerMgm[] = [];
    public tangibleFixed: AnswerMgm[] = [];
    private selectedAnswers: AnswerMgm[] = [];
    private allAssets: AssetMgm[];
    private myQuestionAssets: MyAssetMgm[] = [];

    constructor(
        private accountService: AccountService,
        private userService: UserService,
        private assetService: AssetMgmService,
        private assetCategoryService: AssetCategoryMgmService,
        private idaUtilsService: IdentifyAssetUtilService
    ) { }

    ngOnInit() {
        if (this.questionRenderType.search('rank') !== -1) {
            this.renderType = 'select_rank';
            this.assetCategoryService.findAll().toPromise().then((res) => {
                for (const qa of this.question.answers) {
                    if (qa.asset.assetcategory.type === AssetType.INTANGIBLE) {
                        this.intangible.push(qa);
                    } else if (qa.asset.assetcategory.type === AssetType.TANGIBLE) {
                        if (qa.asset.assetcategory.name === 'Current Assets') {
                            this.tangibleCurrent.push(qa);
                        } else if (qa.asset.assetcategory.name === 'Fixed Assets') {
                            this.tangibleFixed.push(qa);
                        }
                    }
                }
            });
        } else if (this.questionRenderType.search('directly stolen/compromised/damaged') !== -1) {
            this.renderType = 'select_direct_assets';
        } else if (this.questionRenderType.search('indirectly compromised/damaged/devalued') !== -1) {
            this.renderType = 'select_indirect_assets';
        } else if (this.questionRenderType.search('estimated value of your intangible assets') !== -1) {
            this.renderType = 'estimated_assets';
        } else if (this.questionRenderType.search('share the order of magnitude') !== -1) {
            this.renderType = 'insert_magnitude';
        } else if (this.questionRenderType.search('identify the costs that the attack could generate') !== -1) {
            this.renderType = 'idetify_costs';
        }
        this.accountService.get().subscribe((response1) => {
            const account = response1.body;
            this.userService.find(account['login']).subscribe((response2) => {
                this.user = response2.body;
            });
        });
        this.assetService.findAll().toPromise().then((res) => {
            this.allAssets = res;
        });
        console.log(this.question);
        // console.log(this.self);
        // console.log(this.questionnaire);
        // console.log(this.question.answers);
        // console.log(_.sortBy(this.question.answers, 'order'));
        // this.question.answers = _.sortBy(this.question.answers, 'order');
        // console.log(this.question.answers);
        /*
        this.myAnswer = new MyAnswerMgm();
        this.myAnswer.answer = this.question.answers[0];
        this.myAnswer.question = this.question;
        this.myAnswer.questionnaire = this.questionnaire;
        this.accountService.get().subscribe((response1) => {
            const account = response1.body;
            this.userService.find(account['login']).subscribe((response2) => {
                this.user = response2.body;
                this.myAnswer.user = this.user;
                this.myAnswerComplited.emit(this.myAnswer);
            });
        });
        */
    }

    /*
    public onAnswerResponded(myAnswer: MyAnswerMgm) {
        if (myAnswer) {
            this.myAnswerComplited.emit(myAnswer);
        }
    }
    */

    public select(ans: AnswerMgm) {
        console.log(ans);
        const selectedAsset: AssetMgm | AssetMgm[] = this.findAsset(ans);
        const index = _.findIndex(this.selectedAnswers, { id: ans.id });
        if (index !== -1) {
            if (!(selectedAsset instanceof Array)) {
                const indexA = _.findIndex(this.myQuestionAssets,
                    (myAsset) => myAsset.asset.id === selectedAsset.id
                );
                if (indexA !== -1) {
                    this.idaUtilsService.removeFromMyAssets(this.myQuestionAssets[indexA]);
                    this.myQuestionAssets.splice(indexA, 1);
                }
            } else {
                for (const ass of selectedAsset) {
                    const indexA = _.findIndex(this.myQuestionAssets,
                        (myAsset) => myAsset.asset.id === ass.id
                    );
                    if (indexA !== -1) {
                        this.idaUtilsService.removeFromMyAssets(this.myQuestionAssets[indexA]);
                        this.myQuestionAssets.splice(indexA, 1);
                    }
                }
            }
            const indexQ = _.findIndex(this.myQuestionAnswer,
                (myAnswer) => myAnswer.answer.id === this.selectedAnswers[index].id
            );
            if (indexQ !== -1) {
                this.idaUtilsService.removeFromMyAnswer(this.myQuestionAnswer[indexQ]);
                this.myQuestionAnswer.splice(indexQ, 1);
            }
            this.selectedAnswers.splice(index, 1);
        } else {
            // genero un my asset e lo invio al servizio che si occupa di gestirli
            if (!(selectedAsset instanceof Array)) {
                const myAsset = new MyAssetMgm();
                myAsset.magnitude = undefined;
                myAsset.estimated = undefined;
                myAsset.asset = selectedAsset;
                myAsset.questionnaire = this.questionnaire;
                myAsset.ranking = undefined;
                myAsset.selfAssessment = this.self;
                this.myQuestionAssets.push(_.clone(myAsset));
                this.idaUtilsService.addMyAsset(myAsset);
            } else {
                for (const ass of selectedAsset) {
                    const myAsset = new MyAssetMgm();
                    myAsset.magnitude = undefined;
                    myAsset.estimated = undefined;
                    myAsset.asset = ass;
                    myAsset.questionnaire = this.questionnaire;
                    myAsset.ranking = undefined;
                    myAsset.selfAssessment = this.self;
                    this.myQuestionAssets.push(_.clone(myAsset));
                    this.idaUtilsService.addMyAsset(myAsset);
                }
            }

            // genero una nuova risposta e la invio al servizio che si occupa di gestirle
            const myAnswer = new MyAnswerMgm();
            myAnswer.answer = ans;
            myAnswer.question = this.question;
            myAnswer.questionnaire = this.questionnaire;
            myAnswer.user = this.user;
            this.idaUtilsService.addMyAnswer(myAnswer);
            this.myQuestionAnswer.push(myAnswer);
            this.selectedAnswers.push(ans);
        }
        console.log(this.myQuestionAssets);
        console.log(this.selectedAnswers);
        console.log(this.idaUtilsService.getMyAnswersComplited());
        console.log(this.idaUtilsService.getMyAssets());
    }

    private findAsset(ans: AnswerMgm): AssetMgm | AssetMgm[] {
        // let param: string;
        const assetsByCategory: AssetMgm[] = [];
        if(ans.asset){
            return ans.asset as AssetMgm;
        }
        /*
        if (ans.name.search('etc.') !== -1) {
            param = ans.name.substring(0, ans.name.indexOf('('));
            param = param.trim();
        } else {
            param = ans.name;
        }
        for (const ass of this.allAssets) {
            if (ass.name === param) {
                return ass as AssetMgm;
            } else if (ass.assetcategory.name.search(param) !== -1) {
                assetsByCategory.push(ass);
            }
        }
        if (assetsByCategory.length > 0) {
            return assetsByCategory as AssetMgm[];
        }
        */
        return undefined;
    }

    public setRank(ans: AnswerMgm, rank: number) {
        const selectedAsset = this.findAsset(ans);
        if (selectedAsset instanceof AssetMgm) {
            const indexA = _.findIndex(this.myQuestionAssets,
                (myAsset) => myAsset.asset.id === selectedAsset.id
            );
            if (indexA !== -1) {
                this.myQuestionAssets[indexA].ranking = rank;
            }
        } else {
            for (const sA of selectedAsset) {
                const indexA = _.findIndex(this.myQuestionAssets,
                    (myAsset) => myAsset.asset.id === sA.id
                );
                if (indexA !== -1) {
                    this.myQuestionAssets[indexA].ranking = rank;
                }
            }
        }
    }

    public whichRank(ans: AnswerMgm): number {
        const selectedAsset = this.findAsset(ans);
        if (selectedAsset instanceof AssetMgm) {
            const indexA = _.findIndex(this.myQuestionAssets,
                (myAsset) => myAsset.asset.id === selectedAsset.id
            );
            if (indexA !== -1) {
                return this.myQuestionAssets[indexA].ranking;
            } else {
                return 0;
            }
        } else {
            const indexA = _.findIndex(this.myQuestionAssets,
                (myAsset) => myAsset.asset.id === selectedAsset[0].id
            );
            if (indexA !== -1) {
                return this.myQuestionAssets[indexA].ranking;
            } else {
                return 0;
            }
        }
    }

    public isSelected(ans: AnswerMgm): boolean {
        const index = _.findIndex(this.selectedAnswers, { id: ans.id });
        if (index !== -1) {
            return true;
        }
        return false;
    }

}
