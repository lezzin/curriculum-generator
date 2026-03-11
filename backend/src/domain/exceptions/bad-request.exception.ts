import { DomainException } from './domain-exception';

export class BadRequestException extends DomainException {
  constructor(message = 'Bad request') {
    super(message);
  }
}
