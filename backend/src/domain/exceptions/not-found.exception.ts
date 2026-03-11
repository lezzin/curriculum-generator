import { DomainException } from './domain-exception';

export class NotFoundException extends DomainException {
  constructor(message = 'Resource not found') {
    super(message);
  }
}
