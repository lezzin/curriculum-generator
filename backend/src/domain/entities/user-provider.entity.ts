export class UserProvider {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly provider: string,
    public readonly providerId: string,
  ) {}
}
