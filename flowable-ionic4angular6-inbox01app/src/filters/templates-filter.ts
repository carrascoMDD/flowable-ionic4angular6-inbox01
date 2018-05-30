import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UserData} from '../providers/user-data';
import {ApplicationsProvider} from '../providers/applications-provider';
import {ActiveFilter} from './active-filter';

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
export abstract class TemplatesFilter extends ActiveFilter{

    applications: IApplication[];



    constructor( public user: UserData, public applicationsProvider: ApplicationsProvider) {
        super( user, applicationsProvider);
        console.log("ActiveFilter constructor");
    }



}
