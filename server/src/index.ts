import * as log from 'npmlog'
import * as yargs from 'yargs'
import { Server } from './server'


/**
 * The main function.
 */
function main() {
    log.info(main.name, '')
    const parser = yargs
        .usage('Willow API') // not being used as usage, but description
        .alias('h', 'help')
        .hide('version')
        .option('port', { default: 8000, description: 'Set the server port' })
        .option('secret', { demandOption: true, description: 'The secret for client sessions', type: 'string' })
        .option('tracers', { demandOption: true, description: 'Address of the tracer server', type: 'string' })
    const argumentS = parser.argv
    const port = argumentS.port
    const secret = argumentS.secret
    const tracerServerAddress = argumentS.tracers
    log.info(main.name, 'cli', { port, secret, tracers: tracerServerAddress })
    startServer(port, secret, tracerServerAddress)
}

/**
 * Starts the server with the received port and secret.
 */
export function startServer(port: number, secret: string, tracerServerAddress: string) {
    new Server(port, secret, tracerServerAddress).listen()
}

// runs when called as entry point
if (!module.parent) {
    main()
}
