import * as log from 'npmlog'
import * as yargs from 'yargs'
import { Server } from './server'

function main() {
    const parser = yargs //
        .usage('Willow API') // not being used as usage, but description
        .alias('h', 'help')
        .hide('version')
        .option('clients', { default: '*', description: 'Client origin (enable CORS)' })
        .option('inactive', { default: 10, description: 'Tracer maximum inactive time (minutes)' })
        .option('lifetime', { default: 30, description: 'Tracer maximum live time (minutes)' })
        .option('port', { default: 8000, description: 'Set the server port' })
        .option('secret', { default: 'secret', description: 'The secret for client sessions' })
        .option('tracers', { demandOption: true, description: 'Address of the tracer server', type: 'string' })
    const argumentS = parser.argv
    const clients = argumentS.clients
    const inactive = argumentS.inactive
    const lifetime = argumentS.lifetime
    const port = argumentS.port
    const secret = argumentS.secret
    const tracers = argumentS.tracers
    log.info(main.name, 'cli', { clients, port, secret, tracers })
    new Server(port, secret, clients, tracers, lifetime, inactive).listen()
}

if (!module.parent) main()
