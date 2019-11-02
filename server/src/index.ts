import log from 'npmlog'
import yargs from 'yargs'
import { Server } from './server'

const main = () => {
    const parser = yargs
        .usage('Willow API for CLI Tracers')
        .alias('h', 'help')
        .hide('version')
        .option('clients', { default: '*', description: 'Client origin (enable CORS)' })
        .option('port', { default: 8000, description: 'Set the server port' })
        .option('steps', { default: 1000, description: 'Maximum number of allowed steps of a program' })
        .option('timeout', { default: 8000, description: 'Maximum tracer run time (milliseconds)' })
        .option('tracer', { array: true, description: 'Tracer <language> <command>', nargs: 2, string: true })

    const arguments_ = parser.argv
    const clients = arguments_.clients
    const port = arguments_.port
    const steps = arguments_.steps
    const timeout = arguments_.timeout
    const tracers = [...Array(arguments_.tracer ? arguments_.tracer.length / 2 : 0)]
        .map((_, i) => [arguments_.tracer[i * 2], arguments_.tracer[i * 2 + 1]] as const)
        .reduce((acc, [language, command]) => ({ ...acc, [language]: command }), {} as { [language: string]: string })
    log.info(main.name, 'cli', { port, tracers })
    new Server(port, tracers, steps, timeout, clients).listen()
}

main()
