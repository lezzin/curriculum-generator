import { Injectable } from '@nestjs/common'
import { Subject } from 'rxjs'

@Injectable()
export class SseService {
    private eventSubject = new Subject<any>()

    getObservable() {
        return this.eventSubject.asObservable()
    }

    sendEvent(data: any) {
        this.eventSubject.next({ data })
    }
}