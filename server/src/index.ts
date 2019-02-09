import * as yargs from 'yargs'
import { Server } from './server'


function main() {
    const parser = yargs
        .usage('Willow API') // not being used as usage, but description
        .alias('h', 'help')
        .hide('version')
        .option('port', { default: 8000, description: 'Set the server port' })
        .option('secret', { demandOption: true, description: 'The secret for client sessions', type: 'string' })
        .option('tracers', { demandOption: true, description: 'Address of the tracer server', type: 'string' })

    const argumentS = parser.argv

    startServer(argumentS.port, argumentS.secret, argumentS.tracers)
}

/**
 * Starts the server with the received port and secret.
 */
export function startServer(port: number, secret: string, tracerServerAddress: string) {
    new Server(port, secret, tracerServerAddress).listen()
}


if (!module.parent) {
    // called as entry point
    main()
}
