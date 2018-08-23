/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { MitigationMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/mitigation-mgm/mitigation-mgm-delete-dialog.component';
import { MitigationMgmService } from '../../../../../../main/webapp/app/entities/mitigation-mgm/mitigation-mgm.service';

describe('Component Tests', () => {

    describe('MitigationMgm Management Delete Component', () => {
        let comp: MitigationMgmDeleteDialogComponent;
        let fixture: ComponentFixture<MitigationMgmDeleteDialogComponent>;
        let service: MitigationMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [MitigationMgmDeleteDialogComponent],
                providers: [
                    MitigationMgmService
                ]
            })
            .overrideTemplate(MitigationMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MitigationMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MitigationMgmService);
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
