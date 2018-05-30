import { Component, ViewChild } from '@angular/core';

import { AlertController, App, FabContainer, /* ItemSliding, */ List, ModalController, NavController, ToastController, LoadingController, Refresher } from 'ionic-angular';

/*
  To learn how to use third party libs in an
  Ionic app check out our docs here: http://ionicframework.com/docs/v2/resources/third-party-libs/
*/
// import moment from 'moment';

import { UserData } from '../../../providers/user-data';

import { TemplateDetailPage } from '../template-detail/template-detail';
import { ScheduleFilterPage } from '../../schedule-filter/schedule-filter';

import { Templatespec } from '../../../interfaces/flow-templatespecs';
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
  @ViewChild('scheduleList', { read: List }) scheduleList: List;

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
    public user: UserData,
    public templatesFilter : TemplatesFilter
  ) {
    this.templatespecs = [];
    console.info( "xx");
  }

  ionViewDidLoad() {
    this.app.setTitle('Templates');
    this.updateTemplates();
  }

  updateTemplates() {
    // Close any open sliding items when the schedule updates
    this.scheduleList && this.scheduleList.closeSlidingItems();

    this.templatesFilter.getTemplatespecs( this.queryText).subscribe(( theTemplatespecs:  Templatespec[]) => {
      this.templatespecs = theTemplatespecs;
      this.shownTemplates = this.templatespecs;
      console.log( "templates.ts updateTemplates theTemplatespecs.length=\n" + ( ( theTemplatespecs && theTemplatespecs.length) ? theTemplatespecs.length : 0));
    });
  }


  doRefresh(refresher: Refresher) {
    this.templatesFilter.getTemplatespecs( this.queryText).subscribe(( theTemplatespecs:  Templatespec[]) => {
      this.templatespecs = theTemplatespecs;
      this.shownTemplates = this.templatespecs;
      console.log( "templates.ts doRefresh theTemplatespecs.length=\n" + ( ( theTemplatespecs && theTemplatespecs.length) ? theTemplatespecs.length : 0));

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

    this.navCtrl.push(TemplateDetailPage, { templatespec: theTemplatespec, name: theTemplatespec.name, key: theTemplatespec.key });
  }



/*
  addFavorite(slidingItem: ItemSliding, sessionData: any) {

    if (this.user.hasFavorite(sessionData.name)) {
      // woops, they already favorited it! What shall we do!?
      // prompt them to remove it
      this.removeFavorite(slidingItem, sessionData, 'Favorite already added');
    } else {
      // remember this session as a user favorite
      this.user.addFavorite(sessionData.name);

      // create an alert instance
      let alert = this.alertCtrl.create({
        title: 'Favorite Added',
        buttons: [{
          text: 'OK',
          handler: () => {
            // close the sliding item
            slidingItem.close();
          }
        }]
      });
      // now present the alert on top of all other content
      alert.present();
    }

  }

  removeFavorite(slidingItem: ItemSliding, sessionData: any, title: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: 'Would you like to remove this session from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this session from their favorites
            this.user.removeFavorite(sessionData.name);
            this.updateTemplates();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }
*/
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
