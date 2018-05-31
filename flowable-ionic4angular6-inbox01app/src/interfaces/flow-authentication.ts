import {Result} from "./flow-result"
import {IAuthentication} from "./flow-iauthentication"


export class Authentication extends Result implements IAuthentication {

    _v_Type = "Authentication";

    constructor(
        public login: string,
        theSuccess: boolean,
        theCondition?: string,
        theMessage?: string,
        theDetails?: any) {

        super(theSuccess, theCondition, theMessage, theDetails);
    };

}

