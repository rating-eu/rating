import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { EBITMgm } from './ebit-mgm.model';
import { EBITMgmService } from './ebit-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-ebit-mgm',
    templateUrl: './ebit-mgm.component.html'
})
export class EBITMgmComponent implements OnInit, OnDestroy {
eBITS: EBITMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private eBITService: EBITMgmService,
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
            this.eBITService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<EBITMgm[]>) => this.eBITS = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.eBITService.query().subscribe(
            (res: HttpResponse<EBITMgm[]>) => {
                this.eBITS = res.body;
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
        this.registerChangeInEBITS();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: EBITMgm) {
        return item.id;
    }
    registerChangeInEBITS() {
        this.eventSubscriber = this.eventManager.subscribe('eBITListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
