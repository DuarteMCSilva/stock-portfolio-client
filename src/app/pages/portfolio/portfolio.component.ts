import { Component, OnInit } from '@angular/core';
import { MarketstackApiService, YearHistory } from 'src/app/services/api/marketstack-api.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  entries: StockEntry[] = [
    { ticker: 'BABA', name: 'Alibaba', sector: 'ECommerce', quantity: 10, lastPrice: 72.82, avgPrice: 148.90 },
    { ticker: 'GOOGL', name: 'Alphabet', sector: '', quantity: 3, lastPrice: 149.02, avgPrice: 142.53 },
    { ticker: 'INTC', name: 'Intel Corp', sector: '', quantity: 16, lastPrice: 43.30, avgPrice: 35.25 },
    { ticker: 'META', name: 'Meta Platforms', sector: '', quantity: 1, lastPrice: 468.39, avgPrice: 140.10 },
    { ticker: 'PLTR', name: 'Palantir', sector: '', quantity: 10, lastPrice: 24.38, avgPrice: 19.89 },
    { ticker: 'PYPL', name: 'Paypal', sector: 'Financials', quantity: 15, lastPrice: 58.90, avgPrice: 60.26 },
    { ticker: 'PEP', name: 'PepsiCo', sector: 'Consumer Def.', quantity: 1, lastPrice: 167.69 , avgPrice: 158.49 },
    { ticker: 'PG', name: 'Procter & Gamble', sector: 'Consumer Def.', quantity: 1, lastPrice: 157.54, avgPrice: 142.50},
    { ticker: 'TGT', name: 'Target Corp', sector: 'Consumer Def.', quantity: 4, lastPrice: 146.52, avgPrice: 128.43 }
  ];

  totals = {total: 0, initial: 0};
  public labels = [''];
  public data: YearHistory = {
    labels: this.labels,
    datasets: []
  };

  
  public options = {
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 11
        }
      },
      y: {
        ticks: {
          maxTicksLimit: 6
        }
      }
    }
  };

  constructor(private marketStackApi: MarketstackApiService) { }


  ngOnInit(): void {
    this.marketStackApi.getEndOfDayHistory(['AAPL','PYPL']).subscribe( (response) => this.data = response);
    this.totals = this.setPortfolioValue(this.entries);
    this.entries = this.setOptionalValues();
  }

  private setPortfolioValue(entries: StockEntry[]): Totals {
    return entries.reduce( (accumulator: Totals , entry: StockEntry): Totals => {
      return { total: accumulator.total + entry.lastPrice * entry.quantity,
          initial: accumulator.initial + entry.avgPrice * entry.quantity
      };
    }, this.totals );
  }

  private setOptionalValues(): StockEntry[] {
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