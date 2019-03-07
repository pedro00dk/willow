import * as log from 'npmlog'
import * as yargs from 'yargs'
import { Server } from './server'
import { TracerProcess } from './tracer/tracer-process'


function main() {
    const parser = yargs
        .usage('Http API for CLI tracers') // not being used as usage, but description
        .alias('h', 'help')
        .hide('version')
        .option('tracer', { array: true, description: 'Tracer <language> <command>', nargs: 2, string: true })
        .option('port', { default: 8000, description: 'Set the server port' })
    const argumentS = parser.argv
    const port = argumentS.port
    const tracers = [...Array(argumentS.tracer ? argumentS.tracer.length / 2 : 0)]
        .map((_, i) => [argumentS.tracer[i * 2], argumentS.tracer[i * 2 + 1]] as [string, string])
        .reduce((acc, [language, command]) => ({ ...acc, [language]: command }), {} as { [language: string]: string })
    log.info(main.name, 'cli', { port, tracers })
    new Server(port, tracers).listen()
}

if (!module.parent) main()
