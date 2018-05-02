/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { LevelWrapperMgmDetailComponent } from '../../../../../../main/webapp/app/entities/level-wrapper-mgm/level-wrapper-mgm-detail.component';
import { LevelWrapperMgmService } from '../../../../../../main/webapp/app/entities/level-wrapper-mgm/level-wrapper-mgm.service';
import { LevelWrapperMgm } from '../../../../../../main/webapp/app/entities/level-wrapper-mgm/level-wrapper-mgm.model';

describe('Component Tests', () => {

    describe('LevelWrapperMgm Management Detail Component', () => {
        let comp: LevelWrapperMgmDetailComponent;
        let fixture: ComponentFixture<LevelWrapperMgmDetailComponent>;
        let service: LevelWrapperMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [LevelWrapperMgmDetailComponent],
                providers: [
                    LevelWrapperMgmService
                ]
            })
            .overrideTemplate(LevelWrapperMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LevelWrapperMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LevelWrapperMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new LevelWrapperMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.levelWrapper).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
