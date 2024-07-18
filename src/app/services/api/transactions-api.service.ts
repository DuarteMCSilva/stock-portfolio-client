import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionItem } from '../state/portfolio/portfolio-state.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionsApiService {

  constructor(private httpClient: HttpClient) { }

  public fetchTransactions(): Observable<TransactionItem[]> {
    const url = 'assets/data/transaction-data-mock.json';
    return this.httpClient.get<TransactionItem[]>(url);
  }
}
