import * as $protobuf from "protobufjs";
/** Properties of an Event. */
export interface IEvent {

    /** Event started */
    started?: (Event.Started|null);

    /** Event inspected */
    inspected?: (Event.Inspected|null);

    /** Event printed */
    printed?: (Event.Printed|null);

    /** Event locked */
    locked?: (Event.Locked|null);

    /** Event threw */
    threw?: (Event.Threw|null);
}

/** Represents an Event. */
export class Event implements IEvent {

    /**
     * Constructs a new Event.
     * @param [properties] Properties to set
     */
    constructor(properties?: IEvent);

    /** Event started. */
    public started?: (Event.Started|null);

    /** Event inspected. */
    public inspected?: (Event.Inspected|null);

    /** Event printed. */
    public printed?: (Event.Printed|null);

    /** Event locked. */
    public locked?: (Event.Locked|null);

    /** Event threw. */
    public threw?: (Event.Threw|null);

    /** Event event. */
    public event?: ("started"|"inspected"|"printed"|"locked"|"threw");

    /**
     * Creates a new Event instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Event instance
     */
    public static create(properties?: IEvent): Event;

    /**
     * Encodes the specified Event message. Does not implicitly {@link Event.verify|verify} messages.
     * @param message Event message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: Event, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Event message, length delimited. Does not implicitly {@link Event.verify|verify} messages.
     * @param message Event message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: Event, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Event message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Event
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Event;

    /**
     * Decodes an Event message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Event
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Event;

    /**
     * Verifies an Event message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Event message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Event
     */
    public static fromObject(object: { [k: string]: any }): Event;

    /**
     * Creates a plain object from an Event message. Also converts values to other types if specified.
     * @param message Event
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Event, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Event to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace Event {

    /** Properties of a Started. */
    interface IStarted {
    }

    /** Represents a Started. */
    class Started implements IStarted {

        /**
         * Constructs a new Started.
         * @param [properties] Properties to set
         */
        constructor(properties?: Event.IStarted);

        /**
         * Creates a new Started instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Started instance
         */
        public static create(properties?: Event.IStarted): Event.Started;

        /**
         * Encodes the specified Started message. Does not implicitly {@link Event.Started.verify|verify} messages.
         * @param message Started message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Event.Started, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Started message, length delimited. Does not implicitly {@link Event.Started.verify|verify} messages.
         * @param message Started message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Event.Started, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Started message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Started
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Event.Started;

        /**
         * Decodes a Started message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Started
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Event.Started;

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
        public static fromObject(object: { [k: string]: any }): Event.Started;

        /**
         * Creates a plain object from a Started message. Also converts values to other types if specified.
         * @param message Started
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Event.Started, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Started to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an Inspected. */
    interface IInspected {

        /** Inspected frame */
        frame?: (Frame|null);
    }

    /** Represents an Inspected. */
    class Inspected implements IInspected {

        /**
         * Constructs a new Inspected.
         * @param [properties] Properties to set
         */
        constructor(properties?: Event.IInspected);

        /** Inspected frame. */
        public frame?: (Frame|null);

        /**
         * Creates a new Inspected instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Inspected instance
         */
        public static create(properties?: Event.IInspected): Event.Inspected;

        /**
         * Encodes the specified Inspected message. Does not implicitly {@link Event.Inspected.verify|verify} messages.
         * @param message Inspected message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Event.Inspected, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Inspected message, length delimited. Does not implicitly {@link Event.Inspected.verify|verify} messages.
         * @param message Inspected message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Event.Inspected, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Inspected message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Inspected
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Event.Inspected;

        /**
         * Decodes an Inspected message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Inspected
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Event.Inspected;

        /**
         * Verifies an Inspected message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Inspected message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Inspected
         */
        public static fromObject(object: { [k: string]: any }): Event.Inspected;

        /**
         * Creates a plain object from an Inspected message. Also converts values to other types if specified.
         * @param message Inspected
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Event.Inspected, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Inspected to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Printed. */
    interface IPrinted {

        /** Printed value */
        value?: (string|null);
    }

    /** Represents a Printed. */
    class Printed implements IPrinted {

        /**
         * Constructs a new Printed.
         * @param [properties] Properties to set
         */
        constructor(properties?: Event.IPrinted);

        /** Printed value. */
        public value: string;

        /**
         * Creates a new Printed instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Printed instance
         */
        public static create(properties?: Event.IPrinted): Event.Printed;

        /**
         * Encodes the specified Printed message. Does not implicitly {@link Event.Printed.verify|verify} messages.
         * @param message Printed message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Event.Printed, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Printed message, length delimited. Does not implicitly {@link Event.Printed.verify|verify} messages.
         * @param message Printed message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Event.Printed, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Printed message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Printed
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Event.Printed;

        /**
         * Decodes a Printed message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Printed
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Event.Printed;

        /**
         * Verifies a Printed message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Printed message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Printed
         */
        public static fromObject(object: { [k: string]: any }): Event.Printed;

