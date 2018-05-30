import { Typed } from "./flow-typed"
import {ILogin, ILoginApplication} from "./flow-ilogins"


export class Login extends Typed  implements ILogin {

    _v_Type = "Login";

    loginApplications: ILoginApplication[];

    constructor(
        public login: string,
        public name: string,
        public familyName: string) {

        super();
        this.loginApplications = [];
    };

    addLoginApplication( theLoginApplication: ILoginApplication) {
        if ( !theLoginApplication) {
            return;
        }

        this.loginApplications.push( theLoginApplication);
    }
}




export class LoginApplication implements ILoginApplication {

    _v_Type = "LoginApplication";

    constructor(
        public login: ILogin,
        public applicationKey: string,
        public identityKeys: string[] ) {

        console.log( "LoginApplication applicationKey=" + applicationKey, " identityKeys=" + identityKeys.toString())
    };
}
