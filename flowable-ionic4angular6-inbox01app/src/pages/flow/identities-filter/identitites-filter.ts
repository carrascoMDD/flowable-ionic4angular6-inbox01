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



@Component({
    selector: 'page-identities-filter',
    templateUrl: 'identities-filter.html'
})
export class IdentitiesFilterPage {

    identityActivations: IIdentityActivation[];
    identityActivationCompositeKeys: string[];

    constructor(
        public app: App,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController,
        public navCtrl: NavController,
        public toastCtrl: ToastController,
        public userData: UserData,
        public navParams: NavParams,
        public viewCtrl: ViewController) {

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
                        this.identityActivationCompositeKeys =
                            this.identityActivations.map(
                                ( theIdentityActivation):string => {
                                    return theIdentityActivation.applicationKey + "_-_" + theIdentityActivation.identityKey;
                                }
                            );
                        pheResolve( theIdentityActivations);
                    },
                    ( theError ) => {
                        pheReject( theError);
                    }
                );
        });
    }





    identityActiveChanged( theApplicationKey: string, theIdentityKey: string): Promise<IIdentityActivation[]> {
        console.log( "IdentitiesFilterPage identityActiveChanged applicationKey=" + theApplicationKey + " identityKey=" + theIdentityKey);
        return new Promise<IIdentityActivation[]>( (resolve)=>{resolve();});
        // return this.storeAndPropagageIdentityActivations();
    }



    deactivateAllIdentities(): Promise<IIdentityActivation[]> {
        console.log( "IdentitiesFilterPage deactivateAllIdentities");
        return this.setActiveAllIdentities( false);
    }



    activateAllIdentities(): Promise<IIdentityActivation[]> {
        console.log( "IdentitiesFilterPage deactivateAllIdentities");
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
