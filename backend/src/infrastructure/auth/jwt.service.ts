import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAdapter {
    constructor(private jwtService: NestJwtService) { }

    sign(payload: any): string {
        return this.jwtService.sign(payload);
    }
}