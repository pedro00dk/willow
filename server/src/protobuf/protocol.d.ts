import * as $protobuf from "protobufjs";
/** Properties of a Step. */
export interface IStep {

    /** Step snapshot */
    snapshot?: (Snapshot|null);

    /** Step threw */
    threw?: (Threw|null);

    /** Step prints */
    prints?: (string[]|null);
}

/** Represents a Step. */
export class Step implements IStep {

    /**
     * Constructs a new Step.
     * @param [properties] Properties to set
     */
    constructor(properties?: IStep);

    /** Step snapshot. */
    public snapshot?: (Snapshot|null);

    /** Step threw. */
    public threw?: (Threw|null);

    /** Step prints. */
    public prints: string[];

    /**
     * Creates a new Step instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Step instance
     */
    public static create(properties?: IStep): Step;

    /**
     * Encodes the specified Step message. Does not implicitly {@link Step.verify|verify} messages.
     * @param message Step message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: Step, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Step message, length delimited. Does not implicitly {@link Step.verify|verify} messages.
     * @param message Step message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: Step, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Step message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Step
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Step;

    /**
     * Decodes a Step message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Step
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Step;

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
    public static fromObject(object: { [k: string]: any }): Step;

    /**
     * Creates a plain object from a Step message. Also converts values to other types if specified.
     * @param message Step
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Step, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Step to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a Snapshot. */
export interface ISnapshot {

    /** Snapshot type */
    type?: (Snapshot.Type|null);

    /** Snapshot finish */
    finish?: (boolean|null);

    /** Snapshot exception */
    exception?: (Exception|null);

    /** Snapshot stack */
    stack?: (Scope[]|null);

    /** Snapshot heap */
    heap?: ({ [k: string]: Obj }|null);
}

/** Represents a Snapshot. */
export class Snapshot implements ISnapshot {

    /**
     * Constructs a new Snapshot.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISnapshot);

    /** Snapshot type. */
    public type: Snapshot.Type;

    /** Snapshot finish. */
    public finish: boolean;

    /** Snapshot exception. */
    public exception?: (Exception|null);

    /** Snapshot stack. */
    public stack: Scope[];

    /** Snapshot heap. */
    public heap: { [k: string]: Obj };

    /**
     * Creates a new Snapshot instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Snapshot instance
     */
    public static create(properties?: ISnapshot): Snapshot;

    /**
     * Encodes the specified Snapshot message. Does not implicitly {@link Snapshot.verify|verify} messages.
     * @param message Snapshot message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: Snapshot, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Snapshot message, length delimited. Does not implicitly {@link Snapshot.verify|verify} messages.
     * @param message Snapshot message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: Snapshot, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Snapshot message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Snapshot
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Snapshot;

    /**
     * Decodes a Snapshot message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Snapshot
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Snapshot;

    /**
     * Verifies a Snapshot message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Snapshot message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Snapshot
     */
    public static fromObject(object: { [k: string]: any }): Snapshot;

    /**
     * Creates a plain object from a Snapshot message. Also converts values to other types if specified.
     * @param message Snapshot
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Snapshot, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Snapshot to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace Snapshot {

    /** Type enum. */
    enum Type {
        LINE = 0,
        CALL = 1,
        RETURN = 2,
        EXCEPTION = 3
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

/** Properties of a Scope. */
export interface IScope {

    /** Scope line */
    line?: (number|null);

    /** Scope name */
    name?: (string|null);

    /** Scope variables */
    variables?: (Variable[]|null);
}

/** Represents a Scope. */
export class Scope implements IScope {

    /**
     * Constructs a new Scope.
     * @param [properties] Properties to set
     */
    constructor(properties?: IScope);

    /** Scope line. */
    public line: number;

    /** Scope name. */
    public name: string;

    /** Scope variables. */
    public variables: Variable[];

    /**
     * Creates a new Scope instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Scope instance
     */
    public static create(properties?: IScope): Scope;

