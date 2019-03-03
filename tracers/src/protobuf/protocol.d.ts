import * as $protobuf from "protobufjs";
/** Properties of a TracerRequest. */
export interface ITracerRequest {

    /** TracerRequest actions */
    actions?: (Action[]|null);
}

/** Represents a TracerRequest. */
export class TracerRequest implements ITracerRequest {

    /**
     * Constructs a new TracerRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: ITracerRequest);

    /** TracerRequest actions. */
    public actions: Action[];

    /**
     * Creates a new TracerRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns TracerRequest instance
     */
    public static create(properties?: ITracerRequest): TracerRequest;

    /**
     * Encodes the specified TracerRequest message. Does not implicitly {@link TracerRequest.verify|verify} messages.
     * @param message TracerRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: TracerRequest, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified TracerRequest message, length delimited. Does not implicitly {@link TracerRequest.verify|verify} messages.
     * @param message TracerRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: TracerRequest, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a TracerRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns TracerRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): TracerRequest;

    /**
     * Decodes a TracerRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns TracerRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): TracerRequest;

    /**
     * Verifies a TracerRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a TracerRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns TracerRequest
     */
    public static fromObject(object: { [k: string]: any }): TracerRequest;

    /**
     * Creates a plain object from a TracerRequest message. Also converts values to other types if specified.
     * @param message TracerRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: TracerRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this TracerRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an Action. */
export interface IAction {

    /** Action create */
    create?: (Action.Create|null);

    /** Action start */
    start?: (Action.Start|null);

    /** Action stop */
    stop?: (Action.Stop|null);

    /** Action step */
    step?: (Action.Stop|null);

    /** Action input */
    input?: (Action.Input|null);
}

/** Represents an Action. */
export class Action implements IAction {

    /**
     * Constructs a new Action.
     * @param [properties] Properties to set
     */
    constructor(properties?: IAction);

    /** Action create. */
    public create?: (Action.Create|null);

    /** Action start. */
    public start?: (Action.Start|null);

    /** Action stop. */
    public stop?: (Action.Stop|null);

    /** Action step. */
    public step?: (Action.Stop|null);

    /** Action input. */
    public input?: (Action.Input|null);

    /** Action action. */
    public action?: ("create"|"start"|"stop"|"step"|"input");

    /**
     * Creates a new Action instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Action instance
     */
    public static create(properties?: IAction): Action;

    /**
     * Encodes the specified Action message. Does not implicitly {@link Action.verify|verify} messages.
     * @param message Action message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: Action, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Action message, length delimited. Does not implicitly {@link Action.verify|verify} messages.
     * @param message Action message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: Action, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Action message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Action
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Action;

    /**
     * Decodes an Action message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Action
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Action;

    /**
     * Verifies an Action message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Action message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Action
     */
    public static fromObject(object: { [k: string]: any }): Action;

    /**
     * Creates a plain object from an Action message. Also converts values to other types if specified.
     * @param message Action
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Action, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Action to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace Action {

    /** Properties of a Create. */
    interface ICreate {

        /** Create main */
        main?: (string|null);

        /** Create code */
        code?: (string|null);

        /** Create tar */
        tar?: (Uint8Array|null);
    }

    /** Represents a Create. */
    class Create implements ICreate {

        /**
         * Constructs a new Create.
         * @param [properties] Properties to set
         */
        constructor(properties?: Action.ICreate);

        /** Create main. */
        public main: string;

        /** Create code. */
        public code: string;

        /** Create tar. */
        public tar: Uint8Array;

        /** Create source. */
        public source?: ("code"|"tar");

        /**
         * Creates a new Create instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Create instance
         */
        public static create(properties?: Action.ICreate): Action.Create;

        /**
         * Encodes the specified Create message. Does not implicitly {@link Action.Create.verify|verify} messages.
         * @param message Create message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Action.Create, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Create message, length delimited. Does not implicitly {@link Action.Create.verify|verify} messages.
         * @param message Create message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Action.Create, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Create message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Create
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Action.Create;

        /**
         * Decodes a Create message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Create
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Action.Create;

        /**
         * Verifies a Create message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Create message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Create
         */
        public static fromObject(object: { [k: string]: any }): Action.Create;

        /**
         * Creates a plain object from a Create message. Also converts values to other types if specified.
         * @param message Create
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Action.Create, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Create to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Start. */
    interface IStart {
    }

    /** Represents a Start. */
    class Start implements IStart {

        /**
         * Constructs a new Start.
         * @param [properties] Properties to set
         */
        constructor(properties?: Action.IStart);

