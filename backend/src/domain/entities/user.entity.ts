import { UserProvider } from './user-provider.entity';

export class User {
  private providers: UserProvider[] = [];

  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public picture?: string | null,
    public password?: string | null,
    public refreshToken?: string | null,
  ) { }

  addProvider(provider: UserProvider) {
    const exists = this.providers.find((p) => p.provider === provider.provider);

    if (exists) {
      throw new Error('Provider já vinculado');
    }

    this.providers.push(provider);
  }

  getProviders() {
    return this.providers;
  }
}
