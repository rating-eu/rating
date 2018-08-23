import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { SelfAssessmentMgm } from './self-assessment-mgm.model';
import { SelfAssessmentMgmService } from './self-assessment-mgm.service';

@Injectable()
export class SelfAssessmentMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private selfAssessmentService: SelfAssessmentMgmService

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
                this.selfAssessmentService.find(id)
                    .subscribe((selfAssessmentResponse: HttpResponse<SelfAssessmentMgm>) => {
                        const selfAssessment: SelfAssessmentMgm = selfAssessmentResponse.body;
                        selfAssessment.created = this.datePipe
                            .transform(selfAssessment.created, 'yyyy-MM-ddTHH:mm:ss');
                        selfAssessment.modified = this.datePipe
                            .transform(selfAssessment.modified, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.selfAssessmentModalRef(component, selfAssessment);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.selfAssessmentModalRef(component, new SelfAssessmentMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    selfAssessmentModalRef(component: Component, selfAssessment: SelfAssessmentMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.selfAssessment = selfAssessment;
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
