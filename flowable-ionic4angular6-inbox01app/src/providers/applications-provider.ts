import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {UserData} from './user-data';

import {HttpClient} from '@angular/common/http';


import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { IApplication } from "../interfaces/flow-iapplications";
import { Application, Group, Identity } from "../interfaces/flow-applications";


// const URL_SCHEMEHOSTPORT_realhost = "http://localhost:8080";
// const URL_APPLICATIONS_realhost	= "";

const URL_SCHEMEHOSTPORT_samehost = "";
const URL_APPLICATIONS_samehost = "assets/flow/flow-applications-static.json";

const URL_SCHEMEHOSTPORT = URL_SCHEMEHOSTPORT_samehost;
const URL_APPLICATIONS = URL_APPLICATIONS_samehost;




@Injectable()
export class ApplicationsProvider {

    applications: IApplication[];



    constructor(public http: Http, public httpc: HttpClient, public user: UserData) {
        console.log("ApplicationsProvider constructor");
    }



    getAllApplications(): Observable<IApplication[]> {
        return this.load();
    }



    load(): Observable<IApplication[]> {
        if(this.applications) {
            return Observable.of(this.applications);
        } else {
            this.applications = null;
            return  this.httpc.get(URL_SCHEMEHOSTPORT + URL_APPLICATIONS).map( this.parseApplications);
        }
    }





    parseApplications( theSrcApplicationsAccess: any): IApplication[] {
        console.log(">>> ApplicationsProvider parseApplications");

        this.applications = [ ];

        if( !theSrcApplicationsAccess) {
            return;
        }

        for( let aSrcApplication of theSrcApplicationsAccess) {
            if(aSrcApplication) {

                const anApplication = new Application(
                    aSrcApplication.name,
                    aSrcApplication.key
                );

                if(aSrcApplication.processSpecs) {
                    for(let aSrcProcessSpec of aSrcApplication.processSpecs) {
                        if(!aSrcProcessSpec) {
                            continue;
                        }
                        const aProcessSpec = new Group(aSrcProcessSpec.name, aSrcProcessSpec.key);
                        anApplication.addProcessSpec(aProcessSpec);
                    }
                }


                if(aSrcApplication.groups) {
                    for(let aSrcGroup of aSrcApplication.groups) {
                        if(!aSrcGroup) {
                            continue;
                        }
                        const aGroup = new Group(aSrcGroup.name, aSrcGroup.groupKeys);
                        anApplication.addGroup(aGroup);
                    }
                }

                if(aSrcApplication.identities) {
                    for(let aSrcIdentity of aSrcApplication.identities) {
                        if(!aSrcIdentity) {
                            continue;
                        }
                        const anIdentity = new Identity(aSrcIdentity.key, aSrcIdentity.groups);
                        anApplication.addIdentity(anIdentity);
                    }
                }

                this.applications.push( anApplication);
            }
        }

        console.log("<<< ApplicationsProvider parseApplications");

        return this.applications;
    }


}
