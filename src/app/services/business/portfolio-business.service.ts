import { Injectable } from '@angular/core';
import { TransactionsApiService } from '../api/transactions-api.service';
import { map, Observable } from 'rxjs';
import { PortfolioSnapshot, TransactionItem } from '../state/portfolio/portfolio-state.service';
import { HoldingState } from '../state/portfolio/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioBusinessService {

  constructor(private transactionsApiService: TransactionsApiService) { }

  readonly NULL_HOLDING: HoldingState = { ticker : '', quantity: 0, avgPrice: 0};


  public getPortfolioState(): Observable<PortfolioSnapshot[]> {
    return this.getTransactions().pipe( map((resp) => this.computePortfolioState(resp)));
  }

  private getTransactions(): Observable<TransactionItem[]> {
    return this.transactionsApiService.fetchTransactions();
  }
  
  private computePortfolioState(transactions: TransactionItem[]): PortfolioSnapshot[]{
    let portfolioSnapshots: PortfolioSnapshot[] = [];

    transactions.forEach( (transactionItem) => {
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
    const totalPrice = quantity * avgPrice;

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
    if(transactionItem.orderType === 'buy') return previousEntry.quantity + transactionItem.quantity;
    if(transactionItem.orderType === 'sell') return previousEntry.quantity - transactionItem.quantity;

    return previousEntry.quantity;
  }

  private computeAvgPrice(transactionItem: TransactionItem, previousEntry: HoldingState ): number {
    if(transactionItem.orderType !== 'buy') return previousEntry.avgPrice;

    const quantity = transactionItem.quantity + previousEntry.quantity;
    const total = transactionItem.price * transactionItem.quantity + previousEntry.avgPrice * previousEntry.quantity;

    return +((total/quantity).toFixed(2));
  }
}
