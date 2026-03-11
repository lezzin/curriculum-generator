import { DomainException } from './domain-exception';

export class UnauthorizedException extends DomainException {
  constructor(message = 'Unauthorized access') {
    super(message);
  }
}
