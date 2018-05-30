import { ITyped } from './flow-ityped';


export interface IApplication extends ITyped {
    name: string;
    key: string;
    isDisabled: boolean;
    specs:  ISpec[];
    groups: IGroup[];
    identities: IIdentity[];

    getAllSpecs() : ISpec[];
    getProcessSpecs() : IProcessSpec[];
}


export interface ISpec extends ITyped {
    application: IApplication;
    name: string;
    key: string;
}


export interface IProcessSpec extends ISpec {
}



export interface IProcessInitiator extends ITyped {
    initiableProcessKeys: string[];
    participedProcessKeys: string[];
}


export interface IGroup extends IProcessInitiator {
    application: IApplication;
    name: string;
    key: string;
    isVirtual: boolean;
}


export interface IIdentity extends IProcessInitiator {
    application: IApplication;
    user: string;
    groupKeys: string[];
}

