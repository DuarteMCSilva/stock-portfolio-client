import { computed, Injectable, Signal, signal } from '@angular/core';
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

interface State {
  isLoading: boolean;
  snapshotHistory: PortfolioSnapshot[];
  currentSnapshot?: PortfolioSnapshot;
  transactionHistory: TransactionItem[];
  error: string;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioStateService {

  transactions: TransactionItem[] = [];
  portfolioEvolution: PortfolioSnapshot[] = [];

  // Store/State
  private portfolioState = signal<State>({
    isLoading: false,
    currentSnapshot: undefined,
    snapshotHistory: [],
    transactionHistory: [],
    error: '',
  });

  constructor() {}
  // Actions - RxJS for async -> In business 

  // Selectors - selects a piece of the state
  get isLoading(): Signal<boolean> {
    return computed(() => this.portfolioState().isLoading);
  }

  get currentSnapshot(): Signal<PortfolioSnapshot | undefined> {
    return computed(() => this.portfolioState().currentSnapshot);
  }

  get snapshotHistory(): Signal<PortfolioSnapshot[]> {
    return computed(() => this.portfolioState().snapshotHistory);
  }

  get transactionHistory(): Signal<TransactionItem[]> {
    return computed(() => this.portfolioState().transactionHistory);
  }

  get error(): Signal<string> {
    return computed(() => this.portfolioState().error);
  }

  // Setters/Reducers - how action updates state
  set isLoading(isLoading: boolean) {
    this.portfolioState.update((state) => ({ ...state, isLoading }));
  }

  set snapshotHistory(snapshotHistory: PortfolioSnapshot[]) {
    this.portfolioState.update(
      (state) => ({
        ...state,
        snapshotHistory,
        currentSnapshot: snapshotHistory.slice(-1)[0] 
      })
    );
  }

  set transactionHistory(transactionHistory: TransactionItem[]) {
    this.portfolioState.update((state) => ({ ...state, transactionHistory }));
  }

  set error(error: string) {
    this.portfolioState.update((state) => ({ ...state, error }));
  }
}
