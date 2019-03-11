/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const Event = $root.Event = (() => {

    /**
     * Properties of an Event.
     * @exports IEvent
     * @interface IEvent
     * @property {Event.Started|null} [started] Event started
     * @property {Event.Inspected|null} [inspected] Event inspected
     * @property {Event.Printed|null} [printed] Event printed
     * @property {Event.Locked|null} [locked] Event locked
     * @property {Event.Threw|null} [threw] Event threw
     */

    /**
     * Constructs a new Event.
     * @exports Event
     * @classdesc Represents an Event.
     * @implements IEvent
     * @constructor
     * @param {IEvent=} [properties] Properties to set
     */
    function Event(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Event started.
     * @member {Event.Started|null|undefined} started
     * @memberof Event
     * @instance
     */
    Event.prototype.started = null;

    /**
     * Event inspected.
     * @member {Event.Inspected|null|undefined} inspected
     * @memberof Event
     * @instance
     */
    Event.prototype.inspected = null;

    /**
     * Event printed.
     * @member {Event.Printed|null|undefined} printed
     * @memberof Event
     * @instance
     */
    Event.prototype.printed = null;

    /**
     * Event locked.
     * @member {Event.Locked|null|undefined} locked
     * @memberof Event
     * @instance
     */
    Event.prototype.locked = null;

    /**
     * Event threw.
     * @member {Event.Threw|null|undefined} threw
     * @memberof Event
     * @instance
     */
    Event.prototype.threw = null;

    // OneOf field names bound to virtual getters and setters
    let $oneOfFields;

    /**
     * Event event.
     * @member {"started"|"inspected"|"printed"|"locked"|"threw"|undefined} event
     * @memberof Event
     * @instance
     */
    Object.defineProperty(Event.prototype, "event", {
        get: $util.oneOfGetter($oneOfFields = ["started", "inspected", "printed", "locked", "threw"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new Event instance using the specified properties.
     * @function create
     * @memberof Event
     * @static
     * @param {IEvent=} [properties] Properties to set
     * @returns {Event} Event instance
     */
    Event.create = function create(properties) {
        return new Event(properties);
    };

    /**
     * Encodes the specified Event message. Does not implicitly {@link Event.verify|verify} messages.
     * @function encode
     * @memberof Event
     * @static
     * @param {Event} message Event message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Event.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.started != null && message.hasOwnProperty("started"))
            $root.Event.Started.encode(message.started, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.inspected != null && message.hasOwnProperty("inspected"))
            $root.Event.Inspected.encode(message.inspected, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.printed != null && message.hasOwnProperty("printed"))
            $root.Event.Printed.encode(message.printed, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.locked != null && message.hasOwnProperty("locked"))
            $root.Event.Locked.encode(message.locked, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        if (message.threw != null && message.hasOwnProperty("threw"))
            $root.Event.Threw.encode(message.threw, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Event message, length delimited. Does not implicitly {@link Event.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Event
     * @static
     * @param {Event} message Event message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Event.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Event message from the specified reader or buffer.
     * @function decode
     * @memberof Event
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Event} Event
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Event.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Event();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.started = $root.Event.Started.decode(reader, reader.uint32());
                break;
            case 2:
                message.inspected = $root.Event.Inspected.decode(reader, reader.uint32());
                break;
            case 3:
                message.printed = $root.Event.Printed.decode(reader, reader.uint32());
                break;
            case 4:
                message.locked = $root.Event.Locked.decode(reader, reader.uint32());
                break;
            case 5:
                message.threw = $root.Event.Threw.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Event message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Event
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Event} Event
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Event.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Event message.
     * @function verify
     * @memberof Event
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Event.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        let properties = {};
        if (message.started != null && message.hasOwnProperty("started")) {
            properties.event = 1;
            {
                let error = $root.Event.Started.verify(message.started);
                if (error)
                    return "started." + error;
            }
        }
        if (message.inspected != null && message.hasOwnProperty("inspected")) {
            if (properties.event === 1)
                return "event: multiple values";
            properties.event = 1;
            {
                let error = $root.Event.Inspected.verify(message.inspected);
                if (error)
                    return "inspected." + error;
            }
        }
        if (message.printed != null && message.hasOwnProperty("printed")) {
            if (properties.event === 1)
                return "event: multiple values";
            properties.event = 1;
            {
                let error = $root.Event.Printed.verify(message.printed);
                if (error)
                    return "printed." + error;
            }
        }
        if (message.locked != null && message.hasOwnProperty("locked")) {
            if (properties.event === 1)
                return "event: multiple values";
            properties.event = 1;
            {
                let error = $root.Event.Locked.verify(message.locked);
                if (error)
                    return "locked." + error;
            }
        }
        if (message.threw != null && message.hasOwnProperty("threw")) {
            if (properties.event === 1)
                return "event: multiple values";
            properties.event = 1;
            {
                let error = $root.Event.Threw.verify(message.threw);
                if (error)
                    return "threw." + error;
            }
        }
        return null;
    };

    /**
     * Creates an Event message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Event
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Event} Event
     */
    Event.fromObject = function fromObject(object) {
        if (object instanceof $root.Event)
            return object;
        let message = new $root.Event();
        if (object.started != null) {
            if (typeof object.started !== "object")
                throw TypeError(".Event.started: object expected");
            message.started = $root.Event.Started.fromObject(object.started);
        }
        if (object.inspected != null) {
            if (typeof object.inspected !== "object")
                throw TypeError(".Event.inspected: object expected");
            message.inspected = $root.Event.Inspected.fromObject(object.inspected);
        }
        if (object.printed != null) {
            if (typeof object.printed !== "object")
                throw TypeError(".Event.printed: object expected");
            message.printed = $root.Event.Printed.fromObject(object.printed);
        }
        if (object.locked != null) {
            if (typeof object.locked !== "object")
                throw TypeError(".Event.locked: object expected");
            message.locked = $root.Event.Locked.fromObject(object.locked);
        }
        if (object.threw != null) {
            if (typeof object.threw !== "object")
                throw TypeError(".Event.threw: object expected");
            message.threw = $root.Event.Threw.fromObject(object.threw);
        }
        return message;
    };

    /**
     * Creates a plain object from an Event message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Event
     * @static
     * @param {Event} message Event
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Event.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (message.started != null && message.hasOwnProperty("started")) {
            object.started = $root.Event.Started.toObject(message.started, options);
            if (options.oneofs)
                object.event = "started";
        }
        if (message.inspected != null && message.hasOwnProperty("inspected")) {
            object.inspected = $root.Event.Inspected.toObject(message.inspected, options);
            if (options.oneofs)
                object.event = "inspected";
        }
        if (message.printed != null && message.hasOwnProperty("printed")) {
            object.printed = $root.Event.Printed.toObject(message.printed, options);
            if (options.oneofs)
                object.event = "printed";
        }
        if (message.locked != null && message.hasOwnProperty("locked")) {
            object.locked = $root.Event.Locked.toObject(message.locked, options);
            if (options.oneofs)
                object.event = "locked";
        }
        if (message.threw != null && message.hasOwnProperty("threw")) {
            object.threw = $root.Event.Threw.toObject(message.threw, options);
            if (options.oneofs)
                object.event = "threw";
        }
        return object;
    };

    /**
     * Converts this Event to JSON.
     * @function toJSON
     * @memberof Event
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Event.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    Event.Started = (function() {

        /**
         * Properties of a Started.
         * @memberof Event
         * @interface IStarted
         */

        /**
         * Constructs a new Started.
         * @memberof Event
         * @classdesc Represents a Started.
         * @implements IStarted
         * @constructor
         * @param {Event.IStarted=} [properties] Properties to set
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
         * @memberof Event.Started
         * @static
         * @param {Event.IStarted=} [properties] Properties to set
         * @returns {Event.Started} Started instance
         */
        Started.create = function create(properties) {
            return new Started(properties);
        };

        /**
         * Encodes the specified Started message. Does not implicitly {@link Event.Started.verify|verify} messages.
         * @function encode
         * @memberof Event.Started
         * @static
         * @param {Event.Started} message Started message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Started.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified Started message, length delimited. Does not implicitly {@link Event.Started.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Event.Started
         * @static
         * @param {Event.Started} message Started message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Started.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Started message from the specified reader or buffer.
         * @function decode
         * @memberof Event.Started
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Event.Started} Started
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Started.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Event.Started();
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
         * @memberof Event.Started
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Event.Started} Started
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
         * @memberof Event.Started
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
         * @memberof Event.Started
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Event.Started} Started
         */
        Started.fromObject = function fromObject(object) {
            if (object instanceof $root.Event.Started)
                return object;
            return new $root.Event.Started();
        };

        /**
         * Creates a plain object from a Started message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Event.Started
         * @static
         * @param {Event.Started} message Started
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Started.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this Started to JSON.
         * @function toJSON
         * @memberof Event.Started
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Started.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Started;
    })();

    Event.Inspected = (function() {

        /**
         * Properties of an Inspected.
         * @memberof Event
         * @interface IInspected
         * @property {Frame|null} [frame] Inspected frame
         */

        /**
         * Constructs a new Inspected.
         * @memberof Event
         * @classdesc Represents an Inspected.
         * @implements IInspected
         * @constructor
         * @param {Event.IInspected=} [properties] Properties to set
         */
        function Inspected(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Inspected frame.
         * @member {Frame|null|undefined} frame
         * @memberof Event.Inspected
         * @instance
         */
        Inspected.prototype.frame = null;

        /**
         * Creates a new Inspected instance using the specified properties.
         * @function create
         * @memberof Event.Inspected
         * @static
         * @param {Event.IInspected=} [properties] Properties to set
         * @returns {Event.Inspected} Inspected instance
         */
        Inspected.create = function create(properties) {
            return new Inspected(properties);
        };

        /**
         * Encodes the specified Inspected message. Does not implicitly {@link Event.Inspected.verify|verify} messages.
         * @function encode
         * @memberof Event.Inspected
         * @static
         * @param {Event.Inspected} message Inspected message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Inspected.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.frame != null && message.hasOwnProperty("frame"))
                $root.Frame.encode(message.frame, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Inspected message, length delimited. Does not implicitly {@link Event.Inspected.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Event.Inspected
         * @static
         * @param {Event.Inspected} message Inspected message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Inspected.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Inspected message from the specified reader or buffer.
         * @function decode
         * @memberof Event.Inspected
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Event.Inspected} Inspected
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Inspected.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Event.Inspected();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.frame = $root.Frame.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Inspected message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Event.Inspected
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Event.Inspected} Inspected
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Inspected.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Inspected message.
         * @function verify
         * @memberof Event.Inspected
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Inspected.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.frame != null && message.hasOwnProperty("frame")) {
                let error = $root.Frame.verify(message.frame);
                if (error)
                    return "frame." + error;
            }
            return null;
        };

        /**
         * Creates an Inspected message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Event.Inspected
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Event.Inspected} Inspected
         */
        Inspected.fromObject = function fromObject(object) {
            if (object instanceof $root.Event.Inspected)
                return object;
            let message = new $root.Event.Inspected();
            if (object.frame != null) {
                if (typeof object.frame !== "object")
                    throw TypeError(".Event.Inspected.frame: object expected");
                message.frame = $root.Frame.fromObject(object.frame);
            }
            return message;
        };

        /**
         * Creates a plain object from an Inspected message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Event.Inspected
         * @static
         * @param {Event.Inspected} message Inspected
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Inspected.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.frame = null;
            if (message.frame != null && message.hasOwnProperty("frame"))
                object.frame = $root.Frame.toObject(message.frame, options);
            return object;
        };

        /**
         * Converts this Inspected to JSON.
         * @function toJSON
         * @memberof Event.Inspected
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Inspected.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Inspected;
    })();

    Event.Printed = (function() {

        /**
         * Properties of a Printed.
         * @memberof Event
         * @interface IPrinted
         * @property {string|null} [value] Printed value
         */

        /**
         * Constructs a new Printed.
         * @memberof Event
         * @classdesc Represents a Printed.
         * @implements IPrinted
         * @constructor
         * @param {Event.IPrinted=} [properties] Properties to set
         */
        function Printed(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Printed value.
         * @member {string} value
         * @memberof Event.Printed
         * @instance
         */
        Printed.prototype.value = "";

        /**
         * Creates a new Printed instance using the specified properties.
         * @function create
         * @memberof Event.Printed
         * @static
         * @param {Event.IPrinted=} [properties] Properties to set
         * @returns {Event.Printed} Printed instance
         */
        Printed.create = function create(properties) {
            return new Printed(properties);
        };

        /**
         * Encodes the specified Printed message. Does not implicitly {@link Event.Printed.verify|verify} messages.
         * @function encode
         * @memberof Event.Printed
         * @static
         * @param {Event.Printed} message Printed message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Printed.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.value != null && message.hasOwnProperty("value"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.value);
            return writer;
        };

        /**
         * Encodes the specified Printed message, length delimited. Does not implicitly {@link Event.Printed.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Event.Printed
         * @static
         * @param {Event.Printed} message Printed message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Printed.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Printed message from the specified reader or buffer.
         * @function decode
         * @memberof Event.Printed
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Event.Printed} Printed
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Printed.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Event.Printed();
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
         * Decodes a Printed message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Event.Printed
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Event.Printed} Printed
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Printed.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Printed message.
         * @function verify
         * @memberof Event.Printed
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Printed.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.value != null && message.hasOwnProperty("value"))
                if (!$util.isString(message.value))
                    return "value: string expected";
            return null;
        };

        /**
         * Creates a Printed message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Event.Printed
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Event.Printed} Printed
         */
        Printed.fromObject = function fromObject(object) {
            if (object instanceof $root.Event.Printed)
                return object;
            let message = new $root.Event.Printed();
            if (object.value != null)
                message.value = String(object.value);
            return message;
        };

        /**
         * Creates a plain object from a Printed message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Event.Printed
         * @static
         * @param {Event.Printed} message Printed
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Printed.toObject = function toObject(message, options) {
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
         * Converts this Printed to JSON.
         * @function toJSON
         * @memberof Event.Printed
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Printed.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Printed;
    })();

    Event.Locked = (function() {

        /**
         * Properties of a Locked.
         * @memberof Event
         * @interface ILocked
         * @property {string|null} [cause] Locked cause
         */

        /**
         * Constructs a new Locked.
         * @memberof Event
         * @classdesc Represents a Locked.
         * @implements ILocked
         * @constructor
         * @param {Event.ILocked=} [properties] Properties to set
         */
        function Locked(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Locked cause.
         * @member {string} cause
         * @memberof Event.Locked
         * @instance
         */
        Locked.prototype.cause = "";

        /**
         * Creates a new Locked instance using the specified properties.
         * @function create
         * @memberof Event.Locked
         * @static
         * @param {Event.ILocked=} [properties] Properties to set
         * @returns {Event.Locked} Locked instance
         */
        Locked.create = function create(properties) {
            return new Locked(properties);
        };

        /**
         * Encodes the specified Locked message. Does not implicitly {@link Event.Locked.verify|verify} messages.
         * @function encode
         * @memberof Event.Locked
         * @static
         * @param {Event.Locked} message Locked message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Locked.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cause != null && message.hasOwnProperty("cause"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.cause);
            return writer;
        };

        /**
         * Encodes the specified Locked message, length delimited. Does not implicitly {@link Event.Locked.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Event.Locked
         * @static
         * @param {Event.Locked} message Locked message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Locked.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Locked message from the specified reader or buffer.
         * @function decode
         * @memberof Event.Locked
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Event.Locked} Locked
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Locked.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Event.Locked();
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
         * Decodes a Locked message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Event.Locked
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Event.Locked} Locked
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Locked.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Locked message.
         * @function verify
         * @memberof Event.Locked
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Locked.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cause != null && message.hasOwnProperty("cause"))
                if (!$util.isString(message.cause))
                    return "cause: string expected";
            return null;
        };

        /**
         * Creates a Locked message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Event.Locked
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Event.Locked} Locked
         */
        Locked.fromObject = function fromObject(object) {
            if (object instanceof $root.Event.Locked)
                return object;
            let message = new $root.Event.Locked();
            if (object.cause != null)
                message.cause = String(object.cause);
            return message;
        };

        /**
         * Creates a plain object from a Locked message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Event.Locked
         * @static
         * @param {Event.Locked} message Locked
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Locked.toObject = function toObject(message, options) {
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
         * Converts this Locked to JSON.
         * @function toJSON
         * @memberof Event.Locked
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Locked.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Locked;
    })();

    Event.Threw = (function() {

        /**
         * Properties of a Threw.
         * @memberof Event
         * @interface IThrew
         * @property {Exception|null} [exception] Threw exception
         */

        /**
         * Constructs a new Threw.
         * @memberof Event
         * @classdesc Represents a Threw.
         * @implements IThrew
         * @constructor
         * @param {Event.IThrew=} [properties] Properties to set
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
         * @memberof Event.Threw
         * @instance
         */
        Threw.prototype.exception = null;

        /**
         * Creates a new Threw instance using the specified properties.
         * @function create
         * @memberof Event.Threw
         * @static
         * @param {Event.IThrew=} [properties] Properties to set
         * @returns {Event.Threw} Threw instance
         */
        Threw.create = function create(properties) {
            return new Threw(properties);
        };

        /**
         * Encodes the specified Threw message. Does not implicitly {@link Event.Threw.verify|verify} messages.
         * @function encode
         * @memberof Event.Threw
         * @static
         * @param {Event.Threw} message Threw message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Threw.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.exception != null && message.hasOwnProperty("exception"))
                $root.Exception.encode(message.exception, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Threw message, length delimited. Does not implicitly {@link Event.Threw.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Event.Threw
         * @static
         * @param {Event.Threw} message Threw message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Threw.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Threw message from the specified reader or buffer.
         * @function decode
         * @memberof Event.Threw
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Event.Threw} Threw
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Threw.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Event.Threw();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.exception = $root.Exception.decode(reader, reader.uint32());
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
         * @memberof Event.Threw
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Event.Threw} Threw
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
         * @memberof Event.Threw
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
            return null;
        };

        /**
         * Creates a Threw message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Event.Threw
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Event.Threw} Threw
         */
        Threw.fromObject = function fromObject(object) {
            if (object instanceof $root.Event.Threw)
                return object;
            let message = new $root.Event.Threw();
            if (object.exception != null) {
                if (typeof object.exception !== "object")
                    throw TypeError(".Event.Threw.exception: object expected");
                message.exception = $root.Exception.fromObject(object.exception);
            }
            return message;
        };

        /**
         * Creates a plain object from a Threw message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Event.Threw
         * @static
         * @param {Event.Threw} message Threw
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Threw.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.exception = null;
            if (message.exception != null && message.hasOwnProperty("exception"))
                object.exception = $root.Exception.toObject(message.exception, options);
            return object;
        };

        /**
         * Converts this Threw to JSON.
         * @function toJSON
         * @memberof Event.Threw
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Threw.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Threw;
    })();

    return Event;
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

export const Frame = $root.Frame = (() => {

    /**
     * Properties of a Frame.
     * @exports IFrame
     * @interface IFrame
     * @property {Frame.Type|null} [type] Frame type
     * @property {number|null} [line] Frame line
     * @property {boolean|null} [finish] Frame finish
     * @property {Exception|null} [exception] Frame exception
     * @property {Frame.Stack|null} [stack] Frame stack
     * @property {Frame.Heap|null} [heap] Frame heap
     */

    /**
     * Constructs a new Frame.
     * @exports Frame
     * @classdesc Represents a Frame.
     * @implements IFrame
     * @constructor
     * @param {IFrame=} [properties] Properties to set
     */
    function Frame(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Frame type.
     * @member {Frame.Type} type
     * @memberof Frame
     * @instance
     */
    Frame.prototype.type = 0;

    /**
     * Frame line.
     * @member {number} line
     * @memberof Frame
     * @instance
     */
    Frame.prototype.line = 0;

    /**
     * Frame finish.
     * @member {boolean} finish
     * @memberof Frame
     * @instance
     */
    Frame.prototype.finish = false;

    /**
     * Frame exception.
     * @member {Exception|null|undefined} exception
     * @memberof Frame
     * @instance
     */
    Frame.prototype.exception = null;

    /**
     * Frame stack.
     * @member {Frame.Stack|null|undefined} stack
     * @memberof Frame
     * @instance
     */
    Frame.prototype.stack = null;

    /**
     * Frame heap.
     * @member {Frame.Heap|null|undefined} heap
     * @memberof Frame
     * @instance
     */
    Frame.prototype.heap = null;

    /**
     * Creates a new Frame instance using the specified properties.
     * @function create
     * @memberof Frame
     * @static
     * @param {IFrame=} [properties] Properties to set
     * @returns {Frame} Frame instance
     */
    Frame.create = function create(properties) {
        return new Frame(properties);
    };

    /**
     * Encodes the specified Frame message. Does not implicitly {@link Frame.verify|verify} messages.
     * @function encode
     * @memberof Frame
     * @static
     * @param {Frame} message Frame message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Frame.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.type != null && message.hasOwnProperty("type"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
        if (message.line != null && message.hasOwnProperty("line"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.line);
        if (message.finish != null && message.hasOwnProperty("finish"))
            writer.uint32(/* id 3, wireType 0 =*/24).bool(message.finish);
        if (message.exception != null && message.hasOwnProperty("exception"))
            $root.Exception.encode(message.exception, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        if (message.stack != null && message.hasOwnProperty("stack"))
            $root.Frame.Stack.encode(message.stack, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        if (message.heap != null && message.hasOwnProperty("heap"))
            $root.Frame.Heap.encode(message.heap, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Frame message, length delimited. Does not implicitly {@link Frame.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Frame
     * @static
     * @param {Frame} message Frame message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Frame.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Frame message from the specified reader or buffer.
     * @function decode
     * @memberof Frame
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Frame} Frame
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Frame.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Frame();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.type = reader.int32();
                break;
            case 2:
                message.line = reader.int32();
                break;
            case 3:
                message.finish = reader.bool();
                break;
            case 4:
                message.exception = $root.Exception.decode(reader, reader.uint32());
                break;
            case 5:
                message.stack = $root.Frame.Stack.decode(reader, reader.uint32());
                break;
            case 6:
                message.heap = $root.Frame.Heap.decode(reader, reader.uint32());
                break;
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
     * @memberof Frame
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Frame} Frame
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
     * @memberof Frame
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Frame.verify = function verify(message) {
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
        if (message.line != null && message.hasOwnProperty("line"))
            if (!$util.isInteger(message.line))
                return "line: integer expected";
        if (message.finish != null && message.hasOwnProperty("finish"))
            if (typeof message.finish !== "boolean")
                return "finish: boolean expected";
        if (message.exception != null && message.hasOwnProperty("exception")) {
            let error = $root.Exception.verify(message.exception);
            if (error)
                return "exception." + error;
        }
        if (message.stack != null && message.hasOwnProperty("stack")) {
            let error = $root.Frame.Stack.verify(message.stack);
            if (error)
                return "stack." + error;
        }
        if (message.heap != null && message.hasOwnProperty("heap")) {
            let error = $root.Frame.Heap.verify(message.heap);
            if (error)
                return "heap." + error;
        }
        return null;
    };

    /**
     * Creates a Frame message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Frame
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Frame} Frame
     */
    Frame.fromObject = function fromObject(object) {
        if (object instanceof $root.Frame)
            return object;
        let message = new $root.Frame();
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
        if (object.line != null)
            message.line = object.line | 0;
        if (object.finish != null)
            message.finish = Boolean(object.finish);
        if (object.exception != null) {
            if (typeof object.exception !== "object")
                throw TypeError(".Frame.exception: object expected");
            message.exception = $root.Exception.fromObject(object.exception);
        }
        if (object.stack != null) {
            if (typeof object.stack !== "object")
                throw TypeError(".Frame.stack: object expected");
            message.stack = $root.Frame.Stack.fromObject(object.stack);
        }
        if (object.heap != null) {
            if (typeof object.heap !== "object")
                throw TypeError(".Frame.heap: object expected");
            message.heap = $root.Frame.Heap.fromObject(object.heap);
        }
        return message;
    };

    /**
     * Creates a plain object from a Frame message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Frame
     * @static
     * @param {Frame} message Frame
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Frame.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.type = options.enums === String ? "LINE" : 0;
            object.line = 0;
            object.finish = false;
            object.exception = null;
            object.stack = null;
            object.heap = null;
        }
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = options.enums === String ? $root.Frame.Type[message.type] : message.type;
        if (message.line != null && message.hasOwnProperty("line"))
            object.line = message.line;
        if (message.finish != null && message.hasOwnProperty("finish"))
            object.finish = message.finish;
        if (message.exception != null && message.hasOwnProperty("exception"))
            object.exception = $root.Exception.toObject(message.exception, options);
        if (message.stack != null && message.hasOwnProperty("stack"))
            object.stack = $root.Frame.Stack.toObject(message.stack, options);
        if (message.heap != null && message.hasOwnProperty("heap"))
            object.heap = $root.Frame.Heap.toObject(message.heap, options);
        return object;
    };

    /**
     * Converts this Frame to JSON.
     * @function toJSON
     * @memberof Frame
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Frame.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Type enum.
     * @name Frame.Type
     * @enum {string}
     * @property {number} LINE=0 LINE value
     * @property {number} CALL=1 CALL value
     * @property {number} RETURN=2 RETURN value
     * @property {number} EXCEPTION=3 EXCEPTION value
     */
    Frame.Type = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "LINE"] = 0;
        values[valuesById[1] = "CALL"] = 1;
        values[valuesById[2] = "RETURN"] = 2;
        values[valuesById[3] = "EXCEPTION"] = 3;
        return values;
    })();

    Frame.Value = (function() {

        /**
         * Properties of a Value.
         * @memberof Frame
         * @interface IValue
         * @property {boolean|null} [booleanValue] Value booleanValue
         * @property {number|Long|null} [integerValue] Value integerValue
         * @property {number|null} [floatValue] Value floatValue
         * @property {string|null} [stringValue] Value stringValue
         * @property {number|Long|null} [reference] Value reference
         */

        /**
         * Constructs a new Value.
         * @memberof Frame
         * @classdesc Represents a Value.
         * @implements IValue
         * @constructor
         * @param {Frame.IValue=} [properties] Properties to set
         */
        function Value(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Value booleanValue.
         * @member {boolean} booleanValue
         * @memberof Frame.Value
         * @instance
         */
        Value.prototype.booleanValue = false;

        /**
         * Value integerValue.
         * @member {number|Long} integerValue
         * @memberof Frame.Value
         * @instance
         */
        Value.prototype.integerValue = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Value floatValue.
         * @member {number} floatValue
         * @memberof Frame.Value
         * @instance
         */
        Value.prototype.floatValue = 0;

        /**
         * Value stringValue.
         * @member {string} stringValue
         * @memberof Frame.Value
         * @instance
         */
        Value.prototype.stringValue = "";

        /**
         * Value reference.
         * @member {number|Long} reference
         * @memberof Frame.Value
         * @instance
         */
        Value.prototype.reference = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * Value value.
         * @member {"booleanValue"|"integerValue"|"floatValue"|"stringValue"|"reference"|undefined} value
         * @memberof Frame.Value
         * @instance
         */
        Object.defineProperty(Value.prototype, "value", {
            get: $util.oneOfGetter($oneOfFields = ["booleanValue", "integerValue", "floatValue", "stringValue", "reference"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new Value instance using the specified properties.
         * @function create
         * @memberof Frame.Value
         * @static
         * @param {Frame.IValue=} [properties] Properties to set
         * @returns {Frame.Value} Value instance
         */
        Value.create = function create(properties) {
            return new Value(properties);
        };

        /**
         * Encodes the specified Value message. Does not implicitly {@link Frame.Value.verify|verify} messages.
         * @function encode
         * @memberof Frame.Value
         * @static
         * @param {Frame.Value} message Value message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Value.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.booleanValue != null && message.hasOwnProperty("booleanValue"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.booleanValue);
            if (message.integerValue != null && message.hasOwnProperty("integerValue"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.integerValue);
            if (message.floatValue != null && message.hasOwnProperty("floatValue"))
                writer.uint32(/* id 3, wireType 1 =*/25).double(message.floatValue);
            if (message.stringValue != null && message.hasOwnProperty("stringValue"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.stringValue);
            if (message.reference != null && message.hasOwnProperty("reference"))
                writer.uint32(/* id 5, wireType 0 =*/40).int64(message.reference);
            return writer;
        };

        /**
         * Encodes the specified Value message, length delimited. Does not implicitly {@link Frame.Value.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Frame.Value
         * @static
         * @param {Frame.Value} message Value message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Value.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Value message from the specified reader or buffer.
         * @function decode
         * @memberof Frame.Value
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Frame.Value} Value
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Value.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Frame.Value();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.booleanValue = reader.bool();
                    break;
                case 2:
                    message.integerValue = reader.int64();
                    break;
                case 3:
                    message.floatValue = reader.double();
                    break;
                case 4:
                    message.stringValue = reader.string();
                    break;
                case 5:
                    message.reference = reader.int64();
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
         * @memberof Frame.Value
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Frame.Value} Value
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
         * @memberof Frame.Value
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Value.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.booleanValue != null && message.hasOwnProperty("booleanValue")) {
                properties.value = 1;
                if (typeof message.booleanValue !== "boolean")
                    return "booleanValue: boolean expected";
            }
            if (message.integerValue != null && message.hasOwnProperty("integerValue")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                if (!$util.isInteger(message.integerValue) && !(message.integerValue && $util.isInteger(message.integerValue.low) && $util.isInteger(message.integerValue.high)))
                    return "integerValue: integer|Long expected";
            }
            if (message.floatValue != null && message.hasOwnProperty("floatValue")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                if (typeof message.floatValue !== "number")
                    return "floatValue: number expected";
            }
            if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                if (!$util.isString(message.stringValue))
                    return "stringValue: string expected";
            }
            if (message.reference != null && message.hasOwnProperty("reference")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                if (!$util.isInteger(message.reference) && !(message.reference && $util.isInteger(message.reference.low) && $util.isInteger(message.reference.high)))
                    return "reference: integer|Long expected";
            }
            return null;
        };

        /**
         * Creates a Value message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Frame.Value
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Frame.Value} Value
         */
        Value.fromObject = function fromObject(object) {
            if (object instanceof $root.Frame.Value)
                return object;
            let message = new $root.Frame.Value();
            if (object.booleanValue != null)
                message.booleanValue = Boolean(object.booleanValue);
            if (object.integerValue != null)
                if ($util.Long)
                    (message.integerValue = $util.Long.fromValue(object.integerValue)).unsigned = false;
                else if (typeof object.integerValue === "string")
                    message.integerValue = parseInt(object.integerValue, 10);
                else if (typeof object.integerValue === "number")
                    message.integerValue = object.integerValue;
                else if (typeof object.integerValue === "object")
                    message.integerValue = new $util.LongBits(object.integerValue.low >>> 0, object.integerValue.high >>> 0).toNumber();
            if (object.floatValue != null)
                message.floatValue = Number(object.floatValue);
            if (object.stringValue != null)
                message.stringValue = String(object.stringValue);
            if (object.reference != null)
                if ($util.Long)
                    (message.reference = $util.Long.fromValue(object.reference)).unsigned = false;
                else if (typeof object.reference === "string")
                    message.reference = parseInt(object.reference, 10);
                else if (typeof object.reference === "number")
                    message.reference = object.reference;
                else if (typeof object.reference === "object")
                    message.reference = new $util.LongBits(object.reference.low >>> 0, object.reference.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a Value message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Frame.Value
         * @static
         * @param {Frame.Value} message Value
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Value.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (message.booleanValue != null && message.hasOwnProperty("booleanValue")) {
                object.booleanValue = message.booleanValue;
                if (options.oneofs)
                    object.value = "booleanValue";
            }
            if (message.integerValue != null && message.hasOwnProperty("integerValue")) {
                if (typeof message.integerValue === "number")
                    object.integerValue = options.longs === String ? String(message.integerValue) : message.integerValue;
                else
                    object.integerValue = options.longs === String ? $util.Long.prototype.toString.call(message.integerValue) : options.longs === Number ? new $util.LongBits(message.integerValue.low >>> 0, message.integerValue.high >>> 0).toNumber() : message.integerValue;
                if (options.oneofs)
                    object.value = "integerValue";
            }
            if (message.floatValue != null && message.hasOwnProperty("floatValue")) {
                object.floatValue = options.json && !isFinite(message.floatValue) ? String(message.floatValue) : message.floatValue;
                if (options.oneofs)
                    object.value = "floatValue";
            }
            if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
                object.stringValue = message.stringValue;
                if (options.oneofs)
                    object.value = "stringValue";
            }
            if (message.reference != null && message.hasOwnProperty("reference")) {
                if (typeof message.reference === "number")
                    object.reference = options.longs === String ? String(message.reference) : message.reference;
                else
                    object.reference = options.longs === String ? $util.Long.prototype.toString.call(message.reference) : options.longs === Number ? new $util.LongBits(message.reference.low >>> 0, message.reference.high >>> 0).toNumber() : message.reference;
                if (options.oneofs)
                    object.value = "reference";
            }
            return object;
        };

        /**
         * Converts this Value to JSON.
         * @function toJSON
         * @memberof Frame.Value
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Value.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Value;
    })();

    Frame.Stack = (function() {

        /**
         * Properties of a Stack.
         * @memberof Frame
         * @interface IStack
         * @property {Array.<Frame.Stack.Scope>|null} [scopes] Stack scopes
         */

        /**
         * Constructs a new Stack.
         * @memberof Frame
         * @classdesc Represents a Stack.
         * @implements IStack
         * @constructor
         * @param {Frame.IStack=} [properties] Properties to set
         */
        function Stack(properties) {
            this.scopes = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Stack scopes.
         * @member {Array.<Frame.Stack.Scope>} scopes
         * @memberof Frame.Stack
         * @instance
         */
        Stack.prototype.scopes = $util.emptyArray;

        /**
         * Creates a new Stack instance using the specified properties.
         * @function create
         * @memberof Frame.Stack
         * @static
         * @param {Frame.IStack=} [properties] Properties to set
         * @returns {Frame.Stack} Stack instance
         */
        Stack.create = function create(properties) {
            return new Stack(properties);
        };

        /**
         * Encodes the specified Stack message. Does not implicitly {@link Frame.Stack.verify|verify} messages.
         * @function encode
         * @memberof Frame.Stack
         * @static
         * @param {Frame.Stack} message Stack message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Stack.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.scopes != null && message.scopes.length)
                for (let i = 0; i < message.scopes.length; ++i)
                    $root.Frame.Stack.Scope.encode(message.scopes[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Stack message, length delimited. Does not implicitly {@link Frame.Stack.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Frame.Stack
         * @static
         * @param {Frame.Stack} message Stack message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Stack.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Stack message from the specified reader or buffer.
         * @function decode
         * @memberof Frame.Stack
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Frame.Stack} Stack
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Stack.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Frame.Stack();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.scopes && message.scopes.length))
                        message.scopes = [];
                    message.scopes.push($root.Frame.Stack.Scope.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Stack message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Frame.Stack
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Frame.Stack} Stack
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Stack.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Stack message.
         * @function verify
         * @memberof Frame.Stack
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Stack.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.scopes != null && message.hasOwnProperty("scopes")) {
                if (!Array.isArray(message.scopes))
                    return "scopes: array expected";
                for (let i = 0; i < message.scopes.length; ++i) {
                    let error = $root.Frame.Stack.Scope.verify(message.scopes[i]);
                    if (error)
                        return "scopes." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Stack message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Frame.Stack
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Frame.Stack} Stack
         */
        Stack.fromObject = function fromObject(object) {
            if (object instanceof $root.Frame.Stack)
                return object;
            let message = new $root.Frame.Stack();
            if (object.scopes) {
                if (!Array.isArray(object.scopes))
                    throw TypeError(".Frame.Stack.scopes: array expected");
                message.scopes = [];
                for (let i = 0; i < object.scopes.length; ++i) {
                    if (typeof object.scopes[i] !== "object")
                        throw TypeError(".Frame.Stack.scopes: object expected");
                    message.scopes[i] = $root.Frame.Stack.Scope.fromObject(object.scopes[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Stack message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Frame.Stack
         * @static
         * @param {Frame.Stack} message Stack
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Stack.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.scopes = [];
            if (message.scopes && message.scopes.length) {
                object.scopes = [];
                for (let j = 0; j < message.scopes.length; ++j)
                    object.scopes[j] = $root.Frame.Stack.Scope.toObject(message.scopes[j], options);
            }
            return object;
        };

        /**
         * Converts this Stack to JSON.
         * @function toJSON
         * @memberof Frame.Stack
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Stack.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        Stack.Scope = (function() {

            /**
             * Properties of a Scope.
             * @memberof Frame.Stack
             * @interface IScope
             * @property {number|null} [line] Scope line
             * @property {string|null} [name] Scope name
             * @property {Array.<Frame.Stack.Scope.Variable>|null} [variables] Scope variables
             */

            /**
             * Constructs a new Scope.
             * @memberof Frame.Stack
             * @classdesc Represents a Scope.
             * @implements IScope
             * @constructor
             * @param {Frame.Stack.IScope=} [properties] Properties to set
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
             * @memberof Frame.Stack.Scope
             * @instance
             */
            Scope.prototype.line = 0;

            /**
             * Scope name.
             * @member {string} name
             * @memberof Frame.Stack.Scope
             * @instance
             */
            Scope.prototype.name = "";

            /**
             * Scope variables.
             * @member {Array.<Frame.Stack.Scope.Variable>} variables
             * @memberof Frame.Stack.Scope
             * @instance
             */
            Scope.prototype.variables = $util.emptyArray;

            /**
             * Creates a new Scope instance using the specified properties.
             * @function create
             * @memberof Frame.Stack.Scope
             * @static
             * @param {Frame.Stack.IScope=} [properties] Properties to set
             * @returns {Frame.Stack.Scope} Scope instance
             */
            Scope.create = function create(properties) {
                return new Scope(properties);
            };

            /**
             * Encodes the specified Scope message. Does not implicitly {@link Frame.Stack.Scope.verify|verify} messages.
             * @function encode
             * @memberof Frame.Stack.Scope
             * @static
             * @param {Frame.Stack.Scope} message Scope message or plain object to encode
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
                        $root.Frame.Stack.Scope.Variable.encode(message.variables[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Scope message, length delimited. Does not implicitly {@link Frame.Stack.Scope.verify|verify} messages.
             * @function encodeDelimited
             * @memberof Frame.Stack.Scope
             * @static
             * @param {Frame.Stack.Scope} message Scope message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Scope.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Scope message from the specified reader or buffer.
             * @function decode
             * @memberof Frame.Stack.Scope
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {Frame.Stack.Scope} Scope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Scope.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Frame.Stack.Scope();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.line = reader.int32();
                        break;
                    case 2:
                        message.name = reader.string();
                        break;
                    case 4:
                        if (!(message.variables && message.variables.length))
                            message.variables = [];
                        message.variables.push($root.Frame.Stack.Scope.Variable.decode(reader, reader.uint32()));
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
             * @memberof Frame.Stack.Scope
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {Frame.Stack.Scope} Scope
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
             * @memberof Frame.Stack.Scope
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
                        let error = $root.Frame.Stack.Scope.Variable.verify(message.variables[i]);
                        if (error)
                            return "variables." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a Scope message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof Frame.Stack.Scope
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {Frame.Stack.Scope} Scope
             */
            Scope.fromObject = function fromObject(object) {
                if (object instanceof $root.Frame.Stack.Scope)
                    return object;
                let message = new $root.Frame.Stack.Scope();
                if (object.line != null)
                    message.line = object.line | 0;
                if (object.name != null)
                    message.name = String(object.name);
                if (object.variables) {
                    if (!Array.isArray(object.variables))
                        throw TypeError(".Frame.Stack.Scope.variables: array expected");
                    message.variables = [];
                    for (let i = 0; i < object.variables.length; ++i) {
                        if (typeof object.variables[i] !== "object")
                            throw TypeError(".Frame.Stack.Scope.variables: object expected");
                        message.variables[i] = $root.Frame.Stack.Scope.Variable.fromObject(object.variables[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a Scope message. Also converts values to other types if specified.
             * @function toObject
             * @memberof Frame.Stack.Scope
             * @static
             * @param {Frame.Stack.Scope} message Scope
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
                        object.variables[j] = $root.Frame.Stack.Scope.Variable.toObject(message.variables[j], options);
                }
                return object;
            };

            /**
             * Converts this Scope to JSON.
             * @function toJSON
             * @memberof Frame.Stack.Scope
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Scope.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            Scope.Variable = (function() {

                /**
                 * Properties of a Variable.
                 * @memberof Frame.Stack.Scope
                 * @interface IVariable
                 * @property {string|null} [name] Variable name
                 * @property {Frame.Value|null} [value] Variable value
                 */

                /**
                 * Constructs a new Variable.
                 * @memberof Frame.Stack.Scope
                 * @classdesc Represents a Variable.
                 * @implements IVariable
                 * @constructor
                 * @param {Frame.Stack.Scope.IVariable=} [properties] Properties to set
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
                 * @memberof Frame.Stack.Scope.Variable
                 * @instance
                 */
                Variable.prototype.name = "";

                /**
                 * Variable value.
                 * @member {Frame.Value|null|undefined} value
                 * @memberof Frame.Stack.Scope.Variable
                 * @instance
                 */
                Variable.prototype.value = null;

                /**
                 * Creates a new Variable instance using the specified properties.
                 * @function create
                 * @memberof Frame.Stack.Scope.Variable
                 * @static
                 * @param {Frame.Stack.Scope.IVariable=} [properties] Properties to set
                 * @returns {Frame.Stack.Scope.Variable} Variable instance
                 */
                Variable.create = function create(properties) {
                    return new Variable(properties);
                };

                /**
                 * Encodes the specified Variable message. Does not implicitly {@link Frame.Stack.Scope.Variable.verify|verify} messages.
                 * @function encode
                 * @memberof Frame.Stack.Scope.Variable
                 * @static
                 * @param {Frame.Stack.Scope.Variable} message Variable message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Variable.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.name != null && message.hasOwnProperty("name"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                    if (message.value != null && message.hasOwnProperty("value"))
                        $root.Frame.Value.encode(message.value, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Variable message, length delimited. Does not implicitly {@link Frame.Stack.Scope.Variable.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof Frame.Stack.Scope.Variable
                 * @static
                 * @param {Frame.Stack.Scope.Variable} message Variable message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Variable.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Variable message from the specified reader or buffer.
                 * @function decode
                 * @memberof Frame.Stack.Scope.Variable
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {Frame.Stack.Scope.Variable} Variable
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Variable.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Frame.Stack.Scope.Variable();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.name = reader.string();
                            break;
                        case 2:
                            message.value = $root.Frame.Value.decode(reader, reader.uint32());
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
                 * @memberof Frame.Stack.Scope.Variable
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {Frame.Stack.Scope.Variable} Variable
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
                 * @memberof Frame.Stack.Scope.Variable
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
                        let error = $root.Frame.Value.verify(message.value);
                        if (error)
                            return "value." + error;
                    }
                    return null;
                };

                /**
                 * Creates a Variable message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof Frame.Stack.Scope.Variable
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {Frame.Stack.Scope.Variable} Variable
                 */
                Variable.fromObject = function fromObject(object) {
                    if (object instanceof $root.Frame.Stack.Scope.Variable)
                        return object;
                    let message = new $root.Frame.Stack.Scope.Variable();
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.value != null) {
                        if (typeof object.value !== "object")
                            throw TypeError(".Frame.Stack.Scope.Variable.value: object expected");
                        message.value = $root.Frame.Value.fromObject(object.value);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Variable message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof Frame.Stack.Scope.Variable
                 * @static
                 * @param {Frame.Stack.Scope.Variable} message Variable
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
                        object.value = $root.Frame.Value.toObject(message.value, options);
                    return object;
                };

                /**
                 * Converts this Variable to JSON.
                 * @function toJSON
                 * @memberof Frame.Stack.Scope.Variable
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Variable.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Variable;
            })();

            return Scope;
        })();

        return Stack;
    })();

    Frame.Heap = (function() {

        /**
         * Properties of a Heap.
         * @memberof Frame
         * @interface IHeap
         * @property {Object.<string,Frame.Heap.Obj>|null} [references] Heap references
         */

        /**
         * Constructs a new Heap.
         * @memberof Frame
         * @classdesc Represents a Heap.
         * @implements IHeap
         * @constructor
         * @param {Frame.IHeap=} [properties] Properties to set
         */
        function Heap(properties) {
            this.references = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Heap references.
         * @member {Object.<string,Frame.Heap.Obj>} references
         * @memberof Frame.Heap
         * @instance
         */
        Heap.prototype.references = $util.emptyObject;

        /**
         * Creates a new Heap instance using the specified properties.
         * @function create
         * @memberof Frame.Heap
         * @static
         * @param {Frame.IHeap=} [properties] Properties to set
         * @returns {Frame.Heap} Heap instance
         */
        Heap.create = function create(properties) {
            return new Heap(properties);
        };

        /**
         * Encodes the specified Heap message. Does not implicitly {@link Frame.Heap.verify|verify} messages.
         * @function encode
         * @memberof Frame.Heap
         * @static
         * @param {Frame.Heap} message Heap message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Heap.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.references != null && message.hasOwnProperty("references"))
                for (let keys = Object.keys(message.references), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 0 =*/8).int64(keys[i]);
                    $root.Frame.Heap.Obj.encode(message.references[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                }
            return writer;
        };

        /**
         * Encodes the specified Heap message, length delimited. Does not implicitly {@link Frame.Heap.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Frame.Heap
         * @static
         * @param {Frame.Heap} message Heap message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Heap.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Heap message from the specified reader or buffer.
         * @function decode
         * @memberof Frame.Heap
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Frame.Heap} Heap
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Heap.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Frame.Heap(), key;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    reader.skip().pos++;
                    if (message.references === $util.emptyObject)
                        message.references = {};
                    key = reader.int64();
                    reader.pos++;
                    message.references[typeof key === "object" ? $util.longToHash(key) : key] = $root.Frame.Heap.Obj.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Heap message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Frame.Heap
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Frame.Heap} Heap
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Heap.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Heap message.
         * @function verify
         * @memberof Frame.Heap
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Heap.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.references != null && message.hasOwnProperty("references")) {
                if (!$util.isObject(message.references))
                    return "references: object expected";
                let key = Object.keys(message.references);
                for (let i = 0; i < key.length; ++i) {
                    if (!$util.key64Re.test(key[i]))
                        return "references: integer|Long key{k:int64} expected";
                    {
                        let error = $root.Frame.Heap.Obj.verify(message.references[key[i]]);
                        if (error)
                            return "references." + error;
                    }
                }
            }
            return null;
        };

        /**
         * Creates a Heap message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Frame.Heap
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Frame.Heap} Heap
         */
        Heap.fromObject = function fromObject(object) {
            if (object instanceof $root.Frame.Heap)
                return object;
            let message = new $root.Frame.Heap();
            if (object.references) {
                if (typeof object.references !== "object")
                    throw TypeError(".Frame.Heap.references: object expected");
                message.references = {};
                for (let keys = Object.keys(object.references), i = 0; i < keys.length; ++i) {
                    if (typeof object.references[keys[i]] !== "object")
                        throw TypeError(".Frame.Heap.references: object expected");
                    message.references[keys[i]] = $root.Frame.Heap.Obj.fromObject(object.references[keys[i]]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Heap message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Frame.Heap
         * @static
         * @param {Frame.Heap} message Heap
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Heap.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.objects || options.defaults)
                object.references = {};
            let keys2;
            if (message.references && (keys2 = Object.keys(message.references)).length) {
                object.references = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.references[keys2[j]] = $root.Frame.Heap.Obj.toObject(message.references[keys2[j]], options);
            }
            return object;
        };

        /**
         * Converts this Heap to JSON.
         * @function toJSON
         * @memberof Frame.Heap
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Heap.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        Heap.Obj = (function() {

            /**
             * Properties of an Obj.
             * @memberof Frame.Heap
             * @interface IObj
             * @property {Frame.Heap.Obj.Type|null} [type] Obj type
             * @property {string|null} [lType] Obj lType
             * @property {boolean|null} [userDefined] Obj userDefined
             * @property {Array.<Frame.Heap.Obj.Member>|null} [members] Obj members
             */

            /**
             * Constructs a new Obj.
             * @memberof Frame.Heap
             * @classdesc Represents an Obj.
             * @implements IObj
             * @constructor
             * @param {Frame.Heap.IObj=} [properties] Properties to set
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
             * @member {Frame.Heap.Obj.Type} type
             * @memberof Frame.Heap.Obj
             * @instance
             */
            Obj.prototype.type = 0;

            /**
             * Obj lType.
             * @member {string} lType
             * @memberof Frame.Heap.Obj
             * @instance
             */
            Obj.prototype.lType = "";

            /**
             * Obj userDefined.
             * @member {boolean} userDefined
             * @memberof Frame.Heap.Obj
             * @instance
             */
            Obj.prototype.userDefined = false;

            /**
             * Obj members.
             * @member {Array.<Frame.Heap.Obj.Member>} members
             * @memberof Frame.Heap.Obj
             * @instance
             */
            Obj.prototype.members = $util.emptyArray;

            /**
             * Creates a new Obj instance using the specified properties.
             * @function create
             * @memberof Frame.Heap.Obj
             * @static
             * @param {Frame.Heap.IObj=} [properties] Properties to set
             * @returns {Frame.Heap.Obj} Obj instance
             */
            Obj.create = function create(properties) {
                return new Obj(properties);
            };

            /**
             * Encodes the specified Obj message. Does not implicitly {@link Frame.Heap.Obj.verify|verify} messages.
             * @function encode
             * @memberof Frame.Heap.Obj
             * @static
             * @param {Frame.Heap.Obj} message Obj message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Obj.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type != null && message.hasOwnProperty("type"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                if (message.lType != null && message.hasOwnProperty("lType"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.lType);
                if (message.userDefined != null && message.hasOwnProperty("userDefined"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.userDefined);
                if (message.members != null && message.members.length)
                    for (let i = 0; i < message.members.length; ++i)
                        $root.Frame.Heap.Obj.Member.encode(message.members[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Obj message, length delimited. Does not implicitly {@link Frame.Heap.Obj.verify|verify} messages.
             * @function encodeDelimited
             * @memberof Frame.Heap.Obj
             * @static
             * @param {Frame.Heap.Obj} message Obj message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Obj.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Obj message from the specified reader or buffer.
             * @function decode
             * @memberof Frame.Heap.Obj
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {Frame.Heap.Obj} Obj
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Obj.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Frame.Heap.Obj();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.type = reader.int32();
                        break;
                    case 2:
                        message.lType = reader.string();
                        break;
                    case 3:
                        message.userDefined = reader.bool();
                        break;
                    case 4:
                        if (!(message.members && message.members.length))
                            message.members = [];
                        message.members.push($root.Frame.Heap.Obj.Member.decode(reader, reader.uint32()));
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
             * @memberof Frame.Heap.Obj
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {Frame.Heap.Obj} Obj
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
             * @memberof Frame.Heap.Obj
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
                if (message.lType != null && message.hasOwnProperty("lType"))
                    if (!$util.isString(message.lType))
                        return "lType: string expected";
                if (message.userDefined != null && message.hasOwnProperty("userDefined"))
                    if (typeof message.userDefined !== "boolean")
                        return "userDefined: boolean expected";
                if (message.members != null && message.hasOwnProperty("members")) {
                    if (!Array.isArray(message.members))
                        return "members: array expected";
                    for (let i = 0; i < message.members.length; ++i) {
                        let error = $root.Frame.Heap.Obj.Member.verify(message.members[i]);
                        if (error)
                            return "members." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an Obj message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof Frame.Heap.Obj
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {Frame.Heap.Obj} Obj
             */
            Obj.fromObject = function fromObject(object) {
                if (object instanceof $root.Frame.Heap.Obj)
                    return object;
                let message = new $root.Frame.Heap.Obj();
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
                if (object.lType != null)
                    message.lType = String(object.lType);
                if (object.userDefined != null)
                    message.userDefined = Boolean(object.userDefined);
                if (object.members) {
                    if (!Array.isArray(object.members))
                        throw TypeError(".Frame.Heap.Obj.members: array expected");
                    message.members = [];
                    for (let i = 0; i < object.members.length; ++i) {
                        if (typeof object.members[i] !== "object")
                            throw TypeError(".Frame.Heap.Obj.members: object expected");
                        message.members[i] = $root.Frame.Heap.Obj.Member.fromObject(object.members[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from an Obj message. Also converts values to other types if specified.
             * @function toObject
             * @memberof Frame.Heap.Obj
             * @static
             * @param {Frame.Heap.Obj} message Obj
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
                    object.lType = "";
                    object.userDefined = false;
                }
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $root.Frame.Heap.Obj.Type[message.type] : message.type;
                if (message.lType != null && message.hasOwnProperty("lType"))
                    object.lType = message.lType;
                if (message.userDefined != null && message.hasOwnProperty("userDefined"))
                    object.userDefined = message.userDefined;
                if (message.members && message.members.length) {
                    object.members = [];
                    for (let j = 0; j < message.members.length; ++j)
                        object.members[j] = $root.Frame.Heap.Obj.Member.toObject(message.members[j], options);
                }
                return object;
            };

            /**
             * Converts this Obj to JSON.
             * @function toJSON
             * @memberof Frame.Heap.Obj
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Obj.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Type enum.
             * @name Frame.Heap.Obj.Type
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

            Obj.Member = (function() {

                /**
                 * Properties of a Member.
                 * @memberof Frame.Heap.Obj
                 * @interface IMember
                 * @property {Frame.Value|null} [key] Member key
                 * @property {Frame.Value|null} [value] Member value
                 */

                /**
                 * Constructs a new Member.
                 * @memberof Frame.Heap.Obj
                 * @classdesc Represents a Member.
                 * @implements IMember
                 * @constructor
                 * @param {Frame.Heap.Obj.IMember=} [properties] Properties to set
                 */
                function Member(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Member key.
                 * @member {Frame.Value|null|undefined} key
                 * @memberof Frame.Heap.Obj.Member
                 * @instance
                 */
                Member.prototype.key = null;

                /**
                 * Member value.
                 * @member {Frame.Value|null|undefined} value
                 * @memberof Frame.Heap.Obj.Member
                 * @instance
                 */
                Member.prototype.value = null;

                /**
                 * Creates a new Member instance using the specified properties.
                 * @function create
                 * @memberof Frame.Heap.Obj.Member
                 * @static
                 * @param {Frame.Heap.Obj.IMember=} [properties] Properties to set
                 * @returns {Frame.Heap.Obj.Member} Member instance
                 */
                Member.create = function create(properties) {
                    return new Member(properties);
                };

                /**
                 * Encodes the specified Member message. Does not implicitly {@link Frame.Heap.Obj.Member.verify|verify} messages.
                 * @function encode
                 * @memberof Frame.Heap.Obj.Member
                 * @static
                 * @param {Frame.Heap.Obj.Member} message Member message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Member.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.key != null && message.hasOwnProperty("key"))
                        $root.Frame.Value.encode(message.key, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.value != null && message.hasOwnProperty("value"))
                        $root.Frame.Value.encode(message.value, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Member message, length delimited. Does not implicitly {@link Frame.Heap.Obj.Member.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof Frame.Heap.Obj.Member
                 * @static
                 * @param {Frame.Heap.Obj.Member} message Member message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Member.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Member message from the specified reader or buffer.
                 * @function decode
                 * @memberof Frame.Heap.Obj.Member
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {Frame.Heap.Obj.Member} Member
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Member.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Frame.Heap.Obj.Member();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.key = $root.Frame.Value.decode(reader, reader.uint32());
                            break;
                        case 2:
                            message.value = $root.Frame.Value.decode(reader, reader.uint32());
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
                 * @memberof Frame.Heap.Obj.Member
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {Frame.Heap.Obj.Member} Member
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
                 * @memberof Frame.Heap.Obj.Member
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Member.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.key != null && message.hasOwnProperty("key")) {
                        let error = $root.Frame.Value.verify(message.key);
                        if (error)
                            return "key." + error;
                    }
                    if (message.value != null && message.hasOwnProperty("value")) {
                        let error = $root.Frame.Value.verify(message.value);
                        if (error)
                            return "value." + error;
                    }
                    return null;
                };

                /**
                 * Creates a Member message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof Frame.Heap.Obj.Member
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {Frame.Heap.Obj.Member} Member
                 */
                Member.fromObject = function fromObject(object) {
                    if (object instanceof $root.Frame.Heap.Obj.Member)
                        return object;
                    let message = new $root.Frame.Heap.Obj.Member();
                    if (object.key != null) {
                        if (typeof object.key !== "object")
                            throw TypeError(".Frame.Heap.Obj.Member.key: object expected");
                        message.key = $root.Frame.Value.fromObject(object.key);
                    }
                    if (object.value != null) {
                        if (typeof object.value !== "object")
                            throw TypeError(".Frame.Heap.Obj.Member.value: object expected");
                        message.value = $root.Frame.Value.fromObject(object.value);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Member message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof Frame.Heap.Obj.Member
                 * @static
                 * @param {Frame.Heap.Obj.Member} message Member
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
                        object.key = $root.Frame.Value.toObject(message.key, options);
                    if (message.value != null && message.hasOwnProperty("value"))
                        object.value = $root.Frame.Value.toObject(message.value, options);
                    return object;
                };

                /**
                 * Converts this Member to JSON.
                 * @function toJSON
                 * @memberof Frame.Heap.Obj.Member
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Member.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Member;
            })();

            return Obj;
        })();

        return Heap;
    })();

    return Frame;
})();

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
     * @property {Action.Start|null} [start] Action start
     * @property {Action.Stop|null} [stop] Action stop
     * @property {Action.Step|null} [step] Action step
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
     * @member {Action.Step|null|undefined} step
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
     * @member {"start"|"stop"|"step"|"input"|undefined} action
     * @memberof Action
     * @instance
     */
    Object.defineProperty(Action.prototype, "action", {
        get: $util.oneOfGetter($oneOfFields = ["start", "stop", "step", "input"]),
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
        if (message.start != null && message.hasOwnProperty("start"))
            $root.Action.Start.encode(message.start, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.stop != null && message.hasOwnProperty("stop"))
            $root.Action.Stop.encode(message.stop, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.step != null && message.hasOwnProperty("step"))
            $root.Action.Step.encode(message.step, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.input != null && message.hasOwnProperty("input"))
            $root.Action.Input.encode(message.input, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
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
                message.start = $root.Action.Start.decode(reader, reader.uint32());
                break;
            case 2:
                message.stop = $root.Action.Stop.decode(reader, reader.uint32());
                break;
            case 3:
                message.step = $root.Action.Step.decode(reader, reader.uint32());
                break;
            case 4:
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
        if (message.start != null && message.hasOwnProperty("start")) {
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
                let error = $root.Action.Step.verify(message.step);
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
            message.step = $root.Action.Step.fromObject(object.step);
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
            object.step = $root.Action.Step.toObject(message.step, options);
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

    Action.Start = (function() {

        /**
         * Properties of a Start.
         * @memberof Action
         * @interface IStart
         * @property {string|null} [main] Start main
         * @property {string|null} [code] Start code
         * @property {Uint8Array|null} [tar] Start tar
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
         * Start main.
         * @member {string} main
         * @memberof Action.Start
         * @instance
         */
        Start.prototype.main = "";

        /**
         * Start code.
         * @member {string} code
         * @memberof Action.Start
         * @instance
         */
        Start.prototype.code = "";

        /**
         * Start tar.
         * @member {Uint8Array} tar
         * @memberof Action.Start
         * @instance
         */
        Start.prototype.tar = $util.newBuffer([]);

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * Start source.
         * @member {"code"|"tar"|undefined} source
         * @memberof Action.Start
         * @instance
         */
        Object.defineProperty(Start.prototype, "source", {
            get: $util.oneOfGetter($oneOfFields = ["code", "tar"]),
            set: $util.oneOfSetter($oneOfFields)
        });

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
            if (message.main != null && message.hasOwnProperty("main"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.main);
            if (message.code != null && message.hasOwnProperty("code"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.code);
            if (message.tar != null && message.hasOwnProperty("tar"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.tar);
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
            let message = new $root.Action.Start();
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
         * Creates a plain object from a Start message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Action.Start
         * @static
         * @param {Action.Start} message Start
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Start.toObject = function toObject(message, options) {
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
     * @property {Array.<Event>|null} [events] TracerResponse events
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
        this.events = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * TracerResponse events.
     * @member {Array.<Event>} events
     * @memberof TracerResponse
     * @instance
     */
    TracerResponse.prototype.events = $util.emptyArray;

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
        if (message.events != null && message.events.length)
            for (let i = 0; i < message.events.length; ++i)
                $root.Event.encode(message.events[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
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
                if (!(message.events && message.events.length))
                    message.events = [];
                message.events.push($root.Event.decode(reader, reader.uint32()));
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
        if (message.events != null && message.hasOwnProperty("events")) {
            if (!Array.isArray(message.events))
                return "events: array expected";
            for (let i = 0; i < message.events.length; ++i) {
                let error = $root.Event.verify(message.events[i]);
                if (error)
                    return "events." + error;
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
        if (object.events) {
            if (!Array.isArray(object.events))
                throw TypeError(".TracerResponse.events: array expected");
            message.events = [];
            for (let i = 0; i < object.events.length; ++i) {
                if (typeof object.events[i] !== "object")
                    throw TypeError(".TracerResponse.events: object expected");
                message.events[i] = $root.Event.fromObject(object.events[i]);
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
            object.events = [];
        if (message.events && message.events.length) {
            object.events = [];
            for (let j = 0; j < message.events.length; ++j)
                object.events[j] = $root.Event.toObject(message.events[j], options);
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

export const Sessions = $root.Sessions = (() => {

    /**
     * Properties of a Sessions.
     * @exports ISessions
     * @interface ISessions
     * @property {Array.<Session>|null} [sessions] Sessions sessions
     */

    /**
     * Constructs a new Sessions.
     * @exports Sessions
     * @classdesc Represents a Sessions.
     * @implements ISessions
     * @constructor
     * @param {ISessions=} [properties] Properties to set
     */
    function Sessions(properties) {
        this.sessions = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Sessions sessions.
     * @member {Array.<Session>} sessions
     * @memberof Sessions
     * @instance
     */
    Sessions.prototype.sessions = $util.emptyArray;

    /**
     * Creates a new Sessions instance using the specified properties.
     * @function create
     * @memberof Sessions
     * @static
     * @param {ISessions=} [properties] Properties to set
     * @returns {Sessions} Sessions instance
     */
    Sessions.create = function create(properties) {
        return new Sessions(properties);
    };

    /**
     * Encodes the specified Sessions message. Does not implicitly {@link Sessions.verify|verify} messages.
     * @function encode
     * @memberof Sessions
     * @static
     * @param {Sessions} message Sessions message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Sessions.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.sessions != null && message.sessions.length)
            for (let i = 0; i < message.sessions.length; ++i)
                $root.Session.encode(message.sessions[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Sessions message, length delimited. Does not implicitly {@link Sessions.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Sessions
     * @static
     * @param {Sessions} message Sessions message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Sessions.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Sessions message from the specified reader or buffer.
     * @function decode
     * @memberof Sessions
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Sessions} Sessions
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Sessions.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Sessions();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.sessions && message.sessions.length))
                    message.sessions = [];
                message.sessions.push($root.Session.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Sessions message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Sessions
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Sessions} Sessions
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Sessions.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Sessions message.
     * @function verify
     * @memberof Sessions
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Sessions.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.sessions != null && message.hasOwnProperty("sessions")) {
            if (!Array.isArray(message.sessions))
                return "sessions: array expected";
            for (let i = 0; i < message.sessions.length; ++i) {
                let error = $root.Session.verify(message.sessions[i]);
                if (error)
                    return "sessions." + error;
            }
        }
        return null;
    };

    /**
     * Creates a Sessions message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Sessions
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Sessions} Sessions
     */
    Sessions.fromObject = function fromObject(object) {
        if (object instanceof $root.Sessions)
            return object;
        let message = new $root.Sessions();
        if (object.sessions) {
            if (!Array.isArray(object.sessions))
                throw TypeError(".Sessions.sessions: array expected");
            message.sessions = [];
            for (let i = 0; i < object.sessions.length; ++i) {
                if (typeof object.sessions[i] !== "object")
                    throw TypeError(".Sessions.sessions: object expected");
                message.sessions[i] = $root.Session.fromObject(object.sessions[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a Sessions message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Sessions
     * @static
     * @param {Sessions} message Sessions
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Sessions.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.sessions = [];
        if (message.sessions && message.sessions.length) {
            object.sessions = [];
            for (let j = 0; j < message.sessions.length; ++j)
                object.sessions[j] = $root.Session.toObject(message.sessions[j], options);
        }
        return object;
    };

    /**
     * Converts this Sessions to JSON.
     * @function toJSON
     * @memberof Sessions
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Sessions.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Sessions;
})();

export const Session = $root.Session = (() => {

    /**
     * Properties of a Session.
     * @exports ISession
     * @interface ISession
     * @property {Id|null} [id] Session id
     * @property {string|null} [language] Session language
     */

    /**
     * Constructs a new Session.
     * @exports Session
     * @classdesc Represents a Session.
     * @implements ISession
     * @constructor
     * @param {ISession=} [properties] Properties to set
     */
    function Session(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Session id.
     * @member {Id|null|undefined} id
     * @memberof Session
     * @instance
     */
    Session.prototype.id = null;

    /**
     * Session language.
     * @member {string} language
     * @memberof Session
     * @instance
     */
    Session.prototype.language = "";

    /**
     * Creates a new Session instance using the specified properties.
     * @function create
     * @memberof Session
     * @static
     * @param {ISession=} [properties] Properties to set
     * @returns {Session} Session instance
     */
    Session.create = function create(properties) {
        return new Session(properties);
    };

    /**
     * Encodes the specified Session message. Does not implicitly {@link Session.verify|verify} messages.
     * @function encode
     * @memberof Session
     * @static
     * @param {Session} message Session message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Session.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.id != null && message.hasOwnProperty("id"))
            $root.Id.encode(message.id, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.language != null && message.hasOwnProperty("language"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.language);
        return writer;
    };

    /**
     * Encodes the specified Session message, length delimited. Does not implicitly {@link Session.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Session
     * @static
     * @param {Session} message Session message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Session.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Session message from the specified reader or buffer.
     * @function decode
     * @memberof Session
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Session} Session
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Session.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Session();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.id = $root.Id.decode(reader, reader.uint32());
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
     * Decodes a Session message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Session
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Session} Session
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Session.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Session message.
     * @function verify
     * @memberof Session
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Session.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.id != null && message.hasOwnProperty("id")) {
            let error = $root.Id.verify(message.id);
            if (error)
                return "id." + error;
        }
        if (message.language != null && message.hasOwnProperty("language"))
            if (!$util.isString(message.language))
                return "language: string expected";
        return null;
    };

    /**
     * Creates a Session message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Session
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Session} Session
     */
    Session.fromObject = function fromObject(object) {
        if (object instanceof $root.Session)
            return object;
        let message = new $root.Session();
        if (object.id != null) {
            if (typeof object.id !== "object")
                throw TypeError(".Session.id: object expected");
            message.id = $root.Id.fromObject(object.id);
        }
        if (object.language != null)
            message.language = String(object.language);
        return message;
    };

    /**
     * Creates a plain object from a Session message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Session
     * @static
     * @param {Session} message Session
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Session.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.id = null;
            object.language = "";
        }
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = $root.Id.toObject(message.id, options);
        if (message.language != null && message.hasOwnProperty("language"))
            object.language = message.language;
        return object;
    };

    /**
     * Converts this Session to JSON.
     * @function toJSON
     * @memberof Session
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Session.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Session;
})();

export const Id = $root.Id = (() => {

    /**
     * Properties of an Id.
     * @exports IId
     * @interface IId
     * @property {number|null} [number] Id number
     */

    /**
     * Constructs a new Id.
     * @exports Id
     * @classdesc Represents an Id.
     * @implements IId
     * @constructor
     * @param {IId=} [properties] Properties to set
     */
    function Id(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Id number.
     * @member {number} number
     * @memberof Id
     * @instance
     */
    Id.prototype.number = 0;

    /**
     * Creates a new Id instance using the specified properties.
     * @function create
     * @memberof Id
     * @static
     * @param {IId=} [properties] Properties to set
     * @returns {Id} Id instance
     */
    Id.create = function create(properties) {
        return new Id(properties);
    };

    /**
     * Encodes the specified Id message. Does not implicitly {@link Id.verify|verify} messages.
     * @function encode
     * @memberof Id
     * @static
     * @param {Id} message Id message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Id.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.number != null && message.hasOwnProperty("number"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.number);
        return writer;
    };

    /**
     * Encodes the specified Id message, length delimited. Does not implicitly {@link Id.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Id
     * @static
     * @param {Id} message Id message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Id.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Id message from the specified reader or buffer.
     * @function decode
     * @memberof Id
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Id} Id
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Id.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Id();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.number = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Id message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Id
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Id} Id
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Id.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Id message.
     * @function verify
     * @memberof Id
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Id.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.number != null && message.hasOwnProperty("number"))
            if (!$util.isInteger(message.number))
                return "number: integer expected";
        return null;
    };

    /**
     * Creates an Id message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Id
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Id} Id
     */
    Id.fromObject = function fromObject(object) {
        if (object instanceof $root.Id)
            return object;
        let message = new $root.Id();
        if (object.number != null)
            message.number = object.number | 0;
        return message;
    };

    /**
     * Creates a plain object from an Id message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Id
     * @static
     * @param {Id} message Id
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Id.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.number = 0;
        if (message.number != null && message.hasOwnProperty("number"))
            object.number = message.number;
        return object;
    };

    /**
     * Converts this Id to JSON.
     * @function toJSON
     * @memberof Id
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Id.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Id;
})();

export const StartResponse = $root.StartResponse = (() => {

    /**
     * Properties of a StartResponse.
     * @exports IStartResponse
     * @interface IStartResponse
     * @property {Session|null} [session] StartResponse session
     * @property {TracerResponse|null} [response] StartResponse response
     */

    /**
     * Constructs a new StartResponse.
     * @exports StartResponse
     * @classdesc Represents a StartResponse.
     * @implements IStartResponse
     * @constructor
     * @param {IStartResponse=} [properties] Properties to set
     */
    function StartResponse(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * StartResponse session.
     * @member {Session|null|undefined} session
     * @memberof StartResponse
     * @instance
     */
    StartResponse.prototype.session = null;

    /**
     * StartResponse response.
     * @member {TracerResponse|null|undefined} response
     * @memberof StartResponse
     * @instance
     */
    StartResponse.prototype.response = null;

    /**
     * Creates a new StartResponse instance using the specified properties.
     * @function create
     * @memberof StartResponse
     * @static
     * @param {IStartResponse=} [properties] Properties to set
     * @returns {StartResponse} StartResponse instance
     */
    StartResponse.create = function create(properties) {
        return new StartResponse(properties);
    };

    /**
     * Encodes the specified StartResponse message. Does not implicitly {@link StartResponse.verify|verify} messages.
     * @function encode
     * @memberof StartResponse
     * @static
     * @param {StartResponse} message StartResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    StartResponse.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.session != null && message.hasOwnProperty("session"))
            $root.Session.encode(message.session, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.response != null && message.hasOwnProperty("response"))
            $root.TracerResponse.encode(message.response, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified StartResponse message, length delimited. Does not implicitly {@link StartResponse.verify|verify} messages.
     * @function encodeDelimited
     * @memberof StartResponse
     * @static
     * @param {StartResponse} message StartResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    StartResponse.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a StartResponse message from the specified reader or buffer.
     * @function decode
     * @memberof StartResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {StartResponse} StartResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    StartResponse.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.StartResponse();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.session = $root.Session.decode(reader, reader.uint32());
                break;
            case 2:
                message.response = $root.TracerResponse.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a StartResponse message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof StartResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {StartResponse} StartResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    StartResponse.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a StartResponse message.
     * @function verify
     * @memberof StartResponse
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    StartResponse.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.session != null && message.hasOwnProperty("session")) {
            let error = $root.Session.verify(message.session);
            if (error)
                return "session." + error;
        }
        if (message.response != null && message.hasOwnProperty("response")) {
            let error = $root.TracerResponse.verify(message.response);
            if (error)
                return "response." + error;
        }
        return null;
    };

    /**
     * Creates a StartResponse message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof StartResponse
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {StartResponse} StartResponse
     */
    StartResponse.fromObject = function fromObject(object) {
        if (object instanceof $root.StartResponse)
            return object;
        let message = new $root.StartResponse();
        if (object.session != null) {
            if (typeof object.session !== "object")
                throw TypeError(".StartResponse.session: object expected");
            message.session = $root.Session.fromObject(object.session);
        }
        if (object.response != null) {
            if (typeof object.response !== "object")
                throw TypeError(".StartResponse.response: object expected");
            message.response = $root.TracerResponse.fromObject(object.response);
        }
        return message;
    };

    /**
     * Creates a plain object from a StartResponse message. Also converts values to other types if specified.
     * @function toObject
     * @memberof StartResponse
     * @static
     * @param {StartResponse} message StartResponse
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    StartResponse.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.session = null;
            object.response = null;
        }
        if (message.session != null && message.hasOwnProperty("session"))
            object.session = $root.Session.toObject(message.session, options);
        if (message.response != null && message.hasOwnProperty("response"))
            object.response = $root.TracerResponse.toObject(message.response, options);
        return object;
    };

    /**
     * Converts this StartResponse to JSON.
     * @function toJSON
     * @memberof StartResponse
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    StartResponse.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return StartResponse;
})();

export const Breakpoints = $root.Breakpoints = (() => {

    /**
     * Properties of a Breakpoints.
     * @exports IBreakpoints
     * @interface IBreakpoints
     * @property {Array.<number>|null} [lines] Breakpoints lines
     */

    /**
     * Constructs a new Breakpoints.
     * @exports Breakpoints
     * @classdesc Represents a Breakpoints.
     * @implements IBreakpoints
     * @constructor
     * @param {IBreakpoints=} [properties] Properties to set
     */
    function Breakpoints(properties) {
        this.lines = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Breakpoints lines.
     * @member {Array.<number>} lines
     * @memberof Breakpoints
     * @instance
     */
    Breakpoints.prototype.lines = $util.emptyArray;

    /**
     * Creates a new Breakpoints instance using the specified properties.
     * @function create
     * @memberof Breakpoints
     * @static
     * @param {IBreakpoints=} [properties] Properties to set
     * @returns {Breakpoints} Breakpoints instance
     */
    Breakpoints.create = function create(properties) {
        return new Breakpoints(properties);
    };

    /**
     * Encodes the specified Breakpoints message. Does not implicitly {@link Breakpoints.verify|verify} messages.
     * @function encode
     * @memberof Breakpoints
     * @static
     * @param {Breakpoints} message Breakpoints message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Breakpoints.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.lines != null && message.lines.length) {
            writer.uint32(/* id 1, wireType 2 =*/10).fork();
            for (let i = 0; i < message.lines.length; ++i)
                writer.int32(message.lines[i]);
            writer.ldelim();
        }
        return writer;
    };

    /**
     * Encodes the specified Breakpoints message, length delimited. Does not implicitly {@link Breakpoints.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Breakpoints
     * @static
     * @param {Breakpoints} message Breakpoints message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Breakpoints.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Breakpoints message from the specified reader or buffer.
     * @function decode
     * @memberof Breakpoints
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Breakpoints} Breakpoints
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Breakpoints.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Breakpoints();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.lines && message.lines.length))
                    message.lines = [];
                if ((tag & 7) === 2) {
                    let end2 = reader.uint32() + reader.pos;
                    while (reader.pos < end2)
                        message.lines.push(reader.int32());
                } else
                    message.lines.push(reader.int32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Breakpoints message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Breakpoints
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Breakpoints} Breakpoints
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Breakpoints.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Breakpoints message.
     * @function verify
     * @memberof Breakpoints
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Breakpoints.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.lines != null && message.hasOwnProperty("lines")) {
            if (!Array.isArray(message.lines))
                return "lines: array expected";
            for (let i = 0; i < message.lines.length; ++i)
                if (!$util.isInteger(message.lines[i]))
                    return "lines: integer[] expected";
        }
        return null;
    };

    /**
     * Creates a Breakpoints message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Breakpoints
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Breakpoints} Breakpoints
     */
    Breakpoints.fromObject = function fromObject(object) {
        if (object instanceof $root.Breakpoints)
            return object;
        let message = new $root.Breakpoints();
        if (object.lines) {
            if (!Array.isArray(object.lines))
                throw TypeError(".Breakpoints.lines: array expected");
            message.lines = [];
            for (let i = 0; i < object.lines.length; ++i)
                message.lines[i] = object.lines[i] | 0;
        }
        return message;
    };

    /**
     * Creates a plain object from a Breakpoints message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Breakpoints
     * @static
     * @param {Breakpoints} message Breakpoints
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Breakpoints.toObject = function toObject(message, options) {
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
     * Converts this Breakpoints to JSON.
     * @function toJSON
     * @memberof Breakpoints
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Breakpoints.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Breakpoints;
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
     * Callback as used by {@link Tracers#getLanguages}.
     * @memberof Tracers
     * @typedef getLanguagesCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {Languages} [response] Languages
     */

    /**
     * Calls getLanguages.
     * @function getLanguages
     * @memberof Tracers
     * @instance
     * @param {Empty} request Empty message or plain object
     * @param {Tracers.getLanguagesCallback} callback Node-style callback called with the error, if any, and Languages
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(Tracers.prototype.getLanguages = function getLanguages(request, callback) {
        return this.rpcCall(getLanguages, $root.Empty, $root.Languages, request, callback);
    }, "name", { value: "getLanguages" });

    /**
     * Calls getLanguages.
     * @function getLanguages
     * @memberof Tracers
     * @instance
     * @param {Empty} request Empty message or plain object
     * @returns {Promise<Languages>} Promise
     * @variation 2
     */

    /**
     * Callback as used by {@link Tracers#getSessions}.
     * @memberof Tracers
     * @typedef getSessionsCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {Sessions} [response] Sessions
     */

    /**
     * Calls getSessions.
     * @function getSessions
     * @memberof Tracers
     * @instance
     * @param {Empty} request Empty message or plain object
     * @param {Tracers.getSessionsCallback} callback Node-style callback called with the error, if any, and Sessions
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(Tracers.prototype.getSessions = function getSessions(request, callback) {
        return this.rpcCall(getSessions, $root.Empty, $root.Sessions, request, callback);
    }, "name", { value: "getSessions" });

    /**
     * Calls getSessions.
     * @function getSessions
     * @memberof Tracers
     * @instance
     * @param {Empty} request Empty message or plain object
     * @returns {Promise<Sessions>} Promise
     * @variation 2
     */

    /**
     * Callback as used by {@link Tracers#start}.
     * @memberof Tracers
     * @typedef startCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {StartResponse} [response] StartResponse
     */

    /**
     * Calls start.
     * @function start
     * @memberof Tracers
     * @instance
     * @param {Action.Start} request Start message or plain object
     * @param {Tracers.startCallback} callback Node-style callback called with the error, if any, and StartResponse
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(Tracers.prototype.start = function start(request, callback) {
        return this.rpcCall(start, $root.Action.Start, $root.StartResponse, request, callback);
    }, "name", { value: "start" });

    /**
     * Calls start.
     * @function start
     * @memberof Tracers
     * @instance
     * @param {Action.Start} request Start message or plain object
     * @returns {Promise<StartResponse>} Promise
     * @variation 2
     */

    /**
     * Callback as used by {@link Tracers#stop}.
     * @memberof Tracers
     * @typedef stopCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {Empty} [response] Empty
     */

    /**
     * Calls stop.
     * @function stop
     * @memberof Tracers
     * @instance
     * @param {Id} request Id message or plain object
     * @param {Tracers.stopCallback} callback Node-style callback called with the error, if any, and Empty
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(Tracers.prototype.stop = function stop(request, callback) {
        return this.rpcCall(stop, $root.Id, $root.Empty, request, callback);
    }, "name", { value: "stop" });

    /**
     * Calls stop.
     * @function stop
     * @memberof Tracers
     * @instance
     * @param {Id} request Id message or plain object
     * @returns {Promise<Empty>} Promise
     * @variation 2
     */

    /**
     * Callback as used by {@link Tracers#step}.
     * @memberof Tracers
     * @typedef stepCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {TracerResponse} [response] TracerResponse
     */

    /**
     * Calls step.
     * @function step
     * @memberof Tracers
     * @instance
     * @param {Id} request Id message or plain object
     * @param {Tracers.stepCallback} callback Node-style callback called with the error, if any, and TracerResponse
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(Tracers.prototype.step = function step(request, callback) {
        return this.rpcCall(step, $root.Id, $root.TracerResponse, request, callback);
    }, "name", { value: "step" });

    /**
     * Calls step.
     * @function step
     * @memberof Tracers
     * @instance
     * @param {Id} request Id message or plain object
     * @returns {Promise<TracerResponse>} Promise
     * @variation 2
     */

    /**
     * Callback as used by {@link Tracers#stepOver}.
     * @memberof Tracers
     * @typedef stepOverCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {TracerResponse} [response] TracerResponse
     */

    /**
     * Calls stepOver.
     * @function stepOver
     * @memberof Tracers
     * @instance
     * @param {Id} request Id message or plain object
     * @param {Tracers.stepOverCallback} callback Node-style callback called with the error, if any, and TracerResponse
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(Tracers.prototype.stepOver = function stepOver(request, callback) {
        return this.rpcCall(stepOver, $root.Id, $root.TracerResponse, request, callback);
    }, "name", { value: "stepOver" });

    /**
     * Calls stepOver.
     * @function stepOver
     * @memberof Tracers
     * @instance
     * @param {Id} request Id message or plain object
     * @returns {Promise<TracerResponse>} Promise
     * @variation 2
     */

    /**
     * Callback as used by {@link Tracers#stepOut}.
     * @memberof Tracers
     * @typedef stepOutCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {TracerResponse} [response] TracerResponse
     */

    /**
     * Calls stepOut.
     * @function stepOut
     * @memberof Tracers
     * @instance
     * @param {Id} request Id message or plain object
     * @param {Tracers.stepOutCallback} callback Node-style callback called with the error, if any, and TracerResponse
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(Tracers.prototype.stepOut = function stepOut(request, callback) {
        return this.rpcCall(stepOut, $root.Id, $root.TracerResponse, request, callback);
    }, "name", { value: "stepOut" });

    /**
     * Calls stepOut.
     * @function stepOut
     * @memberof Tracers
     * @instance
     * @param {Id} request Id message or plain object
     * @returns {Promise<TracerResponse>} Promise
     * @variation 2
     */

    /**
     * Callback as used by {@link Tracers#continue_}.
     * @memberof Tracers
     * @typedef continueCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {TracerResponse} [response] TracerResponse
     */

    /**
     * Calls continue.
     * @function continue
     * @memberof Tracers
     * @instance
     * @param {Id} request Id message or plain object
     * @param {Tracers.continueCallback} callback Node-style callback called with the error, if any, and TracerResponse
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(Tracers.prototype["continue"] = function continue_(request, callback) {
        return this.rpcCall(continue_, $root.Id, $root.TracerResponse, request, callback);
    }, "name", { value: "continue" });

    /**
     * Calls continue.
     * @function continue
     * @memberof Tracers
     * @instance
     * @param {Id} request Id message or plain object
     * @returns {Promise<TracerResponse>} Promise
     * @variation 2
     */

    /**
     * Callback as used by {@link Tracers#input}.
     * @memberof Tracers
     * @typedef inputCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {Empty} [response] Empty
     */

    /**
     * Calls input.
     * @function input
     * @memberof Tracers
     * @instance
     * @param {Action.Input} request Input message or plain object
     * @param {Tracers.inputCallback} callback Node-style callback called with the error, if any, and Empty
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(Tracers.prototype.input = function input(request, callback) {
        return this.rpcCall(input, $root.Action.Input, $root.Empty, request, callback);
    }, "name", { value: "input" });

    /**
     * Calls input.
     * @function input
     * @memberof Tracers
     * @instance
     * @param {Action.Input} request Input message or plain object
     * @returns {Promise<Empty>} Promise
     * @variation 2
     */

    /**
     * Callback as used by {@link Tracers#getBreakpoints}.
     * @memberof Tracers
     * @typedef getBreakpointsCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {Breakpoints} [response] Breakpoints
     */

    /**
     * Calls getBreakpoints.
     * @function getBreakpoints
     * @memberof Tracers
     * @instance
     * @param {Empty} request Empty message or plain object
     * @param {Tracers.getBreakpointsCallback} callback Node-style callback called with the error, if any, and Breakpoints
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(Tracers.prototype.getBreakpoints = function getBreakpoints(request, callback) {
        return this.rpcCall(getBreakpoints, $root.Empty, $root.Breakpoints, request, callback);
    }, "name", { value: "getBreakpoints" });

    /**
     * Calls getBreakpoints.
     * @function getBreakpoints
     * @memberof Tracers
     * @instance
     * @param {Empty} request Empty message or plain object
     * @returns {Promise<Breakpoints>} Promise
     * @variation 2
     */

    /**
     * Callback as used by {@link Tracers#setBreakpoints}.
     * @memberof Tracers
     * @typedef setBreakpointsCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {Empty} [response] Empty
     */

    /**
     * Calls setBreakpoints.
     * @function setBreakpoints
     * @memberof Tracers
     * @instance
     * @param {Breakpoints} request Breakpoints message or plain object
     * @param {Tracers.setBreakpointsCallback} callback Node-style callback called with the error, if any, and Empty
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(Tracers.prototype.setBreakpoints = function setBreakpoints(request, callback) {
        return this.rpcCall(setBreakpoints, $root.Breakpoints, $root.Empty, request, callback);
    }, "name", { value: "setBreakpoints" });

    /**
     * Calls setBreakpoints.
     * @function setBreakpoints
     * @memberof Tracers
     * @instance
     * @param {Breakpoints} request Breakpoints message or plain object
     * @returns {Promise<Empty>} Promise
     * @variation 2
     */

    return Tracers;
})();

export { $root as default };
