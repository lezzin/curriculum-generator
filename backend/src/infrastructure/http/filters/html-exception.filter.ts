import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

@Catch()
export class HtmlExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const acceptsHtml = request.headers.accept?.includes('text/html');

    if (!acceptsHtml) {
      if (exception instanceof HttpException) {
        return response
          .status(exception.getStatus())
          .json(exception.getResponse());
      }

      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error' });
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Ocorreu um erro inesperado.';
    let description: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse() as any;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        message = exceptionResponse?.message || message;
        description = exceptionResponse?.error;
      }
    }

    try {
      const templatePath = path.join(
        process.cwd(),
        'src/infrastructure/http/views/error.hbs',
      );

      const templateSource = fs.readFileSync(templatePath, 'utf8');

      const template = Handlebars.compile(templateSource);

      const html = template({
        title: `${status} - Erro`,
        status,
        message,
        description,
        frontendUrl: process.env.FRONTEND_URL,
      });

      return response.status(status).type('text/html').send(html);
    } catch (templateError) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .type('text/html')
        .send(`<h1>500</h1><p>Erro ao renderizar página de erro</p>`);
    }
  }
}
