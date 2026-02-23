import { Controller, Sse } from '@nestjs/common'
import { Observable } from 'rxjs'
import { SseService } from './sse.service'

@Controller('events')
export class SseController {
    constructor(private readonly sseService: SseService) { }

    @Sse()
    stream(): Observable<any> {
        return this.sseService.getObservable()
    }
}