        /**
         * Creates a plain object from a Printed message. Also converts values to other types if specified.
         * @param message Printed
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Event.Printed, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Printed to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Locked. */
    interface ILocked {

        /** Locked cause */
        cause?: (string|null);
    }

    /** Represents a Locked. */
    class Locked implements ILocked {

        /**
         * Constructs a new Locked.
         * @param [properties] Properties to set
         */
        constructor(properties?: Event.ILocked);

        /** Locked cause. */
        public cause: string;

        /**
         * Creates a new Locked instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Locked instance
         */
        public static create(properties?: Event.ILocked): Event.Locked;

        /**
         * Encodes the specified Locked message. Does not implicitly {@link Event.Locked.verify|verify} messages.
         * @param message Locked message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Event.Locked, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Locked message, length delimited. Does not implicitly {@link Event.Locked.verify|verify} messages.
         * @param message Locked message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Event.Locked, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Locked message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Locked
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Event.Locked;

        /**
         * Decodes a Locked message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Locked
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Event.Locked;

        /**
         * Verifies a Locked message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Locked message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Locked
         */
        public static fromObject(object: { [k: string]: any }): Event.Locked;

        /**
         * Creates a plain object from a Locked message. Also converts values to other types if specified.
         * @param message Locked
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Event.Locked, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Locked to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Threw. */
    interface IThrew {

        /** Threw exception */
        exception?: (Exception|null);
    }

    /** Represents a Threw. */
    class Threw implements IThrew {

        /**
         * Constructs a new Threw.
         * @param [properties] Properties to set
         */
        constructor(properties?: Event.IThrew);

        /** Threw exception. */
        public exception?: (Exception|null);

        /**
         * Creates a new Threw instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Threw instance
         */
        public static create(properties?: Event.IThrew): Event.Threw;

        /**
         * Encodes the specified Threw message. Does not implicitly {@link Event.Threw.verify|verify} messages.
         * @param message Threw message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Event.Threw, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Threw message, length delimited. Does not implicitly {@link Event.Threw.verify|verify} messages.
         * @param message Threw message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Event.Threw, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Threw message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Threw
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Event.Threw;

        /**
         * Decodes a Threw message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Threw
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Event.Threw;

        /**
         * Verifies a Threw message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Threw message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Threw
         */
        public static fromObject(object: { [k: string]: any }): Event.Threw;

        /**
         * Creates a plain object from a Threw message. Also converts values to other types if specified.
         * @param message Threw
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Event.Threw, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Threw to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Properties of an Exception. */
export interface IException {

    /** Exception type */
    type?: (string|null);

    /** Exception args */
    args?: (string[]|null);

    /** Exception traceback */
    traceback?: (string[]|null);
}

/** Represents an Exception. */
export class Exception implements IException {

    /**
     * Constructs a new Exception.
     * @param [properties] Properties to set
     */
    constructor(properties?: IException);

    /** Exception type. */
    public type: string;

    /** Exception args. */
    public args: string[];

    /** Exception traceback. */
    public traceback: string[];

    /**
     * Creates a new Exception instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Exception instance
     */
    public static create(properties?: IException): Exception;

    /**
     * Encodes the specified Exception message. Does not implicitly {@link Exception.verify|verify} messages.
     * @param message Exception message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: Exception, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Exception message, length delimited. Does not implicitly {@link Exception.verify|verify} messages.
     * @param message Exception message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: Exception, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Exception message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Exception
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Exception;

    /**
     * Decodes an Exception message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Exception
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Exception;

    /**
     * Verifies an Exception message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Exception message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Exception
     */
    public static fromObject(object: { [k: string]: any }): Exception;

    /**
     * Creates a plain object from an Exception message. Also converts values to other types if specified.
     * @param message Exception
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Exception, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Exception to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a Frame. */
export interface IFrame {

    /** Frame type */
    type?: (Frame.Type|null);

    /** Frame line */
    line?: (number|null);

    /** Frame finish */
    finish?: (boolean|null);

    /** Frame exception */
    exception?: (Exception|null);

    /** Frame stack */
    stack?: (Frame.Stack|null);

    /** Frame heap */
    heap?: (Frame.Heap|null);
}

/** Represents a Frame. */
export class Frame implements IFrame {

    /**
     * Constructs a new Frame.
     * @param [properties] Properties to set
     */
    constructor(properties?: IFrame);

    /** Frame type. */
    public type: Frame.Type;

    /** Frame line. */
    public line: number;

    /** Frame finish. */
    public finish: boolean;

    /** Frame exception. */
    public exception?: (Exception|null);