    /**
     * Encodes the specified Scope message. Does not implicitly {@link Scope.verify|verify} messages.
     * @param message Scope message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: Scope, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Scope message, length delimited. Does not implicitly {@link Scope.verify|verify} messages.
     * @param message Scope message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: Scope, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Scope message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Scope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Scope;

    /**
     * Decodes a Scope message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Scope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Scope;

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
    public static fromObject(object: { [k: string]: any }): Scope;

    /**
     * Creates a plain object from a Scope message. Also converts values to other types if specified.
     * @param message Scope
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Scope, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Scope to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a Variable. */
export interface IVariable {

    /** Variable name */
    name?: (string|null);

    /** Variable value */
    value?: (Value|null);
}

/** Represents a Variable. */
export class Variable implements IVariable {

    /**
     * Constructs a new Variable.
     * @param [properties] Properties to set
     */
    constructor(properties?: IVariable);

    /** Variable name. */
    public name: string;

    /** Variable value. */
    public value?: (Value|null);

    /**
     * Creates a new Variable instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Variable instance
     */
    public static create(properties?: IVariable): Variable;

    /**
     * Encodes the specified Variable message. Does not implicitly {@link Variable.verify|verify} messages.
     * @param message Variable message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: Variable, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Variable message, length delimited. Does not implicitly {@link Variable.verify|verify} messages.
     * @param message Variable message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: Variable, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Variable message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Variable
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Variable;

    /**
     * Decodes a Variable message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Variable
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Variable;

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
    public static fromObject(object: { [k: string]: any }): Variable;

    /**
     * Creates a plain object from a Variable message. Also converts values to other types if specified.
     * @param message Variable
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Variable, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Variable to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a Value. */
export interface IValue {

    /** Value boolean */
    boolean?: (boolean|null);

    /** Value integer */
    integer?: (number|Long|null);

    /** Value float */
    float?: (number|null);

    /** Value string */
    string?: (string|null);

    /** Value other */
    other?: (string|null);

    /** Value reference */
    reference?: (string|null);
}

/** Represents a Value. */
export class Value implements IValue {

    /**
     * Constructs a new Value.
     * @param [properties] Properties to set
     */
    constructor(properties?: IValue);

    /** Value boolean. */
    public boolean: boolean;

    /** Value integer. */
    public integer: (number|Long);

    /** Value float. */
    public float: number;

    /** Value string. */
    public string: string;

    /** Value other. */
    public other: string;

    /** Value reference. */
    public reference: string;

    /** Value value. */
    public value?: ("boolean"|"integer"|"float"|"string"|"other"|"reference");

    /**
     * Creates a new Value instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Value instance
     */
    public static create(properties?: IValue): Value;

    /**
     * Encodes the specified Value message. Does not implicitly {@link Value.verify|verify} messages.
     * @param message Value message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: Value, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Value message, length delimited. Does not implicitly {@link Value.verify|verify} messages.
     * @param message Value message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: Value, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Value message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Value
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Value;

    /**
     * Decodes a Value message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Value
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Value;

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
    public static fromObject(object: { [k: string]: any }): Value;

    /**
     * Creates a plain object from a Value message. Also converts values to other types if specified.
     * @param message Value
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Value to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an Obj. */
export interface IObj {

    /** Obj type */
    type?: (Obj.Type|null);

    /** Obj languageType */
    languageType?: (string|null);

    /** Obj userDefined */
    userDefined?: (boolean|null);

    /** Obj members */
    members?: (Member[]|null);
}

/** Represents an Obj. */
export class Obj implements IObj {

    /**
     * Constructs a new Obj.
     * @param [properties] Properties to set
     */
    constructor(properties?: IObj);

    /** Obj type. */
    public type: Obj.Type;

    /** Obj languageType. */
    public languageType: string;

    /** Obj userDefined. */
    public userDefined: boolean;

    /** Obj members. */
    public members: Member[];

    /**
     * Creates a new Obj instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Obj instance
     */
    public static create(properties?: IObj): Obj;

