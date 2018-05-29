import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { UserData } from './user-data';

import { HttpClient } from '@angular/common/http';


import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { Templatespec, Variablespec} from "../interfaces/flow-templatespecs";

// const URL_SCHEMEHOSTPORT_realhost = "http://localhost:8080";
// const URL_PROCESSDEFINITIONS_realhost	= "/process-api/repository/process-definitions";


const URL_SCHEMEHOSTPORT_samehost = "";
const URL_PROCESSDEFINITIONS_samehost 	=  "assets/flow/flow-templates-static.json";

const URL_SCHEMEHOSTPORT = URL_SCHEMEHOSTPORT_samehost;
const URL_PROCESSDEFINITIONS 	= URL_PROCESSDEFINITIONS_samehost;



/*
const URL_PROCESSINSTANCES   	= "/process-api/runtime/process-instances";
const URL_QUERYTASKS 			= "/process-api/query/tasks";
const URL_TASKVARIABLESALL 	= "/process-api/runtime/tasks/{taskId}/variables";
const URL_TASKVARIABLESLOCAL 	= "/process-api/runtime/tasks/{taskId}/variables?scope=local";
const URL_TASKVARIABLESGLOBAL 	= "/process-api/runtime/tasks/{taskId}/variables?scope=global";
const URL_EXECUTETASKACTION    = "/process-api/runtime/tasks/{taskId}";
*/

@Injectable()
export class TemplatesProvider {

  templatespecs: Templatespec[];

  constructor(public http: Http, public httpc : HttpClient, public user: UserData) {
    console.log( "yy");
  }



  getTemplatespecs( queryText = '' ) : Observable<Templatespec[]> {
    let aResult = this.load();
    console.log( "template getTemplatespecs queryText" + queryText);
    return aResult;
    /*
    .map(( theTemplateSpecs: Templatespec[]) => {

      queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
      let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

      theTemplateSpecs.forEach((aTemplatespec: Templatespec) => {
        // check if this session should show or not
        this.filterTemplate(aTemplatespec, queryWords);
        });

      });
           */

  };

  load(): Observable<Templatespec[]> {
    if (this.templatespecs) {
      return Observable.of(this.templatespecs);
    } else {
      this.templatespecs = null;
      let aURL = URL_SCHEMEHOSTPORT + URL_PROCESSDEFINITIONS;
     let aResult = this.httpc.get(aURL).map(this.parseProcessSpec);
     return aResult;

      /*
       this.httpc.get(aURL)
         .subscribe(data => {
           console.log(JSON.stringify( data, null, 4));
         }, err => {
           console.log(err);
         });
       return null;
    */


    }
  }

  parseProcessSpec( theSpecs: any) : Templatespec[] {

    this.templatespecs = [ ];

    if( !theSpecs) {
      return;
    }

    let someProcessSpecs = theSpecs.data;
    if( !someProcessSpecs) {
      return;
    }

    for( let aProcessSpec of someProcessSpecs) {
      if( aProcessSpec) {

        const aTemplatespec  : Templatespec = new Templatespec(
          aProcessSpec.id,
          aProcessSpec.url,
          aProcessSpec.key,
          aProcessSpec.version,
          aProcessSpec.name,
          aProcessSpec.description,
          aProcessSpec.tenantId,
          aProcessSpec.deploymentId,
          aProcessSpec.deploymentUrl,
          aProcessSpec.resource,
          aProcessSpec.diagramResource,
          aProcessSpec.category,
          aProcessSpec.graphicalNotationDefined,
          aProcessSpec.suspended,
          aProcessSpec.startFormDefined
        );

        if( aProcessSpec.variables) {
          for( let aProcessVariable of aProcessSpec.variables) {
            if( !aProcessVariable) {
              continue;
            }
            const aVariableSpec = new Variablespec( aProcessVariable.name, aProcessVariable.type);
            aTemplatespec.addVariablespec( aVariableSpec)
          }
        }


        if( aProcessSpec.transientVariables) {
          for( let aTransientProcessVariable of aProcessSpec.transientVariables) {
            if( !aTransientProcessVariable) {
              continue;
            }

            const aVariableSpec = new Variablespec( aTransientProcessVariable.name, aTransientProcessVariable.type);
            aTemplatespec.addTransientVariablespec( aVariableSpec)
          }
        }

        this.templatespecs.push( aTemplatespec);
      }
    }

    return this.templatespecs;
  }




  filterTemplate( theTemplatespec : Templatespec, queryWords: string[]) {

    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach((queryWord: string) => {
        if( ( theTemplatespec.name.toLowerCase().indexOf(queryWord) >= 0)
            || ( theTemplatespec.key.toLowerCase().indexOf(queryWord) >= 0)
            ||( theTemplatespec.description.toLowerCase().indexOf(queryWord) >= 0))
          {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }

    // all tests must be true if it should not be hidden
    theTemplatespec.hide = !matchesQueryText;
  }


}
