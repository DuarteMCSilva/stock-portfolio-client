export interface HoldingState { // Changes after transaction
    ticker: string,
    quantity: number,
    avgPrice: number,
    totalPrice?: number
}