import { GetPageInput } from 'src/application/models/input/resume.input';
import { NotFoundException } from 'src/domain/exceptions';
import { ResumeDocumentRepository } from 'src/domain/repositories/resume-document.repository';
import { ResumeRepository } from 'src/domain/repositories/resume.repository';
import { UserConfigRepository } from 'src/domain/repositories/user-config.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';

export class GetPageUseCase {
  constructor(
    private readonly resumeDocumentRepository: ResumeDocumentRepository,
    private readonly resumeRepository: ResumeRepository,
    private readonly userConfigRepository: UserConfigRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(body: GetPageInput) {
    const resume = await this.resumeRepository.findById(body.id);
    if (!resume) {
      throw new NotFoundException('Currículo não encontrado!');
    }

    if (body?.template) {
      resume.template = body.template;
    }

    const user = await this.userRepository.findById(resume.userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    const userConfig = await this.userConfigRepository.findByUserId(
      resume.userId,
    );

    return this.resumeDocumentRepository.generateHtml(
      resume,
      user,
      userConfig,
      'page',
    );
  }
}
