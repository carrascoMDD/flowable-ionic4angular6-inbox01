import {Component} from '@angular/core';

import {AlertController, App, LoadingController, ModalController, NavController, ToastController} from 'ionic-angular';

import {UserData} from '../../../providers/user-data';
import {TemplatesFilter} from "../../../filters/templates-filter";
import {LoggedinPage} from "../loggedin/loggedin";
import {ILogin} from "../../../interfaces/flow-ilogins";


@Component({
    selector: 'page-account',
    templateUrl: 'account.html'
})
export class AccountPage extends LoggedinPage {

    constructor(
        theApp: App,
        theAlertCtrl: AlertController,
        theLoadingCtrl: LoadingController,
        theModalCtrl: ModalController,
        theNavCtrl: NavController,
        theToastCtrl: ToastController,
        theUserData: UserData,
        public templatesFilter: TemplatesFilter
    ) {
        super( theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData);

        console.log("TemplatesPage constructor");
    }

    ngAfterViewInit() {
        this.beLoggedinOrGoToLoginPage();
    }

    updatePicture() {
        console.log('Clicked to update picture');
    }

    updateContent() : Promise<any> {
        console.log('Clicked to update picture');
        return new Promise<any>( ()=>{});
    }


    // Present an alert with the current username populated
    // clicking OK will update the username and display it
    // clicking Cancel will close the alert and do nothing
    changeUsername() {
        return new Promise<ILogin>( ( pheResolve, pheReject) => {
            this.beLoggedinOrGoToLoginPage()
                .then(
                    ( pheAuthenticatedLogin) => {
                        if( !pheAuthenticatedLogin) {
                            pheReject( "User is not logged in");
                            return;
                        }

                        let alert = this.alertCtrl.create({
                            title: 'Change Username',
                            subTitle: pheAuthenticatedLogin.login
                        });
                        alert.addInput({
                            name: 'name',
                            value: pheAuthenticatedLogin.name,
                            placeholder: 'name'
                        });
                        alert.addInput({
                            name: 'familyName',
                            value: pheAuthenticatedLogin.familyName,
                            placeholder: 'username'
                        });
                        alert.addButton({
                            text: 'Ok',
                            handler: (data: any) => {
                                if(data){}/*CQT*/
                                console.log( "Changed User name")
                            }
                        });
                        alert.addButton({
                            text: 'Cancel',
                            handler: (data: any) => {
                                if(data){}/*CQT*/
                                console.log( "Canceled Change User name")
                            }
                        });

                        alert.present()
                            .then(
                                ( ) => {
                                    pheResolve( pheAuthenticatedLogin);
                                },
                                ( ) => {
                                    pheReject( pheAuthenticatedLogin);
                                });
                    },
                    ( pheError) => {
                        pheReject( pheError);
                    }
                );
        });
    }



    changePassword() {
        console.log('Clicked to change password');
    }


    support() {
        this.navCtrl.push('SupportPage');
    }
}
