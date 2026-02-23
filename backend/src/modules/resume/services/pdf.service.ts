import { Injectable, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { Language, ResumePdfDto } from '../dto/prompt.dto';
import { SECTION_LABELS } from '../constants/resume.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { ResumeEntity } from '../entities/resume.entity';
import { Repository } from 'typeorm';
import { type Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class PdfService implements OnModuleInit, OnModuleDestroy {
  private browser: puppeteer.Browser;
  private template: Handlebars.TemplateDelegate;

  constructor(
    @InjectRepository(ResumeEntity)
    private resumeRepository: Repository<ResumeEntity>,

    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async onModuleInit() {
    this.browser = await puppeteer.launch({
      headless: 'shell',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const templatePath = path.join(
      __dirname,
      '../../../templates/resume.hbs',
    );

    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    this.template = Handlebars.compile(templateContent);
  }

  async generateResumePdf(resume: ResumePdfDto): Promise<Buffer> {
    const labels = SECTION_LABELS[resume.language] || SECTION_LABELS[Language.PT];

    const html = this.template({
      ...resume,
      labels
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

  async generateResumePdfById(id: string): Promise<Buffer> {
    const cacheKey = this.getCacheKey(id);
    const ttl = 300000; // 5 minutes 

    const cached = await this.cacheManager.get<Buffer>(cacheKey);

    if (cached) {
      return cached;
    }

    const resumeEntity = await this.resumeRepository.findOne({ where: { id } });

    if (!resumeEntity) {
      throw new Error('Resume not found');
    }

    const pdfBuffer = await this.generateResumePdf(resumeEntity as ResumePdfDto);
    await this.cacheManager.set(cacheKey, pdfBuffer, ttl);
    return pdfBuffer;
  }

  async onModuleDestroy() {
    await this.browser.close();
  }

  getCacheKey(id: string): string {
    return `resume_pdf_${id}`;
  }
}