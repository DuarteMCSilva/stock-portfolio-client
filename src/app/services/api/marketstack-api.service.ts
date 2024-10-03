import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarketstackApiService {
  
  // private readonly MARKETSTACK_KEY = 'c098565631a51d35319761f26cfa8e6d';
  private readonly EOD_ENDPOINT_MOCK = 'assets/mock-response/eod_multiple.json';
   private readonly DEV_DJANGO = (ticker: string, period: string) => `http://localhost:3000/historical-prices?ticker=${ticker}&p=${period}`;
  //private readonly DEV_DJANGO = 'assets/data/price-hist.json';
  // private readonly EOD_ENDPOINT = `http://api.marketstack.com/v1/eod?access_key=${this.MARKETSTACK_KEY}&limit=1000`;

  private readonly PREVIOUS_CLOSE =  (ticker:string) => `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=_2ipQbmncvN_GASEyzOvHjjbRleJhOL8`;


  constructor(private httpClient: HttpClient) { }

  public getHistoricalPrices(ticker: string, period: string) {
    return this.httpClient.get(this.DEV_DJANGO(ticker, period)).pipe( 
        map( (response) => {
          const map = new Map<string, number>();
          const entries = Object.entries(response);

          entries.forEach( (entry) => {
              const date = entry[0]
              const price = entry[1]
              if( +date > 0 && price > 0 ) map.set(entry[0], entry[1]);
              else console.error( "Invalid entry: " + JSON.stringify(entry) )
          })

          return map;
        }
      ));
  }

  public getEndOfDayHistory(tickers: string[]): Observable<YearHistory> {
    // const endpoint = this.EOD_ENDPOINT + `&symbols=${tickers.join(',')}`;

    return this.httpClient.get(this.EOD_ENDPOINT_MOCK).pipe( map( (response: any) => {
      const resData: any[] = response.data;
      return {
        labels: this.getDates(resData, tickers[0]),
        datasets: this.getDatasets(resData)
      };
    }
  ));
  }

  public getPreviousClose(ticker: string) {
    const endpoint = this.PREVIOUS_CLOSE(ticker);
    console.log(endpoint);
    return this.httpClient.get(endpoint).pipe( map( (response: any) => response.results[0].c ));
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

export interface Datasets {
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
