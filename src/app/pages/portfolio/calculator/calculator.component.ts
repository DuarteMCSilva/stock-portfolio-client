import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {

  formGroup: FormGroup;

  intrinsicValue$: Observable<number>;
  intrinsicValueSubject: BehaviorSubject<number>;

  propagatedRevenue: number[] = [];

  constructor() {
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

    const shares = formValues.shares;

    this.propagatedRevenue = this.propagateRevenueGrowth(formValues)

    const totalProjectedRevenue = this.propagatedRevenue
      .reduce((acc, curr, ind) => {
        return acc + curr * this.discountFactor(formValues.discount / 100, ind);
      }, 0);

    const IV = (totalProjectedRevenue * FCFtoRevenueRatio - formValues.debt) / shares;
    this.intrinsicValueSubject.next(IV);
    return IV;
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
    return Array.from({ length: 20 },
      (_, index) => {
        if (index < 5) return growth5 / 100;
        else if (index < 10) return growth10 / 100;
        else return growth20 / 100;
      }
    )
  }
}
