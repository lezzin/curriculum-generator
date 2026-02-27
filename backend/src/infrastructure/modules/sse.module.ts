import { Module } from "@nestjs/common";
import { SseController } from "src/presentation/controllers/sse/sse.controller";
import { SseService } from "../services/sse.service";

@Module({
    controllers: [SseController],
    providers: [SseService],
    exports: [SseService]
})
export class SseModule { }