export interface MarketplaceProposal {
    id?: string
    userId?: string
    createdAt?: string
    prompt?: string
    message: string
    bidAmount: number
    deliveryDays: number
}