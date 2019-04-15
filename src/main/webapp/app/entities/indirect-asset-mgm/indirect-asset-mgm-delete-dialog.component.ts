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
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IndirectAssetMgm } from './indirect-asset-mgm.model';
import { IndirectAssetMgmPopupService } from './indirect-asset-mgm-popup.service';
import { IndirectAssetMgmService } from './indirect-asset-mgm.service';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-indirect-asset-mgm-delete-dialog',
    templateUrl: './indirect-asset-mgm-delete-dialog.component.html'
})
export class IndirectAssetMgmDeleteDialogComponent {

    indirectAsset: IndirectAssetMgm;

    constructor(
        private indirectAssetService: IndirectAssetMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.indirectAssetService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'indirectAssetListModification',
                content: 'Deleted an indirectAsset'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-indirect-asset-mgm-delete-popup',
    template: ''
})
export class IndirectAssetMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private indirectAssetPopupService: IndirectAssetMgmPopupService,
        public popUpService: PopUpService
    ) { }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                this.indirectAssetPopupService
                    .open(IndirectAssetMgmDeleteDialogComponent as Component, params['id']);
            });
        }
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}
