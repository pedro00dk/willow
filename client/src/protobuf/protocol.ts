export interface IStep {
    snapshot?: (ISnapshot|null);
    threw?: (IThrew|null);
    prints?: (string[]|null);
}

export class Step implements IStep {
    public snapshot?: (ISnapshot|null);
    public threw?: (IThrew|null);
    public prints: string[];
}

export interface ISnapshot {
    type?: (Snapshot.Type|null);
    finish?: (boolean|null);
    exception?: (IException|null);
    stack?: (IScope[]|null);
    heap?: ({ [k: string]: IObj }|null);
}

export class Snapshot implements ISnapshot {
    public type: Snapshot.Type;
    public finish: boolean;
    public exception?: (IException|null);
    public stack: IScope[];
    public heap: { [k: string]: IObj };
}

export namespace Snapshot {

    export enum Type {
        LINE = 0,
        CALL = 1,
        RETURN = 2,
        EXCEPTION = 3
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

export interface IScope {
    line?: (number|null);
    name?: (string|null);
    variables?: (IVariable[]|null);
}

export class Scope implements IScope {
    public line: number;
    public name: string;
    public variables: IVariable[];
}

export interface IVariable {
    name?: (string|null);
    value?: (IValue|null);
}

export class Variable implements IVariable {
    public name: string;
    public value?: (IValue|null);
}

export interface IValue {
    number?: (number|null);
    string?: (string|null);
    reference?: (string|null);
}

export class Value implements IValue {
    public number: number;
    public string: string;
    public reference: string;
    public value?: ("number"|"string"|"reference");
}

export interface IObj {
    type?: (Obj.Type|null);
    languageType?: (string|null);
    userDefined?: (boolean|null);
    members?: (IMember[]|null);
}

export class Obj implements IObj {
    public type: Obj.Type;
    public languageType: string;
    public userDefined: boolean;
    public members: IMember[];
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
}

export interface IMember {
    key?: (IValue|null);
    value?: (IValue|null);
}

export class Member implements IMember {
    public key?: (IValue|null);
    public value?: (IValue|null);
}

export interface IThrew {
    exception?: (IException|null);
    cause?: (string|null);
}

export class Threw implements IThrew {
    public exception?: (IException|null);
    public cause: string;
}

export interface ITrace {
    source?: (string|null);
    input?: (string|null);
    steps?: (number|null);
}

export class Trace implements ITrace {
    public source: string;
    public input: string;
    public steps: number;
}

export interface IResult {
    steps?: (IStep[]|null);
}

export class Result implements IResult {
    public steps: IStep[];
}
