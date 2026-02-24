import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { Language, ResumePdfDto } from '../dto/prompt.dto';
import { SECTION_LABELS } from '../constants/resume.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { ResumeEntity } from '../entities/resume.entity';
import { Repository } from 'typeorm';
import { MinioService } from 'src/modules/minio/minio.service';

@Injectable()
export class PdfService implements OnModuleInit, OnModuleDestroy {
  private browser: puppeteer.Browser;
  private template: Handlebars.TemplateDelegate;

  constructor(
    @InjectRepository(ResumeEntity)
    private resumeRepository: Repository<ResumeEntity>,
    private readonly minioService: MinioService,
  ) { }

  async onModuleInit() {
    this.browser = await puppeteer.launch({
      headless: 'shell',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const templatePath = path.join(__dirname, '../../../templates/resume.hbs');

    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    this.template = Handlebars.compile(templateContent);
  }

  async generateResumePdf(resume: ResumePdfDto): Promise<Buffer> {
    const labels =
      SECTION_LABELS[resume.language] || SECTION_LABELS[Language.PT];

    const html = this.template({
      ...resume,
      labels,
    });

    const page = await this.browser.newPage();

    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
    });

    await page.close();

    return Buffer.from(pdf);
  }

  async generateResumePdfById(id: string): Promise<string> {
    const bucket = 'resumes';
    const fileName = `${id}.pdf`;

    const resume = await this.resumeRepository.findOne({ where: { id } });
    if (!resume) throw new Error('Resume not found');

    await this.minioService.createBucket(bucket);

    if (!(await this.minioService.hasFile(bucket, fileName))) {
      const pdf = await this.generateResumePdf(resume as ResumePdfDto);
      await this.minioService.uploadFile(bucket, fileName, pdf, 'application/pdf');
    }

    return this.minioService.getPresignedUrl(bucket, fileName);
  }

  async onModuleDestroy() {
    await this.browser.close();
  }
}
