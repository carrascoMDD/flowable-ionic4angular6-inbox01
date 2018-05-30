import {Typed} from "./flow-typed"
import {IIdentityActivation} from "./flow-iidentityactivation"


export class IdentityActivation extends Typed implements IIdentityActivation {

    _v_Type = "IdentityActivation";

    constructor(
        public applicationKey: string,
        public identityKey: string,
        public isActive: boolean = false) {

        super();
    };

    setActive( theIsActive: boolean) {
        this.isActive = theIsActive === true;
    }

    getActive(): boolean {
        return this.isActive === true;
    }
}
