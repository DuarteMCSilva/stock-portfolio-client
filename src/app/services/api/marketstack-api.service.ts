import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarketstackApiService {
  
  private readonly MARKETSTACK_KEY = 'c098565631a51d35319761f26cfa8e6d';

  private readonly EOD_ENDPOINT_MOCK = 'assets/mock-response/eod_multiple.json';

  private readonly EOD_ENDPOINT = `http://api.marketstack.com/v1/eod?access_key=${this.MARKETSTACK_KEY}&limit=1000`;

  constructor(private httpClient: HttpClient) { }

  public getEndOfDayHistory(tickers: string[]): Observable<YearHistory> {
    const endpoint = this.EOD_ENDPOINT + `&symbols=${tickers.join(',')}`

    return this.httpClient.get(this.EOD_ENDPOINT_MOCK).pipe( map( (response: any) => {
      const resData: any[] = response.data;
      return {
        labels: this.getDates(resData, tickers[0]),
        datasets: this.getDatasets(resData)
      };
    }
  ));
  }

  private getDatasets(resData: any) { 
    const datasets: Datasets[] = [];

    this.getValuesByTicker(resData).forEach( (priceHist: number[], ticker: string ) => {
        datasets.push( {
          label: ticker,
          data: priceHist.map( (val) => val/priceHist[0]*100),
          fill: false
        } )
    } );

    return datasets;
  }

  private getValuesByTicker(resData: any): Map<string, number[]> {
    return resData.reduce( (acc: Map<string, number[]>, curr: any) => {

      const currTickerHistory = acc.get(curr.symbol);

      if(!currTickerHistory){
        acc.set(curr.symbol, [curr.close]);
      }
      else{
        acc.set(curr.symbol, [curr.close, ...currTickerHistory]);
      }

      return acc;
      
    }, new Map<string, number[]>());
  }

  private getDates(resData: any, pivotTicker: string) {
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
}


interface Datasets {
    label: string,
    data: number[],
    fill: boolean,
    borderColor?: string,
    tension?: number
}

export interface YearHistory {
  labels: string[],
  datasets: Datasets[]
}
