/*
 * logout.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angularx6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */

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
