import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs';

export enum OrderType {
  BUY = 'BUY',
  SELL = 'SELL',
  DIVIDEND = 'DIV',
  OTHER = 'OTHER'
} 

interface TransactionInfo {
  date: string;
  quantity: number;
  price: number;
  fees: number;
  ticker: string;
  orderType: string;
  product: string;
}

interface ParsedTransaction {
  date: string,
  quantity: number,
  totalPrice: number,
  fees: number,
  productName: string
}

const RELEVANT_COLUMNS = ['Data', 'Hora', 'Quantidade', 'Valor', 'Custos de transação', 'Produto'];

@Injectable({
  providedIn: 'root'
})
export class CsvHandlerApiService {
  private tickerMap = this.createTickerMap();

  constructor(private httpClient: HttpClient) { 

  }

  public fetchTransactions(){
    const url = 'assets/data/Transactions.csv';
    return this.httpClient.get(url, {responseType: 'text'}).pipe( 
      map( (csv) => this.parseTransactionsCsv(csv) ),
      tap( (a) => console.log(a))
    );
  }

  public parseTransactionsCsv(data: string): TransactionInfo[] {

      const tableLines = data.split('\n');//= csvParse.parse(data, { columns: true } );
      const columnNames = tableLines[0].split(',');
      const columnIndexes = this.getIndexesOfRelevantColumns(columnNames);

      const entries = tableLines.slice(1);

      return entries.map((entryRaw): TransactionInfo => {
          const entryObject = this.extractTransactionObjectFromEntry(entryRaw, columnIndexes);
          return {
              date: entryObject.date,
              quantity: Math.abs(entryObject.quantity),
              price: Math.abs(this.priceFormat(entryObject)),
              fees: entryObject.fees,
              ticker: this.getTickerFromName(entryObject.productName),
              orderType: this.assertOrderType(entryObject.quantity, entryObject.totalPrice),
              product: entryObject.productName
          };
      });
  };

  private extractTransactionObjectFromEntry(entryRaw: string , columnIndexes: Map<string,number>): ParsedTransaction {
    const entry = entryRaw.split(',')
    return {
      date: this.dateToFormat(entry[columnIndexes.get('Data')!]),
      quantity: +entry[columnIndexes.get('Quantidade')!],
      totalPrice: +entry[columnIndexes.get('Valor')!],
      fees: +entry[columnIndexes.get('Custos de transação')!],
      productName: entry[columnIndexes.get('Produto')!]
    }
  }

  
  private dateToFormat(date: string) {
    const [dd, mm, yyyy] = date.split('-');
    return yyyy + mm + dd;
  }

  private priceFormat(obj: any): number {
    return +((obj.totalPrice/obj.quantity).toFixed(2))
  }

  private getIndexesOfRelevantColumns(columnNames: string[]) {
    const indexMap = new Map<string, number>();
    RELEVANT_COLUMNS.forEach( (col) => indexMap.set( col, columnNames.indexOf(col)) )
    return indexMap;
  }

  private assertOrderType(quantity: number, price: number): string {
      if (quantity > 0 && price < 0) return OrderType.BUY;
      else if( quantity < 0 && price > 0) return OrderType.SELL;
      else if( quantity === 0 && price > 0 ) return OrderType.DIVIDEND;
      else return OrderType.OTHER;
  }

  private getTickerFromName(productName: string): string{ // Temporary hard, ugly solution, while there is no API available.

      const ticker = this.tickerMap.get(productName);
      
      if(!ticker) {
        console.warn('Ticker not found for: ' + productName);
        return productName;
      }

      return ticker;
  }

  private createTickerMap() {
    const map = new Map<string, string>();
    // Stocks
    map.set('ALTRI SGPS', 'ALTR.LS');
    map.set('ARISTA NETWORKS INC.', 'ANET');
    map.set('ADR ON ALIBABA GROUP HOLDING', 'BABA');
    map.set('SALESFORCE.COM INC COM', 'CRM');
    map.set('BANK OF AMERICA CORPOR', 'BAC');
    map.set('CVR ENERGY INC. COMMON', 'CVI');
    map.set('DELTA AIR LINES INC.', 'DAL');~
    map.set('ALPHABET INC. - CLASS A', 'GOOGL');
    map.set('GREENVOLT', 'GVOLT.LS');
    map.set('HP INC', 'HPQ');
    map.set('INTEL CORPORATION - CO', 'INTC');
    map.set('META PLATFORMS INC', 'META');
    map.set('NATIONAL RETAIL PROPER', 'NNN');
    map.set('PAYPAL HOLDINGS INC.', 'PYPL');
    map.set('PALANTIR TECHNOLOGIES INC-A', 'PLTR');
    map.set('PEPSICO INC', 'PEP');
    map.set('PROCTER & GAMBLE COMPA', 'PG');
    map.set('PROGRESSIVE CORPORATIO','PGR');
    map.set('TARGET CORPORATION COM', 'TGT');
    map.set('MARTIFER', 'MAR.LS')

    // ETFs
    map.set('ISHARES NASDAQ US BIOTECHNOLOGY ETF USD ACC', '2B70.DE');
    map.set('ISHARES DIGITAL SECURITY UCITS ETF USD ACC', 'L0CK.DE');
    map.set('AMUNDI MSCI EMERGING MARKETS UCITS ETF - EUR (C)', 'AMEM.DE');
    map.set('ISHARES S&P 500 INF TECH SECTOR UCITS ETF USD(ACC)', 'QDVE.DE');
    map.set('ISHARES NASDAQ-100 UCITS ETF (DE)', 'SXRV.DE');
    map.set('ISHARES NASDAQ 100 UCITS ETF USD (ACC)', 'SXRV.MU');
    map.set('VANGUARD S&P 500 UCITS ETF USD', 'VUAA.DE');
    map.set('XTRACKERS MSCI EMERGING MARKETS UCITS ETF 1C', '#XMME');   
    return map;
  }
}
