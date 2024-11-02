import { TestBed } from '@angular/core/testing';

import { EvaluationsBusinessService } from './evaluations-business.service';

describe('EvaluationsBusinessService', () => {
  let service: EvaluationsBusinessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvaluationsBusinessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getGrowthFactors: should ', () => {
    const factor = service.getGrowthFactors();

    service['growthRates'] = [0.02, 0.05, 0.02];

    const expected = [ 
      0.02, 0.02, 0.02, 0.02, 0.02,
      0.05, 0.05, 0.05, 0.05, 0.05,
      0.02, 0.02, 0.02, 0.02, 0.02,
      0.02, 0.02, 0.02, 0.02, 0.02
    ]

    expect(factor).toEqual(expected);
  });

  it('#getDiscountFactorOnYear: should ', () => {
    service['discountFactor'] = 0.1
    const factor = service.getDiscountFactorOnYear(1);
    expect(factor).toEqual(0.9);
  });

  it('#getDiscountFactorOnYear: should ', () => {
    service['discountFactor'] = 0.1
    const factor = service.getDiscountFactorOnYear(2);
    expect(factor).toEqual(0.81);
  });

  it('#getPropagatedRevenue: should ', () => {
    service['growthRates'] = [1, 1, 0];
    service['initialRevenue'] = 1

    const factor = service.getPropagatedRevenue();
    const expected = [ 
      2, 4, 8, 16, 32, 64, 128, 256, 512, 1024,
      1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024
    ]
    expect(factor).toEqual(expected);
  });

  it('#getPropagatedRevenue: should ', () => {
    service['growthRates'] = [0.05, 0, 0];
    service['initialRevenue'] = 1

    const factor = service.getPropagatedRevenue();

    const year1 = factor[0];
    const year2 = factor[1]

    expect(year1).toEqual(1.05);
    expect(year2).toEqual(1.1025);
  });

  it('#getPropagatedFCF: should ', () => {
    spyOn(service, 'getPropagatedRevenue').and.returnValue([150, 200, 250]);
    service['initialRevenue'] = 100;
    service['initialFcf'] = 50;

    const fcfExpectation = service.getPropagatedFCF();

    const expected = [75, 100, 125];

    expect(fcfExpectation).toEqual(expected);
  });

  it('#getPropagatedFCF: should ', () => {
    spyOn(service, 'getPropagatedRevenue').and.returnValue([150, 200, 250]);
    service['initialRevenue'] = 100;
    service['initialFcf'] = 50;

    const fcfExpectation = service.getPropagatedFCF(0.25);

    const expected = [37.5, 50, 62.5];

    expect(fcfExpectation).toEqual(expected);
  });

  it('#getDiscountedFCF: should ', () => {
    spyOn(service, 'getPropagatedFCF').and.returnValue([100, 100, 100, 100]);

    service['discountFactor'] = 0.10;

    const dfcfPropagation = service.getDiscountedFCF();

    const expected = [90, 81, 72.9, 65.61];

    expect(dfcfPropagation[0]).toEqual(expected[0])
    expect(dfcfPropagation[1]).toEqual(expected[1])
    expect(dfcfPropagation[2]).toBeCloseTo(expected[2])
    expect(dfcfPropagation[3]).toBeCloseTo(expected[3])
  });

  it('#computeProjectedCashFlows: should ', () => {
    spyOn(service, 'getDiscountedFCF').and.returnValue([90, 81, 72.9, 65.61]);

    const futureCashFlows = service.computeProjectedCashFlows();

    expect(futureCashFlows).toBeCloseTo(309.51)
  });

  
  it('#intrinsicValue: should ', () => {
    spyOn(service, 'getDiscountedFCF').and.returnValue([90, 81, 72.9, 65.61]);

    service['debt'] = 60;
    service['cash'] = 30;

    const intrinsicValue = service.computeIntrinsicValue();

    expect(intrinsicValue).toBeCloseTo(279.51);
  });
});
