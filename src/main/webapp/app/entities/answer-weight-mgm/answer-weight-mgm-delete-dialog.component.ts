import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { AnswerWeightMgm } from './answer-weight-mgm.model';
import { AnswerWeightMgmPopupService } from './answer-weight-mgm-popup.service';
import { AnswerWeightMgmService } from './answer-weight-mgm.service';

@Component({
    selector: 'jhi-answer-weight-mgm-delete-dialog',
    templateUrl: './answer-weight-mgm-delete-dialog.component.html'
})
export class AnswerWeightMgmDeleteDialogComponent {

    answerWeight: AnswerWeightMgm;

    constructor(
        private answerWeightService: AnswerWeightMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.answerWeightService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'answerWeightListModification',
                content: 'Deleted an answerWeight'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-answer-weight-mgm-delete-popup',
    template: ''
})
export class AnswerWeightMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private answerWeightPopupService: AnswerWeightMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.answerWeightPopupService
                .open(AnswerWeightMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
