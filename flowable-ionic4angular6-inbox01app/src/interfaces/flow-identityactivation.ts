import {Typed} from "./flow-typed"
import {IIdentityActivation} from "./flow-iidentityactivation"


export class IdentityActivation extends Typed implements IIdentityActivation {

    _v_Type = "IdentityActivation";

    constructor(
        public applicationKey: string,
        public identityKey: string,
        public active: boolean = false) {
        super();
    };

    setActive( theActive: boolean) {
        this.active = theActive === true;
    }

    getActive(): boolean {
        return this.active;
    }
}
