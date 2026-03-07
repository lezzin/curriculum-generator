export interface ProposalItemOutput {
  id: string;
  userId: string;
  prompt: string;
  message: string;
  bidAmount: number;
  deliveryDays: number;
  createdAt: Date;
}