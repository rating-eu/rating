/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { AssetMgm } from './asset-mgm.model';
import { AssetMgmService } from './asset-mgm.service';
import { Principal } from '../../shared';
import {MyRole} from '../enumerations/MyRole.enum';

@Component({
    selector: 'jhi-asset-mgm',
    templateUrl: './asset-mgm.component.html'
})
export class AssetMgmComponent implements OnInit, OnDestroy {
assets: AssetMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    public isADMIN: boolean;

    constructor(
        private assetService: AssetMgmService,
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
            this.assetService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<AssetMgm[]>) => this.assets = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.assetService.query().subscribe(
            (res: HttpResponse<AssetMgm[]>) => {
                this.assets = res.body;
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
        this.principal.hasAnyAuthority([MyRole[MyRole.ROLE_ADMIN]]).then((response: boolean) => {
            if (response) {
                this.isADMIN = response;
            } else {
                this.isADMIN = false;
            }
        });
        this.registerChangeInAssets();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: AssetMgm) {
        return item.id;
    }
    registerChangeInAssets() {
        this.eventSubscriber = this.eventManager.subscribe('assetListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
