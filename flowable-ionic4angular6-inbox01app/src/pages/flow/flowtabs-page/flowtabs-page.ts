import {Component} from '@angular/core';

import {NavParams} from 'ionic-angular';

import {InboxPage} from '../inbox/inbox';
import {DraftsPage} from "../drafts/drafts";
import {ArchivedPage} from "../archived/archived";
import {BouncedPage} from "../bounced/bounced";
import {TemplatesPage} from "../templates/templates";
import {OutboxPage} from "../outbox/outbox";


@Component({
    templateUrl: 'flowtabs-page.html'
})
export class FlowTabsPage {
    // set the root pages for each tab
    tab1Root: any = InboxPage;
    tab2Root: any = DraftsPage;
    tab3Root: any = ArchivedPage;
    tab4Root: any = BouncedPage;
    tab5Root: any = TemplatesPage;
    tab6Root: any = OutboxPage;

    mySelectedIndex: number;

    constructor(navParams: NavParams) {
        this.mySelectedIndex = navParams.data.tabIndex || 0;
    }

}
