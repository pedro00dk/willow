import log from 'npmlog'
import yargs from 'yargs'
import { Server } from './server'

const main = () => {
    const parser = yargs
        .usage('Willow API for CLI Tracers')
        .alias('h', 'help')
        .hide('version')
        .option('tracer', { array: true, description: 'Tracer <language> <command>', nargs: 2, string: true })
        .option('steps', { default: 1000, description: 'Maximum number of allowed steps of a program' })
        .option('timeout', { default: 8000, description: 'Maximum tracer run time (milliseconds)' })
        .option('client', { default: '*', description: 'Client origin (enable CORS)' })
        .option('port', { default: 8000, description: 'Set the server port' })
        .option('verbose', { type: 'boolean', description: 'Log traces calls and results' })

    const options = parser.argv
    const tracers = [...Array(options.tracer ? options.tracer.length / 2 : 0)]
        .map((_, i) => [options.tracer[i * 2], options.tracer[i * 2 + 1]] as const)
        .reduce((acc, [language, command]) => ({ ...acc, [language]: command }), {} as { [language: string]: string })
    log.info(main.name, 'cli', { ...options, tracers })
    new Server(tracers, options.steps, options.timeout, options.client, options.port, options.verbose).listen()
}

main()
