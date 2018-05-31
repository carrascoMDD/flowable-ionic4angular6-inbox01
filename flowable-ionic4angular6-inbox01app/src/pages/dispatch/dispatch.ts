import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AlertController} from 'ionic-angular';

import {UserData} from '../../providers/user-data';
import {FlowTabsPage} from '../flow/flowtabs-page/flowtabs-page';
import {LoginPage} from "../login/login";


@Component({
    selector: 'page-user',
    templateUrl: 'dispatch.html'
})
export class DispatchPage {

    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public userData: UserData) {
        console.log( "DispatchPage constructor");
    }

    ionViewDidLoad() {
        this.userData.hasLoggedIn()
            .then(
                (theHasLoggedIn) => {
                    if( theHasLoggedIn) {
                        this.navCtrl.setRoot( FlowTabsPage);
                    }
                    else {
                        this.navCtrl.setRoot( LoginPage);
                    }
                },
                ( theError) => {
                    console.log( "TutorialPage startApp this.userData.hasLoggedIn() error=" + theError);
                    throw theError;
                });
    }


}