    /** Frame stack. */
    public stack?: (Frame.Stack|null);

    /** Frame heap. */
    public heap?: (Frame.Heap|null);

    /**
     * Creates a new Frame instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Frame instance
     */
    public static create(properties?: IFrame): Frame;

    /**
     * Encodes the specified Frame message. Does not implicitly {@link Frame.verify|verify} messages.
     * @param message Frame message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: Frame, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Frame message, length delimited. Does not implicitly {@link Frame.verify|verify} messages.
     * @param message Frame message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: Frame, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Frame message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Frame
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Frame;

    /**
     * Decodes a Frame message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Frame
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Frame;

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
    public static fromObject(object: { [k: string]: any }): Frame;

    /**
     * Creates a plain object from a Frame message. Also converts values to other types if specified.
     * @param message Frame
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Frame, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Frame to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace Frame {

    /** Type enum. */
    enum Type {
        LINE = 0,
        CALL = 1,
        RETURN = 2,
        EXCEPTION = 3
    }

    /** Properties of a Value. */
    interface IValue {

        /** Value booleanValue */
        booleanValue?: (boolean|null);

        /** Value integerValue */
        integerValue?: (number|Long|null);

        /** Value floatValue */
        floatValue?: (number|null);

        /** Value stringValue */
        stringValue?: (string|null);

        /** Value reference */
        reference?: (number|Long|null);
    }

    /** Represents a Value. */
    class Value implements IValue {

        /**
         * Constructs a new Value.
         * @param [properties] Properties to set
         */
        constructor(properties?: Frame.IValue);

        /** Value booleanValue. */
        public booleanValue: boolean;

        /** Value integerValue. */
        public integerValue: (number|Long);

        /** Value floatValue. */
        public floatValue: number;

        /** Value stringValue. */
        public stringValue: string;

        /** Value reference. */
        public reference: (number|Long);

        /** Value value. */
        public value?: ("booleanValue"|"integerValue"|"floatValue"|"stringValue"|"reference");

        /**
         * Creates a new Value instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Value instance
         */
        public static create(properties?: Frame.IValue): Frame.Value;

        /**
         * Encodes the specified Value message. Does not implicitly {@link Frame.Value.verify|verify} messages.
         * @param message Value message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Frame.Value, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Value message, length delimited. Does not implicitly {@link Frame.Value.verify|verify} messages.
         * @param message Value message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Frame.Value, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Value message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Value
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Frame.Value;

        /**
         * Decodes a Value message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Value
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Frame.Value;

        /**
         * Verifies a Value message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Value message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Value
         */
        public static fromObject(object: { [k: string]: any }): Frame.Value;

        /**
         * Creates a plain object from a Value message. Also converts values to other types if specified.
         * @param message Value
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Frame.Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Value to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Stack. */
    interface IStack {

        /** Stack scopes */
        scopes?: (Frame.Stack.Scope[]|null);
    }

    /** Represents a Stack. */
    class Stack implements IStack {

        /**
         * Constructs a new Stack.
         * @param [properties] Properties to set
         */
        constructor(properties?: Frame.IStack);

        /** Stack scopes. */
        public scopes: Frame.Stack.Scope[];

        /**
         * Creates a new Stack instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Stack instance
         */
        public static create(properties?: Frame.IStack): Frame.Stack;

        /**
         * Encodes the specified Stack message. Does not implicitly {@link Frame.Stack.verify|verify} messages.
         * @param message Stack message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Frame.Stack, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Stack message, length delimited. Does not implicitly {@link Frame.Stack.verify|verify} messages.
         * @param message Stack message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Frame.Stack, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Stack message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Stack
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Frame.Stack;

        /**
         * Decodes a Stack message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Stack
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Frame.Stack;

        /**
         * Verifies a Stack message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Stack message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Stack
         */
        public static fromObject(object: { [k: string]: any }): Frame.Stack;

        /**
         * Creates a plain object from a Stack message. Also converts values to other types if specified.
         * @param message Stack
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Frame.Stack, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Stack to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace Stack {

        /** Properties of a Scope. */
        interface IScope {

            /** Scope line */
            line?: (number|null);

            /** Scope name */
            name?: (string|null);

            /** Scope variables */
            variables?: (Frame.Stack.Scope.Variable[]|null);
        }

        /** Represents a Scope. */
        class Scope implements IScope {

            /**
             * Constructs a new Scope.
             * @param [properties] Properties to set
             */
            constructor(properties?: Frame.Stack.IScope);

            /** Scope line. */
            public line: number;

            /** Scope name. */
            public name: string;

            /** Scope variables. */
            public variables: Frame.Stack.Scope.Variable[];

            /**
             * Creates a new Scope instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Scope instance
             */
            public static create(properties?: Frame.Stack.IScope): Frame.Stack.Scope;

