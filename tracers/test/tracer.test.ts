import { TracerProcess } from '../src/tracer/tracer-process'
import { TracerWrapper } from '../src/tracer/tracer-wrapper'

const tracers = [
    // ['java', process.env.npm_package_config_java_supplier],
    ['python', process.env.npm_package_config_python_supplier]
]

const codes = {
    java: {
        main: 'Main.java',
        broken: '!@#$%*()',
        working: 'public class Main { public static void main(String[] args) { } }'
    },
    python: {
        main: '<script>',
        broken: '!@#$%*()',
        working: ''
    }
}

tracers.forEach(([language, command]) => {
    describe(
        `tracer process -- ${language}`,
        () => {
            test(
                'create - stop(fail)',
                () => {
                    const tracer = new TracerProcess(command)
                    expect(tracer.getState()).toBe('created')
                    expect(() => tracer.stop()).toThrow()
                }
            )
            test(
                'create - start(working code) - stop',
                async () => {
                    const tracer = new TracerProcess(command)
                    await tracer.start(codes[language].main, codes[language].working)
                    expect(tracer.getState()).toBe('started')
                    expect(() => tracer.stop()).not.toThrow()
                }
            )
            test(
                'create - start(working code) step - stop',
                async () => {
                    const tracer = new TracerProcess(command)
                    await tracer.start(codes[language].main, codes[language].working)
                    expect(() => tracer.step()).not.toThrow()
                    expect(() => tracer.stop()).not.toThrow()
                }
            )
            test(
                'create - start(working code) step* - step(fail) - stop(fail)',
                async () => {
                    const tracer = new TracerProcess(command)
                    await tracer.start(codes[language].main, codes[language].working)
                    while (true) {
                        try {
                            await tracer.step()
                        } catch (error) {
                            break
                        }
                    }
                    expect(() => tracer.step()).toThrow()
                    expect(() => tracer.stop()).toThrow()
                }
            )
            test(
                'create - start(broken code) step(fail) - stop(fail)',
                async () => {
                    const tracer = new TracerProcess(command)
                    await tracer.start(codes[language].main, codes[language].broken)
                    expect(() => tracer.step()).toThrow()
                    expect(() => tracer.stop()).toThrow()
                }
            )
        }
    )
})

tracers.forEach(([language, command]) => {
    describe(
        `tracer wrapper -- ${language}`,
        () => {
            test(
                'step over',
                async () => {
                    const tracer = new TracerWrapper(new TracerProcess(command))
                    await tracer.start(codes[language].main, codes[language].working)
                    expect(() => tracer.stepOver()).not.toThrow()
                    expect(tracer.getState()).toBe('started')
                }
            )
            test(
                'step out',
                async () => {
                    const tracer = new TracerWrapper(new TracerProcess(command))
                    await tracer.start(codes[language].main, codes[language].working)
                    expect(() => tracer.stepOut()).not.toThrow()
                }
            )
            test(
                'continue',
                async () => {
                    const tracer = new TracerWrapper(new TracerProcess(command))
                    await tracer.start(codes[language].main, codes[language].working)
                    expect(() => tracer.continue()).not.toThrow()
                }
            )
        }
    )
})
