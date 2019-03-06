import * as cp from 'child_process'
import * as log from 'npmlog'
import * as protobuf from 'protobufjs'
import * as rx from 'rxjs'
import * as rxOps from 'rxjs/operators'


/**
 * Creates and connects to a process providing easy access to observable buffers. The consumed process stream must
 * generate size delimiters using var_int32 encoding. The generated buffers will always contain an entire data section.
 */
export class ProtoProcess {
    private instance: cp.ChildProcess
    private stdin$_: rx.Subject<protobuf.BufferWriter>
    private stdout$_: rx.Observable<protobuf.BufferReader>
    private stderr$_: rx.Observable<string>

    get stdin$() { return this.stdin$_ }
    get stdout$() { return this.stdout$_ }
    get stderr$() { return this.stderr$_ }

    constructor(private readonly command: string) { }

    isRunning() { return this.instance && !this.instance.killed }

    spawnProcess() {
        log.info(ProtoProcess.name, 'spawn', { command: this.command })
        if (this.isRunning()) throw new Error('process running')

        this.instance = cp.spawn(this.command, { shell: '/bin/bash' })
        const stop$ = rx.merge(rx.fromEvent(this.instance, 'error'), rx.fromEvent(this.instance, 'exit'))
            .pipe(rxOps.take(1))
        this.stdin$_ = new rx.Subject()
        this.stdin$_
            .pipe(rxOps.takeUntil(stop$))
            .subscribe(
                next => this.instance.stdin.write(next.finish()),
                error => { if (!this.instance.killed) this.instance.kill() },
                () => { if (!this.instance.killed) this.instance.kill() }
            )
        this.stdout$_ = rx.fromEvent(this.instance.stdout, 'data')
            .pipe(
                rxOps.map(object => [new protobuf.BufferReader(object as Buffer)]),
                rxOps.scan(
                    (acc, buffer) => {
                        if (!acc[acc.length - 1]) {
                            const messageLength = buffer[0].fixed32()
                            const bufferLength = buffer[0].len - buffer[0].pos
                            buffer[0].pos = 0
                            return messageLength === bufferLength ? [...buffer, undefined] : buffer
                        } else {
                            const messageLength = acc[0].fixed32()
                            const bufferLength = buffer[0].len
                            const accLength = acc.reduce((acc, buffer) => acc + buffer.len - buffer.pos, 0)
                            acc[0].pos = 0
                            return messageLength === accLength + bufferLength
                                ? [...acc, ...buffer, undefined]
                                : [...acc, ...buffer]
                        }
                    },
                    [undefined] as protobuf.BufferReader[]
                ),
                rxOps.filter(buffers => buffers[buffers.length - 1] == undefined),
                rxOps.map(buffers => new protobuf.BufferReader(
                    Buffer.concat(buffers.slice(0, -1).map(buffer => buffer.buf))
                )),
                rxOps.takeUntil(stop$)
            )
        this.stderr$_ = rx.fromEvent(this.instance.stderr, 'data')
            .pipe(
                rxOps.map(object => object as Buffer),
                rxOps.map(buffer => buffer.toString('utf8')),
                rxOps.flatMap(text => rx.from(text.split(/(\n)/))),
                rxOps.filter(part => part.length !== 0),
                rxOps.map(part => [part]),
                rxOps.scan((acc, parts) => acc[acc.length - 1] === '\n' ? parts : [...acc, ...parts], ['\n']),
                rxOps.filter(parts => parts[parts.length - 1] === '\n'),
                rxOps.map(lineParts => lineParts.join('')),
                rxOps.takeUntil(stop$)
            )
    }
}
