import { Module } from "@nestjs/common";
import { AdminController } from "src/presentation/controllers/admin/admin.controller";

@Module({
    controllers: [AdminController]
})
export class AdminModule { }