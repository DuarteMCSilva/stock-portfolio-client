import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { EvaluationsBusinessService } from 'src/app/services/business/evaluations/evaluations-business.service';
import { environment } from 'src/environments/environment';

interface StationaryMetrics {
  debt: number,
  cash: number
}

interface ValueChange {
  value: number,
  change: number
}

interface MomentumFinancials {
  revenue: ValueChange,
  grossProfit: ValueChange,
  netIncome: ValueChange,
  fcf: ValueChange,
  [key: string]: ValueChange
}

interface Stock {
  ticker: string,
  currency: string,
  marketCap: number,
  shares: number,
  beta: number,
  state: StationaryMetrics,
  momentum: MomentumFinancials[]
}

@Component({
  selector: 'app-financials',
  templateUrl: './financials.component.html',
  styleUrl: './financials.component.scss'
})
export class FinancialsComponent implements OnInit {

  public searchInput: string = 'PYPL';

  public results!: Stock;

  public columns = [
    {label: 'period'},
    {label: 'revenue', options: { composite: true, currency: true }},
    {label: 'grossProfit', options: { composite: true, currency: true }},
    {label: 'netIncome', options: { composite: true, currency: true }},
    {label: 'fcf', options: { composite: true, currency: true }}
  ]

  public isLoading$: Observable<boolean>
  private readonly isLoadingSubject: BehaviorSubject<boolean>;

  private readonly ENDPOINT = new URL(`${environment.server}/financials`);

  public estimationsForm: FormGroup;

  constructor(
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private evaluationsBusinessService: EvaluationsBusinessService
  ) {

    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();

    this.estimationsForm = this.formBuilder.group({
      growth5: [null, Validators.required],
      growth10: [null, Validators.required],
      growth20: [4, Validators.required]
    })
  }

  ngOnInit(): void {
    this.onSearch();
  }

  public onSubmit() {
    if ( this.estimationsForm.valid) {
      const { growth5, growth10, growth20 } = this.estimationsForm.value;

      const lastIndex = this.results.momentum.length-1;
      

      const data = {
        growthRates: [ growth5/100, growth10/100, growth20/100 ],
        discountFactor: 0.1,
        initialRevenue: this.results.momentum[lastIndex].revenue.value,
        initialFcf: this.results.momentum[lastIndex].fcf.value,
        debt: this.results.state.debt,
        cash: this.results.state.cash
      }

      const iv = this.evaluationsBusinessService.computeIntrinsicValue(data);

      console.log("Current Price:" + this.results.marketCap/this.results.shares )
      console.log("Value/share: " + iv/this.results.shares);
    }
  }


  public onSearch() {
    const url = this.ENDPOINT;
    url.searchParams.set('ticker', this.searchInput);

    this.isLoadingSubject.next(true);
    this.httpClient.get<Stock>( url.href ).pipe(
      tap( (a) => this.isLoadingSubject.next(false)),
      tap( (response) => {
        this.results = response;
      })
    ).subscribe()
  }
}