            /**
             * Encodes the specified Scope message. Does not implicitly {@link Frame.Stack.Scope.verify|verify} messages.
             * @param message Scope message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: Frame.Stack.Scope, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Scope message, length delimited. Does not implicitly {@link Frame.Stack.Scope.verify|verify} messages.
             * @param message Scope message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: Frame.Stack.Scope, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Scope message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Scope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Frame.Stack.Scope;

            /**
             * Decodes a Scope message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Scope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Frame.Stack.Scope;

            /**
             * Verifies a Scope message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Scope message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Scope
             */
            public static fromObject(object: { [k: string]: any }): Frame.Stack.Scope;

            /**
             * Creates a plain object from a Scope message. Also converts values to other types if specified.
             * @param message Scope
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: Frame.Stack.Scope, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Scope to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace Scope {

            /** Properties of a Variable. */
            interface IVariable {

                /** Variable name */
                name?: (string|null);

                /** Variable value */
                value?: (Frame.Value|null);
            }

            /** Represents a Variable. */
            class Variable implements IVariable {

                /**
                 * Constructs a new Variable.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: Frame.Stack.Scope.IVariable);

                /** Variable name. */
                public name: string;

                /** Variable value. */
                public value?: (Frame.Value|null);

                /**
                 * Creates a new Variable instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Variable instance
                 */
                public static create(properties?: Frame.Stack.Scope.IVariable): Frame.Stack.Scope.Variable;

                /**
                 * Encodes the specified Variable message. Does not implicitly {@link Frame.Stack.Scope.Variable.verify|verify} messages.
                 * @param message Variable message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: Frame.Stack.Scope.Variable, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Variable message, length delimited. Does not implicitly {@link Frame.Stack.Scope.Variable.verify|verify} messages.
                 * @param message Variable message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: Frame.Stack.Scope.Variable, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Variable message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Variable
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Frame.Stack.Scope.Variable;

                /**
                 * Decodes a Variable message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Variable
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Frame.Stack.Scope.Variable;

                /**
                 * Verifies a Variable message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Variable message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Variable
                 */
                public static fromObject(object: { [k: string]: any }): Frame.Stack.Scope.Variable;

                /**
                 * Creates a plain object from a Variable message. Also converts values to other types if specified.
                 * @param message Variable
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: Frame.Stack.Scope.Variable, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Variable to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }
    }

    /** Properties of a Heap. */
    interface IHeap {

        /** Heap references */
        references?: ({ [k: string]: Frame.Heap.Obj }|null);
    }

    /** Represents a Heap. */
    class Heap implements IHeap {

        /**
         * Constructs a new Heap.
         * @param [properties] Properties to set
         */
        constructor(properties?: Frame.IHeap);

        /** Heap references. */
        public references: { [k: string]: Frame.Heap.Obj };

        /**
         * Creates a new Heap instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Heap instance
         */
        public static create(properties?: Frame.IHeap): Frame.Heap;

        /**
         * Encodes the specified Heap message. Does not implicitly {@link Frame.Heap.verify|verify} messages.
         * @param message Heap message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Frame.Heap, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Heap message, length delimited. Does not implicitly {@link Frame.Heap.verify|verify} messages.
         * @param message Heap message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Frame.Heap, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Heap message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Heap
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Frame.Heap;

        /**
         * Decodes a Heap message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Heap
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Frame.Heap;

        /**
         * Verifies a Heap message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Heap message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Heap
         */
        public static fromObject(object: { [k: string]: any }): Frame.Heap;

        /**
         * Creates a plain object from a Heap message. Also converts values to other types if specified.
         * @param message Heap
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Frame.Heap, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Heap to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace Heap {

        /** Properties of an Obj. */
        interface IObj {

            /** Obj type */
            type?: (Frame.Heap.Obj.Type|null);

            /** Obj lType */
            lType?: (string|null);

            /** Obj userDefined */
            userDefined?: (boolean|null);

            /** Obj members */
            members?: (Frame.Heap.Obj.Member[]|null);
        }

        /** Represents an Obj. */
        class Obj implements IObj {

            /**
             * Constructs a new Obj.
             * @param [properties] Properties to set
             */
            constructor(properties?: Frame.Heap.IObj);

            /** Obj type. */
            public type: Frame.Heap.Obj.Type;

            /** Obj lType. */
            public lType: string;

            /** Obj userDefined. */
            public userDefined: boolean;

            /** Obj members. */
            public members: Frame.Heap.Obj.Member[];

            /**
             * Creates a new Obj instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Obj instance
             */
            public static create(properties?: Frame.Heap.IObj): Frame.Heap.Obj;

