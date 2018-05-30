import { ITyped } from './flow-ityped';


export interface IIdentityActivation extends ITyped {
    applicationKey: string;
    identityKey: string;
    isActive: boolean;

    setActive( theIsActive: boolean);
    getActive(): boolean;
}


