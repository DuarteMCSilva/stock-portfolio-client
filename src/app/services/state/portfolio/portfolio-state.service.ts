import { Injectable } from '@angular/core';
import { HoldingState } from './portfolio.model';

export interface TransactionItem {
  date: string,
  orderType: string,
  ticker: string,
  quantity: number,
  price: number,
  fees: number
}

export interface PortfolioSnapshot {
  date: string,
  snapshot: Map<string, HoldingState>
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioStateService {

  transactions: TransactionItem[] = [];
  portfolioEvolution: PortfolioSnapshot[] = [];

  constructor() { }

}