            /**
             * Encodes the specified Obj message. Does not implicitly {@link Frame.Heap.Obj.verify|verify} messages.
             * @param message Obj message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: Frame.Heap.Obj, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Obj message, length delimited. Does not implicitly {@link Frame.Heap.Obj.verify|verify} messages.
             * @param message Obj message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: Frame.Heap.Obj, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Obj message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Obj
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Frame.Heap.Obj;

            /**
             * Decodes an Obj message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Obj
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Frame.Heap.Obj;

            /**
             * Verifies an Obj message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Obj message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Obj
             */
            public static fromObject(object: { [k: string]: any }): Frame.Heap.Obj;

            /**
             * Creates a plain object from an Obj message. Also converts values to other types if specified.
             * @param message Obj
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: Frame.Heap.Obj, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Obj to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace Obj {

            /** Type enum. */
            enum Type {
                ARRAY = 0,
                TUPLE = 1,
                ALIST = 2,
                LLIST = 3,
                HMAP = 4,
                TMAP = 5,
                SET = 6,
                OTHER = 7
            }

            /** Properties of a Member. */
            interface IMember {

                /** Member key */
                key?: (Frame.Value|null);

                /** Member value */
                value?: (Frame.Value|null);
            }

            /** Represents a Member. */
            class Member implements IMember {

                /**
                 * Constructs a new Member.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: Frame.Heap.Obj.IMember);

                /** Member key. */
                public key?: (Frame.Value|null);

                /** Member value. */
                public value?: (Frame.Value|null);

                /**
                 * Creates a new Member instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Member instance
                 */
                public static create(properties?: Frame.Heap.Obj.IMember): Frame.Heap.Obj.Member;

                /**
                 * Encodes the specified Member message. Does not implicitly {@link Frame.Heap.Obj.Member.verify|verify} messages.
                 * @param message Member message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: Frame.Heap.Obj.Member, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Member message, length delimited. Does not implicitly {@link Frame.Heap.Obj.Member.verify|verify} messages.
                 * @param message Member message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: Frame.Heap.Obj.Member, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Member message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Member
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Frame.Heap.Obj.Member;

                /**
                 * Decodes a Member message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Member
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Frame.Heap.Obj.Member;

                /**
                 * Verifies a Member message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Member message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Member
                 */
                public static fromObject(object: { [k: string]: any }): Frame.Heap.Obj.Member;

                /**
                 * Creates a plain object from a Member message. Also converts values to other types if specified.
                 * @param message Member
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: Frame.Heap.Obj.Member, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Member to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }
    }
}

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

    /** Action start */
    start?: (Action.Start|null);

    /** Action stop */
    stop?: (Action.Stop|null);

    /** Action step */
    step?: (Action.Step|null);

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

    /** Action start. */
    public start?: (Action.Start|null);

    /** Action stop. */
    public stop?: (Action.Stop|null);

    /** Action step. */
    public step?: (Action.Step|null);

    /** Action input. */
    public input?: (Action.Input|null);

    /** Action action. */
    public action?: ("start"|"stop"|"step"|"input");

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

    /** Properties of a Start. */
    interface IStart {

        /** Start main */
        main?: (string|null);

        /** Start code */
        code?: (string|null);

        /** Start tar */
        tar?: (Uint8Array|null);
    }

    /** Represents a Start. */
    class Start implements IStart {

        /**
         * Constructs a new Start.
         * @param [properties] Properties to set
         */
        constructor(properties?: Action.IStart);

        /** Start main. */
        public main: string;

        /** Start code. */
        public code: string;

        /** Start tar. */
        public tar: Uint8Array;

        /** Start source. */
        public source?: ("code"|"tar");

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

    /** TracerResponse events */
    events?: (Event[]|null);
}

/** Represents a TracerResponse. */
export class TracerResponse implements ITracerResponse {

    /**
     * Constructs a new TracerResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: ITracerResponse);

    /** TracerResponse events. */
    public events: Event[];

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

/** Properties of an Empty. */
export interface IEmpty {
}

/** Represents an Empty. */
export class Empty implements IEmpty {

    /**
     * Constructs a new Empty.
     * @param [properties] Properties to set
     */
    constructor(properties?: IEmpty);

    /**
     * Creates a new Empty instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Empty instance
     */
    public static create(properties?: IEmpty): Empty;

    /**
     * Encodes the specified Empty message. Does not implicitly {@link Empty.verify|verify} messages.
     * @param message Empty message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: Empty, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Empty message, length delimited. Does not implicitly {@link Empty.verify|verify} messages.
     * @param message Empty message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: Empty, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Empty message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Empty
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Empty;

    /**
     * Decodes an Empty message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Empty
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Empty;

    /**
     * Verifies an Empty message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Empty message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Empty
     */
    public static fromObject(object: { [k: string]: any }): Empty;

