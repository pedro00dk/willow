import * as yargs from 'yargs'

import { TracerServer } from './server'
import { ProcessClient } from './tracer/process-client'
import { Tracer } from './tracer/tracer'


let parser = yargs
    .usage('Http API for CLI tracers') // not being used as usage, but description
    .alias('h', 'help')
    .hide('version')
    .option('port', { default: 8000, description: 'Set the server port' })
    .option(
        'tracer',
        {
            // type: 'array', type: 'string'
            array: true,
            string: true,
            nargs: 2,
            description: 'Tracer <name> <spawn-cmd{<script>}>'
        }
    )

let arguments_ = parser.argv

let serverPort = arguments_.port
let tracerSuppliers = new Map(
    [...Array(arguments_.tracer ? arguments_.tracer.length / 2 : 0)]
        .map((_, i) => [arguments_.tracer[i * 2], arguments_.tracer[i * 2 + 1]] as [string, string])
        .map(([tracer, command]) => {
            let tracerProvider = command.indexOf('{}') != -1
                ? (code: string) => new ProcessClient(command.replace(/{}/, `'${code.replace(/'/g, '\'"\'"\'')}'`))
                : (code: string) => new ProcessClient(`${command} '${code.replace(/'/g, '\'"\'"\'')}'`)
            return [tracer, tracerProvider] as [string, (code: string) => Tracer]
        })
)

console.log(arguments_, tracerSuppliers)
console.log(tracerSuppliers)

new TracerServer(serverPort, tracerSuppliers).listen()