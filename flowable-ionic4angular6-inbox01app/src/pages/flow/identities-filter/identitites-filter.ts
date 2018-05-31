import {Component} from '@angular/core';
import {
    AlertController, App,
    LoadingController, ModalController,
    NavController,
    NavParams,
    ToastController,
    ViewController
} from 'ionic-angular';
import { UserData} from '../../../providers/user-data';
import {IIdentityActivation} from "../../../interfaces/flow-iidentityactivation";

import {LoggedinPage} from '../loggedin/loggedin';


@Component({
    selector: 'page-identities-filter',
    templateUrl: 'identities-filter.html'
})
export class IdentitiesFilterPage extends LoggedinPage{

    identityActivations: IIdentityActivation[];

    constructor(
        theApp: App,
        theAlertCtrl: AlertController,
        theLoadingCtrl: LoadingController,
        theModalCtrl: ModalController,
        theNavCtrl: NavController,
        theToastCtrl: ToastController,
        theUserData: UserData,
        public navParams: NavParams,
        public viewCtrl: ViewController) {

        super(theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData);

        console.log("IdentitiesFilterPage constructor");
    }


    ionViewDidLoad() {
        console.log("ArchivedPage ionViewDidLoad");
        this.app.setTitle('Archived');
    }

    ionViewDidEnter() {
        console.log("TemplatesPage ionViewDidEnter");
        this.updateContent();
    }


    updateContent(): Promise<IIdentityActivation[]> {
        return new Promise( ( pheResolve, pheReject) => {
            this.userData.getIdentityActivations()
                .then(
                    ( theIdentityActivations: IIdentityActivation[]) => {
                        this.identityActivations = theIdentityActivations;
                        pheResolve( theIdentityActivations);
                    },
                    ( theError ) => {
                        pheReject( theError);
                    }
                );
        });
    }





    identityActiveChanged( theApplicationKey: string, theIdentityKey: string): Promise<IIdentityActivation[]> {
        console.log( "identityActiveChanged applicationKey=" + theApplicationKey + " identityKey=" + theIdentityKey);

        return this.storeAndPropagageIdentityActivations();
    }



    deactivateAllIdentities(): Promise<IIdentityActivation[]> {
        return this.setActiveAllIdentities( false);
    }



    activateAllIdentities(): Promise<IIdentityActivation[]> {
        return this.setActiveAllIdentities( true);
    }



    setActiveAllIdentities( theActive: boolean): Promise<IIdentityActivation[]> {
        if( !this.identityActivations) {
            return;
        }

        for( let anActivityActivation of this.identityActivations) {
            anActivityActivation.setActive( theActive);
        }

        return this.storeAndPropagageIdentityActivations();
    }






    applyFilters(): Promise<IIdentityActivation[]> {
        return new Promise<IIdentityActivation[]>( ( pheResolve, pheReject) => {
            this.storeAndPropagageIdentityActivations()
                .then(
                    ( theIdentityActivations: IIdentityActivation[]) => {
                        this.dismiss( this.identityActivations);
                        pheResolve( theIdentityActivations);
                    },
                    ( theError) => {
                        pheReject( theError);
                    }
                );
        });
    }





    storeAndPropagageIdentityActivations(): Promise<IIdentityActivation[]> {
        if( !this.identityActivations) {
            return;
        }
        return this.userData.storeAndPropagageIdentityActivations();
    }


    dismiss(data?: any) {
        // using the injected ViewController this page
        // can "dismiss" itself and pass back data
        this.viewCtrl.dismiss(data);
    }
}