    /**
     * Creates a plain object from an Empty message. Also converts values to other types if specified.
     * @param message Empty
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Empty, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Empty to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a Languages. */
export interface ILanguages {

    /** Languages languages */
    languages?: (string[]|null);
}

/** Represents a Languages. */
export class Languages implements ILanguages {

    /**
     * Constructs a new Languages.
     * @param [properties] Properties to set
     */
    constructor(properties?: ILanguages);

    /** Languages languages. */
    public languages: string[];

    /**
     * Creates a new Languages instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Languages instance
     */
    public static create(properties?: ILanguages): Languages;

    /**
     * Encodes the specified Languages message. Does not implicitly {@link Languages.verify|verify} messages.
     * @param message Languages message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: Languages, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Languages message, length delimited. Does not implicitly {@link Languages.verify|verify} messages.
     * @param message Languages message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: Languages, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Languages message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Languages
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Languages;

    /**
     * Decodes a Languages message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Languages
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Languages;

    /**
     * Verifies a Languages message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Languages message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Languages
     */
    public static fromObject(object: { [k: string]: any }): Languages;

    /**
     * Creates a plain object from a Languages message. Also converts values to other types if specified.
     * @param message Languages
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Languages, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Languages to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a Sessions. */
export interface ISessions {

    /** Sessions sessions */
    sessions?: (Session[]|null);
}

/** Represents a Sessions. */
export class Sessions implements ISessions {

    /**
     * Constructs a new Sessions.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISessions);

    /** Sessions sessions. */
    public sessions: Session[];

    /**
     * Creates a new Sessions instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Sessions instance
     */
    public static create(properties?: ISessions): Sessions;

    /**
     * Encodes the specified Sessions message. Does not implicitly {@link Sessions.verify|verify} messages.
     * @param message Sessions message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: Sessions, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Sessions message, length delimited. Does not implicitly {@link Sessions.verify|verify} messages.
     * @param message Sessions message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: Sessions, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Sessions message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Sessions
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Sessions;

    /**
     * Decodes a Sessions message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Sessions
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Sessions;

    /**
     * Verifies a Sessions message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Sessions message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Sessions
     */
    public static fromObject(object: { [k: string]: any }): Sessions;

    /**
     * Creates a plain object from a Sessions message. Also converts values to other types if specified.
     * @param message Sessions
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Sessions, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Sessions to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a Session. */
export interface ISession {

    /** Session id */
    id?: (Id|null);

    /** Session language */
    language?: (string|null);
}

/** Represents a Session. */
export class Session implements ISession {

    /**
     * Constructs a new Session.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISession);

    /** Session id. */
    public id?: (Id|null);

    /** Session language. */
    public language: string;

    /**
     * Creates a new Session instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Session instance
     */
    public static create(properties?: ISession): Session;

    /**
     * Encodes the specified Session message. Does not implicitly {@link Session.verify|verify} messages.
     * @param message Session message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: Session, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Session message, length delimited. Does not implicitly {@link Session.verify|verify} messages.
     * @param message Session message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: Session, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Session message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Session
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Session;

    /**
     * Decodes a Session message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Session
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Session;

    /**
     * Verifies a Session message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Session message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Session
     */
    public static fromObject(object: { [k: string]: any }): Session;

    /**
     * Creates a plain object from a Session message. Also converts values to other types if specified.
     * @param message Session
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Session, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Session to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an Id. */
export interface IId {

    /** Id number */
    number?: (number|null);
}

/** Represents an Id. */
export class Id implements IId {

    /**
     * Constructs a new Id.
     * @param [properties] Properties to set
     */
    constructor(properties?: IId);

    /** Id number. */
    public number: number;

    /**
     * Creates a new Id instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Id instance
     */
    public static create(properties?: IId): Id;

    /**
     * Encodes the specified Id message. Does not implicitly {@link Id.verify|verify} messages.
     * @param message Id message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: Id, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Id message, length delimited. Does not implicitly {@link Id.verify|verify} messages.
     * @param message Id message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: Id, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Id message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Id
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Id;

    /**
     * Decodes an Id message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Id
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Id;

    /**
     * Verifies an Id message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Id message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Id
     */
    public static fromObject(object: { [k: string]: any }): Id;

    /**
     * Creates a plain object from an Id message. Also converts values to other types if specified.
     * @param message Id
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Id, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Id to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a StartResponse. */
export interface IStartResponse {

    /** StartResponse session */
    session?: (Session|null);

    /** StartResponse response */
    response?: (TracerResponse|null);
}

/** Represents a StartResponse. */
export class StartResponse implements IStartResponse {

    /**
     * Constructs a new StartResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: IStartResponse);

    /** StartResponse session. */
    public session?: (Session|null);

