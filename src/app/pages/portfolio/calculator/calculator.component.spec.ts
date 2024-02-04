import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorComponent } from './calculator.component';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute growth factors', () => {
    const expectedGrowth = [15,15,15,15,15,7,7,7,7,7,4,4,4,4,4,4,4,4,4].map( ( num ) => num/100 );
    const growthFactors = component.computeGrowthFactors([15, 7, 4]);
    expect(growthFactors.length).toEqual(19);
    expect(growthFactors).toEqual(expectedGrowth);
  });

  it('should compute growth factors', () => {
    const projectedRevenue = component.propagateRevenueGrowth({revenue: 1, growth5: 100, growth10: 0, growth20: 100});
    const expectedReturn = [1, 2, 4, 8, 16, 32, 32, 32, 32, 32, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384];
    expect(projectedRevenue).toEqual(expectedReturn);
  });

  it('should compute intrinsic value', () => {
    const input = {revenue: 1, fcf: 1, debt: 0, shares: 1, discount: 0, growth5: 0, growth10: 0, growth20: 0 }

    const projectedRevenue = component.computeIntrinsicValue(input)
    const expectedReturn = 20;
    expect(projectedRevenue).toEqual(expectedReturn);
  });
});
