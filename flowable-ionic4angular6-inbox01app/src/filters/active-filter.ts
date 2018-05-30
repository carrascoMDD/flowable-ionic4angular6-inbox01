import {Injectable} from '@angular/core';
import {UserData} from '../providers/user-data';
import {ApplicationsProvider} from '../providers/applications-provider';


import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { IApplication } from "../interfaces/flow-iapplications";


// const URL_SCHEMEHOSTPORT_realhost = "http://localhost:8080";
// const URL_APPLICATIONS_realhost	= "";

const URL_SCHEMEHOSTPORT_samehost = "";
const URL_APPLICATIONS_samehost = "assets/flow/flow-applications-static.json";

const URL_SCHEMEHOSTPORT = URL_SCHEMEHOSTPORT_samehost;
const URL_APPLICATIONS = URL_APPLICATIONS_samehost;




@Injectable()
export abstract class ActiveFilter {

    applications: IApplication[];



    constructor( public user: UserData, public applicationsProvider: ApplicationsProvider) {
        console.log("ActiveFilter constructor");
    }



}