    /** StartResponse response. */
    public response?: (TracerResponse|null);

    /**
     * Creates a new StartResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns StartResponse instance
     */
    public static create(properties?: IStartResponse): StartResponse;

    /**
     * Encodes the specified StartResponse message. Does not implicitly {@link StartResponse.verify|verify} messages.
     * @param message StartResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: StartResponse, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified StartResponse message, length delimited. Does not implicitly {@link StartResponse.verify|verify} messages.
     * @param message StartResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: StartResponse, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a StartResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns StartResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): StartResponse;

    /**
     * Decodes a StartResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns StartResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): StartResponse;

    /**
     * Verifies a StartResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a StartResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns StartResponse
     */
    public static fromObject(object: { [k: string]: any }): StartResponse;

    /**
     * Creates a plain object from a StartResponse message. Also converts values to other types if specified.
     * @param message StartResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: StartResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this StartResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a Breakpoints. */
export interface IBreakpoints {

    /** Breakpoints lines */
    lines?: (number[]|null);
}

/** Represents a Breakpoints. */
export class Breakpoints implements IBreakpoints {

    /**
     * Constructs a new Breakpoints.
     * @param [properties] Properties to set
     */
    constructor(properties?: IBreakpoints);

    /** Breakpoints lines. */
    public lines: number[];

    /**
     * Creates a new Breakpoints instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Breakpoints instance
     */
    public static create(properties?: IBreakpoints): Breakpoints;

    /**
     * Encodes the specified Breakpoints message. Does not implicitly {@link Breakpoints.verify|verify} messages.
     * @param message Breakpoints message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: Breakpoints, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Breakpoints message, length delimited. Does not implicitly {@link Breakpoints.verify|verify} messages.
     * @param message Breakpoints message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: Breakpoints, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Breakpoints message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Breakpoints
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Breakpoints;

    /**
     * Decodes a Breakpoints message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Breakpoints
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Breakpoints;

    /**
     * Verifies a Breakpoints message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Breakpoints message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Breakpoints
     */
    public static fromObject(object: { [k: string]: any }): Breakpoints;

    /**
     * Creates a plain object from a Breakpoints message. Also converts values to other types if specified.
     * @param message Breakpoints
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Breakpoints, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Breakpoints to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Represents a Tracers */
export class Tracers extends $protobuf.rpc.Service {

    /**
     * Constructs a new Tracers service.
     * @param rpcImpl RPC implementation
     * @param [requestDelimited=false] Whether requests are length-delimited
     * @param [responseDelimited=false] Whether responses are length-delimited
     */
    constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

    /**
     * Creates new Tracers service using the specified rpc implementation.
     * @param rpcImpl RPC implementation
     * @param [requestDelimited=false] Whether requests are length-delimited
     * @param [responseDelimited=false] Whether responses are length-delimited
     * @returns RPC service. Useful where requests and/or responses are streamed.
     */
    public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): Tracers;

    /**
     * Calls getLanguages.
     * @param request Empty message or plain object
     * @param callback Node-style callback called with the error, if any, and Languages
     */
    public getLanguages(request: Empty, callback: Tracers.getLanguagesCallback): void;

    /**
     * Calls getLanguages.
     * @param request Empty message or plain object
     * @returns Promise
     */
    public getLanguages(request: Empty): Promise<Languages>;

    /**
     * Calls getSessions.
     * @param request Empty message or plain object
     * @param callback Node-style callback called with the error, if any, and Sessions
     */
    public getSessions(request: Empty, callback: Tracers.getSessionsCallback): void;

    /**
     * Calls getSessions.
     * @param request Empty message or plain object
     * @returns Promise
     */
    public getSessions(request: Empty): Promise<Sessions>;

    /**
     * Calls start.
     * @param request Start message or plain object
     * @param callback Node-style callback called with the error, if any, and StartResponse
     */
    public start(request: Action.Start, callback: Tracers.startCallback): void;

    /**
     * Calls start.
     * @param request Start message or plain object
     * @returns Promise
     */
    public start(request: Action.Start): Promise<StartResponse>;

    /**
     * Calls stop.
     * @param request Id message or plain object
     * @param callback Node-style callback called with the error, if any, and Empty
     */
    public stop(request: Id, callback: Tracers.stopCallback): void;

    /**
     * Calls stop.
     * @param request Id message or plain object
     * @returns Promise
     */
    public stop(request: Id): Promise<Empty>;

    /**
     * Calls step.
     * @param request Id message or plain object
     * @param callback Node-style callback called with the error, if any, and TracerResponse
     */
    public step(request: Id, callback: Tracers.stepCallback): void;

    /**
     * Calls step.
     * @param request Id message or plain object
     * @returns Promise
     */
    public step(request: Id): Promise<TracerResponse>;

