import {Typed} from "./flow-typed"
import { IApplication, ISpec, IProcessSpec, IGroup, IIdentity} from "./flow-iapplications"


export class Application extends Typed implements IApplication {

    _v_Type = "Application";

    processSpecs: IProcessSpec[];

    groups: IGroup[];
    identities: IIdentity[];

    constructor( public name: string, public key: string) {
        super();
    }

    _v_Success: boolean;
    _v_Condition?: string;
    _v_Message?: string;
    _v_Details?: any;


    addProcessSpec( theProcessSpec: IProcessSpec) {
        if ( !theProcessSpec) {
            return;
        }

        this.processSpecs.push( theProcessSpec);
    }


    addGroup( theGroup: IGroup) {
        if ( !theGroup) {
            return;
        }

        this.groups.push( theGroup);
    }



    addIdentity( theIdentity: IIdentity) {
        if ( !theIdentity) {
            return;
        }

        this.identities.push( theIdentity);
    }
}



export abstract class Spec extends Typed implements ISpec {

    _v_Type = "Spec";


    constructor( public name: string) {
        super();
    }

}




export class ProcessSpec extends Spec implements IProcessSpec {

    _v_Type = "ProcessSpec";

    constructor( theName: string, public key: string) {
        super( theName);
    }
}





export class Group extends Typed implements IGroup {

    _v_Type = "Group";

    constructor( public name: string, public key: string) {
        super();
    };
}




export class Identity extends Typed implements IIdentity {

    _v_Type = "Identity";

    constructor( public key: string, public groupKeys: string[]) {
        super();
    };
}



