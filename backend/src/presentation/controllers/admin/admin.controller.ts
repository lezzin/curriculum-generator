import { Controller, Get, UseGuards } from "@nestjs/common";
import { AdminGuard } from "src/infrastructure/auth/guards/admin.guard";
import { JwtAuthGuard } from "src/infrastructure/auth/guards/jwt-auth.guard";

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
    constructor() { }

    @Get('/')
    get() {
        return { message: 'Usuário é admin' }
    }
}
