import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { ILogin } from "../interfaces/flow-ilogins";
import { IAuthentication } from "../interfaces/flow-iauthentication";
import {Authentication} from "../interfaces/flow-authentication";



const IGNOREPASSWORD  = true;
const CRASHONERROR    = true;


@Injectable()
export class AuthenticationProvider {

    logins: ILogin[];



    constructor( public httpc: HttpClient) {
        console.log("AuthenticationProvider constructor");
    }




    authenticate( theUsername: string, thePassword: string): Observable<IAuthentication> {

        return new Observable<IAuthentication>(( theObserver) => {

            console.log( "AuthenticationProvider authenticate observable subscribe. Delivering immediately.");

            if( IGNOREPASSWORD || thePassword) {
                setTimeout( () => {
                    theObserver.next( new Authentication( theUsername, true, null, null, null));
                    theObserver.complete();
                }, 16);
            }
            else {
                if( CRASHONERROR) {
                    setTimeout( () => {
                        theObserver.error( new Authentication( theUsername, false, null, null, null));
                        theObserver.complete();
                    }, 16);
                }
                else {
                    setTimeout( () => {
                        theObserver.next( new Authentication( theUsername, false, null, null, null));
                        theObserver.complete();
                    }, 16);
                }
            }

            // When the consumer unsubscribes, clean up data ready for next subscription.
            return {
                unsubscribe() {
                    console.log( "AuthenticationProvider authenticate observable unsubscribe");
                }
            };
        });
    }




}
