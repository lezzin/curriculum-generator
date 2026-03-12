export interface GenerateProposalInput {
  userId: string;
  solicitation: string;
}

export interface RemoveProposalInput {
  proposalId: string;
  userId: string;
}
