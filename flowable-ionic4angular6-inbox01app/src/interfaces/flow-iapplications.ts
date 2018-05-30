import { ITyped } from './flow-ityped';


export interface IApplication extends ITyped {
    name: string;
    key: string;
    processSpecs: IProcessSpec[];
    groups: IGroup[];
    identities: IIdentity[];
}


export interface ISpec extends ITyped {
    name: string;
}


export interface IProcessSpec extends ISpec {
    key: string;
}


export interface IGroup extends ITyped {
    name: string;
    key: string;
}


export interface IIdentity extends ITyped {
    key: string;
    groupKeys: string[];
}

