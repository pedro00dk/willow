export interface IEvent {
    started?: (Event.Started|null);
    inspected?: (Event.Inspected|null);
    printed?: (Event.Printed|null);
    locked?: (Event.Locked|null);
    threw?: (Event.Threw|null);
}

export class Event implements IEvent {
    public started?: (Event.Started|null);
    public inspected?: (Event.Inspected|null);
    public printed?: (Event.Printed|null);
    public locked?: (Event.Locked|null);
    public threw?: (Event.Threw|null);
    public event?: ("started"|"inspected"|"printed"|"locked"|"threw");
}

export namespace Event {

    interface IStarted {
    }

    class Started implements IStarted {
    }

    interface IInspected {
        frame?: (Frame|null);
    }

    class Inspected implements IInspected {
        public frame?: (Frame|null);
    }

    interface IPrinted {
        value?: (string|null);
    }

    class Printed implements IPrinted {
        public value: string;
    }

    interface ILocked {
        cause?: (string|null);
    }

    class Locked implements ILocked {
        public cause: string;
    }

    interface IThrew {
        exception?: (Exception|null);
    }

    class Threw implements IThrew {
        public exception?: (Exception|null);
    }
}

export interface IException {
    type?: (string|null);
    args?: (string[]|null);
    traceback?: (string[]|null);
}

export class Exception implements IException {
    public type: string;
    public args: string[];
    public traceback: string[];
}

export interface IFrame {
    type?: (Frame.Type|null);
    line?: (number|null);
    finish?: (boolean|null);
    exception?: (Exception|null);
    stack?: (Frame.Stack|null);
    heap?: (Frame.Heap|null);
}

export class Frame implements IFrame {
    public type: Frame.Type;
    public line: number;
    public finish: boolean;
    public exception?: (Exception|null);
    public stack?: (Frame.Stack|null);
    public heap?: (Frame.Heap|null);
}

export namespace Frame {

    enum Type {
        LINE = 0,
        CALL = 1,
        RETURN = 2,
        EXCEPTION = 3
    }

    interface IValue {
        booleanValue?: (boolean|null);
        integerValue?: (number|Long|null);
        floatValue?: (number|null);
        stringValue?: (string|null);
        reference?: (number|Long|null);
    }

    class Value implements IValue {
        public booleanValue: boolean;
        public integerValue: (number|Long);
        public floatValue: number;
        public stringValue: string;
        public reference: (number|Long);
        public value?: ("booleanValue"|"integerValue"|"floatValue"|"stringValue"|"reference");
    }

    interface IStack {
        scopes?: (Frame.Stack.Scope[]|null);
    }

    class Stack implements IStack {
        public scopes: Frame.Stack.Scope[];
    }

    namespace Stack {

        interface IScope {
            line?: (number|null);
            name?: (string|null);
            variables?: (Frame.Stack.Scope.Variable[]|null);
        }

        class Scope implements IScope {
            public line: number;
            public name: string;
            public variables: Frame.Stack.Scope.Variable[];
        }

        namespace Scope {

            interface IVariable {
                name?: (string|null);
                value?: (Frame.Value|null);
            }

            class Variable implements IVariable {
                public name: string;
                public value?: (Frame.Value|null);
            }
        }
    }

    interface IHeap {
        references?: ({ [k: string]: Frame.Heap.Obj }|null);
    }

    class Heap implements IHeap {
        public references: { [k: string]: Frame.Heap.Obj };
    }

    namespace Heap {

        interface IObj {
            type?: (Frame.Heap.Obj.Type|null);
            lType?: (string|null);
            userDefined?: (boolean|null);
            members?: (Frame.Heap.Obj.Member[]|null);
        }

        class Obj implements IObj {
            public type: Frame.Heap.Obj.Type;
            public lType: string;
            public userDefined: boolean;
            public members: Frame.Heap.Obj.Member[];
        }

        namespace Obj {

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

            interface IMember {
                key?: (Frame.Value|null);
                value?: (Frame.Value|null);
            }

            class Member implements IMember {
                public key?: (Frame.Value|null);
                public value?: (Frame.Value|null);
            }
        }
    }
}

export interface ITracerRequest {
    actions?: (Action[]|null);
}

export class TracerRequest implements ITracerRequest {
    public actions: Action[];
}

export interface IAction {
    start?: (Action.Start|null);
    stop?: (Action.Stop|null);
    step?: (Action.Step|null);
    input?: (Action.Input|null);
}

export class Action implements IAction {
    public start?: (Action.Start|null);
    public stop?: (Action.Stop|null);
    public step?: (Action.Step|null);
    public input?: (Action.Input|null);
    public action?: ("start"|"stop"|"step"|"input");
}

export namespace Action {

    interface IStart {
        main?: (string|null);
        code?: (string|null);
        tar?: (Uint8Array|null);
    }

    class Start implements IStart {
        public main: string;
        public code: string;
        public tar: Uint8Array;
        public source?: ("code"|"tar");
    }

    interface IStop {
    }

    class Stop implements IStop {
    }

    interface IStep {
    }

    class Step implements IStep {
    }

    interface IInput {
        lines?: (string[]|null);
    }

    class Input implements IInput {
        public lines: string[];
    }
}

export interface ITracerResponse {
    events?: (Event[]|null);
}

export class TracerResponse implements ITracerResponse {
    public events: Event[];
}
