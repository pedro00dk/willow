import * as log from 'npmlog'
import * as yargs from 'yargs'
import { Server } from './server'

function main() {
    const parser = yargs
        .usage('Willow API for CLI Tracers')
        .alias('h', 'help')
        .hide('version')
        .option('clients', { default: '*', description: 'Client origin (enable CORS)' })
        .option('port', { default: 8000, description: 'Set the server port' })
        .option('secret', { default: 'secret', description: 'The secret for client sessions' })
        .option('shell', { default: 'sh', description: 'Shell command (or path) to run tracers commands' })
        .option('steps', { default: 1000, description: 'Maximum number of a program being traced' })
        .option('timeout', { default: 8, description: 'Maximum tracer run time (seconds)' })
        .option('tracer', { array: true, description: 'Tracer <language> <command>', nargs: 2, string: true })

    const arguments_ = parser.argv
    const clients = arguments_.clients
    const port = arguments_.port
    const secret = arguments_.secret
    const shell = arguments_.shell
    const steps = arguments_.steps
    const timeout = arguments_.timeout
    const tracers = [...Array(arguments_.tracer ? arguments_.tracer.length / 2 : 0)] //
        .map((_, i) => [arguments_.tracer[i * 2], arguments_.tracer[i * 2 + 1]] as [string, string])
        .reduce((acc, [language, command]) => ({ ...acc, [language]: command }), {} as { [language: string]: string })
    log.info(main.name, 'cli', { port, tracers })
    new Server(port, tracers, shell, steps, timeout, clients, secret).listen()
}

if (!module.parent) main()
