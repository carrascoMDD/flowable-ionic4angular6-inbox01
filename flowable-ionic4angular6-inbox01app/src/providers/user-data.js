"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var flow_identityactivation_1 = require("../interfaces/flow-identityactivation");
var STOREKEYSEPARATORTOREPLACE = /_-_/g;
var STOREKEYSEPARATORTOREPLACEMENT = "=-=";
var STOREKEYPREFIX = "ACTIVEAPPLICATIONIDENTITIES";
var UserData = /** @class */ (function () {
    function UserData(events, storage, loginsProvider) {
        this.events = events;
        this.storage = storage;
        this.loginsProvider = loginsProvider;
        this.HAS_LOGGED_IN = 'hasLoggedIn';
        this.HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
        this.processingLogin = false;
        this.logins = null;
        this.authenticatedLogin = null;
    }
    UserData.prototype.registerInterest_IdentityActivationsChanged = function (theHandler) {
        if (!theHandler) {
            return;
        }
        if (!this.identityActivationsChangedHandlers) {
            this.identityActivationsChangedHandlers = [];
        }
        this.identityActivationsChangedHandlers.push(theHandler);
    };
    UserData.prototype.propagate_IdentityActivationsChanged = function () {
        var _this = this;
        if (!this.identityActivationsChangedHandlers || !this.identityActivationsChangedHandlers.length) {
            return new Promise(function (resolve) {
                resolve();
            });
        }
        /* ************************************************************
        Return a Promise which shall be fulfilled after the chained fulfillement of all the change handlers
         */
        return new Promise(function (resolveTop) {
            var someIdentityActivationsToPropagate = null;
            if (_this.authenticatedLogin) {
                someIdentityActivationsToPropagate = _this.identityActivations;
            }
            var aFirstResolve = null;
            var aFirstPromise = new Promise(function (resolve) {
                aFirstResolve = resolve;
            });
            var aPreviousPromise = aFirstPromise;
            var _loop_1 = function (anIdentityActivationsChangedHandler) {
                var aNextPromise = aPreviousPromise.then(function () {
                    return anIdentityActivationsChangedHandler(someIdentityActivationsToPropagate);
                }, function () {
                    return anIdentityActivationsChangedHandler(someIdentityActivationsToPropagate);
                });
                aPreviousPromise = aNextPromise;
            };
            /* ************************************************************
            Each handler executed after the fulfillement
            of aPreviousPromise which is either the first promise or the resulting promise of the previous handler,
            therefore the propagation of changes to the handlers starts upon fulfillement of the first promise
            done imperatively at the bottom of this method,
            and chains one after the other.
            After the last one, the promise returned by this propagate method is fullfilled,
            just in case somebody is waiting to do something
            after the change propagation completes.
            */
            for (var _i = 0, _a = _this.identityActivationsChangedHandlers; _i < _a.length; _i++) {
                var anIdentityActivationsChangedHandler = _a[_i];
                _loop_1(anIdentityActivationsChangedHandler);
            }
            /* ************************************************************
            Sanity check, should not happen because of the check done at the top of the method on
            this.identityActivationsChangedHandlers.length
            and would anyway be handled properly by (empty but for the initial) chaining execution.
            */
            if (aPreviousPromise === aFirstPromise) {
                resolveTop();
                return;
            }
            aPreviousPromise.then(function () {
                resolveTop();
            }, function () {
                resolveTop();
            });
            /* ************************************************************
            Start propagating by resolving the first Promise
            */
            aFirstResolve();
        });
    };
    UserData.prototype.login = function (username) {
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.setUsername(username);
        this.events.publish('user:login');
    };
    ;
    UserData.prototype.resolveAllWaitingForLoginProcessing = function () {
        if (this.waitingForLoginProcessing) {
            for (var _i = 0, _a = this.waitingForLoginProcessing; _i < _a.length; _i++) {
                var aPromise = _a[_i];
                aPromise(null);
            }
        }
        this.waitingForLoginProcessing = null;
    };
    UserData.prototype.toWaitForLoginProcessing = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (!_this.waitingForLoginProcessing) {
                _this.waitingForLoginProcessing = [];
            }
            _this.waitingForLoginProcessing.push(resolve);
        });
    };
    UserData.prototype.authenticationPerformed = function (theAuthentication) {
        var _this = this;
        this.logins = null;
        this.authenticatedLogin = null;
        this.identityActivations = null;
        if (!theAuthentication || !theAuthentication._v_Success) {
            return new Promise(function (resolve) { resolve(theAuthentication); });
        }
        /* ************************************************************
        Avoid other clients or subscribers to launch resolution of identityActivations
        when already on its (asynchronous) way.
        */
        this.processingLogin = true;
        this.waitingForLoginProcessing = [];
        return new Promise(function (resolve) {
            _this.login(theAuthentication.login);
            _this.loginsProvider.getAllLogins().subscribe(function (theLogins) {
                _this.logins = theLogins;
                _this.authenticatedLogin = null;
                _this.identityActivations = null;
                for (var _i = 0, theLogins_1 = theLogins; _i < theLogins_1.length; _i++) {
                    var aLogin = theLogins_1[_i];
                    if (aLogin && (aLogin.login === theAuthentication.login)) {
                        _this.authenticatedLogin = aLogin;
                        break;
                    }
                }
                /* ************************************************************
                If not found a login matching the authenticated
                then do not build the list of identityActivations with active state from storage.
                */
                if (!_this.authenticatedLogin) {
                    _this.processingLogin = false;
                    _this.resolveAllWaitingForLoginProcessing();
                    resolve(theAuthentication);
                    return;
                }
                /* ************************************************************
                Build the list of identityActivations with active state from storage.
                Create non-active IdentityActivations for all the LoginApplication in the Login
                matching theAuthentication.login
                Index the identityActivations by application key and identity key
                to avoid N*N complexity in match with stored key pairs, below.
                */
                var someIdentityActivationsByKeys = new Map();
                if (_this.authenticatedLogin) {
                    _this.identityActivations = [];
                    for (var _a = 0, _b = _this.authenticatedLogin.loginApplications; _a < _b.length; _a++) {
                        var aLoginApplication = _b[_a];
                        if (aLoginApplication) {
                            if (aLoginApplication.applicationKey && aLoginApplication.identityKeys) {
                                for (var _c = 0, _d = aLoginApplication.identityKeys; _c < _d.length; _c++) {
                                    var anIdentityKey = _d[_c];
                                    var anIdentityActivation = new flow_identityactivation_1.IdentityActivation(aLoginApplication.applicationKey, anIdentityKey, false);
                                    _this.identityActivations.push(anIdentityActivation);
                                    var someIdentityActivationsByKey = someIdentityActivationsByKeys[aLoginApplication.applicationKey];
                                    if (!someIdentityActivationsByKey) {
                                        someIdentityActivationsByKey = new Map();
                                        someIdentityActivationsByKeys[aLoginApplication.applicationKey] = someIdentityActivationsByKey;
                                    }
                                    someIdentityActivationsByKey[anIdentityKey] = anIdentityActivation;
                                }
                            }
                        }
                    }
                }
                /* ************************************************************
                Retrieve from local store the application key - identity key pairs
                which the logged in user did select as active sometime in the past,
                saving the User the need  to activate manually often-used identities at the beginning of work sessions.
                Stored as an array of elements with IIdentityActivation - like layout:
                    applicationKey: string;
                    identityKey: string;
                    active: boolean;
                */
                var aStorageKey = STOREKEYPREFIX + theAuthentication.login.replace(STOREKEYSEPARATORTOREPLACE, STOREKEYSEPARATORTOREPLACEMENT);
                _this.storage.get(aStorageKey).then(function (theStoredIdentityActivations) {
                    // ? is it a string or an object ?
                    if (theStoredIdentityActivations) {
                        for (var _i = 0, theStoredIdentityActivations_1 = theStoredIdentityActivations; _i < theStoredIdentityActivations_1.length; _i++) {
                            var anStoredIdentityActivation = theStoredIdentityActivations_1[_i];
                            if (!anStoredIdentityActivation) {
                                continue;
                            }
                            if (!anStoredIdentityActivation.applicationKey || !anStoredIdentityActivation.identityKey) {
                                continue;
                            }
                            var someApplicationIdentityActivations = someIdentityActivationsByKeys[anStoredIdentityActivation.applicationKey];
                            if (someApplicationIdentityActivations) {
                                var anApplicationIdentityActivation = someApplicationIdentityActivations[anStoredIdentityActivation.identityKey];
                                if (anApplicationIdentityActivation) {
                                    anApplicationIdentityActivation.setActive(anStoredIdentityActivation.active === true);
                                }
                            }
                        }
                    }
                    _this.processingLogin = false;
                    _this.resolveAllWaitingForLoginProcessing();
                    resolve(theAuthentication);
                });
            });
        });
    };
    ;
    UserData.prototype.storeIdentityActivations = function () {
        var _this = this;
        if (!this.authenticatedLogin || this.processingLogin) {
            return new Promise(function (resolve) {
                resolve();
            });
        }
        return new Promise(function (resolve) {
            var aStorageKey = STOREKEYPREFIX + _this.authenticatedLogin.login.replace(STOREKEYSEPARATORTOREPLACE, STOREKEYSEPARATORTOREPLACEMENT);
            _this.storage.set(aStorageKey, _this.identityActivations);
            resolve();
        });
    };
    UserData.prototype.getIdentityActivations = function () {
        var _this = this;
        if (this.processingLogin) {
            return this.toWaitForLoginProcessing();
        }
        if (!this.authenticatedLogin) {
            return new Promise(function (resolve) {
                resolve(null);
            });
        }
        return new Promise(function (resolve) {
            resolve(_this.identityActivations);
        });
    };
    ;
    UserData.prototype.signup = function (username) {
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.setUsername(username);
        this.events.publish('user:signup');
    };
    ;
    UserData.prototype.logout = function () {
        this.storage.remove(this.HAS_LOGGED_IN);
        this.storage.remove('username');
        this.events.publish('user:logout');
    };
    ;
    UserData.prototype.setUsername = function (username) {
        this.storage.set('username', username);
    };
    ;
    UserData.prototype.getUsername = function () {
        return this.storage.get('username').then(function (value) {
            return value;
        });
    };
    ;
    UserData.prototype.hasLoggedIn = function () {
        var _this = this;
        return new Promise(function (resolve) {
            resolve(!(typeof _this.authenticatedLogin === "undefined") && !(_this.authenticatedLogin === null));
        });
        /*
        return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
            return value === true;
        });
        */
    };
    ;
    UserData.prototype.checkHasSeenTutorial = function () {
        return this.storage.get(this.HAS_SEEN_TUTORIAL).then(function (value) {
            return value;
        });
    };
    ;
    UserData = __decorate([
        core_1.Injectable()
    ], UserData);
    return UserData;
}());
exports.UserData = UserData;
