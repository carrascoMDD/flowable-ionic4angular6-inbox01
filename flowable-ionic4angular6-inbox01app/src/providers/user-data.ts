import {Injectable} from '@angular/core';

import {Events} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {IAuthentication} from "../interfaces/flow-iauthentication";

import {LoginsProvider} from "../providers/logins-provider";
import {ILogin} from "../interfaces/flow-ilogins";
import {IdentityActivation} from "../interfaces/flow-identityactivation";
import {IIdentityActivation} from "../interfaces/flow-iidentityactivation";


const STOREKEYSEPARATORTOREPLACE = /_-_/g;
const STOREKEYSEPARATORTOREPLACEMENT = "=-=";
const STOREKEYPREFIX = "ACTIVEAPPLICATIONIDENTITIES";

type PromiseResolve_IIdentityActivationList = ( value: IIdentityActivation[]) => void;

type IdentityActivationsChangedHandler = ( value: IIdentityActivation[]) => Promise<void>;

@Injectable()
export class UserData {

    HAS_LOGGED_IN = 'hasLoggedIn';
    HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

    logins: ILogin[];

    processingLogin = false;

    waitingForLoginProcessing: PromiseResolve_IIdentityActivationList[];

    identityActivationsChangedHandlers : IdentityActivationsChangedHandler[];

    authenticatedLogin: ILogin;
    identityActivations: IdentityActivation[];

    constructor(
        public events: Events,
        public storage: Storage,
        public loginsProvider: LoginsProvider
    ) {
        this.logins = null;
        this.authenticatedLogin = null;
    }



    registerInterest_IdentityActivationsChanged( theHandler: IdentityActivationsChangedHandler): void {
        if( !theHandler) {
            return;
        }
        if( !this.identityActivationsChangedHandlers) {
            this.identityActivationsChangedHandlers = [ ];
        }
        this.identityActivationsChangedHandlers.push( theHandler);
    }




    propagate_IdentityActivationsChanged(): Promise<void> {

        if( !this.identityActivationsChangedHandlers || !this.identityActivationsChangedHandlers.length) {
            return new Promise<void>( (resolve) => {
                resolve();
            });
        }

        /* ************************************************************
        Return a Promise which shall be fulfilled after the chained fulfillement of all the change handlers
         */
        return new Promise<void>( (resolveTop) => {

            let someIdentityActivationsToPropagate = null;
            if( this.authenticatedLogin) {
                someIdentityActivationsToPropagate = this.identityActivations;
            }

            let aFirstResolve = null;
            let aFirstPromise = new Promise<void>( (resolve) => {
                aFirstResolve = resolve;
            });

            let aPreviousPromise = aFirstPromise;

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
            for( let anIdentityActivationsChangedHandler of this.identityActivationsChangedHandlers) {
                let aNextPromise = aPreviousPromise.then(
                    () => {
                        return anIdentityActivationsChangedHandler( someIdentityActivationsToPropagate);
                    },
                    () => {
                        return anIdentityActivationsChangedHandler( someIdentityActivationsToPropagate);
                    }
                );
                aPreviousPromise = aNextPromise;
            }

            /* ************************************************************
            Sanity check, should not happen because of the check done at the top of the method on
            this.identityActivationsChangedHandlers.length
            and would anyway be handled properly by (empty but for the initial) chaining execution.
            */
            if( aPreviousPromise === aFirstPromise) {
                resolveTop( );
                return;
            }

            aPreviousPromise.then(
               () => {
                   resolveTop();
               },
               () => {
                   resolveTop();
               }
            );

            /* ************************************************************
            Start propagating by resolving the first Promise
            */
             aFirstResolve();
        });





    }



    login(username: string): void {
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.setUsername(username);
        this.events.publish('user:login');
    };


    resolveAllWaitingForLoginProcessing(): void {
        if( this.waitingForLoginProcessing) {
            for( let aPromise of this.waitingForLoginProcessing) {
                aPromise( null);
            }
        }
        this.waitingForLoginProcessing = null;
    }





    toWaitForLoginProcessing(): PromiseLike<IIdentityActivation[]> {

        return new Promise<IIdentityActivation[]>( (resolve) => {
            if( !this.waitingForLoginProcessing) {
                this.waitingForLoginProcessing = [];
            }
            this.waitingForLoginProcessing.push( resolve);
        });
    }





