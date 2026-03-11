import { DomainException } from './domain-exception';

export class ForbiddenException extends DomainException {
  constructor(message = 'Forbidden access') {
    super(message);
  }
}
