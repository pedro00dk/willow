import yargs from 'yargs'
import { createServer } from './server'

const main = async () => {
    const parser = yargs
        .usage('Willow api for cli tracers')
        .alias('h', 'help')
        .hide('version')
        .option('port', { default: 8000, description: 'Set the server port' })
        .option('tracer-command', { array: true, string: true, nargs: 2, description: 'Tracer <language> <command>' })
        .option('tracer-steps', { default: 1000, description: 'Maximum number of allowed steps of a program' })
        .option('tracer-timeout', { default: 8000, description: 'Maximum tracer run time (milliseconds)' })
        .option('signed-steps', { type: 'number', description: 'Override --tracer-steps for signed users' })
        .option('signed-timeout', { type: 'number', description: 'Override --tracer-timeout for signed users' })
        .option('authentication-enable', { type: 'boolean', description: 'Enable google oauth routes for user signin' })
        .option('authentication-client-id', { type: 'string', description: 'Google oauth client id' })
        .option('authentication-client-secret', { type: 'string', description: 'Google oauth client secret' })
        .option('database-enable', { type: 'boolean', description: 'Enable user storage (requires authentication)' })
        .option('database-url', { type: 'string', description: 'Connection url to mongo database' })
        .option('database-name', { default: 'test', description: 'The mongo database name' })
        .option('cors-whitelist', { default: '*', description: 'Allow cors clients (split by ",", "*" all clients)' })
        .option('verbose', { type: 'boolean', description: 'Increase log output' })

    const options = parser.argv

    const port = options.port
    const commands: { [language: string]: string } = Object.fromEntries(
        options['tracer-command'].reduce((acc, languageOrCommand, i) => {
            if (i % 2 === 0) acc.push([languageOrCommand, undefined])
            else acc[acc.length - 1][1] = languageOrCommand
            return acc
        }, [] as [string, string][])
    )
    const tracers = {
        commands,
        steps: options['tracer-steps'],
        timeout: options['tracer-timeout']
    }
    const signed = {
        steps: options['signed-steps'] ?? tracers.steps,
        timeout: options['signed-timeout'] ?? tracers.timeout
    }
    const authentication = options['authentication-enable'] && {
        clientId: options['authentication-client-id'],
        clientSecret: options['authentication-client-secret']
    }
    const database = options['authentication-enable'] &&
        options['database-enable'] && {
            url: options['database-url'],
            name: options['database-name']
        }
    const corsWhitelist = new Set(options['cors-whitelist'].split(','))
    const verbose = options.verbose

    console.log('cli', 'options', { tracers, signed, authentication, database, corsWhitelist, verbose })
    const server = await createServer(tracers, signed, authentication, database, corsWhitelist, verbose)
    server.listen(port, () => console.log('server', `listening at', ${port}`))
}

main()
