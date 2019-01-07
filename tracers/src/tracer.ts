import * as cp from 'child_process'
import { Writable } from 'stream'


/**
 * Connects to a tracer process.
 */
export class TracerClient {
    private command: string

    /**
     * Initializes the client with the command to spawn the process.
     */
    constructor(command: string) {
        this.command = command
    }

    /**
     * Spawns the tracer server process.
     */
    spawn() {
        let instance = cp.spawn(this.command, { shell: true })

        instance.stdout.pipe(process.stdout)
        instance.stderr.pipe(process.stderr)

        instance.stdin.write('start\n')
        setInterval(() => instance.stdin.write('step\n'), 1000)
    }
}