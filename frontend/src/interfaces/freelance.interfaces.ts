export interface FreelanceProposal {
    id: string,
    prompt: string,
    message: string,
    bidAmount: number,
    deliveryDays: number,
    createdAt: Date,
}