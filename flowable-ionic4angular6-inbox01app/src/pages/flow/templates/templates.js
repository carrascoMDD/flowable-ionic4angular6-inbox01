"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ionic_angular_1 = require("ionic-angular");
var login_1 = require("../../login/login");
var template_detail_1 = require("../template-detail/template-detail");
var schedule_filter_1 = require("../../schedule-filter/schedule-filter");
var TemplatesPage = /** @class */ (function () {
    function TemplatesPage(alertCtrl, app, loadingCtrl, modalCtrl, navCtrl, toastCtrl, userData, templatesFilter) {
        this.alertCtrl = alertCtrl;
        this.app = app;
        this.loadingCtrl = loadingCtrl;
        this.modalCtrl = modalCtrl;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.userData = userData;
        this.templatesFilter = templatesFilter;
        this.dayIndex = 0;
        this.queryText = '';
        this.segment = 'all';
        this.excludeTracks = [];
        this.shownTemplates = [];
        this.groups = [];
        this.templatespecs = [];
        console.log("TemplatesPage constructor");
    }
    TemplatesPage.prototype.presentAlert = function () {
        var alert = this.alertCtrl.create({
            title: 'You are not logged in, or your session expired',
            subTitle: 'Please login',
            buttons: ['Go to Login']
        });
        return alert.present();
    };
    TemplatesPage.prototype.ionViewDidLoad = function () {
        console.log("TemplatesPage ionViewDidLoad");
        this.app.setTitle('Templates');
    };
    //     this.app.getRootNav().push('SupportPage'); ???
    TemplatesPage.prototype.ionViewCanEnter = function () {
        var _this = this;
        console.log("TemplatesPage ionViewCanEnter");
        return new Promise(function (resolveTop) {
            _this.userData.hasLoggedIn()
                .then(function (theHasLoggedIn) {
                if (theHasLoggedIn) {
                    console.log("TemplatesPage ionViewCanEnter this.userData.hasLoggedIn() false");
                    resolveTop(true);
                    return;
                }
                else {
                    console.log("TemplatesPage ionViewCanEnter FALSE theHasLoggedIn");
                    _this.presentAlert()
                        .then(function () {
                        console.log("TemplatesPage ionViewCanEnter after alert");
                        if (_this.navCtrl.length()) {
                            console.log("TemplatesPage ionViewCanEnter this.navCtrl.length()=" + _this.navCtrl.length() + " about to popToRoot()");
                            setTimeout(function () {
                                _this.app.getRootNav().setRoot(login_1.LoginPage)
                                    .then(function () {
                                    console.log("TemplatesPage ionViewCanEnter done this.app.getRootNav().setRoot( LoginPage)");
                                    resolveTop(false);
                                }, function (theError) {
                                    console.log("TemplatesPage ionViewCanEnter ERROR in popToRoot() theError=" + theError);
                                    resolveTop(false);
                                });
                            }, 0);
                        }
                        else {
                            console.log("TemplatesPage ionViewCanEnter EMPTY this.navCtrl.length()" + " about to setRoot( LoginPage)");
                            _this.app.getRootNav().setRoot(login_1.LoginPage)
                                .then(function () {
                                console.log("TemplatesPage ionViewCanEnter done this.app.getRootNav().setRoot( LoginPage)");
                                resolveTop(false);
                            }, function (theError) {
                                console.log("TemplatesPage ionViewCanEnter ERROR in setRoot() theError=" + theError);
                                resolveTop(false);
                            });
                        }
                    }, function (theError) {
                        console.log("TutorialPage ERROR on ALERT ionViewCanEnter this.userData.hasLoggedIn() false theError=" + theError);
                        resolveTop(false);
                    });
                }
            }, function (theError) {
                console.log("TemplatesPage ionViewCanEnter this.userData.hasLoggedIn() error=" + theError);
                resolveTop(false);
            });
        });
    };
    TemplatesPage.prototype.ionViewDidEnter = function () {
        console.log("TemplatesPage ionViewDidEnter");
        this.updateTemplates();
    };
    TemplatesPage.prototype.updateTemplates = function () {
        var _this = this;
        console.log("TemplatesPage updateTemplates");
        // Close any open sliding items when the schedule updates
        this.templatesList && this.templatesList.closeSlidingItems();
        this.templatesFilter.getTemplatespecs(this.queryText).subscribe(function (theTemplatespecs) {
            _this.templatespecs = theTemplatespecs;
            _this.shownTemplates = _this.templatespecs;
            console.log("templates.ts updateTemplates theTemplatespecs.length=\n" + ((theTemplatespecs && theTemplatespecs.length) ? theTemplatespecs.length : 0));
        });
    };
    TemplatesPage.prototype.doRefresh = function (refresher) {
        var _this = this;
        this.userData.hasLoggedIn()
            .then(function (theHasLoggedIn) {
            if (!theHasLoggedIn) {
                console.log("TutorialPage doRefresh this.userData.hasLoggedIn() false");
                _this.presentAlert()
                    .then(function () {
                    console.log("TutorialPage doRefresh after alert on this.userData.hasLoggedIn() false");
                    _this.navCtrl.popToRoot();
                }, function (theError) {
                    console.log("TutorialPage ERROR on ALERT doRefresh  after alert on this.userData.hasLoggedIn() false theError=" + theError);
                    _this.navCtrl.popToRoot();
                });
                return;
            }
            console.log("TutorialPage doRefresh this.userData.hasLoggedIn() true");
            _this.app.setTitle('Templates');
            _this.templatesFilter.getTemplatespecs(_this.queryText).subscribe(function (theTemplatespecs) {
                _this.templatespecs = theTemplatespecs;
                _this.shownTemplates = _this.templatespecs;
                console.log("templates.ts doRefresh theTemplatespecs.length=\n" + ((theTemplatespecs && theTemplatespecs.length) ? theTemplatespecs.length : 0));
                // simulate a network request that would take longer
                // than just pulling from out local json file
                setTimeout(function () {
                    refresher.complete();
                    var toast = _this.toastCtrl.create({
                        message: 'Templates have been updated.',
                        duration: 3000
                    });
                    toast.present();
                }, 1000);
            });
        }, function (theError) {
            console.log("TutorialPage doRefresh this.userData.hasLoggedIn() error=" + theError);
            throw theError;
        });
    };
    TemplatesPage.prototype.presentFilter = function () {
        var _this = this;
        var modal = this.modalCtrl.create(schedule_filter_1.ScheduleFilterPage, this.excludeTracks);
        modal.present();
        modal.onWillDismiss(function (data) {
            if (data) {
                _this.excludeTracks = data;
                _this.updateTemplates();
            }
        });
    };
    TemplatesPage.prototype.goToTemplateDetail = function (theTemplatespec) {
        // go to the session detail page
        // and pass in the session data
        this.navCtrl.push(template_detail_1.TemplateDetailPage, {
            templatespec: theTemplatespec,
            name: theTemplatespec.name,
            key: theTemplatespec.key
        });
    };
    TemplatesPage.prototype.openSocial = function (network, fab) {
        var loading = this.loadingCtrl.create({
            content: "Posting to " + network,
            duration: (Math.random() * 1000) + 500
        });
        loading.onWillDismiss(function () {
            fab.close();
        });
        loading.present();
    };
    __decorate([
        core_1.ViewChild('templatesList', { read: ionic_angular_1.List })
    ], TemplatesPage.prototype, "templatesList", void 0);
    TemplatesPage = __decorate([
        core_1.Component({
            selector: 'page-templates',
            templateUrl: 'templates.html'
        })
    ], TemplatesPage);
    return TemplatesPage;
}());
exports.TemplatesPage = TemplatesPage;
