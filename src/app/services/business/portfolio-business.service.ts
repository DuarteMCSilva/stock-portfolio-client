import { Injectable } from '@angular/core';
import { TransactionsApiService } from '../api/transactions-api.service';
import { catchError, finalize, forkJoin, map, Observable, tap } from 'rxjs';
import { PortfolioSnapshot, PortfolioStateService, TransactionItem } from '../state/portfolio/portfolio-state.service';
import { HoldingState, StockEntry } from '../state/portfolio/portfolio.model';
import { OrderType } from '../api/csv-handler/csv-handler-api.service';
import { MarketstackApiService } from '../api/marketstack-api.service';

interface StockPrices {
    [ticker: string]: Map<string, number>;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioBusinessService {

  constructor(
    private transactionsApiService: TransactionsApiService,
    private portfolioStateService: PortfolioStateService,
    private marketStackApiService: MarketstackApiService
  ) { }

  readonly NULL_HOLDING: HoldingState = { ticker : '', quantity: 0, avgPrice: 0};

  public fetchPortfolioState(): void {
    this.portfolioStateService.isLoading = true;
    this.getTransactions().pipe(
      tap((transactions) => this.portfolioStateService.transactions = transactions ),
      map((transactions) => this.computePortfolioState(transactions)),
      tap((snapshots) => {
        this.portfolioStateService.snapshotHistory = snapshots;
        console.warn("Persisted snapshots:" );
        console.log(snapshots);
      }),
      catchError( (err) => this.portfolioStateService.error = err),
      finalize( () => this.portfolioStateService.isLoading = false)
    ).subscribe( () => this.getRecentPortfolioEvolution());
  }
  
  public getRecentPortfolioEvolution() {
    const snapshot = this.portfolioStateService.currentSnapshot() ?? [];

    const requestsToMake = snapshot
      .filter( entry => this.filterForDevPurpose(entry))
      .map( (entry) => this.getPricesWeightedByQuantity(entry.ticker, entry.quantity) );

    forkJoin(requestsToMake).subscribe( historicalRecords => {
      let total = new Map<string, number>();
      
      historicalRecords.forEach( ( record ) => {

        record.forEach( (price, date) => {
          const previousPriceAtDate = total.get(date) ?? 0;
          total.set(date, previousPriceAtDate + price)
        })
      })

      const lala = total
      console.log(lala)

      this.portfolioStateService.recentHistory = lala;
    })
  }


  /**
   * Fetches historical prices, and multiplies for the stock quantity.
   * @param ticker 
   * @param quantity 
   * @returns 
  */
  private getPricesWeightedByQuantity(ticker: string, quantity: number) {
    return this.marketStackApiService.getHistoricalPrices(ticker, '3mo')
      .pipe( map( (record) => {
        const weightedPrices: [string, number][] = [...record].map( ([date, value]) => [date, value * quantity] )

        if(record.size == 0) console.warn('No values for ticker: ' + ticker);

        return new Map(weightedPrices);
        })
      )
  }

  private filterForDevPurpose(entry: StockEntry) {
    const ticks = ['PYPL', 'PG']
    return ticks.includes(entry.ticker) || true;
  }

  private getTransactions(): Observable<TransactionItem[]> {
    return this.transactionsApiService.fetchTransactions();
  }
  
  private computePortfolioState(transactions: TransactionItem[]): PortfolioSnapshot[]{
    let portfolioSnapshots: PortfolioSnapshot[] = [];

    transactions
      .filter( (transactionItem) => (transactionItem.orderType === OrderType.BUY ) || (transactionItem.orderType === OrderType.SELL) )
      .forEach( (transactionItem) => {
      const date = transactionItem.date.slice(0,8);
      const holdingState = this.computeNewHoldingState(transactionItem, portfolioSnapshots);
      const dailyEntry = portfolioSnapshots.find( (entry) => entry.date === date );

      if( dailyEntry ) {
        portfolioSnapshots = this.addToDailySnapshot(date, holdingState, portfolioSnapshots, dailyEntry);
      } else {
        portfolioSnapshots = this.addNewDailySnapshot(date, holdingState, portfolioSnapshots);
      }
    })

    return portfolioSnapshots;
  }

  private addToDailySnapshot(date: string, holdingState: HoldingState, portfolioSnapshots: PortfolioSnapshot[], dailyEntry: PortfolioSnapshot ){
    let dailySnapshot = dailyEntry.snapshot;
  
    holdingState.quantity === 0 ? dailySnapshot.delete(holdingState.ticker) : dailySnapshot.set(holdingState.ticker, holdingState);

    portfolioSnapshots.pop();
    portfolioSnapshots.push({
      date: date,
      snapshot: dailySnapshot
    })
    return portfolioSnapshots;
  }

  private addNewDailySnapshot(date: string, holdingState: HoldingState, portfolioSnapshots: PortfolioSnapshot[]) {
    const previousEntry = portfolioSnapshots[portfolioSnapshots.length - 1];
    let dailySnapshot = portfolioSnapshots.length ? new Map(previousEntry.snapshot) : new Map<string, HoldingState>();

    holdingState.quantity === 0 ? dailySnapshot.delete(holdingState.ticker) : dailySnapshot.set(holdingState.ticker, holdingState)

    portfolioSnapshots.push({
      date: date,
      snapshot: dailySnapshot
    })
    return portfolioSnapshots;
  }

  private computeNewHoldingState(transactionItem: TransactionItem, portfolioSnapshots: PortfolioSnapshot[]) {
    const lastTickerEntry = this.getPreviousEntry(portfolioSnapshots, transactionItem.ticker);

    const quantity = this.computeQuantity(transactionItem, lastTickerEntry );
    const avgPrice = this.computeAvgPrice(transactionItem, lastTickerEntry );
    const totalPrice = +((quantity * avgPrice).toFixed(2));

    return { ticker: transactionItem.ticker, quantity, avgPrice, totalPrice };
  }

  private getPreviousEntry(portfolioSnapshots: PortfolioSnapshot[], ticker: string) {
    if(!portfolioSnapshots.length) return this.NULL_HOLDING;

    const dailyEntry = portfolioSnapshots[portfolioSnapshots.length-1].snapshot.get(ticker);

    if(portfolioSnapshots.length === 1) return dailyEntry ?? this.NULL_HOLDING;

    const dayBeforeEntry = portfolioSnapshots[portfolioSnapshots.length-2].snapshot.get(ticker);

    return dailyEntry ?? dayBeforeEntry ?? this.NULL_HOLDING; 
  }

  private computeQuantity(transactionItem: TransactionItem, previousEntry: HoldingState ) {
    if(transactionItem.orderType === OrderType.BUY) return previousEntry.quantity + transactionItem.quantity;
    if(transactionItem.orderType === OrderType.SELL) return previousEntry.quantity - transactionItem.quantity;

    return previousEntry.quantity;
  }

  private computeAvgPrice(transactionItem: TransactionItem, previousEntry: HoldingState ): number {
    if(transactionItem.orderType !== OrderType.BUY) return previousEntry.avgPrice;

    const quantity = transactionItem.quantity + previousEntry.quantity;
    const total = transactionItem.price * transactionItem.quantity + previousEntry.avgPrice * previousEntry.quantity;

    return +((total/quantity).toFixed(2));
  }
}
