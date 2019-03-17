import * as axios from 'axios'
import * as log from 'npmlog'
import * as protocol from '../protobuf/protocol'

/**
 * Proxy implementation of the tracers service protocol.
 */
export class TracersProxy {
    private mode: 'json' | 'proto'
    private requestConfig: axios.AxiosRequestConfig

    constructor(private api: axios.AxiosInstance) {}

    async connect() {
        try {
            const response = await this.api.get('/mode')
            this.mode = response.data
            this.requestConfig =
                this.mode === 'proto'
                    ? {
                          headers: { 'Content-Type': 'application/octet-stream' },
                          responseType: 'arraybuffer',
                          transformRequest: [data => data],
                          transformResponse: [data => data]
                      }
                    : {}
        } catch (error) {
            throw new Error(error.response ? error.response.data : error.toString())
        }
    }

    private async request<T, U>(
        api: axios.AxiosInstance,
        method: string,
        requestObject: T,
        requestType: { encode: (response: T) => protobuf.Writer },
        responseType: { create: (properties: {}) => U; decode: (buffer: Buffer) => U }
    ) {
        log.info(TracersProxy.name, 'request', method)
        try {
            const request = this.mode === 'proto' ? requestType.encode(requestObject).finish() : requestObject
            const data = (await api.post(method, request, this.requestConfig)).data
            return this.mode === 'proto' ? responseType.decode(data) : responseType.create(data)
        } catch (error) {
            throw new Error(error.response ? error.response.data : error.toString())
        }
    }

    getLanguages(request: protocol.Empty): Promise<protocol.Languages> {
        return this.request(this.api, '/getLanguages', request, protocol.Empty, protocol.Languages)
    }

    getSessions(request: protocol.Empty): Promise<protocol.Sessions> {
        return this.request(this.api, '/getSessions', request, protocol.Empty, protocol.Sessions)
    }

    start(request: protocol.StartRequest): Promise<protocol.StartResponse> {
        return this.request(this.api, '/start', request, protocol.StartRequest, protocol.StartResponse)
    }

    stop(request: protocol.Id): Promise<protocol.Empty> {
        return this.request(this.api, '/stop', request, protocol.Id, protocol.Empty)
    }

    step(request: protocol.Id): Promise<protocol.TracerResponse> {
        return this.request(this.api, '/step', request, protocol.Id, protocol.TracerResponse)
    }

    stepOver(request: protocol.Id): Promise<protocol.TracerResponses> {
        return this.request(this.api, '/stepOver', request, protocol.Id, protocol.TracerResponses)
    }

    stepOut(request: protocol.Id): Promise<protocol.TracerResponses> {
        return this.request(this.api, '/stepOut', request, protocol.Id, protocol.TracerResponses)
    }

    continue(request: protocol.Id): Promise<protocol.TracerResponses> {
        return this.request(this.api, '/continue', request, protocol.Id, protocol.TracerResponses)
    }

    input(request: protocol.InputRequest): Promise<protocol.Empty> {
        return this.request(this.api, '/input', request, protocol.InputRequest, protocol.Empty)
    }

    getBreakpoints(request: protocol.Id): Promise<protocol.Breakpoints> {
        return this.request(this.api, '/getBreakpoints', request, protocol.Id, protocol.Breakpoints)
    }

    setBreakpoints(request: protocol.BreakpointsRequest): Promise<protocol.Empty> {
        return this.request(this.api, '/setBreakpoints', request, protocol.BreakpointsRequest, protocol.Empty)
    }
}
