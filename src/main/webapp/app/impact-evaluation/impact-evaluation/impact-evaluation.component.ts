import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '../../../../../../node_modules/@angular/forms';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { AssetMgmService, AssetMgm } from '../../entities/asset-mgm';
import { AssetType } from '../../entities/enumerations/AssetType.enum';
import { ImpactEvaluationService } from '../impact-evaluation.service';
import { EBITMgm } from '../../entities/ebit-mgm';
import { Wp3BundleInput } from '../model/wp3-bundle-input.model';
import { EconomicCoefficientsMgm } from '../../entities/economic-coefficients-mgm';
import { SectorType, CategoryType } from '../../entities/splitting-loss-mgm';
import { MyCategoryType } from '../../entities/enumerations/MyCategoryType.enum';
import { Router } from '../../../../../../node_modules/@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'impact-evaluation',
  templateUrl: './impact-evaluation.component.html',
  styles: []
})
export class ImpactEvaluationComponent implements OnInit {

  public witchStep = 1;
  public isGlobal = true;
  public sectorChoosed: string;
  public impactFormStepOne: FormGroup;
  public impactFormStepTwo: FormGroup;
  public impactFormStepThree: FormGroup;
  // public impactFormStepFour: FormGroup;

  public economicPerformance: number;
  public intangibleDrivingEarnings: number;
  public intangibleCapitalValuation: number;
  public lossOnintangibleAssetsDueToCyberattacks: number;
  public impactOnOrgCapital: number;
  public impactOnKeyComp: number;
  public impactOnIP: number;
  public impactOnFinanceAndInsuranceSector: number[];
  public impactOnHealthCareSector: number[];
  public impactOnInformationSector: number[];
  public impactOnProfessionalSector: number[];

  public tangibleAssets: MyAssetMgm[] = [];
  public financialAssetsAkaCurrent: MyAssetMgm[] = [];
  public physicalAssetsAkaFixed: MyAssetMgm[] = [];
  public ebitLabel: string[] = [];

  private mySelf: SelfAssessmentMgm;
  private firstYear: number;
  private lastYear: number;
  private choosedSectorType: SectorType;

