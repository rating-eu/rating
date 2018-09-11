import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { CriticalLevelMgm } from './critical-level-mgm.model';
import { CriticalLevelMgmService } from './critical-level-mgm.service';

@Injectable()
export class CriticalLevelMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private criticalLevelService: CriticalLevelMgmService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.criticalLevelService.find(id)
                    .subscribe((criticalLevelResponse: HttpResponse<CriticalLevelMgm>) => {
                        const criticalLevel: CriticalLevelMgm = criticalLevelResponse.body;
                        this.ngbModalRef = this.criticalLevelModalRef(component, criticalLevel);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.criticalLevelModalRef(component, new CriticalLevelMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    criticalLevelModalRef(component: Component, criticalLevel: CriticalLevelMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.criticalLevel = criticalLevel;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}