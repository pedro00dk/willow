import * as log from 'npmlog'
import * as protobuf from 'protobufjs'
import * as rx from 'rxjs'
import * as rxOps from 'rxjs/operators'
import { ProtoProcess } from '../process/proto-process'
import * as protocol from '../protobuf/protocol'
import { Tracer } from './tracer'

/**
 * Spawns and connects to a tracer process.
 */
export class TracerProcess implements Tracer {
    private requests$: rx.Subject<protocol.TracerRequest>
    private responses$: rx.Observable<protocol.TracerResponse | string>
    private state: ReturnType<Tracer['getState']> = 'created'

    constructor(private command: string) {}

    private checkState(...states: typeof TracerProcess.prototype.state[]) {
        if (!states.includes(this.state)) throw new Error(`unexpected state: ${this.state}, expected: ${states}`)
    }

    private spawnProcess() {
        log.info(TracerProcess.name, 'spawn', { command: this.command })
        const process = new ProtoProcess(this.command)
        process.spawnProcess()
        this.requests$ = new rx.Subject()
        this.requests$ //
            .subscribe(
                request => {
                    const requestWriter = protocol.TracerRequest.encode(request)
                    process.stdin$.next(protobuf.Writer.create().fixed32(requestWriter.len))
                    process.stdin$.next(requestWriter)
                },
                error => process.stdin$.error(error),
                () => process.stdin$.complete()
            )
        this.responses$ = rx //
            .merge(
                process.stdout$ //
                    .pipe(rxOps.map(reader => protocol.TracerResponse.decode(reader, reader.fixed32()))),
                process.stderr$ //
                    .pipe(rxOps.map(text => `tracer process stderr:\n${text}`))
            )
            .pipe(rxOps.shareReplay(1)) // necessary to get a event or error before subscribing
    }

    getState() {
        return this.state
    }

    async start(start: protocol.Action.Start) {
        log.info(TracerProcess.name, 'start')
        this.checkState('created')
        this.state = 'started'
        this.spawnProcess()
        const eventsPromise = this.responses$.pipe(rxOps.take(1)).toPromise()
        this.requests$.next(
            protocol.TracerRequest.create({
                actions: [protocol.Action.create({ start })]
            })
        )
        const response = await eventsPromise
        if (typeof response === 'string') {
            this.stop()
            throw new Error(response)
        }
        const lastEvent = response.events[response.events.length - 1]
        if (!!lastEvent.threw || (!!lastEvent.inspected && lastEvent.inspected.frame.finish)) this.stop()
        return response
    }

    stop() {
        log.info(TracerProcess.name, 'stop')
        this.checkState('started')
        this.state = 'stopped'
        this.requests$.next(
            protocol.TracerRequest.create({
                actions: [protocol.Action.create({ stop: protocol.Action.Stop.create() })]
            })
        )
        // this.actions$.complete() // the process shall stop automatically (this call will force stop/kill)
    }

    async step(count: number = 1) {
        log.verbose(TracerProcess.name, 'step')
        this.checkState('started')
        const eventsPromise = this.responses$.pipe(rxOps.take(2)).toPromise()
        this.requests$.next(
            protocol.TracerRequest.create({
                actions: [protocol.Action.create({ step: protocol.Action.Step.create({ count }) })]
            })
        )
        const response = await eventsPromise
        if (typeof response === 'string') {
            this.stop()
            throw new Error(response)
        }
        const lastEvent = response.events[response.events.length - 1]
        if (!!lastEvent.threw || (!!lastEvent.inspected && lastEvent.inspected.frame.finish)) this.stop()
        return response
    }

    input(input: protocol.Action.Input) {
        log.verbose(TracerProcess.name, 'input', { lines: input.lines })
        this.checkState('started')
        this.requests$.next(protocol.TracerRequest.create({ actions: [protocol.Action.create({ input })] }))
    }
}
