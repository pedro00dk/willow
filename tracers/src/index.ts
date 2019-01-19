import * as yargs from 'yargs'

import { TracerServer } from './server'
import { ProcessClient } from './tracer/process-client'
import { Tracer } from './tracer/tracer'


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
            nargs: 2
        }
    )

const argumentS = parser.argv

const serverPort = argumentS.port
const tracerSuppliers = new Map(
    [...Array(argumentS.tracer ? argumentS.tracer.length / 2 : 0)]
        .map((_, i) => [argumentS.tracer[i * 2], argumentS.tracer[i * 2 + 1]] as [string, string])
        .map(([tracer, command]) => {
            const tracerProvider = command.indexOf('{}') !== -1
                ? (code: string) => new ProcessClient(command.replace(/{}/, `'${code.replace(/'/g, '\'"\'"\'')}'`))
                : (code: string) => new ProcessClient(`${command} '${code.replace(/'/g, '\'"\'"\'')}'`)
            return [tracer, tracerProvider] as [string, (code: string) => Tracer]
        })
)

new TracerServer(serverPort, tracerSuppliers).listen()
