import {Component} from '@angular/core';

import {
    AlertController,
    App,
    ModalController,
    NavController,
    ToastController,
    LoadingController,
    Refresher
} from 'ionic-angular';

import {UserData} from '../../../providers/user-data';


import {LoginPage} from '../../login/login';


@Component({
    selector: 'page-loggedin',
    templateUrl: 'loggedin.html'
})
export abstract class LoggedinPage {


    constructor(
        public alertCtrl: AlertController,
        public app: App,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController,
        public navCtrl: NavController,
        public toastCtrl: ToastController,
        public userData: UserData
    ) {
        console.log("(abstract)LoggedinPage constructor");
    }


    presentAlert() {
        let alert = this.alertCtrl.create({
            title: "You are not logged in, or your session expired",
            subTitle: "Please login",
            buttons: ["Go to Login"]
        });
        return alert.present();
    }

    ionViewDidLoad() {
        console.log("(abstract)LoggedinPage ionViewDidLoad");
        this.app.setTitle( "(abstract)LoggedinPage");
    }


    beLoggedinOrGoToLoginPage() : Promise<any> {
        console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage");
        return new Promise<Boolean>( (resolveTop) => {
            this.userData.hasLoggedIn()
                .then(
                    (theHasLoggedIn) => {
                        if (theHasLoggedIn) {
                            console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage this.userData.hasLoggedIn() false");
                            resolveTop( true);
                            return;
                        }
                        else {
                            console.log( "(abstract)LoggedinPage beLoggedinOrGoToLoginPage FALSE theHasLoggedIn");
                            this.presentAlert()
                                .then(
                                    () => {
                                        console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage after alert");
                                        let aNavCtrlLength = 0;
                                        try {
                                            aNavCtrlLength = this.navCtrl && this.navCtrl.length();
                                        }
                                        catch( anException){
                                            console.log( "(abstract)LoggedinPage beLoggedinOrGoToLoginPage EXCEPTION during this.navCtrl && this.navCtrl.length()" + anException);
                                        }
                                        if( aNavCtrlLength) {
                                            console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage this.navCtrl.length()=" + this.navCtrl.length() + " about to popToRoot()");
                                            setTimeout( ()=> {
                                                this.app.getRootNav().setRoot( LoginPage)
                                                    .then(
                                                        () => {
                                                            console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage done this.app.getRootNav().setRoot( LoginPage)");
                                                            resolveTop( false);

                                                        },
                                                        ( theError) => {
                                                            console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage ERROR in popToRoot() theError=" + theError);
                                                            resolveTop( false);
                                                        }
                                                    );
                                            }, 0);

                                        }
                                        else {
                                            console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage EMPTY this.navCtrl.length()" + " about to setRoot( LoginPage)");
                                            this.app.getRootNav().setRoot( LoginPage)
                                                .then(
                                                    () => {
                                                        console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage done this.app.getRootNav().setRoot( LoginPage)");
                                                        resolveTop( false);
                                                    },
                                                    ( theError) => {
                                                        console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage ERROR in setRoot() theError=" + theError);
                                                        resolveTop( false);
                                                    }
                                                );
                                        }
                                    },
                                    ( theError) => {
                                        console.log("TutorialPage ERROR on ALERT beLoggedinOrGoToLoginPage this.userData.hasLoggedIn() false theError=" + theError);
                                        resolveTop( false);
                                    }
                                );
                        }
                    },
                    (theError) => {
                        console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage this.userData.hasLoggedIn() error=" + theError);
                        resolveTop( false);
                    }
                );
        });
    }



    ionViewCanEnter() : Promise<any> {
        return this.beLoggedinOrGoToLoginPage();
    }



    ionViewDidEnter() {
        console.log("(abstract)LoggedinPage ionViewDidEnter");
        this.beLoggedinOrGoToLoginPage()
            .then(
                ( pheIsLoggedIn) => {
                    if( pheIsLoggedIn) {
                        return this.updateContent();
                    }
                },
                ( pheError) => {
                    throw pheError;
                }
            )
    }




    abstract updateContent() : Promise<any>;



    toast_Updated( theMessage: string, theMillisToToast: number = 3000): Promise<any> {
        return new Promise<any>( ( pheResolveTop, pheRejectTop) => {
            if(pheRejectTop){}/*CQT*/

            this.toastCtrl
                .create({
                    message: ( theMessage ? theMessage : "Updated"),
                    duration: ( theMillisToToast <= 30000 ? theMillisToToast: 30000)
                })
                .present()
                .then(
                    () => {
                        pheResolveTop();
                    },
                    () => {
                        pheResolveTop();
                    }
                );
        });
    }





    doRefresh(refresher: Refresher) {
        return new Promise<any>( ( resolveTop, rejectTop) => {
            this.beLoggedinOrGoToLoginPage()
                .then(
                    ( pheIsLoggedIn) => {
                        if(pheIsLoggedIn){}/*CQT*/
                        return this.updateContent();
                    },
                    ( pheError) => {
                        throw pheError;
                    }
                )
                .then(
                    ( pheResult) => {
                        refresher.complete();

                        /* ************************************************
                        FireAndForget: Let this one run on its own,
                        hopefully suffling pages while still open shall not break or break it !
                         */
                        this.toast_Updated( "Updated", 3000)/*CQT*/.then(()=>{});

                        resolveTop( pheResult);
                    },
                    ( pheError) => {
                        rejectTop( pheError);
                    }
                );
        });
    }



}
