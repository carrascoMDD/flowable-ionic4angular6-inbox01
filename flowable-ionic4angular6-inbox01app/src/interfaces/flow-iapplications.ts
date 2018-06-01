/*
 * flow-iapplications.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angularx6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */

import { ITyped } from './flow-ityped';


export interface IApplication extends ITyped {
    name: string;
    key: string;
    isDisabled: boolean;
    specs:  ISpec[];
    groups: IGroup[];
    identities: IIdentity[];

    getAllSpecs() : ISpec[];
    getProcessSpecs() : IProcessSpec[];
}


export interface ISpec extends ITyped {
    application: IApplication;
    name: string;
    key: string;
}


export interface IProcessSpec extends ISpec {
}



export interface IProcessInitiator extends ITyped {
    initiableProcessKeys: string[];
    participedProcessKeys: string[];
}


export interface IGroup extends IProcessInitiator {
    application: IApplication;
    name: string;
    key: string;
    isVirtual: boolean;
}


export interface IIdentity extends IProcessInitiator {
    application: IApplication;
    user: string;
    groupKeys: string[];
}

