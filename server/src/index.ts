import * as yargs from 'yargs'


function main() {
    const parser = yargs
        .usage('Willow API') // not being used as usage, but description
        .alias('h', 'help')
        .hide('version')
        .option('port', { default: 8000, description: 'Set the server port' })
        .option('tracers', { description: 'Address of the tracer server', type: 'string' })

    const argumentS = parser.argv

    const port = argumentS.port
    const tracerServerAddress = argumentS.tracers

    console.log(port, tracerServerAddress)
}


if (!module.parent) {
    // called as entry point
    main()
}
