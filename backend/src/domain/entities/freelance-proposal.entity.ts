export class FreelanceProposal {
  constructor(
    public readonly id: string,
    public prompt: string,
    public message: string,
    public bidAmount: number,
    public deliveryDays: number,
    public userId: string,
    public readonly createdAt: Date,
  ) {}
}
