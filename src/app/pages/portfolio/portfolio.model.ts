export interface StockEntry {
    ticker: string,
    name: string,
    sector: string,
    quantity: number,
    lastPrice: number,
    avgPrice: number,
    profit?: number,
    marketValue?: number,
    percentage?: number
  }
