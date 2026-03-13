import { NotFoundException } from 'src/domain/exceptions';
import { BaseDataRepository } from 'src/domain/repositories/base-data.repository';
import { ResumeRepository } from 'src/domain/repositories/resume.repository';
import { UserConfigRepository } from 'src/domain/repositories/user-config.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { ResumeDocumentService } from 'src/infrastructure/services/resume-document.service';

export class GetPdfUseCase {
  constructor(
    private readonly resumeDocumentService: ResumeDocumentService,
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

    const stream = await this.resumeDocumentService.getPdfById(resume, userData, contactData);

    if (!stream) {
      throw new NotFoundException('PDF não encontrado!');
    }

    return stream;
  }
}
