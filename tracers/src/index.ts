import * as yargs from 'yargs'
import { Server } from './server'
import { Tracer } from './tracer/tracer'
import { TracerProcess } from './tracer/tracer-process'


function main() {
    const parser = yargs
        .usage('Http API for CLI tracers') // not being used as usage, but description
        .alias('h', 'help')
        .hide('version')
        .option('port', { default: 8000, description: 'Set the server port' })
        .option(
            'tracer',
            {
                // type: 'array', type: 'string'
                array: true,
                description: 'Tracer <name> <spawn-cmd{<script>}>',
                nargs: 2,
                string: true
            }
        )

    const argumentS = parser.argv

    const port = argumentS.port
    const suppliers = createTracerSuppliers(argumentS.tracer)
    startServer(port, suppliers)
}

/**
 * Creates tracers from string args, every pair or elements of the array is a tracer name and its command.
 */
export function createTracerSuppliers(tracers: string[]) {
    return new Map(
        [...Array(tracers ? tracers.length / 2 : 0)]
            .map((_, i) => [tracers[i * 2], tracers[i * 2 + 1]] as [string, string])
            .map(([tracer, command]) => {
                const supplier = command.indexOf('{}') !== -1
                    ? (code: string) => new TracerProcess(command.replace(/{}/, `'${code.replace(/'/g, '\'"\'"\'')}'`))
                    : (code: string) => new TracerProcess(`${command} '${code.replace(/'/g, '\'"\'"\'')}'`)
                return [tracer, supplier] as [string, (code: string) => Tracer]
            })
    )
}

/**
 * Starts the server with the received suppliers and listen to the received port.
 */
export function startServer(port: number, suppliers: Map<string, (code: string) => Tracer>) {
    new Server(port, suppliers).listen()
}


if (!module.parent) {
    // called as entry point
    main()
}
