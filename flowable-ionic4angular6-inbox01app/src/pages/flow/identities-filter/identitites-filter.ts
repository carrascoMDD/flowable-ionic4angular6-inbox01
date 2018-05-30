import {Component} from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';
import { UserData} from '../../../providers/user-data';
import {IIdentityActivation} from "../../../interfaces/flow-iidentityactivation";

@Component({
    selector: 'page-roles-filter',
    templateUrl: 'identities-filter.html'
})
export class IdentitiesFilterPage {

    identityActivations: IIdentityActivation[];

    constructor(
        public userData: UserData,
        public navParams: NavParams,
        public viewCtrl: ViewController
    ) {}



    ionViewDidLoad() {
        this.userData.getIdentityActivations().then( ( theIdentityActivations: IIdentityActivation[]) => {
            this.identityActivations = theIdentityActivations;
        });
    }



    deactivateAllIdentities() {
        this.setActiveAllIdentities( false);
    }



    activateAllIdentities() {
        this.setActiveAllIdentities( true);
    }



    setActiveAllIdentities( theActive: boolean) {
        if( !this.identityActivations) {
            return;
        }

        for( let anActivityActivation of this.identityActivations) {
            anActivityActivation.setActive( theActive);
        }
        this.userData.storeIdentityActivations();
    }




    identityActiveChanged( theApplicationKey: string, theIdentityKey: string) {
        console.log( "identityActiveChanged applicationKey=" + theApplicationKey + " identityKey=" + theIdentityKey);

        this.userData.propagate_IdentityActivationsChanged();
    }


    applyFilters() {
        this.userData.propagate_IdentityActivationsChanged();
        this.dismiss( this.identityActivations);
    }



    dismiss(data?: any) {
        // using the injected ViewController this page
        // can "dismiss" itself and pass back data
        this.viewCtrl.dismiss(data);
    }
}
