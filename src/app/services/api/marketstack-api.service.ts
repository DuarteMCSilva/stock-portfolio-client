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

  private readonly PREVIOUS_CLOSE =  (ticker:string) => `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=_2ipQbmncvN_GASEyzOvHjjbRleJhOL8`;


  constructor(private httpClient: HttpClient) { }

  public getOneYearHistory(tickers: string[]): Observable<any> {
    return this.httpClient.get(this.EOD_ENDPOINT_MOCK);
  }

  public getPreviousClose(ticker: string) {
    const endpoint = this.PREVIOUS_CLOSE(ticker);
    console.log(endpoint);
    return this.httpClient.get(endpoint).pipe( map( (response: any) => response.results[0].c ));
  }
}