        /**
         * Creates a new Start instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Start instance
         */
        public static create(properties?: Action.IStart): Action.Start;

        /**
         * Encodes the specified Start message. Does not implicitly {@link Action.Start.verify|verify} messages.
         * @param message Start message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Action.Start, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Start message, length delimited. Does not implicitly {@link Action.Start.verify|verify} messages.
         * @param message Start message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Action.Start, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Start message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Start
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Action.Start;

        /**
         * Decodes a Start message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Start
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Action.Start;

        /**
         * Verifies a Start message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Start message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Start
         */
        public static fromObject(object: { [k: string]: any }): Action.Start;

        /**
         * Creates a plain object from a Start message. Also converts values to other types if specified.
         * @param message Start
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Action.Start, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Start to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Stop. */
    interface IStop {
    }

    /** Represents a Stop. */
    class Stop implements IStop {

        /**
         * Constructs a new Stop.
         * @param [properties] Properties to set
         */
        constructor(properties?: Action.IStop);

        /**
         * Creates a new Stop instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Stop instance
         */
        public static create(properties?: Action.IStop): Action.Stop;

        /**
         * Encodes the specified Stop message. Does not implicitly {@link Action.Stop.verify|verify} messages.
         * @param message Stop message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Action.Stop, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Stop message, length delimited. Does not implicitly {@link Action.Stop.verify|verify} messages.
         * @param message Stop message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Action.Stop, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Stop message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Stop
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Action.Stop;

        /**
         * Decodes a Stop message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Stop
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Action.Stop;

        /**
         * Verifies a Stop message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Stop message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Stop
         */
        public static fromObject(object: { [k: string]: any }): Action.Stop;

        /**
         * Creates a plain object from a Stop message. Also converts values to other types if specified.
         * @param message Stop
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Action.Stop, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Stop to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Step. */
    interface IStep {
    }

    /** Represents a Step. */
    class Step implements IStep {

        /**
         * Constructs a new Step.
         * @param [properties] Properties to set
         */
        constructor(properties?: Action.IStep);

        /**
         * Creates a new Step instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Step instance
         */
        public static create(properties?: Action.IStep): Action.Step;

        /**
         * Encodes the specified Step message. Does not implicitly {@link Action.Step.verify|verify} messages.
         * @param message Step message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Action.Step, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Step message, length delimited. Does not implicitly {@link Action.Step.verify|verify} messages.
         * @param message Step message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Action.Step, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Step message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Step
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Action.Step;

        /**
         * Decodes a Step message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Step
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Action.Step;

        /**
         * Verifies a Step message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Step message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Step
         */
        public static fromObject(object: { [k: string]: any }): Action.Step;

        /**
         * Creates a plain object from a Step message. Also converts values to other types if specified.
         * @param message Step
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Action.Step, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Step to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an Input. */
    interface IInput {

        /** Input lines */
        lines?: (string[]|null);
    }

    /** Represents an Input. */
    class Input implements IInput {

        /**
         * Constructs a new Input.
         * @param [properties] Properties to set
         */
        constructor(properties?: Action.IInput);

        /** Input lines. */
        public lines: string[];

        /**
         * Creates a new Input instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Input instance
         */
        public static create(properties?: Action.IInput): Action.Input;

        /**
         * Encodes the specified Input message. Does not implicitly {@link Action.Input.verify|verify} messages.
         * @param message Input message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Action.Input, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Input message, length delimited. Does not implicitly {@link Action.Input.verify|verify} messages.
         * @param message Input message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Action.Input, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Input message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Input
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Action.Input;

        /**
         * Decodes an Input message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Input
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Action.Input;

        /**
         * Verifies an Input message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Input message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Input
         */
        public static fromObject(object: { [k: string]: any }): Action.Input;

        /**
         * Creates a plain object from an Input message. Also converts values to other types if specified.
         * @param message Input
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Action.Input, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Input to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Properties of a TracerResponse. */
export interface ITracerResponse {

    /** TracerResponse results */
    results?: (Result[]|null);
}

/** Represents a TracerResponse. */
export class TracerResponse implements ITracerResponse {

    /**
     * Constructs a new TracerResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: ITracerResponse);

    /** TracerResponse results. */
    public results: Result[];

    /**
     * Creates a new TracerResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns TracerResponse instance
     */
    public static create(properties?: ITracerResponse): TracerResponse;

