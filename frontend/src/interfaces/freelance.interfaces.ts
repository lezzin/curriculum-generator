export interface FreelanceProposal {
  id: string;
  userId: string;
  prompt: string;
  message: string;
  bidAmount: number;
  deliveryDays: number;
  createdAt: Date;
}
