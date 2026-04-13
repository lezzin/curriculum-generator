import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import * as pdf from 'html-pdf-node';

import { SECTION_LABELS } from './constants/resume-labels.constants';
import { Resume } from 'src/domain/entities/resume.entity';
import { User } from 'src/domain/entities/user.entity';
import { UserConfig } from 'src/domain/entities/user.config.entity';
import { Language, SelectedTemplate } from 'src/domain/enums/resume.enums';
import { ResumeDocumentRepository } from 'src/domain/repositories/resume-document.repository';

@Injectable()
export class ResumeDocumentService extends ResumeDocumentRepository implements OnModuleInit {
  async onModuleInit() {
    this.registerHandlebarsHelpers();
  }

  private registerHandlebarsHelpers() {
    Handlebars.registerHelper('add', (value: number, increment: number) => value + increment);

    Handlebars.registerHelper('formatContacts', (contacts: any, format: 'page' | 'pdf') => {
      const parts: string[] = [];

      if (contacts.email) {
        parts.push(`<a href="mailto:${contacts.email}">${contacts.email}</a>`);
      }

      if (contacts.cellphone) {
        parts.push(`<a href="tel:+55${contacts.cellphone}">${contacts.cellphone}</a>`);
      }

      if (contacts.linkedin) {
        parts.push(`<a href="${contacts.linkedin}">LinkedIn</a>`);
      }

      if (contacts.github) {
        parts.push(`<a href="${contacts.github}">GitHub</a>`);
      }

      if (contacts.portfolio) {
        parts.push(`<a href="${contacts.portfolio}">Portfólio</a>`);
      }

      const separator = format === 'page' ? ' ' : ' | ';
      return new Handlebars.SafeString(parts.join(separator));
    });
  }

  generateHtml(
    resume: Resume,
    user: User,
    userConfig: UserConfig | null,
    format: 'page' | 'pdf',
  ): string {
    const template = this.loadTemplate(resume.template, format);
    const labels = SECTION_LABELS[resume.language] ?? SECTION_LABELS[Language.PT];

    return template({
      name: user.name,
      summary: resume.summary,
      initials: this.getInitials(user.name),
      role: resume.role,
      skills: resume.skills,
      experiences: resume.experiences,
      projects: resume.projects,
      labels,
      contacts: {
        email: user.email,
        cellphone: userConfig?.cellphone,
        linkedin: userConfig?.linkedin,
        github: userConfig?.github,
        portfolio: userConfig?.portfolio,
      },
      format,
    });
  }

  async generatePdf(
    resume: Resume,
    user: User,
    userConfig: UserConfig | null,
  ): Promise<Buffer | null> {
    const html = this.generateHtml(resume, user, userConfig, 'pdf');

    const file = { content: html };

    const options = {
      format: 'A4',
      printBackground: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    };

    const pdfBuffer = await pdf.generatePdf(file, options);

    return pdfBuffer;
  }

  private loadTemplate(
    templateType: SelectedTemplate | undefined,
    folder: 'page' | 'pdf',
  ) {
    const file = templateType ?? SelectedTemplate.DEFAULT;
    const templatePath = path.join(
      __dirname,
      '..',
      '..',
      'templates',
      folder,
      `${file}.hbs`,
    );

    const compiled = fs.readFileSync(templatePath, 'utf-8');
    return Handlebars.compile(compiled);
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}
