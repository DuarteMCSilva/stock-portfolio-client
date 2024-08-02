import { Component, OnInit, Signal } from '@angular/core';
import { ChartData } from 'chart.js';
import { MarketstackApiService } from 'src/app/services/api/marketstack-api.service';
import { PortfolioBusinessService } from 'src/app/services/business/portfolio-business.service';
import { PortfolioStateService } from 'src/app/services/state/portfolio/portfolio-state.service';
import { StockEntry } from 'src/app/services/state/portfolio/portfolio.model';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  public entries$: Signal<StockEntry[] | undefined>;
  public total$: Signal<number>;

  public entries: StockEntry[] = [
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

  constructor(private marketStackApi: MarketstackApiService, private portfolioBusinessService: PortfolioBusinessService,
    private portfolioStateService: PortfolioStateService
  ) {
      this.entries$ = this.portfolioStateService.currentSnapshot;
      this.total$ = this.portfolioStateService.currentValue;
  }

  ngOnInit(): void {
    this.marketStackApi.getHistoricalPrices().subscribe( (a) => console.log(a));
    this.marketStackApi.getEndOfDayHistory(['AAPL','PYPL']).subscribe( (response) => this.stockPriceHistoryData = response);
    this.fetchPortfolioSnapshotHistory();
  }

  onClickUpdateTickerPrice(ticker: string) {  // TODO: KEEP?
    this.marketStackApi.getPreviousClose(ticker).subscribe( (price) => {
        this.portfolioStateService.updatePrice(ticker, price);
    });
  }

  private fetchPortfolioSnapshotHistory(){
    return this.portfolioBusinessService.fetchPortfolioState();
  }
}
