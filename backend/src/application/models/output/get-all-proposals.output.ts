export interface ProposalItemOutput {
  id: string;
  prompt: string;
  message: string;
  bidAmount: number;
  deliveryDays: number;
  createdAt: Date;
}

export interface GetAllProposalsOutput {
  items: ProposalItemOutput[];
  total: number;
}
