import { NotFoundException } from 'src/domain/exceptions';
import { ResumeDocumentRepository } from 'src/domain/repositories/resume-document.repository';
import { ResumeRepository } from 'src/domain/repositories/resume.repository';
import { UserConfigRepository } from 'src/domain/repositories/user-config.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';

export class GetPdfUseCase {
  constructor(
    private readonly resumeDocumentRepository: ResumeDocumentRepository,
    private readonly resumeRepository: ResumeRepository,
    private readonly userRepository: UserRepository,
    private readonly userConfigRepository: UserConfigRepository,
  ) { }

  async execute(id: string) {
    const resume = await this.resumeRepository.findById(id);

    if (!resume) {
      throw new NotFoundException('Currículo não encontrado');
    }

    const userData = await this.userRepository.findById(resume.userId);

    if (!userData) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const contactData = await this.userConfigRepository.findByUserId(resume.userId);

    const stream = await this.resumeDocumentRepository.generatePdf(resume, userData, contactData);

    if (!stream) {
      throw new NotFoundException('PDF não encontrado!');
    }

    return stream;
  }
}
