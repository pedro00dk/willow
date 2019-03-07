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
    private actions$: rx.Subject<protocol.Action[]>
    private events$: rx.Observable<protocol.Event[]>
    private state: ReturnType<Tracer['getState']> = 'created'

    constructor(private command: string) { }

    private checkState(...states: typeof TracerProcess.prototype.state[]) {
        if (!states.includes(this.state)) throw new Error(`unexpected state: ${this.state}, expected: ${states}`)
    }

    private spawnProcess() {
        log.info(TracerProcess.name, 'spawn', { command: this.command })
        const process = new ProtoProcess(this.command)
        process.spawnProcess()
        this.actions$ = new rx.Subject()
        this.actions$
            .pipe(rxOps.flatMap(actions => actions.map(action => [action]))) // send one action per request
            .subscribe(
                actions => {
                    const requestWriter = protocol.TracerRequest.encode(new protocol.TracerRequest({ actions }))
                    process.stdin$.next(protobuf.Writer.create().fixed32(requestWriter.len))
                    process.stdin$.next(requestWriter)
                },
                error => process.stdin$.error(error),
                () => process.stdin$.complete()
            )
        this.events$ = process.stdout$
            .pipe(rxOps.map(reader => protocol.TracerResponse.decode(reader, reader.fixed32()).events))
        this.events$
            .pipe(
                rxOps.flatMap(events => events),
                rxOps.filter(event => event.inspected ? event.inspected.frame.finish : event.threw != undefined),
                rxOps.take(1)
            )
            .subscribe(next => this.stop())
        process.stderr$
            .pipe(rxOps.take(1))
            .subscribe(next => this.stop())
    }

    getState() {
        return this.state
    }

    start(main: string, code: string) {
        log.info(TracerProcess.name, 'start')
        this.checkState('created')
        this.state = 'started'
        this.spawnProcess()
        const eventsPromise = this.events$.pipe(rxOps.take(1)).toPromise()
        this.actions$.next([new protocol.Action({ start: new protocol.Action.Start({ main, code }) })])
        return eventsPromise
    }

    stop() {
        log.info(TracerProcess.name, 'stop')
        this.checkState('started')
        this.state = 'stopped'
        this.actions$.next([new protocol.Action({ stop: new protocol.Action.Stop() })])
        // this.actions$.complete() // the process shall stop automatically (this call will force stop/kill)
    }

    step() {
        log.verbose(TracerProcess.name, 'step')
        this.checkState('started')
        const eventsPromise = this.events$.pipe(rxOps.take(1)).toPromise()
        this.actions$.next([new protocol.Action({ step: new protocol.Action.Step() })])
        return eventsPromise
    }

    input(lines: string[]) {
        log.verbose(TracerProcess.name, 'input', { lines })
        this.checkState('started')
        this.actions$.next([new protocol.Action({ input: new protocol.Action.Input({ lines }) })])
    }
}
