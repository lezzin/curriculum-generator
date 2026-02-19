import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as Handlebars from 'handlebars';
import { ResumePdfDto } from '../dto/prompt.dto';

@Injectable()
export class PdfService {
    async generateResumePdf(resume: ResumePdfDto): Promise<Buffer> {
        const template = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            width: 210mm;
            min-height: 297mm;
            padding: 22mm;
            margin: 0;
            color: #111;
            font-size: 14px;
            line-height: 1.6;
          }

          h1 {
            font-size: 22px;
            margin-bottom: 4px;
          }

          .role {
            color: #555;
            margin-bottom: 12px;
          }

          .section {
            margin-top: 28px;
          }

          .section-title {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #777;
            margin-bottom: 12px;
          }

          .experience {
            margin-bottom: 18px;
            page-break-inside: avoid;
          }

          .technologies {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
          }
        </style>
      </head>
      <body>

        <h1>{{name}}</h1>
        <div class="role">{{role}}</div>
        <p>{{summary}}</p>

        <div class="section">
          <div class="section-title">Skills</div>
          <p>{{skillsFormatted}}</p>
        </div>

        <div class="section">
          <div class="section-title">Experience</div>

          {{#each experiences}}
            <div class="experience">
              <strong>{{title}}</strong> — {{company}} ({{period}})
              <p>{{description}}</p>
              <div class="technologies">
                {{technologiesFormatted}}
              </div>
            </div>
          {{/each}}
        </div>

        {{#if projects}}
        <div class="section">
          <div class="section-title">Projects</div>

          {{#each projects}}
            <div class="experience">
              <strong>{{name}}</strong>
              <p>{{description}}</p>
              <div class="technologies">
                {{technologiesFormatted}}
              </div>
            </div>
          {{/each}}
        </div>
        {{/if}}

      </body>
    </html>
    `;

        const formattedData = {
            ...resume,
            skillsFormatted: resume.skills.join(' · '),
            experiences: resume.experiences.map((exp) => ({
                ...exp,
                technologiesFormatted: exp.technologies.join(' · '),
            })),
            projects: resume.projects?.map((project) => ({
                ...project,
                technologiesFormatted: project.technologies.join(' · '),
            })),
        };

        const compiled = Handlebars.compile(template);
        const html = compiled(formattedData);

        const browser = await puppeteer.launch({
            headless: 'shell',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfUint8 = await page.pdf({
            format: 'A4',
            printBackground: true,
        });

        await browser.close();

        return Buffer.from(pdfUint8);
    }
}
