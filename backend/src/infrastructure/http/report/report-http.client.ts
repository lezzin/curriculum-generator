import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { extractAxiosError } from '../helpers/error.helper';

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
            const { message, status } = extractAxiosError(error);
            throw new HttpException(message, status);
        }
    }
}