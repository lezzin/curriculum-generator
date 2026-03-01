import { User } from "../entities/user.entity";

export abstract class UserRepository {
    abstract create(user: User): Promise<User>;
    abstract findByEmail(email: string): Promise<User | null>;
    abstract findById(id: string): Promise<User | null>;
    abstract findByProvider(provider: string, providerId: string): Promise<User | null>;
}