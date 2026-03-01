import {
    Injectable,
    OnModuleInit,
    OnModuleDestroy,
} from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import * as stream from 'node:stream';

import { SECTION_LABELS } from './constants/resume-labels.constants';
import { Resume } from 'src/domain/entities/resume.entity';
import { User } from 'src/domain/entities/user.entity';
import { UserConfig } from 'src/domain/entities/user.config.entity';
import { StorageRepository } from 'src/domain/repositories/storage.repository';
import { Language, SelectedTemplate } from 'src/domain/shared/enums/resume.enums';

@Injectable()
export class ResumeDocumentService
    implements OnModuleInit, OnModuleDestroy {

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

    async onModuleDestroy() {
        await this.browser.close();
    }

    generateResumeHtml(resume: Resume, user: User, userConfig: UserConfig | null, templateFolder: 'page' | 'pdf'): string {
        const template = this.loadTemplate(resume.template, templateFolder);
        const labels = SECTION_LABELS[resume.language] ?? SECTION_LABELS[Language.PT];

        Handlebars.registerHelper('add', function (value: number, increment: number) {
            return value + increment;
        });

        return template({
            ...resume,
            ...user,
            labels,
            contactsHtml: this.getContactHTML(user, userConfig, templateFolder),
        });
    }

    async generateResumePdf(resume: Resume, user: User, userConfig: UserConfig | null): Promise<Buffer> {
        const html = this.generateResumeHtml(
            resume,
            user,
            userConfig,
            'pdf'
        );

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

    async generateAndStorePdf(resume: Resume, user: User, userConfig: UserConfig | null) {
        const bucket = 'resumes';
        const fileName = `${resume.id}.pdf`;

        await this.storage.createBucket(bucket);

        if (!(await this.storage.hasFile(bucket, fileName))) {
            const pdf = await this.generateResumePdf(resume, user, userConfig);
            await this.storage.uploadFile(
                bucket,
                fileName,
                pdf,
                'application/pdf'
            );
        }
    }

    async getPdfById(id: string): Promise<stream.Readable | null> {
        try {
            return await this.storage.getFile('resumes', `${id}.pdf`);
        } catch {
            return null;
        }
    }

    private loadTemplate(templateType: SelectedTemplate | undefined, folder: 'page' | 'pdf') {
        const file = templateType ?? SelectedTemplate.DEFAULT;

        const templatePath = path.join(
            __dirname,
            `../../templates/${folder}/${file}.hbs`
        );

        const content = fs.readFileSync(templatePath, 'utf-8');

        return Handlebars.compile(content);
    }

    private getContactHTML(user: User, userConfig: UserConfig | null, templateFolder: 'page' | 'pdf') {
        const contacts: string[] = [];

        if (user?.email)
            contacts.push(`<a href="mailto:${user.email}">(${user.email})</a>`);

        if (userConfig?.cellphone)
            contacts.push(`<a href="tel:+55${userConfig.cellphone}">(${userConfig.cellphone})</a>`);

        if (userConfig?.linkedin)
            contacts.push(`<a href="${userConfig.linkedin}">LinkedIn</a>`);

        if (userConfig?.github)
            contacts.push(`<a href="${userConfig.github}">GitHub</a>`);

        if (userConfig?.portfolio)
            contacts.push(`<a href="${userConfig.portfolio}">Portfólio</a>`);

        return contacts.join((templateFolder === 'page') ? " " : " | ");
    }
}