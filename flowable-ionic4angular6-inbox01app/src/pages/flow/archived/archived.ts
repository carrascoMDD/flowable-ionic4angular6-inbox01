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

@Component({
    selector: 'page-archived',
    templateUrl: 'archived.html'
})
export class ArchivedPage extends LoggedinPage {
    // the list is a child of the schedule page
    // @ViewChild('archivedList') gets a reference to the list
    // with the variable #scheduleList, `read: List` tells it to return
    // the List and not a reference to the element
    @ViewChild('archivedList', {read: List}) scheduleList: List;

    segment = 'archived';

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

        console.log("ArchivedPage constructor");
    }

    ionViewDidLoad() {
        console.log("ArchivedPage ionViewDidLoad");
        this.app.setTitle('Archived');
    }

    ionViewDidEnter() {
        console.log("TemplatesPage ionViewDidEnter");
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
