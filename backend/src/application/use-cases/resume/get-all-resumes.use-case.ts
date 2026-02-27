import { ResumeRepository } from "src/domain/repositories/resume.repository";

export class GetAllResumesUseCase {
    constructor(
        private readonly resumeRepository: ResumeRepository
    ) { }

    async getAll(userId: string) {
        return await this.resumeRepository.getAll(userId);
    }
}