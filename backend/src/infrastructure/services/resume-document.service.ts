import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

import { SECTION_LABELS } from './constants/resume-labels.constants';
import { Resume } from 'src/domain/entities/resume.entity';
import { User } from 'src/domain/entities/user.entity';
import { UserConfig } from 'src/domain/entities/user.config.entity';
import { Language, SelectedTemplate } from 'src/domain/enums/resume.enums';

@Injectable()
export class ResumeDocumentService implements OnModuleInit, OnModuleDestroy {
  private browser: puppeteer.Browser;

  private readonly PUPPETEER_TIMEOUT = 60000; // 60S

  private readonly PUPPETEER_CONFIG: puppeteer.LaunchOptions = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  };

  async onModuleInit() {
    this.browser = await puppeteer.launch(this.PUPPETEER_CONFIG);
  }

  async onModuleDestroy() {
    await this.browser.close();
  }

  generateResumeHtml(
    resume: Resume,
    user: User,
    userConfig: UserConfig | null,
    templateFolder: 'page' | 'pdf',
  ): string {
    const template = this.loadTemplate(resume.template, templateFolder);
    const labels =
      SECTION_LABELS[resume.language] ?? SECTION_LABELS[Language.PT];

    Handlebars.registerHelper(
      'add',
      function (value: number, increment: number) {
        return value + increment;
      },
    );

    return template({
      name: user.name,
      summary: resume.summary,
      initials: user.name,
      role: resume.role,
      skills: resume.skills,
      experiences: resume.experiences,
      projects: resume.projects,

      labels,
      contactsHtml: this.getContactHTML(user, userConfig, templateFolder),
    });
  }

  async getPdfById(resume: Resume,
    user: User,
    userConfig: UserConfig | null,
  ): Promise<Buffer | null> {
    await this.ensureBrowser();

    const html = this.generateResumeHtml(resume, user, userConfig, 'pdf');

    const page = await this.browser.newPage();

    try {
      await page.setContent(html, {
        waitUntil: 'networkidle0',
        timeout: this.PUPPETEER_TIMEOUT,
      });

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        timeout: this.PUPPETEER_TIMEOUT,
      });

      return Buffer.from(pdf);
    } catch {
      return null
    } finally {
      await page.close();
    }
  }

  private loadTemplate(
    templateType: SelectedTemplate | undefined,
    folder: 'page' | 'pdf',
  ) {
    const file = templateType ?? SelectedTemplate.DEFAULT;

    const templatePath = path.join(
      __dirname,
      `../../templates/${folder}/${file}.hbs`,
    );

    const content = fs.readFileSync(templatePath, 'utf-8');

    return Handlebars.compile(content);
  }

  private getContactHTML(
    user: User,
    userConfig: UserConfig | null,
    templateFolder: 'page' | 'pdf',
  ) {
    const contacts: string[] = [];

    if (user?.email)
      contacts.push(`<a href="mailto:${user.email}">(${user.email})</a>`);

    if (userConfig?.cellphone)
      contacts.push(
        `<a href="tel:+55${userConfig.cellphone}">(${userConfig.cellphone})</a>`,
      );

    if (userConfig?.linkedin)
      contacts.push(`<a href="${userConfig.linkedin}">LinkedIn</a>`);

    if (userConfig?.github)
      contacts.push(`<a href="${userConfig.github}">GitHub</a>`);

    if (userConfig?.portfolio)
      contacts.push(`<a href="${userConfig.portfolio}">Portfólio</a>`);

    return contacts.join(templateFolder === 'page' ? ' ' : ' | ');
  }

  private async ensureBrowser() {
    if (!this.browser || !this.browser.connected) {
      this.browser = await puppeteer.launch(this.PUPPETEER_CONFIG);
    }
  }
}
