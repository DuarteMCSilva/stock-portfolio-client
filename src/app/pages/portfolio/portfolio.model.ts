export interface HoldingState { // Changes after transaction
  ticker: string,
  quantity: number,
  avgPrice: number,
  totalPrice?: number
}

export interface HoldingDetail { // Does not change for the sticker, just store once
  ticker: string,
  name: string,
  sector: string
}

export interface HoldingLive extends HoldingState { // Changes each day/minute/sec, depending on granularity
  lastPrice: number,
  profit: number,
  marketValue: number,
  percentage: number
}

export interface StockEntry {
    ticker: string,
    quantity: number,
    avgPrice: number,
    lastPrice: number,
    name: string,
    sector?: string,
    profit?: number,
    marketValue?: number,
    percentage?: number
  }
