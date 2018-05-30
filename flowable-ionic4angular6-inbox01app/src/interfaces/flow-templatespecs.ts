import {ITemplatespec, IVariablespec, IVariableType} from "./flow-itemplatespecs"

export class Templatespec implements ITemplatespec {

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

  variables: IVariablespec[];
  transientVariables: IVariablespec[];

  addVariablespec( theVariableSpec : IVariablespec) {
    if( !theVariableSpec) {
      return;
    }

    this.variables.push( theVariableSpec);
  }

  addTransientVariablespec( theVariableSpec : IVariablespec) {
    if( !theVariableSpec) {
      return;
    }

    this.transientVariables.push( theVariableSpec);
  }

}



export class Variablespec implements IVariablespec {

  constructor( public name: string, public type: IVariableType) {};

}

