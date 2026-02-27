import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { ResumeQueue } from "src/application/queues/resume-queue";

export class BullMQResumeQueue implements ResumeQueue {
    constructor(
        @InjectQueue("resume.queue")
        private readonly queue: Queue,
    ) { }

    async addGenerateResumeJob(data: any): Promise<void> {
        await this.queue.add("generate-resume", data, {
            attempts: 3,
            backoff: { type: "exponential", delay: 2000 },
        });
    }
}