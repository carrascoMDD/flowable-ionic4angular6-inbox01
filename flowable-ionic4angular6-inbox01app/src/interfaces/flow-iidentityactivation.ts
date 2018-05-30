import { ITyped } from './flow-ityped';


export interface IIdentityActivation extends ITyped {
    applicationKey: string;
    identityKey: string;
    active: boolean;

    setActive( theActive: boolean);
    getActive(): boolean;
}


