import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LikelihoodScaleMgm } from './likelihood-scale-mgm.model';
import { LikelihoodScaleMgmService } from './likelihood-scale-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-likelihood-scale-mgm',
    templateUrl: './likelihood-scale-mgm.component.html'
})
export class LikelihoodScaleMgmComponent implements OnInit, OnDestroy {
likelihoodScales: LikelihoodScaleMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private likelihoodScaleService: LikelihoodScaleMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ?
            this.activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.likelihoodScaleService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<LikelihoodScaleMgm[]>) => this.likelihoodScales = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.likelihoodScaleService.query().subscribe(
            (res: HttpResponse<LikelihoodScaleMgm[]>) => {
                this.likelihoodScales = res.body;
                this.currentSearch = '';
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInLikelihoodScales();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: LikelihoodScaleMgm) {
        return item.id;
    }
    registerChangeInLikelihoodScales() {
        this.eventSubscriber = this.eventManager.subscribe('likelihoodScaleListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