    /**
     * Calls stepOver.
     * @param request Id message or plain object
     * @param callback Node-style callback called with the error, if any, and TracerResponse
     */
    public stepOver(request: Id, callback: Tracers.stepOverCallback): void;

    /**
     * Calls stepOver.
     * @param request Id message or plain object
     * @returns Promise
     */
    public stepOver(request: Id): Promise<TracerResponse>;

    /**
     * Calls stepOut.
     * @param request Id message or plain object
     * @param callback Node-style callback called with the error, if any, and TracerResponse
     */
    public stepOut(request: Id, callback: Tracers.stepOutCallback): void;

    /**
     * Calls stepOut.
     * @param request Id message or plain object
     * @returns Promise
     */
    public stepOut(request: Id): Promise<TracerResponse>;

    /**
     * Calls continue.
     * @param request Id message or plain object
     * @param callback Node-style callback called with the error, if any, and TracerResponse
     */
    public continue(request: Id, callback: Tracers.continueCallback): void;

    /**
     * Calls continue.
     * @param request Id message or plain object
     * @returns Promise
     */
    public continue(request: Id): Promise<TracerResponse>;

    /**
     * Calls input.
     * @param request Input message or plain object
     * @param callback Node-style callback called with the error, if any, and Empty
     */
    public input(request: Action.Input, callback: Tracers.inputCallback): void;

    /**
     * Calls input.
     * @param request Input message or plain object
     * @returns Promise
     */
    public input(request: Action.Input): Promise<Empty>;

    /**
     * Calls getBreakpoints.
     * @param request Empty message or plain object
     * @param callback Node-style callback called with the error, if any, and Breakpoints
     */
    public getBreakpoints(request: Empty, callback: Tracers.getBreakpointsCallback): void;

    /**
     * Calls getBreakpoints.
     * @param request Empty message or plain object
     * @returns Promise
     */
    public getBreakpoints(request: Empty): Promise<Breakpoints>;

    /**
     * Calls setBreakpoints.
     * @param request Breakpoints message or plain object
     * @param callback Node-style callback called with the error, if any, and Empty
     */
    public setBreakpoints(request: Breakpoints, callback: Tracers.setBreakpointsCallback): void;

    /**
     * Calls setBreakpoints.
     * @param request Breakpoints message or plain object
     * @returns Promise
     */
    public setBreakpoints(request: Breakpoints): Promise<Empty>;
}

export namespace Tracers {

    /**
     * Callback as used by {@link Tracers#getLanguages}.
     * @param error Error, if any
     * @param [response] Languages
     */
    type getLanguagesCallback = (error: (Error|null), response?: Languages) => void;

    /**
     * Callback as used by {@link Tracers#getSessions}.
     * @param error Error, if any
     * @param [response] Sessions
     */
    type getSessionsCallback = (error: (Error|null), response?: Sessions) => void;

    /**
     * Callback as used by {@link Tracers#start}.
     * @param error Error, if any
     * @param [response] StartResponse
     */
    type startCallback = (error: (Error|null), response?: StartResponse) => void;

    /**
     * Callback as used by {@link Tracers#stop}.
     * @param error Error, if any
     * @param [response] Empty
     */
    type stopCallback = (error: (Error|null), response?: Empty) => void;

    /**
     * Callback as used by {@link Tracers#step}.
     * @param error Error, if any
     * @param [response] TracerResponse
     */
    type stepCallback = (error: (Error|null), response?: TracerResponse) => void;

    /**
     * Callback as used by {@link Tracers#stepOver}.
     * @param error Error, if any
     * @param [response] TracerResponse
     */
    type stepOverCallback = (error: (Error|null), response?: TracerResponse) => void;

    /**
     * Callback as used by {@link Tracers#stepOut}.
     * @param error Error, if any
     * @param [response] TracerResponse
     */
    type stepOutCallback = (error: (Error|null), response?: TracerResponse) => void;

    /**
     * Callback as used by {@link Tracers#continue_}.
     * @param error Error, if any
     * @param [response] TracerResponse
     */
    type continueCallback = (error: (Error|null), response?: TracerResponse) => void;

    /**
     * Callback as used by {@link Tracers#input}.
     * @param error Error, if any
     * @param [response] Empty
     */
    type inputCallback = (error: (Error|null), response?: Empty) => void;

    /**
     * Callback as used by {@link Tracers#getBreakpoints}.
     * @param error Error, if any
     * @param [response] Breakpoints
     */
    type getBreakpointsCallback = (error: (Error|null), response?: Breakpoints) => void;

    /**
     * Callback as used by {@link Tracers#setBreakpoints}.
     * @param error Error, if any
     * @param [response] Empty
     */
    type setBreakpointsCallback = (error: (Error|null), response?: Empty) => void;
}
