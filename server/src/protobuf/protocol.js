/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const Step = $root.Step = (() => {

    /**
     * Properties of a Step.
     * @exports IStep
     * @interface IStep
     * @property {Snapshot|null} [snapshot] Step snapshot
     * @property {Threw|null} [threw] Step threw
     * @property {Array.<string>|null} [prints] Step prints
     */

    /**
     * Constructs a new Step.
     * @exports Step
     * @classdesc Represents a Step.
     * @implements IStep
     * @constructor
     * @param {IStep=} [properties] Properties to set
     */
    function Step(properties) {
        this.prints = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Step snapshot.
     * @member {Snapshot|null|undefined} snapshot
     * @memberof Step
     * @instance
     */
    Step.prototype.snapshot = null;

    /**
     * Step threw.
     * @member {Threw|null|undefined} threw
     * @memberof Step
     * @instance
     */
    Step.prototype.threw = null;

    /**
     * Step prints.
     * @member {Array.<string>} prints
     * @memberof Step
     * @instance
     */
    Step.prototype.prints = $util.emptyArray;

    /**
     * Creates a new Step instance using the specified properties.
     * @function create
     * @memberof Step
     * @static
     * @param {IStep=} [properties] Properties to set
     * @returns {Step} Step instance
     */
    Step.create = function create(properties) {
        return new Step(properties);
    };

    /**
     * Encodes the specified Step message. Does not implicitly {@link Step.verify|verify} messages.
     * @function encode
     * @memberof Step
     * @static
     * @param {Step} message Step message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Step.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.snapshot != null && message.hasOwnProperty("snapshot"))
            $root.Snapshot.encode(message.snapshot, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.threw != null && message.hasOwnProperty("threw"))
            $root.Threw.encode(message.threw, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.prints != null && message.prints.length)
            for (let i = 0; i < message.prints.length; ++i)
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.prints[i]);
        return writer;
    };

    /**
     * Encodes the specified Step message, length delimited. Does not implicitly {@link Step.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Step
     * @static
     * @param {Step} message Step message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Step.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Step message from the specified reader or buffer.
     * @function decode
     * @memberof Step
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Step} Step
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Step.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Step();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.snapshot = $root.Snapshot.decode(reader, reader.uint32());
                break;
            case 2:
                message.threw = $root.Threw.decode(reader, reader.uint32());
                break;
            case 3:
                if (!(message.prints && message.prints.length))
                    message.prints = [];
                message.prints.push(reader.string());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Step message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Step
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Step} Step
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Step.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Step message.
     * @function verify
     * @memberof Step
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Step.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.snapshot != null && message.hasOwnProperty("snapshot")) {
            let error = $root.Snapshot.verify(message.snapshot);
            if (error)
                return "snapshot." + error;
        }
        if (message.threw != null && message.hasOwnProperty("threw")) {
            let error = $root.Threw.verify(message.threw);
            if (error)
                return "threw." + error;
        }
        if (message.prints != null && message.hasOwnProperty("prints")) {
            if (!Array.isArray(message.prints))
                return "prints: array expected";
            for (let i = 0; i < message.prints.length; ++i)
                if (!$util.isString(message.prints[i]))
                    return "prints: string[] expected";
        }
        return null;
    };

    /**
     * Creates a Step message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Step
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Step} Step
     */
    Step.fromObject = function fromObject(object) {
        if (object instanceof $root.Step)
            return object;
        let message = new $root.Step();
        if (object.snapshot != null) {
            if (typeof object.snapshot !== "object")
                throw TypeError(".Step.snapshot: object expected");
            message.snapshot = $root.Snapshot.fromObject(object.snapshot);
        }
        if (object.threw != null) {
            if (typeof object.threw !== "object")
                throw TypeError(".Step.threw: object expected");
            message.threw = $root.Threw.fromObject(object.threw);
        }
        if (object.prints) {
            if (!Array.isArray(object.prints))
                throw TypeError(".Step.prints: array expected");
            message.prints = [];
            for (let i = 0; i < object.prints.length; ++i)
                message.prints[i] = String(object.prints[i]);
        }
        return message;
    };

    /**
     * Creates a plain object from a Step message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Step
     * @static
     * @param {Step} message Step
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Step.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.prints = [];
        if (options.defaults) {
            object.snapshot = null;
            object.threw = null;
        }
        if (message.snapshot != null && message.hasOwnProperty("snapshot"))
            object.snapshot = $root.Snapshot.toObject(message.snapshot, options);
        if (message.threw != null && message.hasOwnProperty("threw"))
            object.threw = $root.Threw.toObject(message.threw, options);
        if (message.prints && message.prints.length) {
            object.prints = [];
            for (let j = 0; j < message.prints.length; ++j)
                object.prints[j] = message.prints[j];
        }
        return object;
    };

    /**
     * Converts this Step to JSON.
     * @function toJSON
     * @memberof Step
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Step.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Step;
})();

export const Snapshot = $root.Snapshot = (() => {

    /**
     * Properties of a Snapshot.
     * @exports ISnapshot
     * @interface ISnapshot
     * @property {Snapshot.Type|null} [type] Snapshot type
     * @property {boolean|null} [finish] Snapshot finish
     * @property {Exception|null} [exception] Snapshot exception
     * @property {Array.<Scope>|null} [stack] Snapshot stack
     * @property {Object.<string,Obj>|null} [heap] Snapshot heap
     */

    /**
     * Constructs a new Snapshot.
     * @exports Snapshot
     * @classdesc Represents a Snapshot.
     * @implements ISnapshot
     * @constructor
     * @param {ISnapshot=} [properties] Properties to set
     */
    function Snapshot(properties) {
        this.stack = [];
        this.heap = {};
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Snapshot type.
     * @member {Snapshot.Type} type
     * @memberof Snapshot
     * @instance
     */
    Snapshot.prototype.type = 0;

    /**
     * Snapshot finish.
     * @member {boolean} finish
     * @memberof Snapshot
     * @instance
     */
    Snapshot.prototype.finish = false;

    /**
     * Snapshot exception.
     * @member {Exception|null|undefined} exception
     * @memberof Snapshot
     * @instance
     */
    Snapshot.prototype.exception = null;

    /**
     * Snapshot stack.
     * @member {Array.<Scope>} stack
     * @memberof Snapshot
     * @instance
     */
    Snapshot.prototype.stack = $util.emptyArray;

    /**
     * Snapshot heap.
     * @member {Object.<string,Obj>} heap
     * @memberof Snapshot
     * @instance
     */
    Snapshot.prototype.heap = $util.emptyObject;

    /**
     * Creates a new Snapshot instance using the specified properties.
     * @function create
     * @memberof Snapshot
     * @static
     * @param {ISnapshot=} [properties] Properties to set
     * @returns {Snapshot} Snapshot instance
     */
    Snapshot.create = function create(properties) {
        return new Snapshot(properties);
    };

    /**
     * Encodes the specified Snapshot message. Does not implicitly {@link Snapshot.verify|verify} messages.
     * @function encode
     * @memberof Snapshot
     * @static
     * @param {Snapshot} message Snapshot message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Snapshot.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.type != null && message.hasOwnProperty("type"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
        if (message.finish != null && message.hasOwnProperty("finish"))
            writer.uint32(/* id 2, wireType 0 =*/16).bool(message.finish);
        if (message.exception != null && message.hasOwnProperty("exception"))
            $root.Exception.encode(message.exception, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.stack != null && message.stack.length)
            for (let i = 0; i < message.stack.length; ++i)
                $root.Scope.encode(message.stack[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        if (message.heap != null && message.hasOwnProperty("heap"))
            for (let keys = Object.keys(message.heap), i = 0; i < keys.length; ++i) {
                writer.uint32(/* id 5, wireType 2 =*/42).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                $root.Obj.encode(message.heap[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
            }
        return writer;
    };

    /**
     * Encodes the specified Snapshot message, length delimited. Does not implicitly {@link Snapshot.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Snapshot
     * @static
     * @param {Snapshot} message Snapshot message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Snapshot.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Snapshot message from the specified reader or buffer.
     * @function decode
     * @memberof Snapshot
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Snapshot} Snapshot
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Snapshot.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Snapshot(), key;
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.type = reader.int32();
                break;
            case 2:
                message.finish = reader.bool();
                break;
            case 3:
                message.exception = $root.Exception.decode(reader, reader.uint32());
                break;
            case 4:
                if (!(message.stack && message.stack.length))
                    message.stack = [];
                message.stack.push($root.Scope.decode(reader, reader.uint32()));
                break;
            case 5:
                reader.skip().pos++;
                if (message.heap === $util.emptyObject)
                    message.heap = {};
                key = reader.string();
                reader.pos++;
                message.heap[key] = $root.Obj.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Snapshot message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Snapshot
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Snapshot} Snapshot
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Snapshot.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Snapshot message.
     * @function verify
     * @memberof Snapshot
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Snapshot.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.type != null && message.hasOwnProperty("type"))
            switch (message.type) {
            default:
                return "type: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
                break;
            }
        if (message.finish != null && message.hasOwnProperty("finish"))
            if (typeof message.finish !== "boolean")
                return "finish: boolean expected";
        if (message.exception != null && message.hasOwnProperty("exception")) {
            let error = $root.Exception.verify(message.exception);
            if (error)
                return "exception." + error;
        }
        if (message.stack != null && message.hasOwnProperty("stack")) {
            if (!Array.isArray(message.stack))
                return "stack: array expected";
            for (let i = 0; i < message.stack.length; ++i) {
                let error = $root.Scope.verify(message.stack[i]);
                if (error)
                    return "stack." + error;
            }
        }
        if (message.heap != null && message.hasOwnProperty("heap")) {
            if (!$util.isObject(message.heap))
                return "heap: object expected";
            let key = Object.keys(message.heap);
            for (let i = 0; i < key.length; ++i) {
                let error = $root.Obj.verify(message.heap[key[i]]);
                if (error)
                    return "heap." + error;
            }
        }
        return null;
    };

    /**
     * Creates a Snapshot message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Snapshot
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Snapshot} Snapshot
     */
    Snapshot.fromObject = function fromObject(object) {
        if (object instanceof $root.Snapshot)
            return object;
        let message = new $root.Snapshot();
        switch (object.type) {
        case "LINE":
        case 0:
            message.type = 0;
            break;
        case "CALL":
        case 1:
            message.type = 1;
            break;
        case "RETURN":
        case 2:
            message.type = 2;
            break;
        case "EXCEPTION":
        case 3:
            message.type = 3;
            break;
        }
        if (object.finish != null)
            message.finish = Boolean(object.finish);
        if (object.exception != null) {
            if (typeof object.exception !== "object")
                throw TypeError(".Snapshot.exception: object expected");
            message.exception = $root.Exception.fromObject(object.exception);
        }
        if (object.stack) {
            if (!Array.isArray(object.stack))
                throw TypeError(".Snapshot.stack: array expected");
            message.stack = [];
            for (let i = 0; i < object.stack.length; ++i) {
                if (typeof object.stack[i] !== "object")
                    throw TypeError(".Snapshot.stack: object expected");
                message.stack[i] = $root.Scope.fromObject(object.stack[i]);
            }
        }
        if (object.heap) {
            if (typeof object.heap !== "object")
                throw TypeError(".Snapshot.heap: object expected");
            message.heap = {};
            for (let keys = Object.keys(object.heap), i = 0; i < keys.length; ++i) {
                if (typeof object.heap[keys[i]] !== "object")
                    throw TypeError(".Snapshot.heap: object expected");
                message.heap[keys[i]] = $root.Obj.fromObject(object.heap[keys[i]]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a Snapshot message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Snapshot
     * @static
     * @param {Snapshot} message Snapshot
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Snapshot.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.stack = [];
        if (options.objects || options.defaults)
            object.heap = {};
        if (options.defaults) {
            object.type = options.enums === String ? "LINE" : 0;
            object.finish = false;
            object.exception = null;
        }
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = options.enums === String ? $root.Snapshot.Type[message.type] : message.type;
        if (message.finish != null && message.hasOwnProperty("finish"))
            object.finish = message.finish;
        if (message.exception != null && message.hasOwnProperty("exception"))
            object.exception = $root.Exception.toObject(message.exception, options);
        if (message.stack && message.stack.length) {
            object.stack = [];
            for (let j = 0; j < message.stack.length; ++j)
                object.stack[j] = $root.Scope.toObject(message.stack[j], options);
        }
        let keys2;
        if (message.heap && (keys2 = Object.keys(message.heap)).length) {
            object.heap = {};
            for (let j = 0; j < keys2.length; ++j)
                object.heap[keys2[j]] = $root.Obj.toObject(message.heap[keys2[j]], options);
        }
        return object;
    };

    /**
     * Converts this Snapshot to JSON.
     * @function toJSON
     * @memberof Snapshot
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Snapshot.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Type enum.
     * @name Snapshot.Type
     * @enum {string}
     * @property {number} LINE=0 LINE value
     * @property {number} CALL=1 CALL value
     * @property {number} RETURN=2 RETURN value
     * @property {number} EXCEPTION=3 EXCEPTION value
     */
    Snapshot.Type = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "LINE"] = 0;
        values[valuesById[1] = "CALL"] = 1;
        values[valuesById[2] = "RETURN"] = 2;
        values[valuesById[3] = "EXCEPTION"] = 3;
        return values;
    })();

    return Snapshot;
})();

export const Exception = $root.Exception = (() => {

    /**
     * Properties of an Exception.
     * @exports IException
     * @interface IException
     * @property {string|null} [type] Exception type
     * @property {Array.<string>|null} [args] Exception args
     * @property {Array.<string>|null} [traceback] Exception traceback
     */

    /**
     * Constructs a new Exception.
     * @exports Exception
     * @classdesc Represents an Exception.
     * @implements IException
     * @constructor
     * @param {IException=} [properties] Properties to set
     */
    function Exception(properties) {
        this.args = [];
        this.traceback = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Exception type.
     * @member {string} type
     * @memberof Exception
     * @instance
     */
    Exception.prototype.type = "";

    /**
     * Exception args.
     * @member {Array.<string>} args
     * @memberof Exception
     * @instance
     */
    Exception.prototype.args = $util.emptyArray;

    /**
     * Exception traceback.
     * @member {Array.<string>} traceback
     * @memberof Exception
     * @instance
     */
    Exception.prototype.traceback = $util.emptyArray;

    /**
     * Creates a new Exception instance using the specified properties.
     * @function create
     * @memberof Exception
     * @static
     * @param {IException=} [properties] Properties to set
     * @returns {Exception} Exception instance
     */
    Exception.create = function create(properties) {
        return new Exception(properties);
    };

    /**
     * Encodes the specified Exception message. Does not implicitly {@link Exception.verify|verify} messages.
     * @function encode
     * @memberof Exception
     * @static
     * @param {Exception} message Exception message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Exception.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.type != null && message.hasOwnProperty("type"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.type);
        if (message.args != null && message.args.length)
            for (let i = 0; i < message.args.length; ++i)
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.args[i]);
        if (message.traceback != null && message.traceback.length)
            for (let i = 0; i < message.traceback.length; ++i)
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.traceback[i]);
        return writer;
    };

    /**
     * Encodes the specified Exception message, length delimited. Does not implicitly {@link Exception.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Exception
     * @static
     * @param {Exception} message Exception message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Exception.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Exception message from the specified reader or buffer.
     * @function decode
     * @memberof Exception
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Exception} Exception
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Exception.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Exception();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.type = reader.string();
                break;
            case 2:
                if (!(message.args && message.args.length))
                    message.args = [];
                message.args.push(reader.string());
                break;
            case 3:
                if (!(message.traceback && message.traceback.length))
                    message.traceback = [];
                message.traceback.push(reader.string());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Exception message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Exception
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Exception} Exception
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Exception.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Exception message.
     * @function verify
     * @memberof Exception
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Exception.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.type != null && message.hasOwnProperty("type"))
            if (!$util.isString(message.type))
                return "type: string expected";
        if (message.args != null && message.hasOwnProperty("args")) {
            if (!Array.isArray(message.args))
                return "args: array expected";
            for (let i = 0; i < message.args.length; ++i)
                if (!$util.isString(message.args[i]))
                    return "args: string[] expected";
        }
        if (message.traceback != null && message.hasOwnProperty("traceback")) {
            if (!Array.isArray(message.traceback))
                return "traceback: array expected";
            for (let i = 0; i < message.traceback.length; ++i)
                if (!$util.isString(message.traceback[i]))
                    return "traceback: string[] expected";
        }
        return null;
    };

    /**
     * Creates an Exception message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Exception
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Exception} Exception
     */
    Exception.fromObject = function fromObject(object) {
        if (object instanceof $root.Exception)
            return object;
        let message = new $root.Exception();
        if (object.type != null)
            message.type = String(object.type);
        if (object.args) {
            if (!Array.isArray(object.args))
                throw TypeError(".Exception.args: array expected");
            message.args = [];
            for (let i = 0; i < object.args.length; ++i)
                message.args[i] = String(object.args[i]);
        }
        if (object.traceback) {
            if (!Array.isArray(object.traceback))
                throw TypeError(".Exception.traceback: array expected");
            message.traceback = [];
            for (let i = 0; i < object.traceback.length; ++i)
                message.traceback[i] = String(object.traceback[i]);
        }
        return message;
    };

    /**
     * Creates a plain object from an Exception message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Exception
     * @static
     * @param {Exception} message Exception
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Exception.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults) {
            object.args = [];
            object.traceback = [];
        }
        if (options.defaults)
            object.type = "";
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = message.type;
        if (message.args && message.args.length) {
            object.args = [];
            for (let j = 0; j < message.args.length; ++j)
                object.args[j] = message.args[j];
        }
        if (message.traceback && message.traceback.length) {
            object.traceback = [];
            for (let j = 0; j < message.traceback.length; ++j)
                object.traceback[j] = message.traceback[j];
        }
        return object;
    };

    /**
     * Converts this Exception to JSON.
     * @function toJSON
     * @memberof Exception
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Exception.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Exception;
})();

export const Scope = $root.Scope = (() => {

    /**
     * Properties of a Scope.
     * @exports IScope
     * @interface IScope
     * @property {number|null} [line] Scope line
     * @property {string|null} [name] Scope name
     * @property {Array.<Variable>|null} [variables] Scope variables
     */

    /**
     * Constructs a new Scope.
     * @exports Scope
     * @classdesc Represents a Scope.
     * @implements IScope
     * @constructor
     * @param {IScope=} [properties] Properties to set
     */
    function Scope(properties) {
        this.variables = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Scope line.
     * @member {number} line
     * @memberof Scope
     * @instance
     */
    Scope.prototype.line = 0;

    /**
     * Scope name.
     * @member {string} name
     * @memberof Scope
     * @instance
     */
    Scope.prototype.name = "";

    /**
     * Scope variables.
     * @member {Array.<Variable>} variables
     * @memberof Scope
     * @instance
     */
    Scope.prototype.variables = $util.emptyArray;

    /**
     * Creates a new Scope instance using the specified properties.
     * @function create
     * @memberof Scope
     * @static
     * @param {IScope=} [properties] Properties to set
     * @returns {Scope} Scope instance
     */
    Scope.create = function create(properties) {
        return new Scope(properties);
    };

    /**
     * Encodes the specified Scope message. Does not implicitly {@link Scope.verify|verify} messages.
     * @function encode
     * @memberof Scope
     * @static
     * @param {Scope} message Scope message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Scope.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.line != null && message.hasOwnProperty("line"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.line);
        if (message.name != null && message.hasOwnProperty("name"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
        if (message.variables != null && message.variables.length)
            for (let i = 0; i < message.variables.length; ++i)
                $root.Variable.encode(message.variables[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Scope message, length delimited. Does not implicitly {@link Scope.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Scope
     * @static
     * @param {Scope} message Scope message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Scope.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Scope message from the specified reader or buffer.
     * @function decode
     * @memberof Scope
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Scope} Scope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Scope.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Scope();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.line = reader.int32();
                break;
            case 2:
                message.name = reader.string();
                break;
            case 3:
                if (!(message.variables && message.variables.length))
                    message.variables = [];
                message.variables.push($root.Variable.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Scope message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Scope
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Scope} Scope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Scope.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Scope message.
     * @function verify
     * @memberof Scope
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Scope.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.line != null && message.hasOwnProperty("line"))
            if (!$util.isInteger(message.line))
                return "line: integer expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.variables != null && message.hasOwnProperty("variables")) {
            if (!Array.isArray(message.variables))
                return "variables: array expected";
            for (let i = 0; i < message.variables.length; ++i) {
                let error = $root.Variable.verify(message.variables[i]);
                if (error)
                    return "variables." + error;
            }
        }
        return null;
    };

    /**
     * Creates a Scope message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Scope
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Scope} Scope
     */
    Scope.fromObject = function fromObject(object) {
        if (object instanceof $root.Scope)
            return object;
        let message = new $root.Scope();
        if (object.line != null)
            message.line = object.line | 0;
        if (object.name != null)
            message.name = String(object.name);
        if (object.variables) {
            if (!Array.isArray(object.variables))
                throw TypeError(".Scope.variables: array expected");
            message.variables = [];
            for (let i = 0; i < object.variables.length; ++i) {
                if (typeof object.variables[i] !== "object")
                    throw TypeError(".Scope.variables: object expected");
                message.variables[i] = $root.Variable.fromObject(object.variables[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a Scope message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Scope
     * @static
     * @param {Scope} message Scope
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Scope.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.variables = [];
        if (options.defaults) {
            object.line = 0;
            object.name = "";
        }
        if (message.line != null && message.hasOwnProperty("line"))
            object.line = message.line;
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.variables && message.variables.length) {
            object.variables = [];
            for (let j = 0; j < message.variables.length; ++j)
                object.variables[j] = $root.Variable.toObject(message.variables[j], options);
        }
        return object;
    };

    /**
     * Converts this Scope to JSON.
     * @function toJSON
     * @memberof Scope
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Scope.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Scope;
})();

export const Variable = $root.Variable = (() => {

    /**
     * Properties of a Variable.
     * @exports IVariable
     * @interface IVariable
     * @property {string|null} [name] Variable name
     * @property {Value|null} [value] Variable value
     */

    /**
     * Constructs a new Variable.
     * @exports Variable
     * @classdesc Represents a Variable.
     * @implements IVariable
     * @constructor
     * @param {IVariable=} [properties] Properties to set
     */
    function Variable(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Variable name.
     * @member {string} name
     * @memberof Variable
     * @instance
     */
    Variable.prototype.name = "";

    /**
     * Variable value.
     * @member {Value|null|undefined} value
     * @memberof Variable
     * @instance
     */
    Variable.prototype.value = null;

    /**
     * Creates a new Variable instance using the specified properties.
     * @function create
     * @memberof Variable
     * @static
     * @param {IVariable=} [properties] Properties to set
     * @returns {Variable} Variable instance
     */
    Variable.create = function create(properties) {
        return new Variable(properties);
    };

    /**
     * Encodes the specified Variable message. Does not implicitly {@link Variable.verify|verify} messages.
     * @function encode
     * @memberof Variable
     * @static
     * @param {Variable} message Variable message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Variable.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.name != null && message.hasOwnProperty("name"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
        if (message.value != null && message.hasOwnProperty("value"))
            $root.Value.encode(message.value, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Variable message, length delimited. Does not implicitly {@link Variable.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Variable
     * @static
     * @param {Variable} message Variable message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Variable.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Variable message from the specified reader or buffer.
     * @function decode
     * @memberof Variable
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Variable} Variable
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Variable.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Variable();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.name = reader.string();
                break;
            case 2:
                message.value = $root.Value.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Variable message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Variable
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Variable} Variable
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Variable.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Variable message.
     * @function verify
     * @memberof Variable
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Variable.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.value != null && message.hasOwnProperty("value")) {
            let error = $root.Value.verify(message.value);
            if (error)
                return "value." + error;
        }
        return null;
    };

    /**
     * Creates a Variable message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Variable
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Variable} Variable
     */
    Variable.fromObject = function fromObject(object) {
        if (object instanceof $root.Variable)
            return object;
        let message = new $root.Variable();
        if (object.name != null)
            message.name = String(object.name);
        if (object.value != null) {
            if (typeof object.value !== "object")
                throw TypeError(".Variable.value: object expected");
            message.value = $root.Value.fromObject(object.value);
        }
        return message;
    };

    /**
     * Creates a plain object from a Variable message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Variable
     * @static
     * @param {Variable} message Variable
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Variable.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.name = "";
            object.value = null;
        }
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.value != null && message.hasOwnProperty("value"))
            object.value = $root.Value.toObject(message.value, options);
        return object;
    };

    /**
     * Converts this Variable to JSON.
     * @function toJSON
     * @memberof Variable
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Variable.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Variable;
})();

export const Value = $root.Value = (() => {

    /**
     * Properties of a Value.
     * @exports IValue
     * @interface IValue
     * @property {boolean|null} [boolean] Value boolean
     * @property {number|Long|null} [integer] Value integer
     * @property {number|null} [float] Value float
     * @property {string|null} [string] Value string
     * @property {string|null} [other] Value other
     * @property {string|null} [reference] Value reference
     */

    /**
     * Constructs a new Value.
     * @exports Value
     * @classdesc Represents a Value.
     * @implements IValue
     * @constructor
     * @param {IValue=} [properties] Properties to set
     */
    function Value(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Value boolean.
     * @member {boolean} boolean
     * @memberof Value
     * @instance
     */
    Value.prototype.boolean = false;

    /**
     * Value integer.
     * @member {number|Long} integer
     * @memberof Value
     * @instance
     */
    Value.prototype.integer = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * Value float.
     * @member {number} float
     * @memberof Value
     * @instance
     */
    Value.prototype.float = 0;

    /**
     * Value string.
     * @member {string} string
     * @memberof Value
     * @instance
     */
    Value.prototype.string = "";

    /**
     * Value other.
     * @member {string} other
     * @memberof Value
     * @instance
     */
    Value.prototype.other = "";

    /**
     * Value reference.
     * @member {string} reference
     * @memberof Value
     * @instance
     */
    Value.prototype.reference = "";

    // OneOf field names bound to virtual getters and setters
    let $oneOfFields;

    /**
     * Value value.
     * @member {"boolean"|"integer"|"float"|"string"|"other"|"reference"|undefined} value
     * @memberof Value
     * @instance
     */
    Object.defineProperty(Value.prototype, "value", {
        get: $util.oneOfGetter($oneOfFields = ["boolean", "integer", "float", "string", "other", "reference"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new Value instance using the specified properties.
     * @function create
     * @memberof Value
     * @static
     * @param {IValue=} [properties] Properties to set
     * @returns {Value} Value instance
     */
    Value.create = function create(properties) {
        return new Value(properties);
    };

    /**
     * Encodes the specified Value message. Does not implicitly {@link Value.verify|verify} messages.
     * @function encode
     * @memberof Value
     * @static
     * @param {Value} message Value message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Value.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.boolean != null && message.hasOwnProperty("boolean"))
            writer.uint32(/* id 1, wireType 0 =*/8).bool(message.boolean);
        if (message.integer != null && message.hasOwnProperty("integer"))
            writer.uint32(/* id 2, wireType 0 =*/16).int64(message.integer);
        if (message.float != null && message.hasOwnProperty("float"))
            writer.uint32(/* id 3, wireType 1 =*/25).double(message.float);
        if (message.string != null && message.hasOwnProperty("string"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.string);
        if (message.other != null && message.hasOwnProperty("other"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.other);
        if (message.reference != null && message.hasOwnProperty("reference"))
            writer.uint32(/* id 6, wireType 2 =*/50).string(message.reference);
        return writer;
    };

    /**
     * Encodes the specified Value message, length delimited. Does not implicitly {@link Value.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Value
     * @static
     * @param {Value} message Value message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Value.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Value message from the specified reader or buffer.
     * @function decode
     * @memberof Value
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Value} Value
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Value.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Value();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.boolean = reader.bool();
                break;
            case 2:
                message.integer = reader.int64();
                break;
            case 3:
                message.float = reader.double();
                break;
            case 4:
                message.string = reader.string();
                break;
            case 5:
                message.other = reader.string();
                break;
            case 6:
                message.reference = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Value message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Value
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Value} Value
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Value.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Value message.
     * @function verify
     * @memberof Value
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Value.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        let properties = {};
        if (message.boolean != null && message.hasOwnProperty("boolean")) {
            properties.value = 1;
            if (typeof message.boolean !== "boolean")
                return "boolean: boolean expected";
        }
        if (message.integer != null && message.hasOwnProperty("integer")) {
            if (properties.value === 1)
                return "value: multiple values";
            properties.value = 1;
            if (!$util.isInteger(message.integer) && !(message.integer && $util.isInteger(message.integer.low) && $util.isInteger(message.integer.high)))
                return "integer: integer|Long expected";
        }
        if (message.float != null && message.hasOwnProperty("float")) {
            if (properties.value === 1)
                return "value: multiple values";
            properties.value = 1;
            if (typeof message.float !== "number")
                return "float: number expected";
        }
        if (message.string != null && message.hasOwnProperty("string")) {
            if (properties.value === 1)
                return "value: multiple values";
            properties.value = 1;
            if (!$util.isString(message.string))
                return "string: string expected";
        }
        if (message.other != null && message.hasOwnProperty("other")) {
            if (properties.value === 1)
                return "value: multiple values";
            properties.value = 1;
            if (!$util.isString(message.other))
                return "other: string expected";
        }
        if (message.reference != null && message.hasOwnProperty("reference")) {
            if (properties.value === 1)
                return "value: multiple values";
            properties.value = 1;
            if (!$util.isString(message.reference))
                return "reference: string expected";
        }
        return null;
    };

    /**
     * Creates a Value message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Value
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Value} Value
     */
    Value.fromObject = function fromObject(object) {
        if (object instanceof $root.Value)
            return object;
        let message = new $root.Value();
        if (object.boolean != null)
            message.boolean = Boolean(object.boolean);
        if (object.integer != null)
            if ($util.Long)
                (message.integer = $util.Long.fromValue(object.integer)).unsigned = false;
            else if (typeof object.integer === "string")
                message.integer = parseInt(object.integer, 10);
            else if (typeof object.integer === "number")
                message.integer = object.integer;
            else if (typeof object.integer === "object")
                message.integer = new $util.LongBits(object.integer.low >>> 0, object.integer.high >>> 0).toNumber();
        if (object.float != null)
            message.float = Number(object.float);
        if (object.string != null)
            message.string = String(object.string);
        if (object.other != null)
            message.other = String(object.other);
        if (object.reference != null)
            message.reference = String(object.reference);
        return message;
    };

    /**
     * Creates a plain object from a Value message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Value
     * @static
     * @param {Value} message Value
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Value.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (message.boolean != null && message.hasOwnProperty("boolean")) {
            object.boolean = message.boolean;
            if (options.oneofs)
                object.value = "boolean";
        }
        if (message.integer != null && message.hasOwnProperty("integer")) {
            if (typeof message.integer === "number")
                object.integer = options.longs === String ? String(message.integer) : message.integer;
            else
                object.integer = options.longs === String ? $util.Long.prototype.toString.call(message.integer) : options.longs === Number ? new $util.LongBits(message.integer.low >>> 0, message.integer.high >>> 0).toNumber() : message.integer;
            if (options.oneofs)
                object.value = "integer";
        }
        if (message.float != null && message.hasOwnProperty("float")) {
            object.float = options.json && !isFinite(message.float) ? String(message.float) : message.float;
            if (options.oneofs)
                object.value = "float";
        }
        if (message.string != null && message.hasOwnProperty("string")) {
            object.string = message.string;
            if (options.oneofs)
                object.value = "string";
        }
        if (message.other != null && message.hasOwnProperty("other")) {
            object.other = message.other;
            if (options.oneofs)
                object.value = "other";
        }
        if (message.reference != null && message.hasOwnProperty("reference")) {
            object.reference = message.reference;
            if (options.oneofs)
                object.value = "reference";
        }
        return object;
    };

    /**
     * Converts this Value to JSON.
     * @function toJSON
     * @memberof Value
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Value.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Value;
})();

export const Obj = $root.Obj = (() => {

    /**
     * Properties of an Obj.
     * @exports IObj
     * @interface IObj
     * @property {Obj.Type|null} [type] Obj type
     * @property {string|null} [languageType] Obj languageType
     * @property {boolean|null} [userDefined] Obj userDefined
     * @property {Array.<Member>|null} [members] Obj members
     */

    /**
     * Constructs a new Obj.
     * @exports Obj
     * @classdesc Represents an Obj.
     * @implements IObj
     * @constructor
     * @param {IObj=} [properties] Properties to set
     */
    function Obj(properties) {
        this.members = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Obj type.
     * @member {Obj.Type} type
     * @memberof Obj
     * @instance
     */
    Obj.prototype.type = 0;

    /**
     * Obj languageType.
     * @member {string} languageType
     * @memberof Obj
     * @instance
     */
    Obj.prototype.languageType = "";

    /**
     * Obj userDefined.
     * @member {boolean} userDefined
     * @memberof Obj
     * @instance
     */
    Obj.prototype.userDefined = false;

    /**
     * Obj members.
     * @member {Array.<Member>} members
     * @memberof Obj
     * @instance
     */
    Obj.prototype.members = $util.emptyArray;

    /**
     * Creates a new Obj instance using the specified properties.
     * @function create
     * @memberof Obj
     * @static
     * @param {IObj=} [properties] Properties to set
     * @returns {Obj} Obj instance
     */
    Obj.create = function create(properties) {
        return new Obj(properties);
    };

    /**
     * Encodes the specified Obj message. Does not implicitly {@link Obj.verify|verify} messages.
     * @function encode
     * @memberof Obj
     * @static
     * @param {Obj} message Obj message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Obj.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.type != null && message.hasOwnProperty("type"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
        if (message.languageType != null && message.hasOwnProperty("languageType"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.languageType);
        if (message.userDefined != null && message.hasOwnProperty("userDefined"))
            writer.uint32(/* id 3, wireType 0 =*/24).bool(message.userDefined);
        if (message.members != null && message.members.length)
            for (let i = 0; i < message.members.length; ++i)
                $root.Member.encode(message.members[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Obj message, length delimited. Does not implicitly {@link Obj.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Obj
     * @static
     * @param {Obj} message Obj message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Obj.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Obj message from the specified reader or buffer.
     * @function decode
     * @memberof Obj
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Obj} Obj
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Obj.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Obj();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.type = reader.int32();
                break;
            case 2:
                message.languageType = reader.string();
                break;
            case 3:
                message.userDefined = reader.bool();
                break;
            case 4:
                if (!(message.members && message.members.length))
                    message.members = [];
                message.members.push($root.Member.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Obj message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Obj
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Obj} Obj
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Obj.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Obj message.
     * @function verify
     * @memberof Obj
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Obj.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.type != null && message.hasOwnProperty("type"))
            switch (message.type) {
            default:
                return "type: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                break;
            }
        if (message.languageType != null && message.hasOwnProperty("languageType"))
            if (!$util.isString(message.languageType))
                return "languageType: string expected";
        if (message.userDefined != null && message.hasOwnProperty("userDefined"))
            if (typeof message.userDefined !== "boolean")
                return "userDefined: boolean expected";
        if (message.members != null && message.hasOwnProperty("members")) {
            if (!Array.isArray(message.members))
                return "members: array expected";
            for (let i = 0; i < message.members.length; ++i) {
                let error = $root.Member.verify(message.members[i]);
                if (error)
                    return "members." + error;
            }
        }
        return null;
    };

    /**
     * Creates an Obj message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Obj
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Obj} Obj
     */
    Obj.fromObject = function fromObject(object) {
        if (object instanceof $root.Obj)
            return object;
        let message = new $root.Obj();
        switch (object.type) {
        case "ARRAY":
        case 0:
            message.type = 0;
            break;
        case "TUPLE":
        case 1:
            message.type = 1;
            break;
        case "ALIST":
        case 2:
            message.type = 2;
            break;
        case "LLIST":
        case 3:
            message.type = 3;
            break;
        case "HMAP":
        case 4:
            message.type = 4;
            break;
        case "TMAP":
        case 5:
            message.type = 5;
            break;
        case "SET":
        case 6:
            message.type = 6;
            break;
        case "OTHER":
        case 7:
            message.type = 7;
            break;
        }
        if (object.languageType != null)
            message.languageType = String(object.languageType);
        if (object.userDefined != null)
            message.userDefined = Boolean(object.userDefined);
        if (object.members) {
            if (!Array.isArray(object.members))
                throw TypeError(".Obj.members: array expected");
            message.members = [];
            for (let i = 0; i < object.members.length; ++i) {
                if (typeof object.members[i] !== "object")
                    throw TypeError(".Obj.members: object expected");
                message.members[i] = $root.Member.fromObject(object.members[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from an Obj message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Obj
     * @static
     * @param {Obj} message Obj
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Obj.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.members = [];
        if (options.defaults) {
            object.type = options.enums === String ? "ARRAY" : 0;
            object.languageType = "";
            object.userDefined = false;
        }
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = options.enums === String ? $root.Obj.Type[message.type] : message.type;
        if (message.languageType != null && message.hasOwnProperty("languageType"))
            object.languageType = message.languageType;
        if (message.userDefined != null && message.hasOwnProperty("userDefined"))
            object.userDefined = message.userDefined;
        if (message.members && message.members.length) {
            object.members = [];
            for (let j = 0; j < message.members.length; ++j)
                object.members[j] = $root.Member.toObject(message.members[j], options);
        }
        return object;
    };

    /**
     * Converts this Obj to JSON.
     * @function toJSON
     * @memberof Obj
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Obj.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Type enum.
     * @name Obj.Type
     * @enum {string}
     * @property {number} ARRAY=0 ARRAY value
     * @property {number} TUPLE=1 TUPLE value
     * @property {number} ALIST=2 ALIST value
     * @property {number} LLIST=3 LLIST value
     * @property {number} HMAP=4 HMAP value
     * @property {number} TMAP=5 TMAP value
     * @property {number} SET=6 SET value
     * @property {number} OTHER=7 OTHER value
     */
    Obj.Type = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "ARRAY"] = 0;
        values[valuesById[1] = "TUPLE"] = 1;
        values[valuesById[2] = "ALIST"] = 2;
        values[valuesById[3] = "LLIST"] = 3;
        values[valuesById[4] = "HMAP"] = 4;
        values[valuesById[5] = "TMAP"] = 5;
        values[valuesById[6] = "SET"] = 6;
        values[valuesById[7] = "OTHER"] = 7;
        return values;
    })();

    return Obj;
})();

export const Member = $root.Member = (() => {

    /**
     * Properties of a Member.
     * @exports IMember
     * @interface IMember
     * @property {Value|null} [key] Member key
     * @property {Value|null} [value] Member value
     */

    /**
     * Constructs a new Member.
     * @exports Member
     * @classdesc Represents a Member.
     * @implements IMember
     * @constructor
     * @param {IMember=} [properties] Properties to set
     */
    function Member(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Member key.
     * @member {Value|null|undefined} key
     * @memberof Member
     * @instance
     */
    Member.prototype.key = null;

    /**
     * Member value.
     * @member {Value|null|undefined} value
     * @memberof Member
     * @instance
     */
    Member.prototype.value = null;

    /**
     * Creates a new Member instance using the specified properties.
     * @function create
     * @memberof Member
     * @static
     * @param {IMember=} [properties] Properties to set
     * @returns {Member} Member instance
     */
    Member.create = function create(properties) {
        return new Member(properties);
    };

    /**
     * Encodes the specified Member message. Does not implicitly {@link Member.verify|verify} messages.
     * @function encode
     * @memberof Member
     * @static
     * @param {Member} message Member message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Member.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.key != null && message.hasOwnProperty("key"))
            $root.Value.encode(message.key, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.value != null && message.hasOwnProperty("value"))
            $root.Value.encode(message.value, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Member message, length delimited. Does not implicitly {@link Member.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Member
     * @static
     * @param {Member} message Member message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Member.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Member message from the specified reader or buffer.
     * @function decode
     * @memberof Member
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Member} Member
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Member.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Member();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.key = $root.Value.decode(reader, reader.uint32());
                break;
            case 2:
                message.value = $root.Value.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Member message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Member
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Member} Member
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Member.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Member message.
     * @function verify
     * @memberof Member
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Member.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.key != null && message.hasOwnProperty("key")) {
            let error = $root.Value.verify(message.key);
            if (error)
                return "key." + error;
        }
        if (message.value != null && message.hasOwnProperty("value")) {
            let error = $root.Value.verify(message.value);
            if (error)
                return "value." + error;
        }
        return null;
    };

    /**
     * Creates a Member message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Member
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Member} Member
     */
    Member.fromObject = function fromObject(object) {
        if (object instanceof $root.Member)
            return object;
        let message = new $root.Member();
        if (object.key != null) {
            if (typeof object.key !== "object")
                throw TypeError(".Member.key: object expected");
            message.key = $root.Value.fromObject(object.key);
        }
        if (object.value != null) {
            if (typeof object.value !== "object")
                throw TypeError(".Member.value: object expected");
            message.value = $root.Value.fromObject(object.value);
        }
        return message;
    };

    /**
     * Creates a plain object from a Member message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Member
     * @static
     * @param {Member} message Member
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Member.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.key = null;
            object.value = null;
        }
        if (message.key != null && message.hasOwnProperty("key"))
            object.key = $root.Value.toObject(message.key, options);
        if (message.value != null && message.hasOwnProperty("value"))
            object.value = $root.Value.toObject(message.value, options);
        return object;
    };

    /**
     * Converts this Member to JSON.
     * @function toJSON
     * @memberof Member
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Member.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Member;
})();

export const Threw = $root.Threw = (() => {

    /**
     * Properties of a Threw.
     * @exports IThrew
     * @interface IThrew
     * @property {Exception|null} [exception] Threw exception
     * @property {string|null} [cause] Threw cause
     */

    /**
     * Constructs a new Threw.
     * @exports Threw
     * @classdesc Represents a Threw.
     * @implements IThrew
     * @constructor
     * @param {IThrew=} [properties] Properties to set
     */
    function Threw(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Threw exception.
     * @member {Exception|null|undefined} exception
     * @memberof Threw
     * @instance
     */
    Threw.prototype.exception = null;

    /**
     * Threw cause.
     * @member {string} cause
     * @memberof Threw
     * @instance
     */
    Threw.prototype.cause = "";

    /**
     * Creates a new Threw instance using the specified properties.
     * @function create
     * @memberof Threw
     * @static
     * @param {IThrew=} [properties] Properties to set
     * @returns {Threw} Threw instance
     */
    Threw.create = function create(properties) {
        return new Threw(properties);
    };

    /**
     * Encodes the specified Threw message. Does not implicitly {@link Threw.verify|verify} messages.
     * @function encode
     * @memberof Threw
     * @static
     * @param {Threw} message Threw message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Threw.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.exception != null && message.hasOwnProperty("exception"))
            $root.Exception.encode(message.exception, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.cause != null && message.hasOwnProperty("cause"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.cause);
        return writer;
    };

    /**
     * Encodes the specified Threw message, length delimited. Does not implicitly {@link Threw.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Threw
     * @static
     * @param {Threw} message Threw message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Threw.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Threw message from the specified reader or buffer.
     * @function decode
     * @memberof Threw
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Threw} Threw
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Threw.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Threw();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.exception = $root.Exception.decode(reader, reader.uint32());
                break;
            case 2:
                message.cause = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Threw message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Threw
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Threw} Threw
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Threw.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Threw message.
     * @function verify
     * @memberof Threw
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Threw.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.exception != null && message.hasOwnProperty("exception")) {
            let error = $root.Exception.verify(message.exception);
            if (error)
                return "exception." + error;
        }
        if (message.cause != null && message.hasOwnProperty("cause"))
            if (!$util.isString(message.cause))
                return "cause: string expected";
        return null;
    };

    /**
     * Creates a Threw message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Threw
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Threw} Threw
     */
    Threw.fromObject = function fromObject(object) {
        if (object instanceof $root.Threw)
            return object;
        let message = new $root.Threw();
        if (object.exception != null) {
            if (typeof object.exception !== "object")
                throw TypeError(".Threw.exception: object expected");
            message.exception = $root.Exception.fromObject(object.exception);
        }
        if (object.cause != null)
            message.cause = String(object.cause);
        return message;
    };

    /**
     * Creates a plain object from a Threw message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Threw
     * @static
     * @param {Threw} message Threw
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Threw.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.exception = null;
            object.cause = "";
        }
        if (message.exception != null && message.hasOwnProperty("exception"))
            object.exception = $root.Exception.toObject(message.exception, options);
        if (message.cause != null && message.hasOwnProperty("cause"))
            object.cause = message.cause;
        return object;
    };

    /**
     * Converts this Threw to JSON.
     * @function toJSON
     * @memberof Threw
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Threw.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Threw;
})();

export const Trace = $root.Trace = (() => {

    /**
     * Properties of a Trace.
     * @exports ITrace
     * @interface ITrace
     * @property {string|null} [source] Trace source
     * @property {string|null} [input] Trace input
     * @property {number|null} [steps] Trace steps
     */

    /**
     * Constructs a new Trace.
     * @exports Trace
     * @classdesc Represents a Trace.
     * @implements ITrace
     * @constructor
     * @param {ITrace=} [properties] Properties to set
     */
    function Trace(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Trace source.
     * @member {string} source
     * @memberof Trace
     * @instance
     */
    Trace.prototype.source = "";

    /**
     * Trace input.
     * @member {string} input
     * @memberof Trace
     * @instance
     */
    Trace.prototype.input = "";

    /**
     * Trace steps.
     * @member {number} steps
     * @memberof Trace
     * @instance
     */
    Trace.prototype.steps = 0;

    /**
     * Creates a new Trace instance using the specified properties.
     * @function create
     * @memberof Trace
     * @static
     * @param {ITrace=} [properties] Properties to set
     * @returns {Trace} Trace instance
     */
    Trace.create = function create(properties) {
        return new Trace(properties);
    };

    /**
     * Encodes the specified Trace message. Does not implicitly {@link Trace.verify|verify} messages.
     * @function encode
     * @memberof Trace
     * @static
     * @param {Trace} message Trace message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Trace.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.source != null && message.hasOwnProperty("source"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.source);
        if (message.input != null && message.hasOwnProperty("input"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.input);
        if (message.steps != null && message.hasOwnProperty("steps"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.steps);
        return writer;
    };

    /**
     * Encodes the specified Trace message, length delimited. Does not implicitly {@link Trace.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Trace
     * @static
     * @param {Trace} message Trace message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Trace.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Trace message from the specified reader or buffer.
     * @function decode
     * @memberof Trace
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Trace} Trace
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Trace.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Trace();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.source = reader.string();
                break;
            case 2:
                message.input = reader.string();
                break;
            case 3:
                message.steps = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Trace message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Trace
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Trace} Trace
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Trace.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Trace message.
     * @function verify
     * @memberof Trace
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Trace.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.source != null && message.hasOwnProperty("source"))
            if (!$util.isString(message.source))
                return "source: string expected";
        if (message.input != null && message.hasOwnProperty("input"))
            if (!$util.isString(message.input))
                return "input: string expected";
        if (message.steps != null && message.hasOwnProperty("steps"))
            if (!$util.isInteger(message.steps))
                return "steps: integer expected";
        return null;
    };

    /**
     * Creates a Trace message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Trace
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Trace} Trace
     */
    Trace.fromObject = function fromObject(object) {
        if (object instanceof $root.Trace)
            return object;
        let message = new $root.Trace();
        if (object.source != null)
            message.source = String(object.source);
        if (object.input != null)
            message.input = String(object.input);
        if (object.steps != null)
            message.steps = object.steps | 0;
        return message;
    };

    /**
     * Creates a plain object from a Trace message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Trace
     * @static
     * @param {Trace} message Trace
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Trace.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.source = "";
            object.input = "";
            object.steps = 0;
        }
        if (message.source != null && message.hasOwnProperty("source"))
            object.source = message.source;
        if (message.input != null && message.hasOwnProperty("input"))
            object.input = message.input;
        if (message.steps != null && message.hasOwnProperty("steps"))
            object.steps = message.steps;
        return object;
    };

    /**
     * Converts this Trace to JSON.
     * @function toJSON
     * @memberof Trace
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Trace.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Trace;
})();

export const Result = $root.Result = (() => {

    /**
     * Properties of a Result.
     * @exports IResult
     * @interface IResult
     * @property {Array.<Step>|null} [steps] Result steps
     */

    /**
     * Constructs a new Result.
     * @exports Result
     * @classdesc Represents a Result.
     * @implements IResult
     * @constructor
     * @param {IResult=} [properties] Properties to set
     */
    function Result(properties) {
        this.steps = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Result steps.
     * @member {Array.<Step>} steps
     * @memberof Result
     * @instance
     */
    Result.prototype.steps = $util.emptyArray;

    /**
     * Creates a new Result instance using the specified properties.
     * @function create
     * @memberof Result
     * @static
     * @param {IResult=} [properties] Properties to set
     * @returns {Result} Result instance
     */
    Result.create = function create(properties) {
        return new Result(properties);
    };

    /**
     * Encodes the specified Result message. Does not implicitly {@link Result.verify|verify} messages.
     * @function encode
     * @memberof Result
     * @static
     * @param {Result} message Result message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Result.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.steps != null && message.steps.length)
            for (let i = 0; i < message.steps.length; ++i)
                $root.Step.encode(message.steps[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Result message, length delimited. Does not implicitly {@link Result.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Result
     * @static
     * @param {Result} message Result message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Result.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Result message from the specified reader or buffer.
     * @function decode
     * @memberof Result
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Result} Result
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Result.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Result();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.steps && message.steps.length))
                    message.steps = [];
                message.steps.push($root.Step.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Result message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Result
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Result} Result
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Result.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Result message.
     * @function verify
     * @memberof Result
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Result.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.steps != null && message.hasOwnProperty("steps")) {
            if (!Array.isArray(message.steps))
                return "steps: array expected";
            for (let i = 0; i < message.steps.length; ++i) {
                let error = $root.Step.verify(message.steps[i]);
                if (error)
                    return "steps." + error;
            }
        }
        return null;
    };

    /**
     * Creates a Result message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Result
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Result} Result
     */
    Result.fromObject = function fromObject(object) {
        if (object instanceof $root.Result)
            return object;
        let message = new $root.Result();
        if (object.steps) {
            if (!Array.isArray(object.steps))
                throw TypeError(".Result.steps: array expected");
            message.steps = [];
            for (let i = 0; i < object.steps.length; ++i) {
                if (typeof object.steps[i] !== "object")
                    throw TypeError(".Result.steps: object expected");
                message.steps[i] = $root.Step.fromObject(object.steps[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a Result message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Result
     * @static
     * @param {Result} message Result
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Result.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.steps = [];
        if (message.steps && message.steps.length) {
            object.steps = [];
            for (let j = 0; j < message.steps.length; ++j)
                object.steps[j] = $root.Step.toObject(message.steps[j], options);
        }
        return object;
    };

    /**
     * Converts this Result to JSON.
     * @function toJSON
     * @memberof Result
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Result.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Result;
})();

export const Tracers = $root.Tracers = (() => {

    /**
     * Constructs a new Tracers service.
     * @exports Tracers
     * @classdesc Represents a Tracers
     * @extends $protobuf.rpc.Service
     * @constructor
     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
     */
    function Tracers(rpcImpl, requestDelimited, responseDelimited) {
        $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
    }

    (Tracers.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = Tracers;

    /**
     * Creates new Tracers service using the specified rpc implementation.
     * @function create
     * @memberof Tracers
     * @static
     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
     * @returns {Tracers} RPC service. Useful where requests and/or responses are streamed.
     */
    Tracers.create = function create(rpcImpl, requestDelimited, responseDelimited) {
        return new this(rpcImpl, requestDelimited, responseDelimited);
    };

    /**
     * Callback as used by {@link Tracers#languages}.
     * @memberof Tracers
     * @typedef languagesCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {Languages} [response] Languages
     */

    /**
     * Calls languages.
     * @function languages
     * @memberof Tracers
     * @instance
     * @param {Empty} request Empty message or plain object
     * @param {Tracers.languagesCallback} callback Node-style callback called with the error, if any, and Languages
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(Tracers.prototype.languages = function languages(request, callback) {
        return this.rpcCall(languages, $root.Empty, $root.Languages, request, callback);
    }, "name", { value: "languages" });

    /**
     * Calls languages.
     * @function languages
     * @memberof Tracers
     * @instance
     * @param {Empty} request Empty message or plain object
     * @returns {Promise<Languages>} Promise
     * @variation 2
     */

    /**
     * Callback as used by {@link Tracers#trace}.
     * @memberof Tracers
     * @typedef traceCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {Result} [response] Result
     */

    /**
     * Calls trace.
     * @function trace
     * @memberof Tracers
     * @instance
     * @param {TraceRequest} request TraceRequest message or plain object
     * @param {Tracers.traceCallback} callback Node-style callback called with the error, if any, and Result
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(Tracers.prototype.trace = function trace(request, callback) {
        return this.rpcCall(trace, $root.TraceRequest, $root.Result, request, callback);
    }, "name", { value: "trace" });

    /**
     * Calls trace.
     * @function trace
     * @memberof Tracers
     * @instance
     * @param {TraceRequest} request TraceRequest message or plain object
     * @returns {Promise<Result>} Promise
     * @variation 2
     */

    return Tracers;
})();

export const Empty = $root.Empty = (() => {

    /**
     * Properties of an Empty.
     * @exports IEmpty
     * @interface IEmpty
     */

    /**
     * Constructs a new Empty.
     * @exports Empty
     * @classdesc Represents an Empty.
     * @implements IEmpty
     * @constructor
     * @param {IEmpty=} [properties] Properties to set
     */
    function Empty(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Creates a new Empty instance using the specified properties.
     * @function create
     * @memberof Empty
     * @static
     * @param {IEmpty=} [properties] Properties to set
     * @returns {Empty} Empty instance
     */
    Empty.create = function create(properties) {
        return new Empty(properties);
    };

    /**
     * Encodes the specified Empty message. Does not implicitly {@link Empty.verify|verify} messages.
     * @function encode
     * @memberof Empty
     * @static
     * @param {Empty} message Empty message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Empty.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        return writer;
    };

    /**
     * Encodes the specified Empty message, length delimited. Does not implicitly {@link Empty.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Empty
     * @static
     * @param {Empty} message Empty message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Empty.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Empty message from the specified reader or buffer.
     * @function decode
     * @memberof Empty
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Empty} Empty
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Empty.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Empty();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Empty message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Empty
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Empty} Empty
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Empty.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Empty message.
     * @function verify
     * @memberof Empty
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Empty.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        return null;
    };

    /**
     * Creates an Empty message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Empty
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Empty} Empty
     */
    Empty.fromObject = function fromObject(object) {
        if (object instanceof $root.Empty)
            return object;
        return new $root.Empty();
    };

    /**
     * Creates a plain object from an Empty message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Empty
     * @static
     * @param {Empty} message Empty
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Empty.toObject = function toObject() {
        return {};
    };

    /**
     * Converts this Empty to JSON.
     * @function toJSON
     * @memberof Empty
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Empty.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Empty;
})();

export const Languages = $root.Languages = (() => {

    /**
     * Properties of a Languages.
     * @exports ILanguages
     * @interface ILanguages
     * @property {Array.<string>|null} [languages] Languages languages
     */

    /**
     * Constructs a new Languages.
     * @exports Languages
     * @classdesc Represents a Languages.
     * @implements ILanguages
     * @constructor
     * @param {ILanguages=} [properties] Properties to set
     */
    function Languages(properties) {
        this.languages = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Languages languages.
     * @member {Array.<string>} languages
     * @memberof Languages
     * @instance
     */
    Languages.prototype.languages = $util.emptyArray;

    /**
     * Creates a new Languages instance using the specified properties.
     * @function create
     * @memberof Languages
     * @static
     * @param {ILanguages=} [properties] Properties to set
     * @returns {Languages} Languages instance
     */
    Languages.create = function create(properties) {
        return new Languages(properties);
    };

    /**
     * Encodes the specified Languages message. Does not implicitly {@link Languages.verify|verify} messages.
     * @function encode
     * @memberof Languages
     * @static
     * @param {Languages} message Languages message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Languages.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.languages != null && message.languages.length)
            for (let i = 0; i < message.languages.length; ++i)
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.languages[i]);
        return writer;
    };

    /**
     * Encodes the specified Languages message, length delimited. Does not implicitly {@link Languages.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Languages
     * @static
     * @param {Languages} message Languages message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Languages.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Languages message from the specified reader or buffer.
     * @function decode
     * @memberof Languages
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Languages} Languages
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Languages.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Languages();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.languages && message.languages.length))
                    message.languages = [];
                message.languages.push(reader.string());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Languages message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Languages
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Languages} Languages
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Languages.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Languages message.
     * @function verify
     * @memberof Languages
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Languages.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.languages != null && message.hasOwnProperty("languages")) {
            if (!Array.isArray(message.languages))
                return "languages: array expected";
            for (let i = 0; i < message.languages.length; ++i)
                if (!$util.isString(message.languages[i]))
                    return "languages: string[] expected";
        }
        return null;
    };

    /**
     * Creates a Languages message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Languages
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Languages} Languages
     */
    Languages.fromObject = function fromObject(object) {
        if (object instanceof $root.Languages)
            return object;
        let message = new $root.Languages();
        if (object.languages) {
            if (!Array.isArray(object.languages))
                throw TypeError(".Languages.languages: array expected");
            message.languages = [];
            for (let i = 0; i < object.languages.length; ++i)
                message.languages[i] = String(object.languages[i]);
        }
        return message;
    };

    /**
     * Creates a plain object from a Languages message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Languages
     * @static
     * @param {Languages} message Languages
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Languages.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.languages = [];
        if (message.languages && message.languages.length) {
            object.languages = [];
            for (let j = 0; j < message.languages.length; ++j)
                object.languages[j] = message.languages[j];
        }
        return object;
    };

    /**
     * Converts this Languages to JSON.
     * @function toJSON
     * @memberof Languages
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Languages.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Languages;
})();

export const TraceRequest = $root.TraceRequest = (() => {

    /**
     * Properties of a TraceRequest.
     * @exports ITraceRequest
     * @interface ITraceRequest
     * @property {Trace|null} [trace] TraceRequest trace
     * @property {string|null} [language] TraceRequest language
     */

    /**
     * Constructs a new TraceRequest.
     * @exports TraceRequest
     * @classdesc Represents a TraceRequest.
     * @implements ITraceRequest
     * @constructor
     * @param {ITraceRequest=} [properties] Properties to set
     */
    function TraceRequest(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * TraceRequest trace.
     * @member {Trace|null|undefined} trace
     * @memberof TraceRequest
     * @instance
     */
    TraceRequest.prototype.trace = null;

    /**
     * TraceRequest language.
     * @member {string} language
     * @memberof TraceRequest
     * @instance
     */
    TraceRequest.prototype.language = "";

    /**
     * Creates a new TraceRequest instance using the specified properties.
     * @function create
     * @memberof TraceRequest
     * @static
     * @param {ITraceRequest=} [properties] Properties to set
     * @returns {TraceRequest} TraceRequest instance
     */
    TraceRequest.create = function create(properties) {
        return new TraceRequest(properties);
    };

    /**
     * Encodes the specified TraceRequest message. Does not implicitly {@link TraceRequest.verify|verify} messages.
     * @function encode
     * @memberof TraceRequest
     * @static
     * @param {TraceRequest} message TraceRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TraceRequest.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.trace != null && message.hasOwnProperty("trace"))
            $root.Trace.encode(message.trace, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.language != null && message.hasOwnProperty("language"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.language);
        return writer;
    };

    /**
     * Encodes the specified TraceRequest message, length delimited. Does not implicitly {@link TraceRequest.verify|verify} messages.
     * @function encodeDelimited
     * @memberof TraceRequest
     * @static
     * @param {TraceRequest} message TraceRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TraceRequest.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a TraceRequest message from the specified reader or buffer.
     * @function decode
     * @memberof TraceRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {TraceRequest} TraceRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TraceRequest.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.TraceRequest();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.trace = $root.Trace.decode(reader, reader.uint32());
                break;
            case 2:
                message.language = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a TraceRequest message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof TraceRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {TraceRequest} TraceRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TraceRequest.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a TraceRequest message.
     * @function verify
     * @memberof TraceRequest
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    TraceRequest.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.trace != null && message.hasOwnProperty("trace")) {
            let error = $root.Trace.verify(message.trace);
            if (error)
                return "trace." + error;
        }
        if (message.language != null && message.hasOwnProperty("language"))
            if (!$util.isString(message.language))
                return "language: string expected";
        return null;
    };

    /**
     * Creates a TraceRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof TraceRequest
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {TraceRequest} TraceRequest
     */
    TraceRequest.fromObject = function fromObject(object) {
        if (object instanceof $root.TraceRequest)
            return object;
        let message = new $root.TraceRequest();
        if (object.trace != null) {
            if (typeof object.trace !== "object")
                throw TypeError(".TraceRequest.trace: object expected");
            message.trace = $root.Trace.fromObject(object.trace);
        }
        if (object.language != null)
            message.language = String(object.language);
        return message;
    };

    /**
     * Creates a plain object from a TraceRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof TraceRequest
     * @static
     * @param {TraceRequest} message TraceRequest
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    TraceRequest.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.trace = null;
            object.language = "";
        }
        if (message.trace != null && message.hasOwnProperty("trace"))
            object.trace = $root.Trace.toObject(message.trace, options);
        if (message.language != null && message.hasOwnProperty("language"))
            object.language = message.language;
        return object;
    };

    /**
     * Converts this TraceRequest to JSON.
     * @function toJSON
     * @memberof TraceRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    TraceRequest.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return TraceRequest;
})();

export { $root as default };
