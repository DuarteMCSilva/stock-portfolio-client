import { Component, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';
import { MarketstackApiService } from 'src/app/services/api/marketstack-api.service';
import { StockEntry } from './portfolio.model';
import { PortfolioEvolutionBusinessService } from 'src/app/services/business/portfolio-evolution-business.service';
import { PortfolioEvolutionStateService } from 'src/app/services/state/portfolio-evolution-state.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  public entries: StockEntry[] = [
    { ticker: 'BABA', name: 'Alibaba', sector: 'ECommerce', quantity: 10, lastPrice: 78.98, avgPrice: 148.90 },
    { ticker: 'GOOGL', name: 'Alphabet', sector: '', quantity: 3, lastPrice: 176.47, avgPrice: 142.51 },
    { ticker: 'INTC', name: 'Intel Corp', sector: '', quantity: 21, lastPrice: 30.56, avgPrice: 34.14 },
    { ticker: 'META', name: 'Meta Platforms', sector: '', quantity: 1, lastPrice: 494.76, avgPrice: 140.10 },
    { ticker: 'NNN', name: 'National Retail Properties Inc', sector: 'REIT', quantity: 7, lastPrice: 42.54, avgPrice: 39.88},
    { ticker: 'PLTR', name: 'Palantir', sector: '', quantity: 15, lastPrice: 23.32, avgPrice: 20.51 },
    { ticker: 'PYPL', name: 'Paypal', sector: 'Financials', quantity: 15, lastPrice: 67.33, avgPrice: 60.26 },
    { ticker: 'PG', name: 'Procter & Gamble', sector: 'Consumer Def.', quantity: 1, lastPrice: 157.54, avgPrice: 142.50},
    { ticker: 'CRM', name: 'SalesForce', sector: '', quantity: 2, lastPrice: 241.89 , avgPrice: 233.06 },
    { ticker: 'TGT', name: 'Target Corp', sector: 'Consumer Def.', quantity: 4, lastPrice: 146.52, avgPrice: 128.43 },
  ];

  public totals = {total: 0, initial: 0};
  public stockPriceHistoryData: ChartData = {
    labels: [''],
    datasets: []
  };

  public lineChartOptions = {
    maintainAspectRatio: true,
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

  private dates: string[] = [];

  constructor(
    private marketStackApi: MarketstackApiService,
    private portfolioEvolutionBusinessService: PortfolioEvolutionBusinessService,
    private portfolioEvolutionStateService: PortfolioEvolutionStateService
  ) { }

  ngOnInit(): void {
    this.portfolioEvolutionBusinessService
      .getStockPricesHistory(['AAPL','PYPL'])
      .subscribe( (response) => {
        this.dates = response.dates;
        this.stockPriceHistoryData = this.setDataForEvolutionChart(response)
        this.stockPriceHistoryData = this.getPortfolioEvolutionGraph();
      })
    this.updateSecondaryValues();
  }

  onClickUpdateTickerPrice(ticker: string) {
    this.marketStackApi.getPreviousClose(ticker).subscribe( (price) => {
      const entryIndex = this.entries.findIndex( (entry) => entry.ticker === ticker);
      this.entries[entryIndex].lastPrice = price;
      this.updateSecondaryValues();
    });
  }

  getPortfolioEvolutionGraph(): ChartData {
    const dates = this.dates;
    const valueHistory: number[] = [];

    dates.forEach( (date, index) => {
      const valueAtDate = this.portfolioEvolutionStateService.portfolioValueAtDate(date,index);
      valueHistory.push(valueAtDate);
    });
    return {
      labels: dates,
      datasets: [{
        label: 'Ptf',
        data: valueHistory,
        fill: false
      }]
    }
  }

  private updateSecondaryValues() {
    this.totals = this.setPortfolioValue(this.entries);
    this.entries = this.setAndSortOptionalValues();
  }

  private setPortfolioValue(entries: StockEntry[]): Totals {
    return entries.reduce( (accumulator: Totals , entry: StockEntry): Totals => {
      return { total: accumulator.total + entry.lastPrice * entry.quantity,
          initial: accumulator.initial + entry.avgPrice * entry.quantity
      };
    }, {total: 0, initial: 0} );
  }

  private setAndSortOptionalValues(): StockEntry[] {
    return this.entries.map(( entry ) => {
      const profit = (entry.lastPrice - entry.avgPrice) / entry.avgPrice;
      const marketValue = entry.lastPrice * entry.quantity;
      const percentage = marketValue/this.totals.total;
      return {
        ...entry,
        profit,
        marketValue,
        percentage
      }
    }).sort( (entry1, entry2) => {
        if (entry1.percentage > entry2.percentage ){
          return -1;
        }
        else return 1;
    } )
  }

  private setDataForEvolutionChart(response: any) {
    return {
      labels: response.dates,
      datasets: this.portfolioEvolutionBusinessService.getDatasets(response.pricesByTicker)
    }
  }
}

interface Totals {
  total: number,
  initial: number
}
