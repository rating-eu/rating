/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { IndirectAssetMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/indirect-asset-mgm/indirect-asset-mgm-delete-dialog.component';
import { IndirectAssetMgmService } from '../../../../../../main/webapp/app/entities/indirect-asset-mgm/indirect-asset-mgm.service';

describe('Component Tests', () => {

    describe('IndirectAssetMgm Management Delete Component', () => {
        let comp: IndirectAssetMgmDeleteDialogComponent;
        let fixture: ComponentFixture<IndirectAssetMgmDeleteDialogComponent>;
        let service: IndirectAssetMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [IndirectAssetMgmDeleteDialogComponent],
                providers: [
                    IndirectAssetMgmService
                ]
            })
            .overrideTemplate(IndirectAssetMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(IndirectAssetMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(IndirectAssetMgmService);
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
