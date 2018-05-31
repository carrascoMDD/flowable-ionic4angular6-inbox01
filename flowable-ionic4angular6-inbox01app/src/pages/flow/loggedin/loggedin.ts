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


import {ILogin} from '../../../interfaces/flow-ilogins';

import {LoginPage} from '../../login/login';


@Component({
    selector: 'page-loggedin',
    templateUrl: 'loggedin.html'
})
export abstract class LoggedinPage {

    authenticatedLogin: ILogin;

    constructor(
        public app: App,
        public alertCtrl: AlertController,
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


    beLoggedinOrGoToLoginPage() : Promise<ILogin> {
        console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage");
        return new Promise<ILogin>( ( pheResolve, pheReject) => {
            this.userData.getAuthenticatedLogin()
                .then(
                    ( theAuthenticatedLogin) => {
                        if ( theAuthenticatedLogin) {
                            this.authenticatedLogin = theAuthenticatedLogin;
                            console.log("(abstract)LoggedinPage LOGGED IN beLoggedinOrGoToLoginPage this.userData.getAuthenticatedLogin()");
                            pheResolve( theAuthenticatedLogin);
                            return;
                        }
                        else {
                            console.log( "(abstract)LoggedinPage NOT logged in beLoggedinOrGoToLoginPage FALSE theHasLoggedIn");
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
                                                            pheReject( "User not logged in");

                                                        },
                                                        ( theError) => {
                                                            const aMsg = "(abstract)LoggedinPage beLoggedinOrGoToLoginPage ERROR in popToRoot() theError=" + theError;
                                                            console.log( aMsg);
                                                            pheReject( "User not logged in\n" + aMsg);
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
                                                        pheReject( false);
                                                    },
                                                    ( theError) => {
                                                        const aMsg = "(abstract)LoggedinPage beLoggedinOrGoToLoginPage ERROR in setRoot() theError=" + theError;
                                                        console.log( aMsg);
                                                        pheReject( "User not logged in\n" + aMsg);
                                                    }
                                                );
                                        }
                                    },
                                    ( theError) => {
                                        const aMsg = "(abstract)LoggedinPage beLoggedinOrGoToLoginPage NO this.userData.getAuthenticatedLogin() theError=" + theError;
                                        console.log( aMsg);
                                        pheReject( "User not logged in\n" + aMsg);
                                    }
                                );
                        }
                    },
                    (theError) => {
                        const aMsg = "((abstract)LoggedinPage beLoggedinOrGoToLoginPage this.userData.getAuthenticatedLogin() error=" + theError;
                        console.log( aMsg);
                        pheReject( "User not logged in\n" + aMsg);
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



    logout() : Promise<any> {
        return new Promise<any>( ( pheResolve, pheReject) => {
            if(pheReject){}/*CQT*/
            this.userData.logout()
                .then(
                    ( ) => {
                        return this.app.getRootNav().setRoot( LoginPage);
                    },
                    ( theError) => {
                        if(theError){}/*CQT*/
                        throw theError;
                    }
                )
                .then(
                    ( ) => {
                        pheResolve();
                    },
                    ( theError) => {
                        pheReject( theError);
                    }
                );
        });
    }




}