    /**
     * Encodes the specified Obj message. Does not implicitly {@link Obj.verify|verify} messages.
     * @param message Obj message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: Obj, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Obj message, length delimited. Does not implicitly {@link Obj.verify|verify} messages.
     * @param message Obj message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: Obj, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Obj message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Obj
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Obj;

    /**
     * Decodes an Obj message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Obj
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Obj;

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
    public static fromObject(object: { [k: string]: any }): Obj;

    /**
     * Creates a plain object from an Obj message. Also converts values to other types if specified.
     * @param message Obj
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Obj, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Obj to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace Obj {

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
}

/** Properties of a Member. */
export interface IMember {

    /** Member key */
    key?: (Value|null);

    /** Member value */
    value?: (Value|null);
}

/** Represents a Member. */
export class Member implements IMember {

    /**
     * Constructs a new Member.
     * @param [properties] Properties to set
     */
    constructor(properties?: IMember);

    /** Member key. */
    public key?: (Value|null);

    /** Member value. */
    public value?: (Value|null);

    /**
     * Creates a new Member instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Member instance
     */
    public static create(properties?: IMember): Member;

    /**
     * Encodes the specified Member message. Does not implicitly {@link Member.verify|verify} messages.
     * @param message Member message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: Member, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Member message, length delimited. Does not implicitly {@link Member.verify|verify} messages.
     * @param message Member message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: Member, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Member message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Member
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Member;

    /**
     * Decodes a Member message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Member
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Member;

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
    public static fromObject(object: { [k: string]: any }): Member;

    /**
     * Creates a plain object from a Member message. Also converts values to other types if specified.
     * @param message Member
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Member, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Member to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a Threw. */
export interface IThrew {

    /** Threw exception */
    exception?: (Exception|null);

    /** Threw cause */
    cause?: (string|null);
}

/** Represents a Threw. */
export class Threw implements IThrew {

    /**
     * Constructs a new Threw.
     * @param [properties] Properties to set
     */
    constructor(properties?: IThrew);

    /** Threw exception. */
    public exception?: (Exception|null);

    /** Threw cause. */
    public cause: string;

    /**
     * Creates a new Threw instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Threw instance
     */
    public static create(properties?: IThrew): Threw;

    /**
     * Encodes the specified Threw message. Does not implicitly {@link Threw.verify|verify} messages.
     * @param message Threw message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: Threw, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Threw message, length delimited. Does not implicitly {@link Threw.verify|verify} messages.
     * @param message Threw message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: Threw, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Threw message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Threw
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Threw;

    /**
     * Decodes a Threw message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Threw
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Threw;

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
    public static fromObject(object: { [k: string]: any }): Threw;

    /**
     * Creates a plain object from a Threw message. Also converts values to other types if specified.
     * @param message Threw
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Threw, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Threw to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a Trace. */
export interface ITrace {

    /** Trace source */
    source?: (string|null);

    /** Trace input */
    input?: (string|null);

    /** Trace steps */
    steps?: (number|null);
}

/** Represents a Trace. */
export class Trace implements ITrace {

    /**
     * Constructs a new Trace.
     * @param [properties] Properties to set
     */
    constructor(properties?: ITrace);

    /** Trace source. */
    public source: string;

    /** Trace input. */
    public input: string;

    /** Trace steps. */
    public steps: number;

    /**
     * Creates a new Trace instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Trace instance
     */
    public static create(properties?: ITrace): Trace;

    /**
     * Encodes the specified Trace message. Does not implicitly {@link Trace.verify|verify} messages.
     * @param message Trace message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: Trace, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Trace message, length delimited. Does not implicitly {@link Trace.verify|verify} messages.
     * @param message Trace message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: Trace, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Trace message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Trace
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Trace;

    /**
     * Decodes a Trace message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Trace
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Trace;

    /**
     * Verifies a Trace message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Trace message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Trace
     */
    public static fromObject(object: { [k: string]: any }): Trace;

    /**
     * Creates a plain object from a Trace message. Also converts values to other types if specified.
     * @param message Trace
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Trace, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Trace to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a Result. */
export interface IResult {

    /** Result steps */
    steps?: (Step[]|null);
}

/** Represents a Result. */
export class Result implements IResult {

    /**
     * Constructs a new Result.
     * @param [properties] Properties to set
     */
    constructor(properties?: IResult);

    /** Result steps. */
    public steps: Step[];

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
