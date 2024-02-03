import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  entries: StockEntry[] = [
    { ticker: 'BABA', name: 'Alibaba', sector: 'ECommerce', quantity: 10, lastPrice: 71.82, avgPrice: 148.90 },
    { ticker: 'GOOGL', name: 'Alphabet', sector: '', quantity: 1, lastPrice: 142.32, avgPrice: 141.53 },
    { ticker: 'INTC', name: 'Intel Corp', sector: '', quantity: 16, lastPrice: 42.52, avgPrice: 35.25 },
    { ticker: 'META', name: 'Meta Platforms', sector: '', quantity: 2, lastPrice: 474.32, avgPrice: 140.10 },
    { ticker: 'PLTR', name: 'Palantir', sector: '', quantity: 10, lastPrice: 17.02, avgPrice: 19.89 },
    { ticker: 'PYPL', name: 'Paypal', sector: 'Financials', quantity: 11, lastPrice: 62.32, avgPrice: 61.26 },
    { ticker: 'PEP', name: 'PepsiCo', sector: 'Consumer Def.', quantity: 1, lastPrice: 170.99 , avgPrice: 158.49 },
    { ticker: 'PG', name: 'Procter & Gamble', sector: 'Consumer Def.', quantity: 1, lastPrice: 146.54, avgPrice: 142.50},
    { ticker: 'TGT', name: 'Target Corp', sector: 'Consumer Def.', quantity: 4, lastPrice: 145.42, avgPrice: 128.43 }
  ]

  totals = {total: 0, initial: 0};

  constructor() { }

  ngOnInit(): void {
    this.totals = this.setPortfolioValue(this.entries);
    this.entries = this.setOptionalValues();
  }

  setPortfolioValue(entries: StockEntry[]): Totals {
    return entries.reduce( (accumulator: Totals , entry: StockEntry): Totals => {
      return { total: accumulator.total + entry.lastPrice * entry.quantity,
          initial: accumulator.initial + entry.avgPrice * entry.quantity
      };
    }, this.totals );
  }

  setOptionalValues(): StockEntry[] {
    return this.entries.map(( entry ) => {
      const profit = (entry.lastPrice - entry.avgPrice) / entry.avgPrice;
      const marketValue = entry.lastPrice * entry.quantity;
      const portfolio = marketValue/this.totals.total;
      return {
        ...entry,
        profit,
        marketValue,
        portfolio
      }
    }).sort( (entry1, entry2) => {
        if (entry1.portfolio > entry2.portfolio ){
          return -1;
        }
        else return 1;
    } )
  }

}

interface StockEntry {
  ticker: string,
  name: string,
  sector: string,
  quantity: number,
  lastPrice: number,
  avgPrice: number,
  profit?: number,
  marketValue?: number,
  portfolio?: number
}

interface Totals {
  total: number,
  initial: number
}