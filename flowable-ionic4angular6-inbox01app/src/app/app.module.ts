import {BrowserModule} from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {SplashScreen} from '@ionic-native/splash-screen';
import {IonicStorageModule} from '@ionic/storage';

import {ConferenceApp} from './app.component';

import {AboutPage} from '../pages/about/about';
import {PopoverPage} from '../pages/about-popover/about-popover';
import {AccountPage} from '../pages/flow/account/account';
import {LoginPage} from '../pages/login/login';
import {MapPage} from '../pages/map/map';
import {SchedulePage} from '../pages/schedule/schedule';
import {ScheduleFilterPage} from '../pages/schedule-filter/schedule-filter';
import {SessionDetailPage} from '../pages/session-detail/session-detail';
import {SignupPage} from '../pages/signup/signup';
import {SpeakerDetailPage} from '../pages/speaker-detail/speaker-detail';
import {SpeakerListPage} from '../pages/speaker-list/speaker-list';
import {TabsPage} from '../pages/tabs-page/tabs-page';
import {TutorialPage} from '../pages/tutorial/tutorial';
import {SupportPage} from '../pages/support/support';

import {UserData} from '../providers/user-data';

import {LogoutPage} from '../pages/flow/logout/logout';
import {IdentitiesFilterPage} from "../pages/flow/identities-filter/identitites-filter";
import {FlowTabsPage} from '../pages/flow/flowtabs-page/flowtabs-page';
import {InboxPage} from '../pages/flow/inbox/inbox';
import {DraftsPage} from "../pages/flow/drafts/drafts";
import {ArchivedPage} from '../pages/flow/archived/archived';
import {BouncedPage} from "../pages/flow/bounced/bounced";
import {TemplatesPage} from "../pages/flow/templates/templates";
import {TemplateDetailPage} from '../pages/flow/template-detail/template-detail';
import {OutboxPage} from "../pages/flow/outbox/outbox";

import {AuthenticationProvider} from '../providers/authentication-provider';
import {LoginsProvider} from "../providers/logins-provider";
import {ApplicationsProvider} from "../providers/applications-provider";
import {TemplatesProvider} from "../providers/templates-provider";
import {TemplatesFilter} from "../filters/templates-filter";


@NgModule({
    declarations: [
        ConferenceApp,
        AboutPage,
        AccountPage,
        LoginPage,
        MapPage,
        PopoverPage,
        SchedulePage,
        ScheduleFilterPage,
        SessionDetailPage,
        SignupPage,
        SpeakerDetailPage,
        SpeakerListPage,
        TabsPage,
        TutorialPage,
        SupportPage,

        LogoutPage,
        FlowTabsPage,
        IdentitiesFilterPage,
        InboxPage,
        DraftsPage,
        ArchivedPage,
        BouncedPage,
        TemplatesPage,
        TemplateDetailPage,
        OutboxPage
    ],
    imports: [
        BrowserModule,
        HttpModule,
        HttpClientModule,
        IonicModule.forRoot(ConferenceApp, {}, {
            links: [
                {component: TabsPage, name: 'TabsPage', segment: 'tabs-page'},
                {component: SchedulePage, name: 'Schedule', segment: 'schedule'},
                {component: SessionDetailPage, name: 'SessionDetail', segment: 'sessionDetail/:sessionId'},
                {component: ScheduleFilterPage, name: 'ScheduleFilter', segment: 'scheduleFilter'},
                {component: SpeakerListPage, name: 'SpeakerList', segment: 'speakerList'},
                {component: SpeakerDetailPage, name: 'SpeakerDetail', segment: 'speakerDetail/:speakerId'},
                {component: MapPage, name: 'Map', segment: 'map'},
                {component: AboutPage, name: 'AboutPage', segment: 'about'},
                {component: TutorialPage, name: 'Tutorial', segment: 'tutorial'},
                {component: SupportPage, name: 'SupportPage', segment: 'support'},
                {component: LoginPage, name: 'LoginPage', segment: 'login'},
                {component: AccountPage, name: 'AccountPage', segment: 'account'},
                {component: SignupPage, name: 'SignupPage', segment: 'signup'},

                {component: LogoutPage, name: 'LogoutPage', segment: 'logout'},
                {component: FlowTabsPage, name: 'FlowTabsPage', segment: 'flowtabs-page'},
                {component: InboxPage, name: 'Inbox', segment: 'inbox'},
                {component: DraftsPage, name: 'Drafts', segment: 'drafts'},
                {component: ArchivedPage, name: 'Archived', segment: 'archived'},
                {component: BouncedPage, name: 'Bounced', segment: 'bounced'},
                {component: TemplatesPage, name: 'Templates', segment: 'templates'},
                {component: TemplateDetailPage, name: 'TemplateDetail', segment: 'templateDetail/:templateKey'},
                {component: OutboxPage, name: 'Outbox', segment: 'outbox'}
            ]
        }),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        ConferenceApp,
        AboutPage,
        AccountPage,
        LoginPage,
        MapPage,
        PopoverPage,
        SchedulePage,
        ScheduleFilterPage,
        SessionDetailPage,
        SignupPage,
        SpeakerDetailPage,
        SpeakerListPage,
        TabsPage,
        TutorialPage,
        SupportPage,

        LogoutPage,
        FlowTabsPage,
        IdentitiesFilterPage,
        InboxPage,
        DraftsPage,
        ArchivedPage,
        BouncedPage,
        TemplatesPage,
        TemplateDetailPage,
        OutboxPage
    ],
    providers: [
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        UserData,
        InAppBrowser,
        SplashScreen,

        LoginsProvider,
        AuthenticationProvider,
        ApplicationsProvider,
        TemplatesProvider,
        TemplatesFilter
    ]
})
export class AppModule {
}
