import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('MyAnswer e2e test', () => {

    let navBarPage: NavBarPage;
    let myAnswerDialogPage: MyAnswerDialogPage;
    let myAnswerComponentsPage: MyAnswerComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load MyAnswers', () => {
        navBarPage.goToEntity('my-answer-mgm');
        myAnswerComponentsPage = new MyAnswerComponentsPage();
        expect(myAnswerComponentsPage.getTitle())
            .toMatch(/hermeneutApp.myAnswer.home.title/);

    });

    it('should load create MyAnswer dialog', () => {
        myAnswerComponentsPage.clickOnCreateButton();
        myAnswerDialogPage = new MyAnswerDialogPage();
        expect(myAnswerDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.myAnswer.home.createOrEditLabel/);
        myAnswerDialogPage.close();
    });

    it('should create and save MyAnswers', () => {
        myAnswerComponentsPage.clickOnCreateButton();
        myAnswerDialogPage.setMycheckInput('mycheck');
        expect(myAnswerDialogPage.getMycheckInput()).toMatch('mycheck');
        myAnswerDialogPage.questionnaireStatusSelectLastOption();
        myAnswerDialogPage.answerSelectLastOption();
        myAnswerDialogPage.questionSelectLastOption();
        myAnswerDialogPage.questionnaireSelectLastOption();
        myAnswerDialogPage.userSelectLastOption();
        myAnswerDialogPage.save();
        expect(myAnswerDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class MyAnswerComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-my-answer-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class MyAnswerDialogPage {
    modalTitle = element(by.css('h4#myMyAnswerLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    mycheckInput = element(by.css('input#field_mycheck'));
    questionnaireStatusSelect = element(by.css('select#field_questionnaireStatus'));
    answerSelect = element(by.css('select#field_answer'));
    questionSelect = element(by.css('select#field_question'));
    questionnaireSelect = element(by.css('select#field_questionnaire'));
    userSelect = element(by.css('select#field_user'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setMycheckInput = function(mycheck) {
        this.mycheckInput.sendKeys(mycheck);
    };

    getMycheckInput = function() {
        return this.mycheckInput.getAttribute('value');
    };

    questionnaireStatusSelectLastOption = function() {
        this.questionnaireStatusSelect.all(by.tagName('option')).last().click();
    };

    questionnaireStatusSelectOption = function(option) {
        this.questionnaireStatusSelect.sendKeys(option);
    };

    getQuestionnaireStatusSelect = function() {
        return this.questionnaireStatusSelect;
    };

    getQuestionnaireStatusSelectedOption = function() {
        return this.questionnaireStatusSelect.element(by.css('option:checked')).getText();
    };

    answerSelectLastOption = function() {
        this.answerSelect.all(by.tagName('option')).last().click();
    };

    answerSelectOption = function(option) {
        this.answerSelect.sendKeys(option);
    };

    getAnswerSelect = function() {
        return this.answerSelect;
    };

    getAnswerSelectedOption = function() {
        return this.answerSelect.element(by.css('option:checked')).getText();
    };

    questionSelectLastOption = function() {
        this.questionSelect.all(by.tagName('option')).last().click();
    };

    questionSelectOption = function(option) {
        this.questionSelect.sendKeys(option);
    };

    getQuestionSelect = function() {
        return this.questionSelect;
    };

    getQuestionSelectedOption = function() {
        return this.questionSelect.element(by.css('option:checked')).getText();
    };

    questionnaireSelectLastOption = function() {
        this.questionnaireSelect.all(by.tagName('option')).last().click();
    };

    questionnaireSelectOption = function(option) {
        this.questionnaireSelect.sendKeys(option);
    };

    getQuestionnaireSelect = function() {
        return this.questionnaireSelect;
    };

    getQuestionnaireSelectedOption = function() {
        return this.questionnaireSelect.element(by.css('option:checked')).getText();
    };

    userSelectLastOption = function() {
        this.userSelect.all(by.tagName('option')).last().click();
    };

    userSelectOption = function(option) {
        this.userSelect.sendKeys(option);
    };

    getUserSelect = function() {
        return this.userSelect;
    };

    getUserSelectedOption = function() {
        return this.userSelect.element(by.css('option:checked')).getText();
    };

    save() {
        this.saveButton.click();
    }

    close() {
        this.closeButton.click();
    }

    getSaveButton() {
        return this.saveButton;
    }
}