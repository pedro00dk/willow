import Axios, * as axios from 'axios'
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
            throw new Error(error.toString())
        }
    }

    private async request<T, U>(
        api: axios.AxiosInstance,
        method: string,
        requestObject: T,
        toProto: (request: T) => Uint8Array,
        toJson: (request: T) => {},
        decode: (buffer: Buffer) => U,
        create: (properties: {}) => U
    ) {
        try {
            const request = this.mode === 'proto' ? toProto(requestObject) : toJson(requestObject)
            const response = await api.post(method, request, this.requestConfig)
            return this.mode === 'proto' ? decode(response.data) : create(response.data)
        } catch (error) {
            throw new Error(error.toString())
        }
    }

    getLanguages(request: protocol.Empty): Promise<protocol.Languages> {
        return this.request(
            this.api,
            '/getLanguages',
            request,
            request => protocol.Empty.encodeDelimited(request).finish(),
            request => request,
            buffer => protocol.Languages.decodeDelimited(buffer),
            properties => protocol.Languages.create(properties)
        )
    }

    getSessions(request: protocol.Empty): Promise<protocol.Sessions> {
        return this.request(
            this.api,
            '/getSessions',
            request,
            request => protocol.Empty.encodeDelimited(request).finish(),
            request => request,
            buffer => protocol.Sessions.decodeDelimited(buffer),
            properties => protocol.Sessions.create(properties)
        )
    }

    async start(request: protocol.StartRequest): Promise<protocol.StartResponse> {
        return this.request(
            this.api,
            '/start',
            request,
            request => protocol.StartRequest.encodeDelimited(request).finish(),
            request => request,
            buffer => protocol.StartResponse.decodeDelimited(buffer),
            properties => protocol.StartResponse.create(properties)
        )
    }

    stop(request: protocol.Id): Promise<protocol.Empty> {
        return this.request(
            this.api,
            '/stop',
            request,
            request => protocol.Id.encodeDelimited(request).finish(),
            request => request,
            buffer => protocol.Empty.decodeDelimited(buffer),
            properties => protocol.Empty.create(properties)
        )
    }

    step(request: protocol.Id): Promise<protocol.TracerResponse> {
        return this.request(
            this.api,
            '/step',
            request,
            request => protocol.Id.encodeDelimited(request).finish(),
            request => request,
            buffer => protocol.TracerResponse.decodeDelimited(buffer),
            properties => protocol.TracerResponse.create(properties)
        )
    }

    async stepOver(request: protocol.Id): Promise<protocol.TracerResponses> {
        return this.request(
            this.api,
            '/stepOver',
            request,
            request => protocol.Id.encodeDelimited(request).finish(),
            request => request,
            buffer => protocol.TracerResponses.decodeDelimited(buffer),
            properties => protocol.TracerResponses.create(properties)
        )
    }

    async stepOut(request: protocol.Id): Promise<protocol.TracerResponses> {
        return this.request(
            this.api,
            '/stepOut',
            request,
            request => protocol.Id.encodeDelimited(request).finish(),
            request => request,
            buffer => protocol.TracerResponses.decodeDelimited(buffer),
            properties => protocol.TracerResponses.create(properties)
        )
    }

    async continue(request: protocol.Id): Promise<protocol.TracerResponses> {
        return this.request(
            this.api,
            '/continue',
            request,
            request => protocol.Id.encodeDelimited(request).finish(),
            request => request,
            buffer => protocol.TracerResponses.decodeDelimited(buffer),
            properties => protocol.TracerResponses.create(properties)
        )
    }

    input(request: protocol.InputRequest): Promise<protocol.Empty> {
        return this.request(
            this.api,
            '/input',
            request,
            request => protocol.InputRequest.encodeDelimited(request).finish(),
            request => request,
            buffer => protocol.Empty.decodeDelimited(buffer),
            properties => protocol.Empty.create(properties)
        )
    }

    getBreakpoints(request: protocol.Id): Promise<protocol.Breakpoints> {
        return this.request(
            this.api,
            '/getBreakpoints',
            request,
            request => protocol.Id.encodeDelimited(request).finish(),
            request => request,
            buffer => protocol.Breakpoints.decodeDelimited(buffer),
            properties => protocol.Breakpoints.create(properties)
        )
    }

    setBreakpoints(request: protocol.BreakpointsRequest): Promise<protocol.Empty> {
        return this.request(
            this.api,
            '/setBreakpoints',
            request,
            request => protocol.BreakpointsRequest.encodeDelimited(request).finish(),
            request => request,
            buffer => protocol.Empty.decodeDelimited(buffer),
            properties => protocol.Empty.create(properties)
        )
    }
}
