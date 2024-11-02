import { computed, Injectable, Signal, signal } from '@angular/core';
import { HoldingState, StockEntry } from './portfolio.model';

export interface TransactionItem {
  date: string,
  orderType: string,
  ticker: string,
  quantity: number,
  price: number,
  fees: number
}

export interface PortfolioSnapshot {
  date: string,
  snapshot: Map<string, HoldingState>
}

interface Totals {
  total: number,
  initial: number
}

interface State {
  isLoading: boolean;
  initialValue: number;
  currentValue: number;
  snapshotHistory: PortfolioSnapshot[];
  currentSnapshot?: StockEntry[];
  transactionHistory: TransactionItem[];
  recentHistory?: Map<string, number>
  error: string;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioStateService {

  transactions: TransactionItem[] = [];
  portfolioEvolution: PortfolioSnapshot[] = [];
  portfolioPriceEvolution: any;

  // Store/State
  private portfolioState = signal<State>({
    isLoading: false,
    initialValue: 0,
    currentValue: 0,
    currentSnapshot: undefined,
    snapshotHistory: [],
    transactionHistory: [],
    error: '',
    recentHistory: undefined
  });

  constructor() {}
  // Actions - RxJS for async -> In business 

  // Selectors - selects a piece of the state
  get isLoading(): Signal<boolean> {
    return computed(() => this.portfolioState().isLoading);
  }

  get currentValue(): Signal<number> {
    return computed(() => this.portfolioState().currentValue);
  }

  get currentSnapshot(): Signal<StockEntry[] | undefined> {
    return computed(() => this.portfolioState().currentSnapshot);
  }

  get snapshotHistory(): Signal<PortfolioSnapshot[]> {
    return computed(() => this.portfolioState().snapshotHistory);
  }

  get transactionHistory(): Signal<TransactionItem[]> {
    return computed(() => this.portfolioState().transactionHistory);
  }

  get error(): Signal<string> {
    return computed(() => this.portfolioState().error);
  }

  get recentHistory(): Signal<Map<string, number> | undefined> {
    return computed( () => this.portfolioState().recentHistory)
  }

  // Setters/Reducers - how action updates state
  set isLoading(isLoading: boolean) {
    this.portfolioState.update((state) => ({ ...state, isLoading }));
  }

  set snapshotHistory(snapshotHistory: PortfolioSnapshot[]) {
    const currEntries = this.computeCurrentSnapshot(snapshotHistory.slice(-1)[0]);
    const totalValue = this.computeCurrentPortfolioValue(currEntries).total;

    this.portfolioState.update(
      (state) => ({
        ...state,
        snapshotHistory,
        currentSnapshot: currEntries,
        currentValue: totalValue
      })
    );
  }

  set transactionHistory(transactionHistory: TransactionItem[]) {
    this.portfolioState.update((state) => ({ ...state, transactionHistory }));
  }

  set error(error: string) {
    this.portfolioState.update((state) => ({ ...state, error }));
  }

  set recentHistory(recentHistory: Map<string, number> | undefined) {
    this.portfolioState.update( (state) => ({...state, recentHistory}) )
  }

  public updatePrice(ticker: string, price: number) {
      const currSnapshot = this.currentSnapshot();

      if(!currSnapshot) return;

      const entryIndex = currSnapshot.findIndex( (entry) => entry.ticker === ticker);
      const entryToUpdate = currSnapshot[entryIndex];
      currSnapshot[entryIndex] = {
          ...entryToUpdate,
          lastPrice: price,
          profit: this.computeProfit(price, entryToUpdate.avgPrice),
          marketValue: entryToUpdate.quantity * price 
      }
      
      this.portfolioState.update( (state) => ({
        ...state,
        currentSnapshot: this.sortSnapshotByValue(currSnapshot),
        currentValue: this.computeCurrentPortfolioValue(currSnapshot).total
      }))
  }
/* 
  public getAllSymbols() {
    const tickerList = this.transactions.map( (tr) => tr.ticker );
    const uniqueTickers = Array.from(new Set(tickerList));
    const filtered = uniqueTickers.filter( (tick) => !!tick && !tick.includes('#') );
    return filtered;
  } */

  private computeCurrentSnapshot(lastState: PortfolioSnapshot): StockEntry[] {
    const entries: StockEntry[] = [];
    lastState.snapshot?.forEach( (stockEntry) => {
        const lastPrice = this.getPriceAtDate(stockEntry.ticker, lastState.date);
        const profit = (lastPrice - stockEntry.avgPrice) / stockEntry.avgPrice;
        const marketValue = lastPrice * stockEntry.quantity;

        entries.push( {
          ...stockEntry, 
          name: stockEntry.ticker,
          lastPrice,
          marketValue,
          profit
        })
    });
    return this.sortSnapshotByValue(entries);
  }

  private sortSnapshotByValue(entries: StockEntry[]): StockEntry[] {
      return entries.sort( (entry1, entry2) => {
        if (entry1.marketValue! > entry2.marketValue! ){
          return -1;
        }
        else return 1;
      });
  }

  private computeProfit(price: number, avgPrice: number) {
      return (price - avgPrice) / avgPrice;
  }

  private computeCurrentPortfolioValue(entries: StockEntry[]): Totals {
      return entries.reduce( 
          (accumulator: Totals , entry: StockEntry): Totals => {
              return { 
                  total: accumulator.total + entry.lastPrice * entry.quantity,
                  initial: accumulator.initial + entry.avgPrice * entry.quantity
              };
          }, {total: 0, initial: 0} );
  }

  private getPriceAtDate(ticker: string, date: string): number {
    const mockMap = new Map<string, number>();

    mockMap.set("ALTR.LS", 4.90);
    mockMap.set("PLTR", 26);
    mockMap.set("GVOLT", 0);
    mockMap.set("PG", 147);
    mockMap.set("SXRV", 980);
    mockMap.set("VUAA", 102.08);
    mockMap.set("QDVE", 27);
    mockMap.set("LU1681045370", 4.85);
    mockMap.set("CRM", 220);
    mockMap.set("META", 475);
    mockMap.set("GOOGL", 165);
    mockMap.set("INTC", 29.06);
    mockMap.set("PYPL", 65.31);
    mockMap.set("NNN", 45.98);
    mockMap.set("TGT", 147.02);
    mockMap.set("BABA", 77.92);
    
    return mockMap.get(ticker) ?? 1;
  }
}