    /**
     * Encodes the specified TracerResponse message. Does not implicitly {@link TracerResponse.verify|verify} messages.
     * @param message TracerResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: TracerResponse, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified TracerResponse message, length delimited. Does not implicitly {@link TracerResponse.verify|verify} messages.
     * @param message TracerResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: TracerResponse, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a TracerResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns TracerResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): TracerResponse;

    /**
     * Decodes a TracerResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns TracerResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): TracerResponse;

    /**
     * Verifies a TracerResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a TracerResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns TracerResponse
     */
    public static fromObject(object: { [k: string]: any }): TracerResponse;

    /**
     * Creates a plain object from a TracerResponse message. Also converts values to other types if specified.
     * @param message TracerResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: TracerResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this TracerResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a Result. */
export interface IResult {

    /** Result created */
    created?: (Result.Created|null);

    /** Result started */
    started?: (Result.Started|null);

    /** Result frame */
    frame?: (Result.Frame|null);

    /** Result print */
    print?: (Result.Print|null);

    /** Result lock */
    lock?: (Result.Lock|null);

    /** Result error */
    error?: (Result.Error|null);
}

/** Represents a Result. */
export class Result implements IResult {

    /**
     * Constructs a new Result.
     * @param [properties] Properties to set
     */
    constructor(properties?: IResult);

    /** Result created. */
    public created?: (Result.Created|null);

    /** Result started. */
    public started?: (Result.Started|null);

    /** Result frame. */
    public frame?: (Result.Frame|null);

    /** Result print. */
    public print?: (Result.Print|null);

    /** Result lock. */
    public lock?: (Result.Lock|null);

    /** Result error. */
    public error?: (Result.Error|null);

    /** Result result. */
    public result?: ("created"|"started"|"frame"|"print"|"lock"|"error");

    /**
     * Creates a new Result instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Result instance
     */
    public static create(properties?: IResult): Result;

    /**
     * Encodes the specified Result message. Does not implicitly {@link Result.verify|verify} messages.
     * @param message Result message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: Result, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Result message, length delimited. Does not implicitly {@link Result.verify|verify} messages.
     * @param message Result message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: Result, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Result message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Result
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Result;

    /**
     * Decodes a Result message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Result
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Result;

    /**
     * Verifies a Result message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Result message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Result
     */
    public static fromObject(object: { [k: string]: any }): Result;

    /**
     * Creates a plain object from a Result message. Also converts values to other types if specified.
     * @param message Result
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Result, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Result to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace Result {

    /** Properties of a Created. */
    interface ICreated {
    }

    /** Represents a Created. */
    class Created implements ICreated {

        /**
         * Constructs a new Created.
         * @param [properties] Properties to set
         */
        constructor(properties?: Result.ICreated);

        /**
         * Creates a new Created instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Created instance
         */
        public static create(properties?: Result.ICreated): Result.Created;

        /**
         * Encodes the specified Created message. Does not implicitly {@link Result.Created.verify|verify} messages.
         * @param message Created message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Result.Created, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Created message, length delimited. Does not implicitly {@link Result.Created.verify|verify} messages.
         * @param message Created message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Result.Created, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Created message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Created
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Result.Created;

        /**
         * Decodes a Created message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Created
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Result.Created;

        /**
         * Verifies a Created message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Created message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Created
         */
        public static fromObject(object: { [k: string]: any }): Result.Created;

        /**
         * Creates a plain object from a Created message. Also converts values to other types if specified.
         * @param message Created
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Result.Created, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Created to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Started. */
    interface IStarted {
    }

    /** Represents a Started. */
    class Started implements IStarted {

        /**
         * Constructs a new Started.
         * @param [properties] Properties to set
         */
        constructor(properties?: Result.IStarted);

        /**
         * Creates a new Started instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Started instance
         */
        public static create(properties?: Result.IStarted): Result.Started;

        /**
         * Encodes the specified Started message. Does not implicitly {@link Result.Started.verify|verify} messages.
         * @param message Started message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Result.Started, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Started message, length delimited. Does not implicitly {@link Result.Started.verify|verify} messages.
         * @param message Started message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Result.Started, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Started message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Started
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Result.Started;

        /**
         * Decodes a Started message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Started
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Result.Started;

        /**
         * Verifies a Started message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Started message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Started
         */
        public static fromObject(object: { [k: string]: any }): Result.Started;

        /**
         * Creates a plain object from a Started message. Also converts values to other types if specified.
         * @param message Started
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Result.Started, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Started to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Frame. */
    interface IFrame {
    }

    /** Represents a Frame. */
    class Frame implements IFrame {

