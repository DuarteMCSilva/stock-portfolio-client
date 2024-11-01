import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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
  period: string,
  revenue: ValueChange,
  grossProfit: ValueChange,
  netIncome: ValueChange,
  fcf: ValueChange
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

  constructor(private httpClient: HttpClient) {

    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.onSearch();
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
