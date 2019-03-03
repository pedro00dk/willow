/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const TracerRequest = $root.TracerRequest = (() => {

    /**
     * Properties of a TracerRequest.
     * @exports ITracerRequest
     * @interface ITracerRequest
     * @property {Array.<Action>|null} [actions] TracerRequest actions
     */

    /**
     * Constructs a new TracerRequest.
     * @exports TracerRequest
     * @classdesc Represents a TracerRequest.
     * @implements ITracerRequest
     * @constructor
     * @param {ITracerRequest=} [properties] Properties to set
     */
    function TracerRequest(properties) {
        this.actions = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * TracerRequest actions.
     * @member {Array.<Action>} actions
     * @memberof TracerRequest
     * @instance
     */
    TracerRequest.prototype.actions = $util.emptyArray;

    /**
     * Creates a new TracerRequest instance using the specified properties.
     * @function create
     * @memberof TracerRequest
     * @static
     * @param {ITracerRequest=} [properties] Properties to set
     * @returns {TracerRequest} TracerRequest instance
     */
    TracerRequest.create = function create(properties) {
        return new TracerRequest(properties);
    };

    /**
     * Encodes the specified TracerRequest message. Does not implicitly {@link TracerRequest.verify|verify} messages.
     * @function encode
     * @memberof TracerRequest
     * @static
     * @param {TracerRequest} message TracerRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TracerRequest.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.actions != null && message.actions.length)
            for (let i = 0; i < message.actions.length; ++i)
                $root.Action.encode(message.actions[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified TracerRequest message, length delimited. Does not implicitly {@link TracerRequest.verify|verify} messages.
     * @function encodeDelimited
     * @memberof TracerRequest
     * @static
     * @param {TracerRequest} message TracerRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TracerRequest.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a TracerRequest message from the specified reader or buffer.
     * @function decode
     * @memberof TracerRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {TracerRequest} TracerRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TracerRequest.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.TracerRequest();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.actions && message.actions.length))
                    message.actions = [];
                message.actions.push($root.Action.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a TracerRequest message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof TracerRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {TracerRequest} TracerRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TracerRequest.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a TracerRequest message.
     * @function verify
     * @memberof TracerRequest
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    TracerRequest.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.actions != null && message.hasOwnProperty("actions")) {
            if (!Array.isArray(message.actions))
                return "actions: array expected";
            for (let i = 0; i < message.actions.length; ++i) {
                let error = $root.Action.verify(message.actions[i]);
                if (error)
                    return "actions." + error;
            }
        }
        return null;
    };

    /**
     * Creates a TracerRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof TracerRequest
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {TracerRequest} TracerRequest
     */
    TracerRequest.fromObject = function fromObject(object) {
        if (object instanceof $root.TracerRequest)
            return object;
        let message = new $root.TracerRequest();
        if (object.actions) {
            if (!Array.isArray(object.actions))
                throw TypeError(".TracerRequest.actions: array expected");
            message.actions = [];
            for (let i = 0; i < object.actions.length; ++i) {
                if (typeof object.actions[i] !== "object")
                    throw TypeError(".TracerRequest.actions: object expected");
                message.actions[i] = $root.Action.fromObject(object.actions[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a TracerRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof TracerRequest
     * @static
     * @param {TracerRequest} message TracerRequest
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    TracerRequest.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.actions = [];
        if (message.actions && message.actions.length) {
            object.actions = [];
            for (let j = 0; j < message.actions.length; ++j)
                object.actions[j] = $root.Action.toObject(message.actions[j], options);
        }
        return object;
    };

    /**
     * Converts this TracerRequest to JSON.
     * @function toJSON
     * @memberof TracerRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    TracerRequest.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return TracerRequest;
})();

export const Action = $root.Action = (() => {

    /**
     * Properties of an Action.
     * @exports IAction
     * @interface IAction
     * @property {Action.Create|null} [create] Action create
     * @property {Action.Start|null} [start] Action start
     * @property {Action.Stop|null} [stop] Action stop
     * @property {Action.Stop|null} [step] Action step
     * @property {Action.Input|null} [input] Action input
     */

    /**
     * Constructs a new Action.
     * @exports Action
     * @classdesc Represents an Action.
     * @implements IAction
     * @constructor
     * @param {IAction=} [properties] Properties to set
     */
    function Action(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Action create.
     * @member {Action.Create|null|undefined} create
     * @memberof Action
     * @instance
     */
    Action.prototype.create = null;

    /**
     * Action start.
     * @member {Action.Start|null|undefined} start
     * @memberof Action
     * @instance
     */
    Action.prototype.start = null;

    /**
     * Action stop.
     * @member {Action.Stop|null|undefined} stop
     * @memberof Action
     * @instance
     */
    Action.prototype.stop = null;

    /**
     * Action step.
     * @member {Action.Stop|null|undefined} step
     * @memberof Action
     * @instance
     */
    Action.prototype.step = null;

    /**
     * Action input.
     * @member {Action.Input|null|undefined} input
     * @memberof Action
     * @instance
     */
    Action.prototype.input = null;

    // OneOf field names bound to virtual getters and setters
    let $oneOfFields;

    /**
     * Action action.
     * @member {"create"|"start"|"stop"|"step"|"input"|undefined} action
     * @memberof Action
     * @instance
     */
    Object.defineProperty(Action.prototype, "action", {
        get: $util.oneOfGetter($oneOfFields = ["create", "start", "stop", "step", "input"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new Action instance using the specified properties.
     * @function create
     * @memberof Action
     * @static
     * @param {IAction=} [properties] Properties to set
     * @returns {Action} Action instance
     */
    Action.create = function create(properties) {
        return new Action(properties);
    };

    /**
     * Encodes the specified Action message. Does not implicitly {@link Action.verify|verify} messages.
     * @function encode
     * @memberof Action
     * @static
     * @param {Action} message Action message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Action.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.create != null && message.hasOwnProperty("create"))
            $root.Action.Create.encode(message.create, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.start != null && message.hasOwnProperty("start"))
            $root.Action.Start.encode(message.start, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.stop != null && message.hasOwnProperty("stop"))
            $root.Action.Stop.encode(message.stop, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.step != null && message.hasOwnProperty("step"))
            $root.Action.Stop.encode(message.step, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        if (message.input != null && message.hasOwnProperty("input"))
            $root.Action.Input.encode(message.input, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Action message, length delimited. Does not implicitly {@link Action.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Action
     * @static
     * @param {Action} message Action message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Action.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Action message from the specified reader or buffer.
     * @function decode
     * @memberof Action
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Action} Action
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Action.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Action();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.create = $root.Action.Create.decode(reader, reader.uint32());
                break;
            case 2:
                message.start = $root.Action.Start.decode(reader, reader.uint32());
                break;
            case 3:
                message.stop = $root.Action.Stop.decode(reader, reader.uint32());
                break;
            case 4:
                message.step = $root.Action.Stop.decode(reader, reader.uint32());
                break;
            case 5:
                message.input = $root.Action.Input.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Action message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Action
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Action} Action
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Action.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Action message.
     * @function verify
     * @memberof Action
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Action.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        let properties = {};
        if (message.create != null && message.hasOwnProperty("create")) {
            properties.action = 1;
            {
                let error = $root.Action.Create.verify(message.create);
                if (error)
                    return "create." + error;
            }
        }
        if (message.start != null && message.hasOwnProperty("start")) {
            if (properties.action === 1)
                return "action: multiple values";
            properties.action = 1;
            {
                let error = $root.Action.Start.verify(message.start);
                if (error)
                    return "start." + error;
            }
        }
        if (message.stop != null && message.hasOwnProperty("stop")) {
            if (properties.action === 1)
                return "action: multiple values";
            properties.action = 1;
            {
                let error = $root.Action.Stop.verify(message.stop);
                if (error)
                    return "stop." + error;
            }
        }
        if (message.step != null && message.hasOwnProperty("step")) {
            if (properties.action === 1)
                return "action: multiple values";
            properties.action = 1;
            {
                let error = $root.Action.Stop.verify(message.step);
                if (error)
                    return "step." + error;
            }
        }
        if (message.input != null && message.hasOwnProperty("input")) {
            if (properties.action === 1)
                return "action: multiple values";
            properties.action = 1;
            {
                let error = $root.Action.Input.verify(message.input);
                if (error)
                    return "input." + error;
            }
        }
        return null;
    };

    /**
     * Creates an Action message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Action
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Action} Action
     */
    Action.fromObject = function fromObject(object) {
        if (object instanceof $root.Action)
            return object;
        let message = new $root.Action();
        if (object.create != null) {
            if (typeof object.create !== "object")
                throw TypeError(".Action.create: object expected");
            message.create = $root.Action.Create.fromObject(object.create);
        }
        if (object.start != null) {
            if (typeof object.start !== "object")
                throw TypeError(".Action.start: object expected");
            message.start = $root.Action.Start.fromObject(object.start);
        }
        if (object.stop != null) {
            if (typeof object.stop !== "object")
                throw TypeError(".Action.stop: object expected");
            message.stop = $root.Action.Stop.fromObject(object.stop);
        }
        if (object.step != null) {
            if (typeof object.step !== "object")
                throw TypeError(".Action.step: object expected");
            message.step = $root.Action.Stop.fromObject(object.step);
        }
        if (object.input != null) {
            if (typeof object.input !== "object")
                throw TypeError(".Action.input: object expected");
            message.input = $root.Action.Input.fromObject(object.input);
        }
        return message;
    };

    /**
     * Creates a plain object from an Action message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Action
     * @static
     * @param {Action} message Action
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Action.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (message.create != null && message.hasOwnProperty("create")) {
            object.create = $root.Action.Create.toObject(message.create, options);
            if (options.oneofs)
                object.action = "create";
        }
        if (message.start != null && message.hasOwnProperty("start")) {
            object.start = $root.Action.Start.toObject(message.start, options);
            if (options.oneofs)
                object.action = "start";
        }
        if (message.stop != null && message.hasOwnProperty("stop")) {
            object.stop = $root.Action.Stop.toObject(message.stop, options);
            if (options.oneofs)
                object.action = "stop";
        }
        if (message.step != null && message.hasOwnProperty("step")) {
            object.step = $root.Action.Stop.toObject(message.step, options);
            if (options.oneofs)
                object.action = "step";
        }
        if (message.input != null && message.hasOwnProperty("input")) {
            object.input = $root.Action.Input.toObject(message.input, options);
            if (options.oneofs)
                object.action = "input";
        }
        return object;
    };

    /**
     * Converts this Action to JSON.
     * @function toJSON
     * @memberof Action
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Action.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    Action.Create = (function() {

        /**
         * Properties of a Create.
         * @memberof Action
         * @interface ICreate
         * @property {string|null} [main] Create main
         * @property {string|null} [code] Create code
         * @property {Uint8Array|null} [tar] Create tar
         */

        /**
         * Constructs a new Create.
         * @memberof Action
         * @classdesc Represents a Create.
         * @implements ICreate
         * @constructor
         * @param {Action.ICreate=} [properties] Properties to set
         */
        function Create(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Create main.
         * @member {string} main
         * @memberof Action.Create
         * @instance
         */
        Create.prototype.main = "";

        /**
         * Create code.
         * @member {string} code
         * @memberof Action.Create
         * @instance
         */
        Create.prototype.code = "";

        /**
         * Create tar.
         * @member {Uint8Array} tar
         * @memberof Action.Create
         * @instance
         */
        Create.prototype.tar = $util.newBuffer([]);

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * Create source.
         * @member {"code"|"tar"|undefined} source
         * @memberof Action.Create
         * @instance
         */
        Object.defineProperty(Create.prototype, "source", {
            get: $util.oneOfGetter($oneOfFields = ["code", "tar"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new Create instance using the specified properties.
         * @function create
         * @memberof Action.Create
         * @static
         * @param {Action.ICreate=} [properties] Properties to set
         * @returns {Action.Create} Create instance
         */
        Create.create = function create(properties) {
            return new Create(properties);
        };

        /**
         * Encodes the specified Create message. Does not implicitly {@link Action.Create.verify|verify} messages.
         * @function encode
         * @memberof Action.Create
         * @static
         * @param {Action.Create} message Create message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Create.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.main != null && message.hasOwnProperty("main"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.main);
            if (message.code != null && message.hasOwnProperty("code"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.code);
            if (message.tar != null && message.hasOwnProperty("tar"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.tar);
            return writer;
        };

        /**
         * Encodes the specified Create message, length delimited. Does not implicitly {@link Action.Create.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Action.Create
         * @static
         * @param {Action.Create} message Create message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Create.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Create message from the specified reader or buffer.
         * @function decode
         * @memberof Action.Create
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Action.Create} Create
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Create.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Action.Create();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.main = reader.string();
                    break;
                case 2:
                    message.code = reader.string();
                    break;
                case 3:
                    message.tar = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Create message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Action.Create
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Action.Create} Create
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Create.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Create message.
         * @function verify
         * @memberof Action.Create
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Create.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.main != null && message.hasOwnProperty("main"))
                if (!$util.isString(message.main))
                    return "main: string expected";
            if (message.code != null && message.hasOwnProperty("code")) {
                properties.source = 1;
                if (!$util.isString(message.code))
                    return "code: string expected";
            }
            if (message.tar != null && message.hasOwnProperty("tar")) {
                if (properties.source === 1)
                    return "source: multiple values";
                properties.source = 1;
                if (!(message.tar && typeof message.tar.length === "number" || $util.isString(message.tar)))
                    return "tar: buffer expected";
            }
            return null;
        };

        /**
         * Creates a Create message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Action.Create
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Action.Create} Create
         */
        Create.fromObject = function fromObject(object) {
            if (object instanceof $root.Action.Create)
                return object;
            let message = new $root.Action.Create();
            if (object.main != null)
                message.main = String(object.main);
            if (object.code != null)
                message.code = String(object.code);
            if (object.tar != null)
                if (typeof object.tar === "string")
                    $util.base64.decode(object.tar, message.tar = $util.newBuffer($util.base64.length(object.tar)), 0);
                else if (object.tar.length)
                    message.tar = object.tar;
            return message;
        };

        /**
         * Creates a plain object from a Create message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Action.Create
         * @static
         * @param {Action.Create} message Create
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Create.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.main = "";
            if (message.main != null && message.hasOwnProperty("main"))
                object.main = message.main;
            if (message.code != null && message.hasOwnProperty("code")) {
                object.code = message.code;
                if (options.oneofs)
                    object.source = "code";
            }
            if (message.tar != null && message.hasOwnProperty("tar")) {
                object.tar = options.bytes === String ? $util.base64.encode(message.tar, 0, message.tar.length) : options.bytes === Array ? Array.prototype.slice.call(message.tar) : message.tar;
                if (options.oneofs)
                    object.source = "tar";
            }
            return object;
        };

        /**
         * Converts this Create to JSON.
         * @function toJSON
         * @memberof Action.Create
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Create.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Create;
    })();

    Action.Start = (function() {

        /**
         * Properties of a Start.
         * @memberof Action
         * @interface IStart
         */

        /**
         * Constructs a new Start.
         * @memberof Action
         * @classdesc Represents a Start.
         * @implements IStart
         * @constructor
         * @param {Action.IStart=} [properties] Properties to set
         */
        function Start(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new Start instance using the specified properties.
         * @function create
         * @memberof Action.Start
         * @static
         * @param {Action.IStart=} [properties] Properties to set
         * @returns {Action.Start} Start instance
         */
        Start.create = function create(properties) {
            return new Start(properties);
        };

        /**
         * Encodes the specified Start message. Does not implicitly {@link Action.Start.verify|verify} messages.
         * @function encode
         * @memberof Action.Start
         * @static
         * @param {Action.Start} message Start message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Start.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified Start message, length delimited. Does not implicitly {@link Action.Start.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Action.Start
         * @static
         * @param {Action.Start} message Start message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Start.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Start message from the specified reader or buffer.
         * @function decode
         * @memberof Action.Start
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Action.Start} Start
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Start.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Action.Start();
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
         * Decodes a Start message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Action.Start
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Action.Start} Start
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Start.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Start message.
         * @function verify
         * @memberof Action.Start
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Start.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a Start message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Action.Start
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Action.Start} Start
         */
        Start.fromObject = function fromObject(object) {
            if (object instanceof $root.Action.Start)
                return object;
            return new $root.Action.Start();
        };

        /**
         * Creates a plain object from a Start message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Action.Start
         * @static
         * @param {Action.Start} message Start
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Start.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this Start to JSON.
         * @function toJSON
         * @memberof Action.Start
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Start.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Start;
    })();

    Action.Stop = (function() {

        /**
         * Properties of a Stop.
         * @memberof Action
         * @interface IStop
         */

        /**
         * Constructs a new Stop.
         * @memberof Action
         * @classdesc Represents a Stop.
         * @implements IStop
         * @constructor
         * @param {Action.IStop=} [properties] Properties to set
         */
        function Stop(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new Stop instance using the specified properties.
         * @function create
         * @memberof Action.Stop
         * @static
         * @param {Action.IStop=} [properties] Properties to set
         * @returns {Action.Stop} Stop instance
         */
        Stop.create = function create(properties) {
            return new Stop(properties);
        };

        /**
         * Encodes the specified Stop message. Does not implicitly {@link Action.Stop.verify|verify} messages.
         * @function encode
         * @memberof Action.Stop
         * @static
         * @param {Action.Stop} message Stop message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Stop.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified Stop message, length delimited. Does not implicitly {@link Action.Stop.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Action.Stop
         * @static
         * @param {Action.Stop} message Stop message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Stop.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Stop message from the specified reader or buffer.
         * @function decode
         * @memberof Action.Stop
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Action.Stop} Stop
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Stop.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Action.Stop();
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
         * Decodes a Stop message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Action.Stop
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Action.Stop} Stop
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Stop.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Stop message.
         * @function verify
         * @memberof Action.Stop
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Stop.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a Stop message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Action.Stop
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Action.Stop} Stop
         */
        Stop.fromObject = function fromObject(object) {
            if (object instanceof $root.Action.Stop)
                return object;
            return new $root.Action.Stop();
        };

        /**
         * Creates a plain object from a Stop message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Action.Stop
         * @static
         * @param {Action.Stop} message Stop
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Stop.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this Stop to JSON.
         * @function toJSON
         * @memberof Action.Stop
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Stop.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Stop;
    })();

    Action.Step = (function() {

        /**
         * Properties of a Step.
         * @memberof Action
         * @interface IStep
         */

        /**
         * Constructs a new Step.
         * @memberof Action
         * @classdesc Represents a Step.
         * @implements IStep
         * @constructor
         * @param {Action.IStep=} [properties] Properties to set
         */
        function Step(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new Step instance using the specified properties.
         * @function create
         * @memberof Action.Step
         * @static
         * @param {Action.IStep=} [properties] Properties to set
         * @returns {Action.Step} Step instance
         */
        Step.create = function create(properties) {
            return new Step(properties);
        };

        /**
         * Encodes the specified Step message. Does not implicitly {@link Action.Step.verify|verify} messages.
         * @function encode
         * @memberof Action.Step
         * @static
         * @param {Action.Step} message Step message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Step.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified Step message, length delimited. Does not implicitly {@link Action.Step.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Action.Step
         * @static
         * @param {Action.Step} message Step message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Step.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Step message from the specified reader or buffer.
         * @function decode
         * @memberof Action.Step
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Action.Step} Step
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Step.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Action.Step();
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
         * Decodes a Step message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Action.Step
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Action.Step} Step
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
         * @memberof Action.Step
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Step.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a Step message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Action.Step
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Action.Step} Step
         */
        Step.fromObject = function fromObject(object) {
            if (object instanceof $root.Action.Step)
                return object;
            return new $root.Action.Step();
        };

        /**
         * Creates a plain object from a Step message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Action.Step
         * @static
         * @param {Action.Step} message Step
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Step.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this Step to JSON.
         * @function toJSON
         * @memberof Action.Step
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Step.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Step;
    })();

    Action.Input = (function() {

        /**
         * Properties of an Input.
         * @memberof Action
         * @interface IInput
         * @property {Array.<string>|null} [lines] Input lines
         */

        /**
         * Constructs a new Input.
         * @memberof Action
         * @classdesc Represents an Input.
         * @implements IInput
         * @constructor
         * @param {Action.IInput=} [properties] Properties to set
         */
        function Input(properties) {
            this.lines = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Input lines.
         * @member {Array.<string>} lines
         * @memberof Action.Input
         * @instance
         */
        Input.prototype.lines = $util.emptyArray;

        /**
         * Creates a new Input instance using the specified properties.
         * @function create
         * @memberof Action.Input
         * @static
         * @param {Action.IInput=} [properties] Properties to set
         * @returns {Action.Input} Input instance
         */
        Input.create = function create(properties) {
            return new Input(properties);
        };

        /**
         * Encodes the specified Input message. Does not implicitly {@link Action.Input.verify|verify} messages.
         * @function encode
         * @memberof Action.Input
         * @static
         * @param {Action.Input} message Input message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Input.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.lines != null && message.lines.length)
                for (let i = 0; i < message.lines.length; ++i)
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.lines[i]);
            return writer;
        };

        /**
         * Encodes the specified Input message, length delimited. Does not implicitly {@link Action.Input.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Action.Input
         * @static
         * @param {Action.Input} message Input message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Input.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Input message from the specified reader or buffer.
         * @function decode
         * @memberof Action.Input
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Action.Input} Input
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Input.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Action.Input();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.lines && message.lines.length))
                        message.lines = [];
                    message.lines.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Input message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Action.Input
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Action.Input} Input
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Input.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Input message.
         * @function verify
         * @memberof Action.Input
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Input.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.lines != null && message.hasOwnProperty("lines")) {
                if (!Array.isArray(message.lines))
                    return "lines: array expected";
                for (let i = 0; i < message.lines.length; ++i)
                    if (!$util.isString(message.lines[i]))
                        return "lines: string[] expected";
            }
            return null;
        };

        /**
         * Creates an Input message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Action.Input
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Action.Input} Input
         */
        Input.fromObject = function fromObject(object) {
            if (object instanceof $root.Action.Input)
                return object;
            let message = new $root.Action.Input();
            if (object.lines) {
                if (!Array.isArray(object.lines))
                    throw TypeError(".Action.Input.lines: array expected");
                message.lines = [];
                for (let i = 0; i < object.lines.length; ++i)
                    message.lines[i] = String(object.lines[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from an Input message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Action.Input
         * @static
         * @param {Action.Input} message Input
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Input.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.lines = [];
            if (message.lines && message.lines.length) {
                object.lines = [];
                for (let j = 0; j < message.lines.length; ++j)
                    object.lines[j] = message.lines[j];
            }
            return object;
        };

        /**
         * Converts this Input to JSON.
         * @function toJSON
         * @memberof Action.Input
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Input.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Input;
    })();

    return Action;
})();

export const TracerResponse = $root.TracerResponse = (() => {

    /**
     * Properties of a TracerResponse.
     * @exports ITracerResponse
     * @interface ITracerResponse
     * @property {Array.<Result>|null} [results] TracerResponse results
     */

    /**
     * Constructs a new TracerResponse.
     * @exports TracerResponse
     * @classdesc Represents a TracerResponse.
     * @implements ITracerResponse
     * @constructor
     * @param {ITracerResponse=} [properties] Properties to set
     */
    function TracerResponse(properties) {
        this.results = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * TracerResponse results.
     * @member {Array.<Result>} results
     * @memberof TracerResponse
     * @instance
     */
    TracerResponse.prototype.results = $util.emptyArray;

    /**
     * Creates a new TracerResponse instance using the specified properties.
     * @function create
     * @memberof TracerResponse
     * @static
     * @param {ITracerResponse=} [properties] Properties to set
     * @returns {TracerResponse} TracerResponse instance
     */
    TracerResponse.create = function create(properties) {
        return new TracerResponse(properties);
    };

    /**
     * Encodes the specified TracerResponse message. Does not implicitly {@link TracerResponse.verify|verify} messages.
     * @function encode
     * @memberof TracerResponse
     * @static
     * @param {TracerResponse} message TracerResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TracerResponse.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.results != null && message.results.length)
            for (let i = 0; i < message.results.length; ++i)
                $root.Result.encode(message.results[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified TracerResponse message, length delimited. Does not implicitly {@link TracerResponse.verify|verify} messages.
     * @function encodeDelimited
     * @memberof TracerResponse
     * @static
     * @param {TracerResponse} message TracerResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TracerResponse.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a TracerResponse message from the specified reader or buffer.
     * @function decode
     * @memberof TracerResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {TracerResponse} TracerResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TracerResponse.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.TracerResponse();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.results && message.results.length))
                    message.results = [];
                message.results.push($root.Result.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a TracerResponse message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof TracerResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {TracerResponse} TracerResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TracerResponse.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a TracerResponse message.
     * @function verify
     * @memberof TracerResponse
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    TracerResponse.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.results != null && message.hasOwnProperty("results")) {
            if (!Array.isArray(message.results))
                return "results: array expected";
            for (let i = 0; i < message.results.length; ++i) {
                let error = $root.Result.verify(message.results[i]);
                if (error)
                    return "results." + error;
            }
        }
        return null;
    };

    /**
     * Creates a TracerResponse message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof TracerResponse
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {TracerResponse} TracerResponse
     */
    TracerResponse.fromObject = function fromObject(object) {
        if (object instanceof $root.TracerResponse)
            return object;
        let message = new $root.TracerResponse();
        if (object.results) {
            if (!Array.isArray(object.results))
                throw TypeError(".TracerResponse.results: array expected");
            message.results = [];
            for (let i = 0; i < object.results.length; ++i) {
                if (typeof object.results[i] !== "object")
                    throw TypeError(".TracerResponse.results: object expected");
                message.results[i] = $root.Result.fromObject(object.results[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a TracerResponse message. Also converts values to other types if specified.
     * @function toObject
     * @memberof TracerResponse
     * @static
     * @param {TracerResponse} message TracerResponse
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    TracerResponse.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.results = [];
        if (message.results && message.results.length) {
            object.results = [];
            for (let j = 0; j < message.results.length; ++j)
                object.results[j] = $root.Result.toObject(message.results[j], options);
        }
        return object;
    };

    /**
     * Converts this TracerResponse to JSON.
     * @function toJSON
     * @memberof TracerResponse
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    TracerResponse.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return TracerResponse;
})();

export const Result = $root.Result = (() => {

    /**
     * Properties of a Result.
     * @exports IResult
     * @interface IResult
     * @property {Result.Created|null} [created] Result created
     * @property {Result.Started|null} [started] Result started
     * @property {Result.Frame|null} [frame] Result frame
     * @property {Result.Print|null} [print] Result print
     * @property {Result.Lock|null} [lock] Result lock
     * @property {Result.Error|null} [error] Result error
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
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Result created.
     * @member {Result.Created|null|undefined} created
     * @memberof Result
     * @instance
     */
    Result.prototype.created = null;

    /**
     * Result started.
     * @member {Result.Started|null|undefined} started
     * @memberof Result
     * @instance
     */
    Result.prototype.started = null;

    /**
     * Result frame.
     * @member {Result.Frame|null|undefined} frame
     * @memberof Result
     * @instance
     */
    Result.prototype.frame = null;

    /**
     * Result print.
     * @member {Result.Print|null|undefined} print
     * @memberof Result
     * @instance
     */
    Result.prototype.print = null;

    /**
     * Result lock.
     * @member {Result.Lock|null|undefined} lock
     * @memberof Result
     * @instance
     */
    Result.prototype.lock = null;

    /**
     * Result error.
     * @member {Result.Error|null|undefined} error
     * @memberof Result
     * @instance
     */
    Result.prototype.error = null;

    // OneOf field names bound to virtual getters and setters
    let $oneOfFields;

    /**
     * Result result.
     * @member {"created"|"started"|"frame"|"print"|"lock"|"error"|undefined} result
     * @memberof Result
     * @instance
     */
    Object.defineProperty(Result.prototype, "result", {
        get: $util.oneOfGetter($oneOfFields = ["created", "started", "frame", "print", "lock", "error"]),
        set: $util.oneOfSetter($oneOfFields)
    });

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
        if (message.created != null && message.hasOwnProperty("created"))
            $root.Result.Created.encode(message.created, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.started != null && message.hasOwnProperty("started"))
            $root.Result.Started.encode(message.started, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.frame != null && message.hasOwnProperty("frame"))
            $root.Result.Frame.encode(message.frame, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.print != null && message.hasOwnProperty("print"))
            $root.Result.Print.encode(message.print, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        if (message.lock != null && message.hasOwnProperty("lock"))
            $root.Result.Lock.encode(message.lock, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        if (message.error != null && message.hasOwnProperty("error"))
            $root.Result.Error.encode(message.error, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
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
                message.created = $root.Result.Created.decode(reader, reader.uint32());
                break;
            case 2:
                message.started = $root.Result.Started.decode(reader, reader.uint32());
                break;
            case 3:
                message.frame = $root.Result.Frame.decode(reader, reader.uint32());
                break;
            case 4:
                message.print = $root.Result.Print.decode(reader, reader.uint32());
                break;
            case 5:
                message.lock = $root.Result.Lock.decode(reader, reader.uint32());
                break;
            case 6:
                message.error = $root.Result.Error.decode(reader, reader.uint32());
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
        let properties = {};
        if (message.created != null && message.hasOwnProperty("created")) {
            properties.result = 1;
            {
                let error = $root.Result.Created.verify(message.created);
                if (error)
                    return "created." + error;
            }
        }
        if (message.started != null && message.hasOwnProperty("started")) {
            if (properties.result === 1)
                return "result: multiple values";
            properties.result = 1;
            {
                let error = $root.Result.Started.verify(message.started);
                if (error)
                    return "started." + error;
            }
        }
        if (message.frame != null && message.hasOwnProperty("frame")) {
            if (properties.result === 1)
                return "result: multiple values";
            properties.result = 1;
            {
                let error = $root.Result.Frame.verify(message.frame);
                if (error)
                    return "frame." + error;
            }
        }
        if (message.print != null && message.hasOwnProperty("print")) {
            if (properties.result === 1)
                return "result: multiple values";
            properties.result = 1;
            {
                let error = $root.Result.Print.verify(message.print);
                if (error)
                    return "print." + error;
            }
        }
        if (message.lock != null && message.hasOwnProperty("lock")) {
            if (properties.result === 1)
                return "result: multiple values";
            properties.result = 1;
            {
                let error = $root.Result.Lock.verify(message.lock);
                if (error)
                    return "lock." + error;
            }
        }
        if (message.error != null && message.hasOwnProperty("error")) {
            if (properties.result === 1)
                return "result: multiple values";
            properties.result = 1;
            {
                let error = $root.Result.Error.verify(message.error);
                if (error)
                    return "error." + error;
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
        if (object.created != null) {
            if (typeof object.created !== "object")
                throw TypeError(".Result.created: object expected");
            message.created = $root.Result.Created.fromObject(object.created);
        }
        if (object.started != null) {
            if (typeof object.started !== "object")
                throw TypeError(".Result.started: object expected");
            message.started = $root.Result.Started.fromObject(object.started);
        }
        if (object.frame != null) {
            if (typeof object.frame !== "object")
                throw TypeError(".Result.frame: object expected");
            message.frame = $root.Result.Frame.fromObject(object.frame);
        }
        if (object.print != null) {
            if (typeof object.print !== "object")
                throw TypeError(".Result.print: object expected");
            message.print = $root.Result.Print.fromObject(object.print);
        }
        if (object.lock != null) {
            if (typeof object.lock !== "object")
                throw TypeError(".Result.lock: object expected");
            message.lock = $root.Result.Lock.fromObject(object.lock);
        }
        if (object.error != null) {
            if (typeof object.error !== "object")
                throw TypeError(".Result.error: object expected");
            message.error = $root.Result.Error.fromObject(object.error);
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
        if (message.created != null && message.hasOwnProperty("created")) {
            object.created = $root.Result.Created.toObject(message.created, options);
            if (options.oneofs)
                object.result = "created";
        }
        if (message.started != null && message.hasOwnProperty("started")) {
            object.started = $root.Result.Started.toObject(message.started, options);
            if (options.oneofs)
                object.result = "started";
        }
        if (message.frame != null && message.hasOwnProperty("frame")) {
            object.frame = $root.Result.Frame.toObject(message.frame, options);
            if (options.oneofs)
                object.result = "frame";
        }
        if (message.print != null && message.hasOwnProperty("print")) {
            object.print = $root.Result.Print.toObject(message.print, options);
            if (options.oneofs)
                object.result = "print";
        }
        if (message.lock != null && message.hasOwnProperty("lock")) {
            object.lock = $root.Result.Lock.toObject(message.lock, options);
            if (options.oneofs)
                object.result = "lock";
        }
        if (message.error != null && message.hasOwnProperty("error")) {
            object.error = $root.Result.Error.toObject(message.error, options);
            if (options.oneofs)
                object.result = "error";
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

    Result.Created = (function() {

        /**
         * Properties of a Created.
         * @memberof Result
         * @interface ICreated
         */

        /**
         * Constructs a new Created.
         * @memberof Result
         * @classdesc Represents a Created.
         * @implements ICreated
         * @constructor
         * @param {Result.ICreated=} [properties] Properties to set
         */
        function Created(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new Created instance using the specified properties.
         * @function create
         * @memberof Result.Created
         * @static
         * @param {Result.ICreated=} [properties] Properties to set
         * @returns {Result.Created} Created instance
         */
        Created.create = function create(properties) {
            return new Created(properties);
        };

        /**
         * Encodes the specified Created message. Does not implicitly {@link Result.Created.verify|verify} messages.
         * @function encode
         * @memberof Result.Created
         * @static
         * @param {Result.Created} message Created message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Created.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified Created message, length delimited. Does not implicitly {@link Result.Created.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Result.Created
         * @static
         * @param {Result.Created} message Created message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Created.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Created message from the specified reader or buffer.
         * @function decode
         * @memberof Result.Created
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Result.Created} Created
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Created.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Result.Created();
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
         * Decodes a Created message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Result.Created
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Result.Created} Created
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Created.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Created message.
         * @function verify
         * @memberof Result.Created
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Created.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a Created message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Result.Created
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Result.Created} Created
         */
        Created.fromObject = function fromObject(object) {
            if (object instanceof $root.Result.Created)
                return object;
            return new $root.Result.Created();
        };

        /**
         * Creates a plain object from a Created message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Result.Created
         * @static
         * @param {Result.Created} message Created
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Created.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this Created to JSON.
         * @function toJSON
         * @memberof Result.Created
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Created.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Created;
    })();

    Result.Started = (function() {

        /**
         * Properties of a Started.
         * @memberof Result
         * @interface IStarted
         */

        /**
         * Constructs a new Started.
         * @memberof Result
         * @classdesc Represents a Started.
         * @implements IStarted
         * @constructor
         * @param {Result.IStarted=} [properties] Properties to set
         */
        function Started(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new Started instance using the specified properties.
         * @function create
         * @memberof Result.Started
         * @static
         * @param {Result.IStarted=} [properties] Properties to set
         * @returns {Result.Started} Started instance
         */
        Started.create = function create(properties) {
            return new Started(properties);
        };

        /**
         * Encodes the specified Started message. Does not implicitly {@link Result.Started.verify|verify} messages.
         * @function encode
         * @memberof Result.Started
         * @static
         * @param {Result.Started} message Started message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Started.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified Started message, length delimited. Does not implicitly {@link Result.Started.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Result.Started
         * @static
         * @param {Result.Started} message Started message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Started.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Started message from the specified reader or buffer.
         * @function decode
         * @memberof Result.Started
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Result.Started} Started
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Started.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Result.Started();
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
         * Decodes a Started message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Result.Started
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Result.Started} Started
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Started.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Started message.
         * @function verify
         * @memberof Result.Started
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Started.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a Started message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Result.Started
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Result.Started} Started
         */
        Started.fromObject = function fromObject(object) {
            if (object instanceof $root.Result.Started)
                return object;
            return new $root.Result.Started();
        };

        /**
         * Creates a plain object from a Started message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Result.Started
         * @static
         * @param {Result.Started} message Started
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Started.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this Started to JSON.
         * @function toJSON
         * @memberof Result.Started
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Started.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Started;
    })();

    Result.Frame = (function() {

        /**
         * Properties of a Frame.
         * @memberof Result
         * @interface IFrame
         */

        /**
         * Constructs a new Frame.
         * @memberof Result
         * @classdesc Represents a Frame.
         * @implements IFrame
         * @constructor
         * @param {Result.IFrame=} [properties] Properties to set
         */
        function Frame(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new Frame instance using the specified properties.
         * @function create
         * @memberof Result.Frame
         * @static
         * @param {Result.IFrame=} [properties] Properties to set
         * @returns {Result.Frame} Frame instance
         */
        Frame.create = function create(properties) {
            return new Frame(properties);
        };

        /**
         * Encodes the specified Frame message. Does not implicitly {@link Result.Frame.verify|verify} messages.
         * @function encode
         * @memberof Result.Frame
         * @static
         * @param {Result.Frame} message Frame message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Frame.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified Frame message, length delimited. Does not implicitly {@link Result.Frame.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Result.Frame
         * @static
         * @param {Result.Frame} message Frame message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Frame.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Frame message from the specified reader or buffer.
         * @function decode
         * @memberof Result.Frame
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Result.Frame} Frame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Frame.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Result.Frame();
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
         * Decodes a Frame message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Result.Frame
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Result.Frame} Frame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Frame.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Frame message.
         * @function verify
         * @memberof Result.Frame
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Frame.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a Frame message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Result.Frame
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Result.Frame} Frame
         */
        Frame.fromObject = function fromObject(object) {
            if (object instanceof $root.Result.Frame)
                return object;
            return new $root.Result.Frame();
        };

        /**
         * Creates a plain object from a Frame message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Result.Frame
         * @static
         * @param {Result.Frame} message Frame
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Frame.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this Frame to JSON.
         * @function toJSON
         * @memberof Result.Frame
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Frame.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Frame;
    })();

    Result.Print = (function() {

        /**
         * Properties of a Print.
         * @memberof Result
         * @interface IPrint
         * @property {string|null} [value] Print value
         */

        /**
         * Constructs a new Print.
         * @memberof Result
         * @classdesc Represents a Print.
         * @implements IPrint
         * @constructor
         * @param {Result.IPrint=} [properties] Properties to set
         */
        function Print(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Print value.
         * @member {string} value
         * @memberof Result.Print
         * @instance
         */
        Print.prototype.value = "";

        /**
         * Creates a new Print instance using the specified properties.
         * @function create
         * @memberof Result.Print
         * @static
         * @param {Result.IPrint=} [properties] Properties to set
         * @returns {Result.Print} Print instance
         */
        Print.create = function create(properties) {
            return new Print(properties);
        };

        /**
         * Encodes the specified Print message. Does not implicitly {@link Result.Print.verify|verify} messages.
         * @function encode
         * @memberof Result.Print
         * @static
         * @param {Result.Print} message Print message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Print.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.value != null && message.hasOwnProperty("value"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.value);
            return writer;
        };

        /**
         * Encodes the specified Print message, length delimited. Does not implicitly {@link Result.Print.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Result.Print
         * @static
         * @param {Result.Print} message Print message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Print.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Print message from the specified reader or buffer.
         * @function decode
         * @memberof Result.Print
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Result.Print} Print
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Print.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Result.Print();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.value = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Print message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Result.Print
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Result.Print} Print
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Print.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Print message.
         * @function verify
         * @memberof Result.Print
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Print.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.value != null && message.hasOwnProperty("value"))
                if (!$util.isString(message.value))
                    return "value: string expected";
            return null;
        };

        /**
         * Creates a Print message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Result.Print
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Result.Print} Print
         */
        Print.fromObject = function fromObject(object) {
            if (object instanceof $root.Result.Print)
                return object;
            let message = new $root.Result.Print();
            if (object.value != null)
                message.value = String(object.value);
            return message;
        };

        /**
         * Creates a plain object from a Print message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Result.Print
         * @static
         * @param {Result.Print} message Print
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Print.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.value = "";
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = message.value;
            return object;
        };

        /**
         * Converts this Print to JSON.
         * @function toJSON
         * @memberof Result.Print
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Print.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Print;
    })();

    Result.Lock = (function() {

        /**
         * Properties of a Lock.
         * @memberof Result
         * @interface ILock
         * @property {string|null} [cause] Lock cause
         */

        /**
         * Constructs a new Lock.
         * @memberof Result
         * @classdesc Represents a Lock.
         * @implements ILock
         * @constructor
         * @param {Result.ILock=} [properties] Properties to set
         */
        function Lock(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Lock cause.
         * @member {string} cause
         * @memberof Result.Lock
         * @instance
         */
        Lock.prototype.cause = "";

        /**
         * Creates a new Lock instance using the specified properties.
         * @function create
         * @memberof Result.Lock
         * @static
         * @param {Result.ILock=} [properties] Properties to set
         * @returns {Result.Lock} Lock instance
         */
        Lock.create = function create(properties) {
            return new Lock(properties);
        };

        /**
         * Encodes the specified Lock message. Does not implicitly {@link Result.Lock.verify|verify} messages.
         * @function encode
         * @memberof Result.Lock
         * @static
         * @param {Result.Lock} message Lock message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Lock.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cause != null && message.hasOwnProperty("cause"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.cause);
            return writer;
        };

        /**
         * Encodes the specified Lock message, length delimited. Does not implicitly {@link Result.Lock.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Result.Lock
         * @static
         * @param {Result.Lock} message Lock message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Lock.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Lock message from the specified reader or buffer.
         * @function decode
         * @memberof Result.Lock
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Result.Lock} Lock
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Lock.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Result.Lock();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
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
         * Decodes a Lock message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Result.Lock
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Result.Lock} Lock
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Lock.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Lock message.
         * @function verify
         * @memberof Result.Lock
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Lock.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cause != null && message.hasOwnProperty("cause"))
                if (!$util.isString(message.cause))
                    return "cause: string expected";
            return null;
        };

        /**
         * Creates a Lock message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Result.Lock
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Result.Lock} Lock
         */
        Lock.fromObject = function fromObject(object) {
            if (object instanceof $root.Result.Lock)
                return object;
            let message = new $root.Result.Lock();
            if (object.cause != null)
                message.cause = String(object.cause);
            return message;
        };

        /**
         * Creates a plain object from a Lock message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Result.Lock
         * @static
         * @param {Result.Lock} message Lock
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Lock.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.cause = "";
            if (message.cause != null && message.hasOwnProperty("cause"))
                object.cause = message.cause;
            return object;
        };

        /**
         * Converts this Lock to JSON.
         * @function toJSON
         * @memberof Result.Lock
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Lock.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Lock;
    })();

    Result.Error = (function() {

        /**
         * Properties of an Error.
         * @memberof Result
         * @interface IError
         * @property {Result.Error.Source|null} [source] Error source
         * @property {boolean|null} [terminal] Error terminal
         */

        /**
         * Constructs a new Error.
         * @memberof Result
         * @classdesc Represents an Error.
         * @implements IError
         * @constructor
         * @param {Result.IError=} [properties] Properties to set
         */
        function Error(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Error source.
         * @member {Result.Error.Source} source
         * @memberof Result.Error
         * @instance
         */
        Error.prototype.source = 0;

        /**
         * Error terminal.
         * @member {boolean} terminal
         * @memberof Result.Error
         * @instance
         */
        Error.prototype.terminal = false;

        /**
         * Creates a new Error instance using the specified properties.
         * @function create
         * @memberof Result.Error
         * @static
         * @param {Result.IError=} [properties] Properties to set
         * @returns {Result.Error} Error instance
         */
        Error.create = function create(properties) {
            return new Error(properties);
        };

        /**
         * Encodes the specified Error message. Does not implicitly {@link Result.Error.verify|verify} messages.
         * @function encode
         * @memberof Result.Error
         * @static
         * @param {Result.Error} message Error message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Error.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.source != null && message.hasOwnProperty("source"))
                writer.uint32(/* id 0, wireType 0 =*/0).int32(message.source);
            if (message.terminal != null && message.hasOwnProperty("terminal"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.terminal);
            return writer;
        };

        /**
         * Encodes the specified Error message, length delimited. Does not implicitly {@link Result.Error.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Result.Error
         * @static
         * @param {Result.Error} message Error message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Error.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Error message from the specified reader or buffer.
         * @function decode
         * @memberof Result.Error
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Result.Error} Error
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Error.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Result.Error();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 0:
                    message.source = reader.int32();
                    break;
                case 1:
                    message.terminal = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Error message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Result.Error
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Result.Error} Error
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Error.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Error message.
         * @function verify
         * @memberof Result.Error
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Error.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.source != null && message.hasOwnProperty("source"))
                switch (message.source) {
                default:
                    return "source: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.terminal != null && message.hasOwnProperty("terminal"))
                if (typeof message.terminal !== "boolean")
                    return "terminal: boolean expected";
            return null;
        };

        /**
         * Creates an Error message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Result.Error
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Result.Error} Error
         */
        Error.fromObject = function fromObject(object) {
            if (object instanceof $root.Result.Error)
                return object;
            let message = new $root.Result.Error();
            switch (object.source) {
            case "TRACER":
            case 0:
                message.source = 0;
                break;
            case "TRACED":
            case 1:
                message.source = 1;
                break;
            }
            if (object.terminal != null)
                message.terminal = Boolean(object.terminal);
            return message;
        };

        /**
         * Creates a plain object from an Error message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Result.Error
         * @static
         * @param {Result.Error} message Error
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Error.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.source = options.enums === String ? "TRACER" : 0;
                object.terminal = false;
            }
            if (message.source != null && message.hasOwnProperty("source"))
                object.source = options.enums === String ? $root.Result.Error.Source[message.source] : message.source;
            if (message.terminal != null && message.hasOwnProperty("terminal"))
                object.terminal = message.terminal;
            return object;
        };

        /**
         * Converts this Error to JSON.
         * @function toJSON
         * @memberof Result.Error
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Error.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Source enum.
         * @name Result.Error.Source
         * @enum {string}
         * @property {number} TRACER=0 TRACER value
         * @property {number} TRACED=1 TRACED value
         */
        Error.Source = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "TRACER"] = 0;
            values[valuesById[1] = "TRACED"] = 1;
            return values;
        })();

        return Error;
    })();

    return Result;
})();

export { $root as default };
