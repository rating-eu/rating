/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { AnswerWeightMgmDialogComponent } from '../../../../../../main/webapp/app/entities/answer-weight-mgm/answer-weight-mgm-dialog.component';
import { AnswerWeightMgmService } from '../../../../../../main/webapp/app/entities/answer-weight-mgm/answer-weight-mgm.service';
import { AnswerWeightMgm } from '../../../../../../main/webapp/app/entities/answer-weight-mgm/answer-weight-mgm.model';

describe('Component Tests', () => {

    describe('AnswerWeightMgm Management Dialog Component', () => {
        let comp: AnswerWeightMgmDialogComponent;
        let fixture: ComponentFixture<AnswerWeightMgmDialogComponent>;
        let service: AnswerWeightMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [AnswerWeightMgmDialogComponent],
                providers: [
                    AnswerWeightMgmService
                ]
            })
            .overrideTemplate(AnswerWeightMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AnswerWeightMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AnswerWeightMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new AnswerWeightMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.answerWeight = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'answerWeightListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new AnswerWeightMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.answerWeight = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'answerWeightListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});