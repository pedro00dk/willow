import * as log from 'npmlog'
import * as yargs from 'yargs'
import { Server } from './server'

function main() {
    const parser = yargs //
        .usage('Willow API') // not being used as usage, but description
        .alias('h', 'help')
        .hide('version')
        .option('clients', { default: '*', description: 'Client origin (enable CORS)', type: 'string' })
        .option('port', { default: 8000, description: 'Set the server port' })
        .option('secret', { default: 'secret', description: 'The secret for client sessions', type: 'string' })
        .option('tracers', { demandOption: true, description: 'Address of the tracer server', type: 'string' })
    const argumentS = parser.argv
    const clients = argumentS.clients
    const port = argumentS.port
    const secret = argumentS.secret
    const tracers = argumentS.tracers
    log.info(main.name, 'cli', { clients, port, secret, tracers })
    new Server(port, secret, clients, tracers).listen()
}

if (!module.parent) main()
