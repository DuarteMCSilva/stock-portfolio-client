import { Component, Input, OnChanges } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { StockEntry } from 'src/app/services/state/portfolio/portfolio.model';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent implements OnChanges {

  @Input() entries: StockEntry[] = [];
  @Input() totalValue: number = 1;
    
  public pieChartOptions: ChartOptions<'pie'> = {};

  public portfolioPieChartData: ChartData = {
    labels: [],
    datasets: [
      {
        data: []
      }
    ]
  };

  constructor() {}

  ngOnInit() {
    this.pieChartOptions = this.getPieChartOptions();
  }

  ngOnChanges() {
    this.portfolioPieChartData = this.computePieChartData();
  }
  
  private computePieChartData() {
    const pieChart: { labels: string[], data: number[] } = { labels: [], data: [] };
    const pieChartData = this.entries.reduce( (acc, curr: StockEntry) => {
      const percentage = (curr.marketValue ?? 0) / this.totalValue;

      return {
        labels: [curr.ticker, ...acc.labels ],
        data: [percentage, ...acc.data ]
      };
    }, pieChart );

    return {
      labels : pieChartData.labels,
      datasets: [
        {
          data: pieChartData.data
        }
      ]
    }
  }

  private getPieChartOptions(): ChartOptions<'pie'> {
    return {
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: (item: any) => this.formatPercentage(item)
          }
        }
      }
    }
  }

  private formatPercentage(item: any): string {
    const label = item.label || '';
    const value = (item.raw * 100).toPrecision(2);
    return `${label}: ${value}%`;
  }
}
