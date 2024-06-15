import { Injectable } from '@angular/core';
import { MarketstackApiService } from '../api/marketstack-api.service';
import { map } from 'rxjs';

export interface Dataset {
  label: string,
  data: number[],
  fill: boolean,
  borderColor?: string,
  tension?: number
}

export interface PriceHistoryByTicker {
  dates: DateString[],
  pricesByTicker: Map<string, number[]>
}

export interface PriceHistory {
  prices: number[];
  dates?: string[];
}

export type DateString = string;

export interface YearHistory {
  labels: string[],
  datasets: Dataset[]
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioEvolutionBusinessService {

  private pricesByTicker = new Map<string, number[]>();

  constructor( private marketstackApiService: MarketstackApiService ) { }

  getStockPricesHistory(tickers: string[]) {
    return this.marketstackApiService.getOneYearHistory(tickers)
      .pipe( map( (response: any) => {
        const resData: any[] = response.data;
        return {
          pricesByTicker: this.getValuesByTicker(resData),
          dates: this.getDates(resData, tickers[0])
        };
      }));
  }
    
  private getDates(resData: any, pivotTicker: string): DateString[] {
    return resData.reduce( (acc: Date[], curr:any) => {

      if(curr.symbol !== pivotTicker){
        return acc;
      }

      const opts: Intl.DateTimeFormatOptions = {
        year: '2-digit', month: 'short'
      }
      const date = new Date(curr.date).toLocaleDateString('pt-PT', opts);
    
      return [date, ...acc];

    }, [] );
  }
  
  public getDatasets(valuesByTicker: Map<string, number[]>): Dataset[] { 
    const datasets: Dataset[] = [];

    valuesByTicker.forEach( (priceHist: number[], ticker: string ) => {
        datasets.push( {
          label: ticker,
          data: priceHist.map( (val) => val/priceHist[0]*100),
          fill: false
        } )
    } );

    return datasets;
  }
  
  private getValuesByTicker(resData: any): Map<string, number[]> {
    this.pricesByTicker = resData.reduce( (acc: Map<string, number[]>, curr: any) => {

      const currTickerHistory = acc.get(curr.symbol) ?? [];

      acc.set(curr.symbol, [curr.close, ...currTickerHistory]);

      return acc;
      
    }, new Map<string, number[]>());

    return this.pricesByTicker;
  }
}