        /**
         * Constructs a new Frame.
         * @param [properties] Properties to set
         */
        constructor(properties?: Result.IFrame);

        /**
         * Creates a new Frame instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Frame instance
         */
        public static create(properties?: Result.IFrame): Result.Frame;

        /**
         * Encodes the specified Frame message. Does not implicitly {@link Result.Frame.verify|verify} messages.
         * @param message Frame message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Result.Frame, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Frame message, length delimited. Does not implicitly {@link Result.Frame.verify|verify} messages.
         * @param message Frame message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Result.Frame, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Frame message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Frame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Result.Frame;

        /**
         * Decodes a Frame message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Frame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Result.Frame;

        /**
         * Verifies a Frame message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Frame message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Frame
         */
        public static fromObject(object: { [k: string]: any }): Result.Frame;

        /**
         * Creates a plain object from a Frame message. Also converts values to other types if specified.
         * @param message Frame
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Result.Frame, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Frame to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Print. */
    interface IPrint {

        /** Print value */
        value?: (string|null);
    }

    /** Represents a Print. */
    class Print implements IPrint {

        /**
         * Constructs a new Print.
         * @param [properties] Properties to set
         */
        constructor(properties?: Result.IPrint);

        /** Print value. */
        public value: string;

        /**
         * Creates a new Print instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Print instance
         */
        public static create(properties?: Result.IPrint): Result.Print;

        /**
         * Encodes the specified Print message. Does not implicitly {@link Result.Print.verify|verify} messages.
         * @param message Print message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Result.Print, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Print message, length delimited. Does not implicitly {@link Result.Print.verify|verify} messages.
         * @param message Print message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Result.Print, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Print message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Print
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Result.Print;

        /**
         * Decodes a Print message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Print
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Result.Print;

        /**
         * Verifies a Print message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Print message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Print
         */
        public static fromObject(object: { [k: string]: any }): Result.Print;

        /**
         * Creates a plain object from a Print message. Also converts values to other types if specified.
         * @param message Print
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Result.Print, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Print to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Lock. */
    interface ILock {

        /** Lock cause */
        cause?: (string|null);
    }

    /** Represents a Lock. */
    class Lock implements ILock {

        /**
         * Constructs a new Lock.
         * @param [properties] Properties to set
         */
        constructor(properties?: Result.ILock);

        /** Lock cause. */
        public cause: string;

        /**
         * Creates a new Lock instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Lock instance
         */
        public static create(properties?: Result.ILock): Result.Lock;

        /**
         * Encodes the specified Lock message. Does not implicitly {@link Result.Lock.verify|verify} messages.
         * @param message Lock message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Result.Lock, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Lock message, length delimited. Does not implicitly {@link Result.Lock.verify|verify} messages.
         * @param message Lock message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Result.Lock, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Lock message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Lock
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Result.Lock;

        /**
         * Decodes a Lock message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Lock
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Result.Lock;

        /**
         * Verifies a Lock message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Lock message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Lock
         */
        public static fromObject(object: { [k: string]: any }): Result.Lock;

        /**
         * Creates a plain object from a Lock message. Also converts values to other types if specified.
         * @param message Lock
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Result.Lock, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Lock to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an Error. */
    interface IError {

        /** Error source */
        source?: (Result.Error.Source|null);

        /** Error terminal */
        terminal?: (boolean|null);
    }

    /** Represents an Error. */
    class Error implements IError {

        /**
         * Constructs a new Error.
         * @param [properties] Properties to set
         */
        constructor(properties?: Result.IError);

        /** Error source. */
        public source: Result.Error.Source;

        /** Error terminal. */
        public terminal: boolean;

        /**
         * Creates a new Error instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Error instance
         */
        public static create(properties?: Result.IError): Result.Error;

        /**
         * Encodes the specified Error message. Does not implicitly {@link Result.Error.verify|verify} messages.
         * @param message Error message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Result.Error, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Error message, length delimited. Does not implicitly {@link Result.Error.verify|verify} messages.
         * @param message Error message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Result.Error, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Error message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Error
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Result.Error;

        /**
         * Decodes an Error message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Error
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Result.Error;

        /**
         * Verifies an Error message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Error message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Error
         */
        public static fromObject(object: { [k: string]: any }): Result.Error;

        /**
         * Creates a plain object from an Error message. Also converts values to other types if specified.
         * @param message Error
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Result.Error, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Error to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace Error {

        /** Source enum. */
        enum Source {
            TRACER = 0,
            TRACED = 1
        }
    }
}
