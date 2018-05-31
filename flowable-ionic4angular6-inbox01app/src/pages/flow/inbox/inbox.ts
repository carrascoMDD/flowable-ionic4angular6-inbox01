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

import {LoggedinPage} from "../loggedin/loggedin";


@Component({
    selector: 'page-inbox',
    templateUrl: 'inbox.html'
})
export class InboxPage extends LoggedinPage {
    // the list is a child of the schedule page
    // @ViewChild('inboxList') gets a reference to the list
    // with the variable #scheduleList, `read: List` tells it to return
    // the List and not a reference to the element
    @ViewChild('inboxList', {read: List}) scheduleList: List;

    dayIndex = 0;
    queryText = '';
    segment = 'inbox';
    excludeTracks: any = [];
    shownSessions: any = [];
    groups: any = [];
    confDate: string;

    constructor(
        theApp: App,
        theAlertCtrl: AlertController,
        theLoadingCtrl: LoadingController,
        theModalCtrl: ModalController,
        theNavCtrl: NavController,
        theToastCtrl: ToastController,
        theUserData: UserData
    ) {
        super(theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData);

        console.log("DraftsPage constructor");
    }

    ionViewDidLoad() {
        console.log("DraftsPage ionViewDidLoad");
        this.app.setTitle('Archived');
    }

    ionViewDidEnter() {
        console.log("DraftsPage ionViewDidEnter");
        this.updateContent();
    }


    updateContent(): Promise<any> {
        return new Promise<any>((resolve) => {
            resolve();
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
