import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EvaluationsBusinessService {
  private growthRates: number[];

  private discountFactor: number;
  private initialRevenue: number;
  private initialFcf: number;
  private debt: number;
  private cash: number;

  constructor() {
     this.growthRates = [0.02, 0.05, 0.02];
     this.discountFactor = 1;
     this.initialRevenue = 1;
     this.initialFcf = 1;
     this.debt = 1;
     this.cash = 1;
  }

  computeIntrinsicValue(method: string = 'DFCF'){
    return this.cash - this.debt + this.computeProjectedCashFlows(); 
  }

  computeProjectedCashFlows() {
    return this.getDiscountedFCF().reduce((acc, curr) => acc + curr, 0);
  }

  getDiscountedFCF(): number[] {
    const propagatedFCF = this.getPropagatedFCF();

    return propagatedFCF.map( (fcf, index) => fcf*this.getDiscountFactorOnYear(index+1) )
  }

  getPropagatedFCF(ratio?: number) {
    const revenueExpectation = this.getPropagatedRevenue();

    const fcfRatio = ratio ?? this.initialFcf/this.initialRevenue;

    return revenueExpectation.map( (revenue) => revenue*fcfRatio );
  }

  getPropagatedRevenue(): number[] {
    const growthFactors = this.getGrowthFactors();
    return growthFactors.reduce(
      (projRevenue: number[], current: number, index): number[] => {
        if ( index === 0 ) {
          return [this.initialRevenue * (1 + current)]
        }
        return [...projRevenue, projRevenue[index-1] * (1 + current)];
      }, []
    );
  }

  getGrowthFactors(): number[] {
    const [growth5, growth10, growth20] = this.growthRates;
    return Array.from({ length: 20 }, (_, index) => {
        if (index < 5) return growth5;
        else if (index < 10) return growth10;
        else return growth20;
      }
    )
  }

  getDiscountFactorOnYear(year: number): number {
    return Math.pow(1 - this.discountFactor, year);
  }
}
