export interface HoldingState { // Changes after transaction
    ticker: string,
    quantity: number,
    avgPrice: number,
    totalPrice?: number
}

export interface StockEntry extends HoldingState {
    lastPrice: number,
    name?: string,
    sector?: string,
    profit?: number,
    marketValue?: number,
    percentage?: number
  }
