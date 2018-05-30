import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UserData} from '../providers/user-data';
import {ApplicationsProvider} from '../providers/applications-provider';
import {ActiveFilter} from './active-filter';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { IApplication } from "../interfaces/flow-iapplications";
import {Templatespec} from "../interfaces/flow-templatespecs";
import {TemplatesProvider} from "../providers/templates-provider";
import {IIdentityActivation} from "../interfaces/flow-iidentityactivation";



@Injectable()
export abstract class TemplatesFilter extends ActiveFilter{

    applications: IApplication[];



    constructor(
        public userData: UserData,
        public applicationsProvider: ApplicationsProvider,
        public templatesProvider: TemplatesProvider) {
        super( userData, applicationsProvider);
        console.log("TemplatesFilter constructor");
    }




    getTemplatespecs( queryText = '' ) : Observable<Templatespec[]> {

        console.log( "TemplatesFilter getTemplatespecs queryText" + JSON.stringify(queryText));

        return new Observable<Templatespec[]>(( theObserver) => {

            console.log( "TemplatesFilter getTemplatespecs observable subscribe. Delivering after observing templatesProvider and applications provider promise is resolved.");

            this.templatesProvider.getTemplatespecs().subscribe(

                ( theTemplatespecs: Templatespec[]) => {
                    console.log( "TemplatesFilter getTemplatespecs received this.templatesProvider.getTemplatespecs() theTemplatespecs.length=" + ( !theTemplatespecs ? 0 : theTemplatespecs.length));

                    this.userData.getIdentityActivations().then( ( theIdentityActivations: IIdentityActivation[]) => {

                        console.log( "TemplatesFilter getTemplatespecs received this.userData.getIdentityActivations() theIdentityActivations.length=" + ( !theIdentityActivations ? 0 : theIdentityActivations.length));

                        if( theIdentityActivations){}/*CQT*/
                        let someFilteredTemplatespecs = theTemplatespecs.slice();

                        theObserver.next( someFilteredTemplatespecs);
                        theObserver.complete();
                    });
                },
                ( theError: any) => {
                    console.log( "TemplatesFilter getTemplatespecs theError=" + JSON.stringify( theError));
                    theObserver.error( theError);
                    theObserver.complete();
                }
            );

            // When the consumer unsubscribes, clean up data ready for next subscription.
            return {
                unsubscribe() {
                    console.log( "TemplatesFilter getTemplatespecs observable unsubscribe");
                }
            };
        });
    }




}
