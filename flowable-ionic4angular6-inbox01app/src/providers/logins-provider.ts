import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import {HttpClient} from '@angular/common/http';

import { ILogin } from "../interfaces/flow-ilogins";
import { Login, LoginApplication } from "../interfaces/flow-logins";


// const URL_SCHEMEHOSTPORT_realhost = "http://localhost:8080";
// const URL_LOGINS_realhost	= "";

const URL_SCHEMEHOSTPORT_samehost = "";
const URL_LOGINS_samehost = "assets/flow/flow-logins-static.json";

const URL_SCHEMEHOSTPORT = URL_SCHEMEHOSTPORT_samehost;
const URL_LOGINS = URL_LOGINS_samehost;



@Injectable()
export class LoginsProvider {

    logins: ILogin[];



    constructor( public httpc: HttpClient) {
        console.log("LoginsProvider constructor");
    }




    getAllLogins(): Observable<ILogin[]> {
        return this.load();
    }



    load(): Observable<ILogin[]> {
        if(this.logins) {
            return Observable.of(this.logins);
        } else {
            this.logins = null;
            return  this.httpc.get(URL_SCHEMEHOSTPORT + URL_LOGINS).map( this.parseLogins);
        }
    }



    parseLogins( theSrcLogins: any): ILogin[] {
        console.log(">>> LoginsProvider parseLogins");

        this.logins = [ ];

        if( !theSrcLogins) {
            return;
        }

        for( let aSrcLogin of theSrcLogins) {
            if(aSrcLogin) {

                console.log("    LoginsProvider parseLogins aLogin=" + aSrcLogin.login);

                const aLogin = new Login(
                    aSrcLogin.login,
                    aSrcLogin.name,
                    aSrcLogin.familyName
                );

                if(aSrcLogin.loginApplications) {
                    for(let aSrcLoginApplication of aSrcLogin.loginApplications) {
                        if(!aSrcLoginApplication) {
                            continue;
                        }
                        const aLoginApplication = new LoginApplication(
                            aSrcLoginApplication.applicationKey,
                            aSrcLoginApplication.identityKeys ? aSrcLoginApplication.identityKeys.slice() : null);
                        aLogin.addLoginApplication(aLoginApplication);
                    }
                }

                this.logins.push( aLogin);
            }
        }

        console.log("<<< LoginsProvider parseLogins");

        return this.logins;
    }


}
