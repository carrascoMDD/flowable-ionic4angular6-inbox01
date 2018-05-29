import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { TemplatesProvider } from '../../../providers/templatesprovider';
import {Templatespec} from "../../../interfaces/flow-templatespecs";

@Component({
  selector: 'page-template-detail',
  templateUrl: 'template-detail.html'
})
export class TemplateDetailPage {
  template: Templatespec;

  constructor(
    public templatesProvider : TemplatesProvider,
    public navParams: NavParams
  ) {
    console.log( "TemplateDetailPage constructor");
  }

  ionViewWillEnter() {
    this.templatesProvider.load().subscribe(( theTemplatespecs:  Templatespec[]) => {
      for ( const aTemplatespec of theTemplatespecs) {
        if ( aTemplatespec && aTemplatespec.key === this.navParams.data.key) {
          this.template = aTemplatespec;
          break;
        }
      }
    });
  }
}
