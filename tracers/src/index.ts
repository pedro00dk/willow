import * as yargs from 'yargs'


let parser = yargs
    .usage('Http API for CLI tracers') // not being used as usage, but description
    .alias('h', 'help')
    .hide('version')
    .option('port', { default: 8000, description: 'Set the server port' })
    .option(
        'tracer',
        {
            // type: 'array', type: 'string'
            array: true,
            string: true,
            nargs: 2,
            demandOption: true,
            description: 'Tracer <name> <spawn-cmd{<script>}>'
        }
    )

let arguments_ = parser.argv
console.log(arguments_)
