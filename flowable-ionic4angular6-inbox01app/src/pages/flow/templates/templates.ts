import {Component, ViewChild} from '@angular/core';

import {
    AlertController,
    App,
    FabContainer, /* ItemSliding, */
    List,
    ModalController,
    NavController,
    ToastController,
    LoadingController,
    Refresher
} from 'ionic-angular';

import {UserData} from '../../../providers/user-data';


import {LoginPage} from '../../login/login';

import {TemplateDetailPage} from '../template-detail/template-detail';
import {ScheduleFilterPage} from '../../schedule-filter/schedule-filter';

import {Templatespec} from '../../../interfaces/flow-templatespecs';
import {TemplatesFilter} from "../../../filters/templates-filter";

@Component({
    selector: 'page-templates',
    templateUrl: 'templates.html'
})
export class TemplatesPage {
    // the list is a child of the schedule page
    // @ViewChild('scheduleList') gets a reference to the list
    // with the variable #scheduleList, `read: List` tells it to return
    // the List and not a reference to the element
    @ViewChild('scheduleList', {read: List}) scheduleList: List;

    dayIndex = 0;
    queryText = '';
    segment = 'all';
    excludeTracks: any = [];
    shownTemplates: any = [];
    groups: any = [];
    confDate: string;


    public templatespecs: Templatespec[];

    constructor(
        public alertCtrl: AlertController,
        public app: App,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController,
        public navCtrl: NavController,
        public toastCtrl: ToastController,
        public userData: UserData,
        public templatesFilter: TemplatesFilter
    ) {
        this.templatespecs = [];
        console.log("TemplatesPage constructor");
    }


    presentAlert() {
        /*
        let alert = this.alertCtrl.create({
            title: 'You are not logged in, or your session expired',
            subTitle: 'Please login',
            buttons: ['Go to Login']
        });
        return alert.present();
        */
        return new Promise<Boolean>( (resolve) => { resolve( true);});

    }

    ionViewDidLoad() {
        console.log("TemplatesPage ionViewDidLoad");
        this.app.setTitle('Templates');
    }


    //     this.app.getRootNav().push('SupportPage'); ???

    ionViewCanEnter() : Promise<any> {
        console.log("TemplatesPage ionViewCanEnter");
        /*
        if( true) {
            return this.userData.hasLoggedIn();
        }
        */
        return new Promise<Boolean>( (resolveTop) => {
            this.userData.hasLoggedIn()
                .then(
                    (theHasLoggedIn) => {
                        if (theHasLoggedIn) {
                            console.log("TemplatesPage ionViewCanEnter this.userData.hasLoggedIn() false");
                            resolveTop( true);
                            return;
                        }
                        else {
                            console.log( "TemplatesPage ionViewCanEnter FALSE theHasLoggedIn");
                            this.presentAlert()
                                .then(
                                    () => {
                                        console.log("TemplatesPage ionViewCanEnter after alert");
                                        if( this.navCtrl.length()) {
                                            console.log("TemplatesPage ionViewCanEnter this.navCtrl.length()=" + this.navCtrl.length() + " about to popToRoot()");
                                            setTimeout( ()=> {
                                                this.app.getRootNav().setRoot( LoginPage)
                                                    .then(
                                                        () => {
                                                            console.log("TemplatesPage ionViewCanEnter done this.app.getRootNav().setRoot( LoginPage)");
                                                            resolveTop( false);

                                                        },
                                                        ( theError) => {
                                                            console.log("TemplatesPage ionViewCanEnter ERROR in popToRoot() theError=" + theError);
                                                            resolveTop( false);
                                                        }
                                                    );
                                            }, 0);

                                        }
                                        else {
                                            console.log("TemplatesPage ionViewCanEnter EMPTY this.navCtrl.length()" + " about to setRoot( LoginPage)");
                                            this.app.getRootNav().setRoot( LoginPage)
                                                .then(
                                                    () => {
                                                        console.log("TemplatesPage ionViewCanEnter done this.app.getRootNav().setRoot( LoginPage)");
                                                        resolveTop( false);
                                                    },
                                                    ( theError) => {
                                                        console.log("TemplatesPage ionViewCanEnter ERROR in setRoot() theError=" + theError);
                                                        resolveTop( false);
                                                    }
                                                );
                                        }
                                    },
                                    ( theError) => {
                                        console.log("TutorialPage ERROR on ALERT ionViewCanEnter this.userData.hasLoggedIn() false theError=" + theError);
                                        resolveTop( false);
                                    }
                                );
                        }
                    },
                    (theError) => {
                        console.log("TemplatesPage ionViewCanEnter this.userData.hasLoggedIn() error=" + theError);
                        resolveTop( false);
                    }
                );
        });
    }




