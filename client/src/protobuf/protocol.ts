export interface IEvent {
    started?: (Event.IStarted|null);
    inspected?: (Event.IInspected|null);
    printed?: (Event.IPrinted|null);
    locked?: (Event.ILocked|null);
    threw?: (Event.IThrew|null);
}

export class Event implements IEvent {
    public started?: (Event.IStarted|null);
    public inspected?: (Event.IInspected|null);
    public printed?: (Event.IPrinted|null);
    public locked?: (Event.ILocked|null);
    public threw?: (Event.IThrew|null);
    public event?: ("started"|"inspected"|"printed"|"locked"|"threw");
}

export namespace Event {

    export interface IStarted {
    }

    export class Started implements IStarted {
    }

    export interface IInspected {
        frame?: (IFrame|null);
    }

    export class Inspected implements IInspected {
        public frame?: (IFrame|null);
    }

    export interface IPrinted {
        value?: (string|null);
    }

    export class Printed implements IPrinted {
        public value: string;
    }

    export interface ILocked {
        cause?: (string|null);
    }

    export class Locked implements ILocked {
        public cause: string;
    }

    export interface IThrew {
        exception?: (IException|null);
    }

    export class Threw implements IThrew {
        public exception?: (IException|null);
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
    exception?: (IException|null);
    stack?: (Frame.IStack|null);
    heap?: (Frame.IHeap|null);
}

export class Frame implements IFrame {
    public type: Frame.Type;
    public line: number;
    public finish: boolean;
    public exception?: (IException|null);
    public stack?: (Frame.IStack|null);
    public heap?: (Frame.IHeap|null);
}

export namespace Frame {

    export enum Type {
        LINE = 0,
        CALL = 1,
        RETURN = 2,
        EXCEPTION = 3
    }

    export interface IValue {
        booleanValue?: (boolean|null);
        integerValue?: (number|Long|null);
        floatValue?: (number|null);
        stringValue?: (string|null);
        reference?: (number|Long|null);
    }

    export class Value implements IValue {
        public booleanValue: boolean;
        public integerValue: (number|Long);
        public floatValue: number;
        public stringValue: string;
        public reference: (number|Long);
        public value?: ("booleanValue"|"integerValue"|"floatValue"|"stringValue"|"reference");
    }

    export interface IStack {
        scopes?: (Frame.Stack.IScope[]|null);
    }

    export class Stack implements IStack {
        public scopes: Frame.Stack.IScope[];
    }

    export namespace Stack {

        export interface IScope {
            line?: (number|null);
            name?: (string|null);
            variables?: (Frame.Stack.Scope.IVariable[]|null);
        }

        export class Scope implements IScope {
            public line: number;
            public name: string;
            public variables: Frame.Stack.Scope.IVariable[];
        }

        export namespace Scope {

            export interface IVariable {
                name?: (string|null);
                value?: (Frame.IValue|null);
            }

            export class Variable implements IVariable {
                public name: string;
                public value?: (Frame.IValue|null);
            }
        }
    }

    export interface IHeap {
        references?: ({ [k: string]: Frame.Heap.IObj }|null);
    }

    export class Heap implements IHeap {
        public references: { [k: string]: Frame.Heap.IObj };
    }

    export namespace Heap {

        export interface IObj {
            type?: (Frame.Heap.Obj.Type|null);
            lType?: (string|null);
            userDefined?: (boolean|null);
            members?: (Frame.Heap.Obj.IMember[]|null);
        }

        export class Obj implements IObj {
            public type: Frame.Heap.Obj.Type;
            public lType: string;
            public userDefined: boolean;
            public members: Frame.Heap.Obj.IMember[];
        }

        export namespace Obj {

            export enum Type {
                ARRAY = 0,
                TUPLE = 1,
                ALIST = 2,
                LLIST = 3,
                HMAP = 4,
                TMAP = 5,
                SET = 6,
                OTHER = 7
            }

            export interface IMember {
                key?: (Frame.IValue|null);
                value?: (Frame.IValue|null);
            }

            export class Member implements IMember {
                public key?: (Frame.IValue|null);
                public value?: (Frame.IValue|null);
            }
        }
    }
}

export interface ITracerRequest {
    actions?: (IAction[]|null);
}

export class TracerRequest implements ITracerRequest {
    public actions: IAction[];
}

export interface IAction {
    start?: (Action.IStart|null);
    stop?: (Action.IStop|null);
    step?: (Action.IStep|null);
    input?: (Action.IInput|null);
}

export class Action implements IAction {
    public start?: (Action.IStart|null);
    public stop?: (Action.IStop|null);
    public step?: (Action.IStep|null);
    public input?: (Action.IInput|null);
    public action?: ("start"|"stop"|"step"|"input");
}

export namespace Action {

    export interface IStart {
        main?: (string|null);
        code?: (string|null);
        tar?: (Uint8Array|null);
    }

    export class Start implements IStart {
        public main: string;
        public code: string;
        public tar: Uint8Array;
        public source?: ("code"|"tar");
    }

    export interface IStop {
    }

    export class Stop implements IStop {
    }

    export interface IStep {
    }

    export class Step implements IStep {
    }

    export interface IInput {
        lines?: (string[]|null);
    }

    export class Input implements IInput {
        public lines: string[];
    }
}

export interface ITracerResponse {
    events?: (IEvent[]|null);
}

export class TracerResponse implements ITracerResponse {
    public events: IEvent[];
}
