import {Itemplatespec, Ivariablespec, IvariableType} from "./flow-itemplatespecs"

export class Templatespec implements Itemplatespec {

  public hide : Boolean;

  constructor(
    public id: string,
    public url: string,
    public key: string,
    public version: number,
    public name: string,
    public description: string,
    public tenantId: string,
    public deploymentId: string,
    public deploymentUrl: string,
    public resource: string,
    public diagramResource: string,
    public category: string,
    public graphicalNotationDefined: boolean,
    public suspended: boolean,
    public startFormDefined: boolean
  ) {
    this.variables          = [];
    this.transientVariables = [];
    this.hide = false;
  };

  variables: Ivariablespec[];
  transientVariables: Ivariablespec[];

  addVariablespec( theVariableSpec : Ivariablespec) {
    if( !theVariableSpec) {
      return;
    }

    this.variables.push( theVariableSpec);
  }

  addTransientVariablespec( theVariableSpec : Ivariablespec) {
    if( !theVariableSpec) {
      return;
    }

    this.transientVariables.push( theVariableSpec);
  }

}



export class Variablespec implements Ivariablespec {

  constructor( public name: string, public type: IvariableType) {};

}