  public sectorialPercentageMatrix: any[] = [
    {
      ipSectorialPercentage: [] = [
        { financeAmdInsurence: 13.6 },
        { healthCareAndSocialAssistance: 14.7 },
        { information: 27.5 },
        { professionalScientificAndTechnicalService: 6.1 }
      ],
      keyCompSectorialPercentage: [] = [
        { financeAmdInsurence: 45.3 },
        { healthCareAndSocialAssistance: 63.3 },
        { information: 27.8 },
        { professionalScientificAndTechnicalService: 53.7 }
      ],
      orgCapitalSectorialPercentage: [] = [
        { financeAmdInsurence: 41.1 },
        { healthCareAndSocialAssistance: 22 },
        { information: 44.7 },
        { professionalScientificAndTechnicalService: 40.2 }
      ],
    }
  ];
  constructor(
    private mySelfAssessmentService: SelfAssessmentMgmService,
    private assetService: AssetMgmService,
    private impactService: ImpactEvaluationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.firstYear = (new Date().getFullYear()) - 2;
    this.lastYear = (new Date().getFullYear()) + 3;
    let year = this.firstYear;
    while (year <= this.lastYear) {
      this.ebitLabel.push('Ebit for ' + year.toString());
      year++;
    }
    // TODO chiamata per recuperare tutti i MyAssets a partire dal selfAssessment
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
    this.impactService.getMyAssets(this.mySelf).toPromise().then((res) => {
      if (res && res.length > 0) {
        // Recuperare tutti gli intangible;
        for (const asset of res) {
          if ((asset.asset as AssetMgm).assetcategory.type.toString() === AssetType.TANGIBLE.toString()) {
            this.tangibleAssets.push(asset);
            if ((asset.asset as AssetMgm).assetcategory.name === 'Current Assets') {
              this.financialAssetsAkaCurrent.push(asset);
            } else if ((asset.asset as AssetMgm).assetcategory.name === 'Fixed Assets') {
              this.physicalAssetsAkaFixed.push(asset);
            }
          }
        }
        console.log(this.tangibleAssets);
        console.log(this.financialAssetsAkaCurrent);
        console.log(this.physicalAssetsAkaFixed);
      }
    });

    this.tangibleAssets = [];
    this.impactFormStepOne = new FormGroup({
      ebit1: new FormControl(undefined, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]+')
      ])),
      ebit2: new FormControl(undefined, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]+')
      ])),
      ebit3: new FormControl(undefined, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]+')
      ])),
      ebit4: new FormControl(undefined, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]+')
      ])),
      ebit5: new FormControl(undefined, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]+')
      ])),
      ebit6: new FormControl(undefined, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]+')
      ])),
      /*
      firstYear: new FormControl(firstYear, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
      lastYear: new FormControl(lastYear, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
      */
      discountingRate: new FormControl(undefined, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(1),
        Validators.pattern('[0-9]+,[0-9]+|[0-9]+.[0-9]+')
      ])),
    });
    this.impactFormStepTwo = new FormGroup({
      physicalAssetsReturn: new FormControl(7.1, Validators.compose([
        // Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('[0-9]+,[0-9]+|[0-9]+.[0-9]+|[0-9]+')
      ])),
      financialAssetsReturn: new FormControl(5.0, Validators.compose([
        // Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('[0-9]+,[0-9]+|[0-9]+.[0-9]+|[0-9]+')
      ])),
    });
    this.impactFormStepThree = new FormGroup({
      lossOfIntangiblePercentage: new FormControl(18.29, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('[0-9]+,[0-9]+|[0-9]+.[0-9]+|[0-9]+')
      ])),
    });
    // NON PIù NECESSARIO, I PARAMETRI PERCENTUALI SONO PRESTABILITI E NON MODIFICABILI
    /*
    this.impactFormStepFour = new FormGroup({
      globalPercentageIP: new FormControl(19.89, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('[0-9]+,[0-9]+|[0-9]+.[0-9]+')
      ])),
      globalPercentageKeyComp: new FormControl(42.34, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('[0-9]+,[0-9]+|[0-9]+.[0-9]+')
      ])),
      globalPercentageOrgCapital: new FormControl(37.77, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('[0-9]+,[0-9]+|[0-9]+.[0-9]+')
      ])),
      sectorialPercentage: new FormControl(undefined, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('[0-9]+,[0-9]+|[0-9]+.[0-9]+')
      ])),
    });
    */
  }

  public trackByFn(index: number, value: any) {
    return index;
  }

  public evaluateStepOne() {
    console.log('EVALUATE STEP ONE');
    const ebits: EBITMgm[] = [];
    const dataChange = false;
    // prepare ebit 1
    const ebit1: EBITMgm = new EBITMgm();
    ebit1.selfAssessment = this.mySelf;
    ebit1.year = this.firstYear;
    if (String(this.impactFormStepOne.get('ebit1').value).includes(',')) {
      ebit1.value = Math.round(Number((this.impactFormStepOne.get('ebit1').value as string).replace(/,/g, '.')) * 100) / 100;
    } else {
      ebit1.value = Math.round(Number(this.impactFormStepOne.get('ebit1').value as string) * 100) / 100;
    }
    ebits.push(ebit1);
    // prepare ebit 2
    const ebit2: EBITMgm = new EBITMgm();
    ebit2.selfAssessment = this.mySelf;
    ebit2.year = this.firstYear + 1;
    if (String(this.impactFormStepOne.get('ebit2').value).includes(',')) {
      ebit2.value = Math.round(Number((this.impactFormStepOne.get('ebit2').value as string).replace(/,/g, '.')) * 100) / 100;
    } else {
      ebit2.value = Math.round(Number(this.impactFormStepOne.get('ebit2').value as string) * 100) / 100;
    }
    ebits.push(ebit2);
    // prepare ebit 3
    const ebit3: EBITMgm = new EBITMgm();
    ebit3.selfAssessment = this.mySelf;
    ebit3.year = this.firstYear + 2;
    if (String(this.impactFormStepOne.get('ebit3').value).includes(',')) {
      ebit3.value = Math.round(Number((this.impactFormStepOne.get('ebit3').value as string).replace(/,/g, '.')) * 100) / 100;
    } else {
      ebit3.value = Math.round(Number(this.impactFormStepOne.get('ebit3').value as string) * 100) / 100;
    }
    ebits.push(ebit3);
    // prepare ebit 4
    const ebit4: EBITMgm = new EBITMgm();
    ebit4.selfAssessment = this.mySelf;
    ebit4.year = this.firstYear + 3;
    if (String(this.impactFormStepOne.get('ebit4').value).includes(',')) {
      ebit4.value = Math.round(Number((this.impactFormStepOne.get('ebit4').value as string).replace(/,/g, '.')) * 100) / 100;
    } else {
      ebit4.value = Math.round(Number(this.impactFormStepOne.get('ebit4').value as string) * 100) / 100;
    }
    ebits.push(ebit4);
    // prepare ebit 5
    const ebit5: EBITMgm = new EBITMgm();
    ebit5.selfAssessment = this.mySelf;
    ebit5.year = this.firstYear + 4;
    if (String(this.impactFormStepOne.get('ebit5').value).includes(',')) {
      ebit5.value = Math.round(Number((this.impactFormStepOne.get('ebit5').value as string).replace(/,/g, '.')) * 100) / 100;
    } else {
      ebit5.value = Math.round(Number(this.impactFormStepOne.get('ebit5').value as string) * 100) / 100;
    }
    ebits.push(ebit5);
    // prepare ebit 6
    const ebit6: EBITMgm = new EBITMgm();
    ebit6.selfAssessment = this.mySelf;
    ebit6.year = this.firstYear + 5;
    if (String(this.impactFormStepOne.get('ebit6').value).includes(',')) {
      ebit6.value = Math.round(Number((this.impactFormStepOne.get('ebit6').value as string).replace(/,/g, '.')) * 100) / 100;
    } else {
      ebit6.value = Math.round(Number(this.impactFormStepOne.get('ebit6').value as string) * 100) / 100;
    }
    ebits.push(ebit5);
    // prepare discounting rate
    let discounting: number;
    if (String(this.impactFormStepOne.get('discountingRate').value).includes(',')) {
      discounting = Math.round(Number((this.impactFormStepOne.get('discountingRate').value as string).replace(/,/g, '.')) * 100) / 100;
    } else {
      discounting = Math.round(Number(this.impactFormStepOne.get('discountingRate').value as string) * 100) / 100;
    }
    if (ebits.length === 6 && discounting) {
      const inputs: Wp3BundleInput = new Wp3BundleInput();
      inputs.ebits = ebits;
      inputs.economicCoefficients = new EconomicCoefficientsMgm();
      inputs.economicCoefficients.discountingRate = discounting;
      console.log(inputs);
      this.impactService.evaluateStepOne(inputs, this.mySelf).toPromise().then((res) => {
        if (res) {
          this.economicPerformance = res.economicResults.economicPerformance;
        }
      });
      // this.economicPerformance = Math.random() * 100;
    }
  }
  public evaluateStepTwo() {
    console.log('EVALUATE STEP TWO');
    let dataIsOk = true;
    for (const asset of this.physicalAssetsAkaFixed) {
      if (isNaN(parseFloat(asset.economicValue.toString()))) {
        dataIsOk = false;
      }
    }
    for (const asset of this.financialAssetsAkaCurrent) {
      if (isNaN(parseFloat(asset.economicValue.toString()))) {
        dataIsOk = false;
      }
    }
    if (!dataIsOk) {
      return;
    }
    let physicalAssetsReturn = 7.1;
    let financialAssetsReturn = 5.0;
    if (this.impactFormStepTwo.get('physicalAssetsReturn').value &&
      !isNaN(parseFloat(this.impactFormStepTwo.get('physicalAssetsReturn').value))) {
      if (String(this.impactFormStepTwo.get('physicalAssetsReturn').value).includes(',')) {
        physicalAssetsReturn = Math.round(Number((this.impactFormStepTwo.get('physicalAssetsReturn').value as string).replace(/,/g, '.')) * 100) / 100;
      } else {
        physicalAssetsReturn = Math.round(Number(this.impactFormStepTwo.get('physicalAssetsReturn').value as string) * 100) / 100;
      }
    }
    if (this.impactFormStepTwo.get('financialAssetsReturn').value &&
      !isNaN(parseFloat(this.impactFormStepTwo.get('financialAssetsReturn').value))) {
      if (String(this.impactFormStepTwo.get('financialAssetsReturn').value).includes(',')) {
        financialAssetsReturn = Math.round(Number(String(this.impactFormStepTwo.get('financialAssetsReturn').value).replace(/,/g, '.')) * 100) / 100;
      } else {
        financialAssetsReturn = Math.round(Number(String(this.impactFormStepTwo.get('financialAssetsReturn').value)) * 100) / 100;
      }
    }
    if (this.financialAssetsAkaCurrent && this.physicalAssetsAkaFixed && financialAssetsReturn && physicalAssetsReturn) {
      const inputs: Wp3BundleInput = new Wp3BundleInput();
      inputs.economicCoefficients = new EconomicCoefficientsMgm();
      inputs.economicCoefficients.physicalAssetsReturn = physicalAssetsReturn;
      inputs.economicCoefficients.financialAssetsReturn = financialAssetsReturn;
      inputs.myAssets = [];
      inputs.myAssets = this.financialAssetsAkaCurrent.concat(this.physicalAssetsAkaFixed);
      console.log(inputs);
      this.impactService.evaluateStepTwo(inputs, this.mySelf).toPromise().then((res) => {
        if (res) {
          this.intangibleDrivingEarnings = res.economicResults.intangibleDrivingEarnings;
          this.intangibleCapitalValuation = res.economicResults.intangibleCapital;
        }
      });
      /*
      this.intangibleDrivingEarnings = Math.random() * 100;
      this.intangibleCapitalValuation = Math.random() * 100;
      */
    }
  }
  public evaluateStepThree() {
    console.log('EVALUATE STEP THREE');
    let lossOfIntangiblePercentage = 18.29;
    if (this.impactFormStepThree.get('lossOfIntangiblePercentage').value &&
      !isNaN(parseFloat(this.impactFormStepThree.get('lossOfIntangiblePercentage').value))) {
      if (String(this.impactFormStepThree.get('lossOfIntangiblePercentage').value).includes(',')) {
        lossOfIntangiblePercentage = Math.round(Number((this.impactFormStepThree.get('lossOfIntangiblePercentage').value as string).replace(/,/g, '.')) * 100) / 100;
      } else {
        lossOfIntangiblePercentage = Math.round(Number(this.impactFormStepThree.get('lossOfIntangiblePercentage').value as string) * 100) / 100;
      }
    }
    if (lossOfIntangiblePercentage) {
      const inputs: Wp3BundleInput = new Wp3BundleInput();
      inputs.economicCoefficients = new EconomicCoefficientsMgm();
      inputs.economicCoefficients.lossOfIntangible = lossOfIntangiblePercentage;
      console.log(inputs);
      this.impactService.evaluateStepThree(inputs, this.mySelf).toPromise().then((res) => {
        if (res) {
          this.lossOnintangibleAssetsDueToCyberattacks = res.economicResults.intangibleLossByAttacks;
        }
      });
      // this.lossOnintangibleAssetsDueToCyberattacks = Math.random() * 100;
    }
  }

  public evaluateStepFour() {
    console.log('EVALUATE STEP FOUR');
    /*
    if (this.impactFormStepFour.invalid) {
      // gestire l'errore
      return;
    }
    */
    const inputs: Wp3BundleInput = new Wp3BundleInput();
    if (this.isGlobal) {
      inputs.sectorType = SectorType.GLOBAL;
    } else {
      inputs.sectorType = this.choosedSectorType;
    }
    console.log(inputs);
    this.impactService.evaluateStepFour(inputs, this.mySelf).toPromise().then((res) => {
      if (res) {
        for (const impactOn of res.splittingLosses) {
          switch (impactOn.categoryType.toString()) {
            case MyCategoryType.IP.toString(): {
              this.impactOnIP = impactOn.loss;
              break;
            }
            case MyCategoryType.KEY_COMP.toString(): {
              this.impactOnKeyComp = impactOn.loss;
              break;
            }
            case MyCategoryType.ORG_CAPITAL.toString(): {
              this.impactOnOrgCapital = impactOn.loss;
              break;
            }
          }
        }
      }
    });
    /*
    this.impactOnOrgCapital = Math.random() * 100;
    this.impactOnKeyComp = Math.random() * 100;
    this.impactOnIP = Math.random() * 100;
    */
  }

  public isSectorSelected(sector: string): boolean {
    if (this.sectorChoosed === sector) {
      return true;
    }
    return false;
  }

  public selectStep(step: number) {
    switch (step) {
      case 2: {
        if (this.impactFormStepOne.invalid) {
          return;
        }
        this.evaluateStepOne();
        break;
      }
      case 3: {
        if (this.impactFormStepTwo.invalid) {
          return;
        }
        this.evaluateStepTwo();
        break;
      }
      case 4: {
        if (this.impactFormStepThree.invalid) {
          return;
        }
        this.evaluateStepThree();
        if (this.isGlobal) {
          this.evaluateStepFour();
        }
        break;
      }
    }
    this.witchStep = step;
  }

  public setIsGlobal() {
    this.isGlobal = !this.isGlobal;
    if (this.isGlobal) {
      this.evaluateStepFour();
    } else {
      this.resetStepFourRes();
    }
  }

  private resetStepFourRes() {
    this.choosedSectorType = null;
    this.impactOnOrgCapital = undefined;
    this.impactOnKeyComp = undefined;
    this.impactOnIP = undefined;
  }

  public setSector(sector: string) {
    this.sectorChoosed = sector;
    switch (sector) {
      case 'finance_and_insurance': {
        this.choosedSectorType = SectorType.FINANCE_AND_INSURANCE;
        break;
      }
      case 'health_care_and_social_assistance': {
        this.choosedSectorType = SectorType.HEALTH_CARE_AND_SOCIAL_ASSISTANCE;
        break;
      }
      case 'information': {
        this.choosedSectorType = SectorType.INFORMATION;
        break;
      }
      case 'professional_scientific_and_technical_service': {
        this.choosedSectorType = SectorType.PROFESSIONAL_SCIENTIFIC_AND_TECHNICAL_SERVICE;
        break;
      }
    }
    this.evaluateStepFour();
  }

  public close() {
    this.router.navigate(['./']);
  }
}
