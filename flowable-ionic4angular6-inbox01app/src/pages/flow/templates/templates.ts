/*
 * templates.ts
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

    queryText = '';
    segment = 'all';
    excludeTracks: any = [];
    shownTemplates: any = [];
    groups: any = [];

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
