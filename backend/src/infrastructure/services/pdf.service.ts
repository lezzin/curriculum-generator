import {
    Injectable,
    OnModuleInit,
    OnModuleDestroy,
} from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as Handlebars from 'handlebars';
import * as stream from 'node:stream';
import * as fs from 'fs';
import * as path from 'path';
import { SECTION_LABELS } from './constants/resume-labels.constants';
import { Language, SelectedTemplate } from 'src/domain/shared/enums/resume.enums';
import { Resume } from 'src/domain/entities/resume.entity';
import { StorageRepository } from 'src/domain/repositories/storage.repository';

@Injectable()
export class PdfService implements OnModuleInit, OnModuleDestroy {
    private browser: puppeteer.Browser;

    constructor(
        private readonly storage: StorageRepository,
    ) { }

    async onModuleInit() {
        this.browser = await puppeteer.launch({
            headless: 'shell',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
    }

    async generateResumePdf(resume: Resume): Promise<Buffer> {
        const hbsTemplate = this.loadTemplate(resume.template);

        const labels =
            SECTION_LABELS[resume.language] || SECTION_LABELS[Language.PT];

        const html = hbsTemplate({
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

    async generateResumePdfByEntity(entity: Resume) {
        const bucket = 'resumes';
        const fileName = `${entity.id}.pdf`;

        await this.storage.createBucket(bucket);

        if (!(await this.storage.hasFile(bucket, fileName))) {
            const pdf = await this.generateResumePdf(entity);
            await this.storage.uploadFile(bucket, fileName, pdf, 'application/pdf');
        }
    }

    async getPdfById(id: string): Promise<stream.Readable | null> {
        try {
            const bucket = 'resumes';
            const fileName = `${id}.pdf`;

            return await this.storage.getFile(bucket, fileName);
        } catch (err: any) {
            return null
        }
    }

    loadTemplate(templateType?: SelectedTemplate): HandlebarsTemplateDelegate<any> {
        const templateFilename = templateType ?? SelectedTemplate.DEFAULT;
        const templatePath = path.join(__dirname, `../../templates/${templateFilename}.hbs`);
        const templateContent = fs.readFileSync(templatePath, 'utf-8');

        return Handlebars.compile(templateContent);
    }

    async onModuleDestroy() {
        await this.browser.close();
    }
}