    authenticationPerformed( theAuthentication: IAuthentication): Promise<IAuthentication> {
        this.logins              = null;
        this.authenticatedLogin  = null;
        this.identityActivations = null;

        if( !theAuthentication || !theAuthentication._v_Success) {
            return new Promise<IAuthentication>( (resolve) => { resolve( theAuthentication);});
        }


        /* ************************************************************
        Avoid other clients or subscribers to launch resolution of identityActivations
        when already on its (asynchronous) way.
        */
        this.processingLogin = true;
        this.waitingForLoginProcessing = [ ];

        return new Promise<IAuthentication>( (resolve) => {

            this.login( theAuthentication.login);

            this.loginsProvider.getAllLogins().subscribe(

                ( theLogins: ILogin[]) => {

                    this.logins              = theLogins;
                    this.authenticatedLogin  = null;
                    this.identityActivations = null;

                    for( let aLogin of theLogins) {
                        if( aLogin && ( aLogin.login === theAuthentication.login)) {
                            this.authenticatedLogin = aLogin;
                            break;
                        }
                    }

                    /* ************************************************************
                    If not found a login matching the authenticated
                    then do not build the list of identityActivations with active state from storage.
                    */
                    if( !this.authenticatedLogin) {
                        this.processingLogin = false;
                        this.resolveAllWaitingForLoginProcessing();
                        resolve( theAuthentication);
                        return;
                    }



                    /* ************************************************************
                    Build the list of identityActivations with active state from storage.
                    Create non-active IdentityActivations for all the LoginApplication in the Login
                    matching theAuthentication.login
                    Index the identityActivations by application key and identity key
                    to avoid N*N complexity in match with stored key pairs, below.
                    */
                    const someIdentityActivationsByKeys = new Map<string,Map<string, string>>();
                    if( this.authenticatedLogin) {
                        this.identityActivations = [ ];
                        for( let aLoginApplication of this.authenticatedLogin.loginApplications) {
                            if( aLoginApplication) {
                                if( aLoginApplication.applicationKey && aLoginApplication.identityKeys) {
                                    for( let anIdentityKey of aLoginApplication.identityKeys) {
                                        const anIdentityActivation = new IdentityActivation( aLoginApplication.applicationKey, anIdentityKey, false);
                                        this.identityActivations.push( anIdentityActivation);

                                        let someIdentityActivationsByKey = someIdentityActivationsByKeys[ aLoginApplication.applicationKey];
                                        if( !someIdentityActivationsByKey) {
                                            someIdentityActivationsByKey = new Map<string, string>();
                                            someIdentityActivationsByKeys[ aLoginApplication.applicationKey] = someIdentityActivationsByKey;
                                        }
                                        someIdentityActivationsByKey[ anIdentityKey] = anIdentityActivation;
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
                    let aStorageKey = STOREKEYPREFIX +  theAuthentication.login.replace(STOREKEYSEPARATORTOREPLACE, STOREKEYSEPARATORTOREPLACEMENT);
                    this.storage.get( aStorageKey).then(( theStoredIdentityActivations) => {
                        // ? is it a string or an object ?
                        if( theStoredIdentityActivations) {
                            for( let anStoredIdentityActivation of theStoredIdentityActivations) {
                                if( !anStoredIdentityActivation) {
                                    continue;
                                }

                                if( !anStoredIdentityActivation.applicationKey || !anStoredIdentityActivation.identityKey) {
                                    continue;
                                }

                                const someApplicationIdentityActivations = someIdentityActivationsByKeys[ anStoredIdentityActivation.applicationKey];
                                if( someApplicationIdentityActivations) {
                                    const anApplicationIdentityActivation = someApplicationIdentityActivations[ anStoredIdentityActivation.identityKey];
                                    if( anApplicationIdentityActivation) {
                                        anApplicationIdentityActivation.setActive( anStoredIdentityActivation.active === true);
                                    }
                                }
                            }
                        }

                        this.processingLogin = false;
                        this.resolveAllWaitingForLoginProcessing();
                        resolve( theAuthentication);
                    });

                }
            );
        });
    };





    storeIdentityActivations(): PromiseLike<void> {
        if( !this.authenticatedLogin || this.processingLogin) {
            return new Promise<void>( (resolve) => {
                resolve();
            });
        }

        return new Promise<void>( (resolve) => {
            let aStorageKey = STOREKEYPREFIX +  this.authenticatedLogin.login.replace(STOREKEYSEPARATORTOREPLACE, STOREKEYSEPARATORTOREPLACEMENT);
            this.storage.set( aStorageKey, this.identityActivations);
            resolve();
        });
    }






    getIdentityActivations(): PromiseLike<IIdentityActivation[]> {

        if( this.processingLogin) {
            return this.toWaitForLoginProcessing();
        }

        if( !this.authenticatedLogin) {
            return new Promise<IIdentityActivation[]>( (resolve) => {
                resolve( null);
            });
        }

        return new Promise<IIdentityActivation[]>( (resolve) => {
            resolve( this.identityActivations);
        });
    };



    signup(username: string): void {
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.setUsername(username);
        this.events.publish('user:signup');
    };

    logout(): void {
        this.storage.remove(this.HAS_LOGGED_IN);
        this.storage.remove('username');
        this.events.publish('user:logout');
    };

    setUsername(username: string): void {
        this.storage.set('username', username);
    };

    getUsername(): Promise<string> {
        return this.storage.get('username').then((value) => {
            return value;
        });
    };

    hasLoggedIn(): Promise<boolean> {
        return new Promise<boolean>( (resolve) => {
            resolve( !( typeof this.authenticatedLogin === "undefined") && !( this.authenticatedLogin === null));
        });
        /*
        return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
            return value === true;
        });
        */
    };

    checkHasSeenTutorial(): Promise<string> {
        return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
            return value;
        });
    };
}
