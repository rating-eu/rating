/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { AttackCostParamMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/attack-cost-param-mgm/attack-cost-param-mgm-delete-dialog.component';
import { AttackCostParamMgmService } from '../../../../../../main/webapp/app/entities/attack-cost-param-mgm/attack-cost-param-mgm.service';

describe('Component Tests', () => {

    describe('AttackCostParamMgm Management Delete Component', () => {
        let comp: AttackCostParamMgmDeleteDialogComponent;
        let fixture: ComponentFixture<AttackCostParamMgmDeleteDialogComponent>;
        let service: AttackCostParamMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [AttackCostParamMgmDeleteDialogComponent],
                providers: [
                    AttackCostParamMgmService
                ]
            })
            .overrideTemplate(AttackCostParamMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AttackCostParamMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AttackCostParamMgmService);
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
