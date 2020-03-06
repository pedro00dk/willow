import yargs from 'yargs'
import { createServer } from './server'

const main = () => {
    const parser = yargs
        .usage('Willow API for CLI Tracers')
        .alias('h', 'help')
        .hide('version')
        .option('port', { default: 8000, description: 'Set the server port' })
        .option('tracer-command', { array: true, string: true, nargs: 2, description: 'Tracer <language> <command>' })
        .option('tracer-steps', { default: 1000, description: 'Maximum number of allowed steps of a program' })
        .option('tracer-timeout', { default: 8000, description: 'Maximum tracer run time (milliseconds)' })
        .option('signin-steps', { type: 'number', description: 'Override --tracer-steps for signed users' })
        .option('signin-timeout', { type: 'number', description: 'Override --tracer-timeout for signed users' })
        .option('auth-enable', { type: 'boolean', description: 'Enable OAuth authentication routes' })
        .option('auth-google-client-id', { type: 'string', description: 'Google OAuth client id' })
        .option('auth-google-client-secret', { type: 'string', description: 'Google Oauth client secret' })
        .option('auth-google-callback-uri', { type: 'string', description: 'Google Oauth client secret' })
        .option('auth-database-connection', { type: 'string', description: 'Connection string to a mongo database' })
        .option('auth-cookie-key', { default: 'cookie-key', description: 'Key to encrypt authorization cookie' })
        .option('cors-whitelist', { type: 'string', description: 'Allow CORS clients split by "," ("*" any client)' })
        .option('verbose', { type: 'boolean', description: 'Log traces calls and results' })

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
        steps: options['signin-steps'],
        timeout: options['signin-timeout']
    }
    const credentials = options['auth-enable'] && {
        clientID: options['auth-google-client-id'],
        clientSecret: options['auth-google-client-secret'],
        callbackURL: options['auth-google-callback-uri'],
        databaseConnection: options['auth-database-connection']
    }
    const cookieKey = options['auth-cookie-key']
    const corsWhitelist = new Set((options['cors-whitelist'] ?? '').split(','))
    const verbose = options.verbose

    console.log({ tracers, signed, credentials, cookieKey, corsWhitelist, verbose })
    const server = createServer(tracers, signed, credentials, cookieKey, corsWhitelist, verbose)
    console.log('Server running at', port)
    server.listen(port)
}

main()
