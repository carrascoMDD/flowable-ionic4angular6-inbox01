import { Component, ViewChild } from '@angular/core';

import { MenuController, NavController, Slides } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import {UserData} from '../../providers/user-data';
import { LoginPage } from '../login/login';
import { FlowTabsPage } from '../flow/flowtabs-page/flowtabs-page';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})

export class TutorialPage {
  showSkip = true;

	@ViewChild('slides') slides: Slides;

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public storage: Storage,
    public userData: UserData
  ) { }

  startApp() {
      this.storage.set('hasSeenTutorial', 'true')
          .then(
              () => {
                  this.userData.hasLoggedIn()
                      .then(
                          (theHasLoggedIn) => {
                              if( theHasLoggedIn) {
                                  this.navCtrl.push( FlowTabsPage);
                              }
                              else {
                                  this.navCtrl.push( LoginPage);
                              }
                          },
                          ( theError) => {
                            console.log( "TutorialPage startApp this.userData.hasLoggedIn() error=" + theError);
                            throw theError;
                          });
              },
              ( theError) => {
                  console.log( "TutorialPage startApp this.storage.set('hasSeenTutorial', 'true') error=" + theError);
                  throw theError;
              }
          );
  }


  onSlideChangeStart(slider: Slides) {
    this.showSkip = !slider.isEnd();
  }

  ionViewWillEnter() {
    this.slides.update();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

}
