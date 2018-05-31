import {Component} from '@angular/core';

import {
    AlertController,
    App,
    FabContainer,
    ModalController,
    NavController,
    ToastController,
    LoadingController
} from 'ionic-angular';

import {UserData} from '../../../providers/user-data';
import {LoggedinPage} from '../loggedin/loggedin';


@Component({
    selector: 'page-logout',
    templateUrl: 'logout.html'
})
export class LogoutPage extends LoggedinPage {

    constructor(
        theApp: App,
        theAlertCtrl: AlertController,
        theLoadingCtrl: LoadingController,
        theModalCtrl: ModalController,
        theNavCtrl: NavController,
        theToastCtrl: ToastController,
        theUserData: UserData
    ) {
        super( theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData);

        console.log("LogoutPage constructor");
    }


    ionViewDidLoad() {
        console.log("LogoutPage ionViewDidLoad");
        this.app.setTitle('Templates');
    }




    ionViewDidEnter() {
        console.log("LogoutPage ionViewDidEnter");
    }


    updateContent(): Promise<any> {
        return new Promise<any>(()=>{});
    }




    openSocial(network: string, fab: FabContainer) {
        let loading = this.loadingCtrl.create({
            content: `Posting to ${network}`,
            duration: (Math.random() * 1000) + 500
        });
        loading.onWillDismiss(() => {
            fab.close();
        });
        loading.present();
    }

}
