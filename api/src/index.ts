import yargs from 'yargs'
import { Config } from './data'
import { Server } from './server'

const main = async () => {
    const parser = yargs
        .usage('Willow api for cli tracers')
        .alias('h', 'help')
        .hide('version')
        .option('tracer', { array: true, string: true, nargs: 2, description: 'Tracer <language> <command>' })
        .option('steps', { default: 200, description: 'Maximum program size' })
        .option('timeout', { default: 5000, description: 'Maximum tracer run time (milliseconds)' })
        .option('auth-steps', { default: 1000, description: 'Override --steps for authenticated users' })
        .option('auth-timeout', { default: 8000, description: 'Override --timeout for authenticated users' })
        .option('auth', { type: 'boolean', description: 'Enable google oauth routes for user signin' })
        .option('auth-client-id', { type: 'string', description: 'Google oauth client id' })
        .option('auth-client-secret', { type: 'string', description: 'Google oauth client secret' })
        .option('db', { type: 'boolean', description: 'Enable user action storage if auth is enabled' })
        .option('db-url', { type: 'string', description: 'Mongo daemon url' })
        .option('db-name', { default: 'test', description: 'Mongo db name' })
        .option('cors', { default: '*', description: 'Allow cors clients suffixes ("," split) ("*" any)' })
        .option('port', { default: 8000, description: 'Server port' })
        .option('verbose', { type: 'boolean', description: 'Increase log output' })

    const options = parser.argv
    const tracerEntries = (options['tracer'] ?? []).reduce((acc, languageOrCommand, i) => {
        if (i % 2 === 0) acc.push([languageOrCommand, undefined])
        else acc[acc.length - 1][1] = languageOrCommand
        return acc
    }, [] as [string, string][])
    const config: Config = {
        tracers: Object.fromEntries(tracerEntries),
        steps: options.steps,
        timeout: options.timeout,
        authSteps: options['auth-steps'],
        authTimeout: options['auth-timeout'],
        auth: options['auth'] && { clientID: options['auth-client-id'], clientSecret: options['auth-client-secret'] },
        db: options['db'] && { url: options['db-url'], name: options['db-name'] },
        cors: options.cors.split(','),
        port: options.port,
        verbose: options.verbose
    }

    console.log('cli', 'options', { config })
    const server = new Server(config)
    server.start()
}

main()
