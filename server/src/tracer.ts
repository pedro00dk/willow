import * as cp from 'child_process'
import * as log from 'npmlog'
import * as protobuf from 'protobufjs'
import * as rx from 'rxjs'
import * as rxOps from 'rxjs/operators'
import * as protocol from './protobuf/protocol'

/**
 * Spawns and connects to a tracer process.
 */
export class Tracer {
    constructor(
        private readonly command: string,
        private readonly shell: string,
        private readonly trace: protocol.Trace,
        private readonly timeout: number
    ) {}

    async run() {
        log.info(Tracer.name, 'run')
        const tracer = cp.spawn(this.command, { shell: this.shell })
        const stop$ = rx //
            .merge(rx.fromEvent(tracer, 'error'), rx.fromEvent(tracer, 'exit'))
            .pipe(rxOps.take(1))

        const stdout$ = rx
            .fromEvent<Buffer>(tracer.stdout, 'data')
            .pipe(rxOps.takeUntil(stop$))
            .pipe(
                rxOps.map(buffer => new protobuf.Reader(buffer)),
                rxOps.scan<protobuf.Reader, protobuf.Reader[]>(
                    (acc, reader) => {
                        if (!acc[acc.length - 1]) {
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
                    [undefined]
                ),
                rxOps.filter(buffers => !buffers[buffers.length - 1]),
                rxOps.map(
                    buffers => new protobuf.Reader(Buffer.concat(buffers.slice(0, -1).map(buffer => buffer.buf)))
                ),
                rxOps.map(reader => protocol.Result.decode(reader, reader.fixed32()))
            )

        const stderr$ = rx
            .fromEvent<Buffer>(tracer.stderr, 'data')
            .pipe(rxOps.takeUntil(stop$))
            .pipe(
                rxOps.map(buffer => buffer.toString('utf8')),
                rxOps.map(text => `tracer process stderr:\n${text}`)
            )

        const result$ = rx.merge(stdout$, stderr$)
        const resultPromise = result$ //
            .pipe(
                rxOps.take(1),
                rxOps.timeout(this.timeout * 1000)
            )
            .toPromise()

        const traceWriter = protocol.Trace.encode(this.trace)
        const lengthWriter = protobuf.Writer.create().fixed32(traceWriter.len)
        tracer.stdin.write(lengthWriter.finish())
        tracer.stdin.write(traceWriter.finish())

        try {
            const result = await resultPromise
            if (typeof result === 'string') {
                log.info(Tracer.name, 'run', 'threw', result)
                throw new Error(result)
            }
            log.info(Tracer.name, 'run', 'returned')
            return result
        } catch(error) {
            throw error
        } finally {
            if (!tracer.killed) tracer.kill()
        }
    }
}
