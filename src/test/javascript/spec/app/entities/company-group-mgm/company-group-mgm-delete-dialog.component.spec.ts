/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { CompanyGroupMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/company-group-mgm/company-group-mgm-delete-dialog.component';
import { CompanyGroupMgmService } from '../../../../../../main/webapp/app/entities/company-group-mgm/company-group-mgm.service';

describe('Component Tests', () => {

    describe('CompanyGroupMgm Management Delete Component', () => {
        let comp: CompanyGroupMgmDeleteDialogComponent;
        let fixture: ComponentFixture<CompanyGroupMgmDeleteDialogComponent>;
        let service: CompanyGroupMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [CompanyGroupMgmDeleteDialogComponent],
                providers: [
                    CompanyGroupMgmService
                ]
            })
            .overrideTemplate(CompanyGroupMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CompanyGroupMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CompanyGroupMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(Observable.of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
