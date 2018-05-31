import {Component, ViewChild} from '@angular/core';

import {
    AlertController,
    App,
    FabContainer,
    List,
    ModalController,
    NavController,
    ToastController,
    LoadingController
} from 'ionic-angular';

import {UserData} from '../../../providers/user-data';

import {LoggedinPage} from '../loggedin/loggedin';

import {TemplateDetailPage} from '../template-detail/template-detail';
import {ScheduleFilterPage} from '../../schedule-filter/schedule-filter';

import {Templatespec} from '../../../interfaces/flow-templatespecs';
import {TemplatesFilter} from "../../../filters/templates-filter";

@Component({
    selector: 'page-templates',
    templateUrl: 'templates.html'
})
export class TemplatesPage extends LoggedinPage {
    // the list is a child of the schedule page
    // @ViewChild('templatesList') gets a reference to the list
    // with the variable #templatesList, `read: List` tells it to return
    // the List and not a reference to the element
    @ViewChild('templatesList', {read: List}) templatesList: List;

    dayIndex = 0;
    queryText = '';
    segment = 'all';
    excludeTracks: any = [];
    shownTemplates: any = [];
    groups: any = [];
    confDate: string;

    public templatespecs: Templatespec[];

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

        this.templatespecs = [];
        console.log("TemplatesPage constructor");
    }


    presentAlert() {
        let alert = this.alertCtrl.create({
            title: 'You are not logged in, or your session expired',
            subTitle: 'Please login',
            buttons: ['Go to Login']
        });
        return alert.present();
    }

    ionViewDidLoad() {
        console.log("TemplatesPage ionViewDidLoad");
        this.app.setTitle('Templates');
    }




    ionViewDidEnter() {
        console.log("TemplatesPage ionViewDidEnter");
        this.updateTemplates();
    }


    updateContent(): Promise<any> {
        return this.updateTemplates();
    }



    updateTemplates() {
        console.log("TemplatesPage updateTemplates");
        // Close any open sliding items when the schedule updates
        // seem to be synchronous! - probably just touches some variables
        this.templatesList && this.templatesList.closeSlidingItems();

        return new Promise<any>( ( resolver) => {
            this.templatesFilter.getTemplatespecs(this.queryText).subscribe((theTemplatespecs: Templatespec[]) => {
                this.templatespecs = theTemplatespecs;
                this.shownTemplates = this.templatespecs;
                console.log("templates.ts updateTemplates theTemplatespecs.length=\n" + ((theTemplatespecs && theTemplatespecs.length) ? theTemplatespecs.length : 0));

                resolver( this.templatespecs);
            });
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
