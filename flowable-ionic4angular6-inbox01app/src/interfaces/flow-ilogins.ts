import { ITyped } from './flow-ityped';


export interface ILogin extends ITyped {
    login: string;
    name: string;
    familyName: string;
    loginApplications: ILoginApplication[];
}


export interface ILoginApplication extends ITyped {
    login: ILogin;
    applicationKey: string;
    identityKeys: string[];
}


