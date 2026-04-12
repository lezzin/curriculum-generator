import { NestWorkerOptions } from "@nestjs/bullmq/dist/interfaces/worker-options.interface";
import { JobsOptions } from "bullmq";
import { REQUEST_TIMEOUT as GEMINI_REQUEST_TIMEOUT } from "src/infrastructure/services/gemini/gemini.service";

export const JOB_OPTIONS: JobsOptions = {
    attempts: 2,
    backoff: {
        type: 'exponential',
        delay: 5000,
    },
}

export const WORKER_OPTIONS: NestWorkerOptions = {
    lockDuration: GEMINI_REQUEST_TIMEOUT,
    concurrency: 1,
}