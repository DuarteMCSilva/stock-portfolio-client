import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TransactionItem } from '../state/portfolio/portfolio-state.service';
import { CsvHandlerApiService } from './csv-handler/csv-handler-api.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionsApiService {

  constructor(
    private csvHandlerApiService: CsvHandlerApiService) { }

  public fetchTransactions(): Observable<TransactionItem[]> {
    return this.csvHandlerApiService.fetchTransactions().pipe( map( (transactions) => transactions.reverse() ) );
  }

/*   private fetchMock() {
    const url = 'assets/data/transaction-data-mock.json';
    return this.httpClient.get<TransactionItem[]>(url);
  } */
}
