import {Injectable} from '@angular/core';
import {UserData} from '../providers/user-data';
import {ApplicationsProvider} from '../providers/applications-provider';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';



@Injectable()
export abstract class ActiveFilter {

    constructor(
        public userData: UserData,
        public applicationsProvider: ApplicationsProvider) {
        console.log("ActiveFilter constructor");
    }



}