    ionViewDidEnter() {
        console.log("TemplatesPage ionViewDidEnter");
        this.updateTemplates();
    }




    updateTemplates() {
        console.log("TemplatesPage updateTemplates");
        // Close any open sliding items when the schedule updates
        this.scheduleList && this.scheduleList.closeSlidingItems();

        this.templatesFilter.getTemplatespecs(this.queryText).subscribe((theTemplatespecs: Templatespec[]) => {
            this.templatespecs = theTemplatespecs;
            this.shownTemplates = this.templatespecs;
            console.log("templates.ts updateTemplates theTemplatespecs.length=\n" + ((theTemplatespecs && theTemplatespecs.length) ? theTemplatespecs.length : 0));
        });
    }


    doRefresh(refresher: Refresher) {
        this.userData.hasLoggedIn()
            .then(
                (theHasLoggedIn) => {
                    if (!theHasLoggedIn) {
                        console.log("TutorialPage doRefresh this.userData.hasLoggedIn() false");
                        this.presentAlert()
                            .then(
                                () => {
                                    console.log("TutorialPage doRefresh after alert on this.userData.hasLoggedIn() false");
                                    this.navCtrl.popToRoot();
                                },
                                ( theError) => {
                                    console.log("TutorialPage ERROR on ALERT doRefresh  after alert on this.userData.hasLoggedIn() false theError=" + theError);
                                    this.navCtrl.popToRoot();
                                });
                        return;
                    }

                    console.log("TutorialPage doRefresh this.userData.hasLoggedIn() true");

                    this.app.setTitle('Templates');

                    this.templatesFilter.getTemplatespecs(this.queryText).subscribe((theTemplatespecs: Templatespec[]) => {
                        this.templatespecs = theTemplatespecs;
                        this.shownTemplates = this.templatespecs;
                        console.log("templates.ts doRefresh theTemplatespecs.length=\n" + ((theTemplatespecs && theTemplatespecs.length) ? theTemplatespecs.length : 0));

                        // simulate a network request that would take longer
                        // than just pulling from out local json file
                        setTimeout(() => {
                            refresher.complete();

                            const toast = this.toastCtrl.create({
                                message: 'Templates have been updated.',
                                duration: 3000
                            });
                            toast.present();
                        }, 1000);
                    });
                },
                (theError) => {
                    console.log("TutorialPage doRefresh this.userData.hasLoggedIn() error=" + theError);
                    throw theError;
                });

    }

    presentFilter() {
        let modal = this.modalCtrl.create(ScheduleFilterPage, this.excludeTracks);
        modal.present();

        modal.onWillDismiss((data: any[]) => {
            if (data) {
                this.excludeTracks = data;
                this.updateTemplates();
            }
        });

    }


    goToTemplateDetail(theTemplatespec: Templatespec) {
        // go to the session detail page
        // and pass in the session data

        this.navCtrl.push(TemplateDetailPage, {
            templatespec: theTemplatespec,
            name: theTemplatespec.name,
            key: theTemplatespec.key
        });
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
