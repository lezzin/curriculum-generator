import { DomainException } from './domain-exception';

export class ConflictException extends DomainException {
  constructor(message = 'Conflict occurred') {
    super(message);
  }
}
