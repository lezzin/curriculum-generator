import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { extractErrorMessage } from '../helpers/error.helper';
import { isAxiosError } from 'axios';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface HttpPayload {
    method: HttpMethod,
    path: string,
    params?: Record<string, unknown>,
}

@Injectable()
export class ReportHttpClient {
    constructor(
        private readonly httpService: HttpService,
    ) { }

    async request<T>(payload: HttpPayload): Promise<T> {
        const { method, path, params } = payload;

        try {
            const response = await lastValueFrom(
                this.httpService.request({
                    method,
                    url: path,
                    data: params,
                }),
            );

            return response.data as T;
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                throw new HttpException(error.message, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR)
            }

            throw new Error(extractErrorMessage(error));
        }
    }
}