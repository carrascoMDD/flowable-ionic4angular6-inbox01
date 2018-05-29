import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { InboxPage } from '../inbox/inbox';
import { ArchivedPage} from "../archived/archived";
import { DraftsPage} from "../drafts/drafts";
import { OutboxPage} from "../outbox/outbox";
import { TemplatesPage} from "../templates/templates";


@Component({
  templateUrl: 'flowtabs-page.html'
})
export class FlowTabsPage {
  // set the root pages for each tab
  tab1Root: any = InboxPage;
  tab2Root: any = DraftsPage;
  tab3Root: any = ArchivedPage;
  tab4Root: any = TemplatesPage;
  tab5Root: any = OutboxPage;

  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

}
