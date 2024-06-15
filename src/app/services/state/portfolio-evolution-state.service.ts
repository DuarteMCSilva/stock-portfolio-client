import { Injectable } from '@angular/core';
import { StockEntry } from 'src/app/pages/portfolio/portfolio.model';

type Ticker = string;

interface PortfolioState {
  date: string,
  entries: Map<Ticker, StockEntry>,
  totalValue: number
}

interface PriceHistoryState {
  pricesByTicker: Map<string, number[]>
  dateInterval: string[]
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioEvolutionStateService {

  public portfolioStateHistory: PortfolioState[] = [];

  private priceHistState: PriceHistoryState = {
    pricesByTicker: new Map<string, number[]>(),
    dateInterval: []
  }

  public mock_ptf = [
    { ticker: 'GOOGL', name: 'Alphabet', sector: '', quantity: 4, lastPrice: 176.47, avgPrice: 142.51 },
    { ticker: 'PYPL', name: 'Paypal', sector: 'Financials', quantity: 15, lastPrice: 67.33, avgPrice: 60.26 },
    { ticker: 'TGT', name: 'Target Corp', sector: 'Consumer Def.', quantity: 3, lastPrice: 146.52, avgPrice: 128.43 }
  ]


  constructor() { }

  get pricesByTicker(): Map<string, number[]> {
    return this.priceHistState.pricesByTicker
  }

  set pricesByTicker(map: Map<string, number[]>) {
    this.priceHistState.pricesByTicker = map;
  }

  get dateInterval(): string[] {
    return this.priceHistState.dateInterval;
  }

  set dateInterval(dates: string[]) {
    this.priceHistState.dateInterval = dates;
  }

  portfolioValueAtDate(date: string, index: number): number {
    return this.mock_ptf.reduce( (accumulator: number , entry: StockEntry): number => {
      const priceAtDate = this.getPriceAtDate(entry.ticker, index);
      const quantityAtDate = this.getQuantityAtDate(entry);
      return accumulator + priceAtDate * quantityAtDate;
    }, 0 );
  }

  private getQuantityAtDate(entry: StockEntry) {
    return entry.quantity;
  }

  private getPriceAtDate(ticker: string, index: number) {
    return this.pricesByTicker.get(ticker)![index] ?? 0;
  }
}
