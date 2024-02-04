import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { EvaluationsApiService } from 'src/app/services/evaluations-api.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {

  formGroup: FormGroup;

  intrinsicValue: number = 0;
  intrinsicValue$: Observable<number>;
  intrinsicValueSubject: BehaviorSubject<number>;

  propagatedRevenue: number[] = [];
  propagatedFCF: number[] = [];
  propagatedDFCF: number[] = [];
  numShares = 1;
  totalProjCashFlow = 0;

  constructor(private evaluationsApi: EvaluationsApiService) {
    this.evaluationsApi.postEvaluation().subscribe( (d) => console.log(d));
    this.evaluationsApi.getEvaluations().subscribe( (d) => console.log(d));
    this.intrinsicValueSubject = new BehaviorSubject<number>(0);
    this.intrinsicValue$ = this.intrinsicValueSubject.asObservable();
    this.formGroup = new FormGroup(
      {
        ticker: new FormControl('HELLO', Validators.required),
        revenue: new FormControl(307000, Validators.required),
        debt: new FormControl(28500, Validators.required),
        fcf: new FormControl(69500, Validators.required),
        shares: new FormControl(12460, Validators.required),
        growth5: new FormControl(15, Validators.required),
        growth10: new FormControl(10, Validators.required),
        growth20: new FormControl(4, Validators.required),
        discount: new FormControl(7, Validators.required),
        commentary: new FormControl(''),
      }
    )
  }

  ngOnInit(): void {
    this.computeIntrinsicValue(this.formGroup.value);
  }

  discountFactor(discount: number, year: number) {
    return Math.pow(1 - discount, year);
  }

  computeIntrinsicValue(formValues: any) {
    const FCFtoRevenueRatio = formValues.fcf / formValues.revenue;

    this.numShares = formValues.shares;

    this.propagatedRevenue = this.propagateRevenueGrowth(formValues);

    this.propagatedFCF = this.propagatedRevenue.map( (revenue, index) => {
      return revenue * FCFtoRevenueRatio;
    })

    this.propagatedDFCF = this.propagatedFCF.map( (fcf, index) => {
      return fcf * this.discountFactor(formValues.discount / 100, index)
    })

    this.totalProjCashFlow = this.propagatedDFCF.reduce((acc, curr) => acc + curr, 0);

    const IV = this.calculateDFCF(this.totalProjCashFlow, formValues.debt, this.numShares);
    this.intrinsicValueSubject.next(IV);
    this.intrinsicValue = IV;
    return IV;
  }

  calculateDFCF(projectedFCF: number, debt: number, shares: number): number{
    return (projectedFCF - debt)/shares
  }

  propagateRevenueGrowth(formValues: any): number[] {
    const growthFactors = this.computeGrowthFactors(
      [formValues.growth5,
      formValues.growth10,
      formValues.growth20]
    );
    return growthFactors.reduce((projRevenue: number[], current: number, index): number[] => {
      return [...projRevenue, projRevenue[index] * (1 + current)];
    }, [formValues.revenue]);
  }

  computeGrowthFactors([growth5, growth10, growth20]: number[]): number[] {
    return Array.from({ length: 19 },
      (_, index) => {
        if (index < 5) return growth5 / 100;
        else if (index < 10) return growth10 / 100;
        else return growth20 / 100;
      }
    )
  }

  saveSimulation() {
    const formValues = this.formGroup.value;

    const date = new Date();
    const dateToSave = date.toLocaleString('en-GB',{ day: '2-digit', month: 'short', year: '2-digit'});
    
    const simul: Simulation = {
      date: dateToSave,
      ticker: formValues.ticker,
      intrinsicValue: this.intrinsicValue,
      financials: {
        revenue: formValues.revenue,
        fcf: formValues.fcf,
        debt: formValues.debt
      },
      assumptions: {
        growth5: formValues.growth5,
        growth10: formValues.growth10,
        growth20: formValues.growth20,
        discount: formValues.discount
      },
      comment: formValues.commentary
    }
    const simulation = JSON.stringify(simul);
    console.log(simulation)
    return simulation;
  }

}

export interface Simulation {
  date: string,
  ticker: string,
  intrinsicValue: number,
  financials: Financials,
  assumptions: Assumptions,
  projections?: Projections,
  comment?: string
}

interface Projections {
  revenue: number[],
  fcf: number[],
  dfcf: number[]
}

interface Assumptions {
  growth5: number,
  growth10: number,
  growth20: number,
  discount: number
}

interface Financials {
  revenue: number,
  fcf: number,
  debt: number
}
