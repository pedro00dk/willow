import * as cp from 'child_process'
import * as protobuf from 'protobufjs'
import * as rx from 'rxjs'
import * as rxOps from 'rxjs/operators'

/**
 * Creates and connects to a process providing easy access to observable buffers. The consumed process stream must
 * generate length delimiters using var_int32 encoding. The generated buffers will always contain an entire data
 * section.
 */
export class ProtoProcess {
    private stdin$_: rx.Subject<protobuf.Writer>
    private stdout$_: rx.Observable<protobuf.Reader>
    private stderr$_: rx.Observable<string>

    get stdin$() {
        return this.stdin$_
    }
    get stdout$() {
        return this.stdout$_
    }
    get stderr$() {
        return this.stderr$_
    }

    constructor(private readonly command: string) {}

    isRunning() {
        return this.stdin$ && !this.stdin$.closed
    }

    spawnProcess() {
        if (this.isRunning()) throw new Error('process running')

        const instance = cp.spawn(this.command, { shell: '/bin/bash' })
        const stop$ = rx //
            .merge(rx.fromEvent(instance, 'error'), rx.fromEvent(instance, 'exit'))
            .pipe(rxOps.take(1))
        this.stdin$_ = new rx.Subject()
        this.stdin$_ //
            .pipe(rxOps.takeUntil(stop$))
            .subscribe(
                next => instance.stdin.write(next.finish()),
                error => (!instance.killed ? instance.kill() : undefined),
                () => (!instance.killed ? instance.kill() : undefined)
            )
        this.stdout$_ = rx //
            .fromEvent<Buffer>(instance.stdout, 'data')
            .pipe(
                rxOps.map(buffer => new protobuf.Reader(buffer as Uint8Array)),
                rxOps.scan<protobuf.Reader>(
                    (acc, reader) => {
                        if (acc[acc.length - 1] == undefined) {
                            const messageLength = reader.fixed32()
                            const readerLength = reader.len - reader.pos
                            reader.pos = 0
                            return messageLength === readerLength ? [reader, undefined] : [reader]
                        } else {
                            const messageLength = acc[0].fixed32()
                            const readerLength = reader.len
                            const accLength = acc.reduce((acc, buffer) => acc + buffer.len - buffer.pos, 0)
                            acc[0].pos = 0
                            return messageLength === accLength + readerLength
                                ? [...acc, reader, undefined]
                                : [...acc, reader]
                        }
                    },
                    [undefined] as protobuf.Reader[]
                ),
                rxOps.filter(buffers => buffers[buffers.length - 1] == undefined),
                rxOps.map(
                    buffers => new protobuf.Reader(Buffer.concat(buffers.slice(0, -1).map(buffer => buffer.buf)))
                ),
                rxOps.takeUntil(stop$)
            )
        this.stderr$_ = rx //
            .fromEvent<Buffer>(instance.stderr, 'data')
            .pipe(
                rxOps.map(buffer => buffer.toString('utf8')),
                rxOps.takeUntil(stop$)
            )
    }
}
