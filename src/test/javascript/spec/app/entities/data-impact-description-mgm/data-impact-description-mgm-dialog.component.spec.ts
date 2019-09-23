/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { DataImpactDescriptionMgmDialogComponent } from '../../../../../../main/webapp/app/entities/data-impact-description-mgm/data-impact-description-mgm-dialog.component';
import { DataImpactDescriptionMgmService } from '../../../../../../main/webapp/app/entities/data-impact-description-mgm/data-impact-description-mgm.service';
import { DataImpactDescriptionMgm } from '../../../../../../main/webapp/app/entities/data-impact-description-mgm/data-impact-description-mgm.model';

describe('Component Tests', () => {

    describe('DataImpactDescriptionMgm Management Dialog Component', () => {
        let comp: DataImpactDescriptionMgmDialogComponent;
        let fixture: ComponentFixture<DataImpactDescriptionMgmDialogComponent>;
        let service: DataImpactDescriptionMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DataImpactDescriptionMgmDialogComponent],
                providers: [
                    DataImpactDescriptionMgmService
                ]
            })
            .overrideTemplate(DataImpactDescriptionMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DataImpactDescriptionMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DataImpactDescriptionMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new DataImpactDescriptionMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.dataImpactDescription = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'dataImpactDescriptionListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new DataImpactDescriptionMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.dataImpactDescription = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'dataImpactDescriptionListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
