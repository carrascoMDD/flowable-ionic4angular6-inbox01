

export interface ISpecsreport {
  data: ITemplatespec[],
  total: number, // 2,
  start: number, // 0,
  sort: string, // "name",
  order: string, // "asc",
  size:  number, //2
}



export interface ITemplatespec {
  id: string, // "flowableplay01:1:a43d814f-6314-11e8-8c3e-227d0f96bf59",
  url: string, // "http://localhost:49586/process-api/repository/process-definitions/flowableplay01:1:a43d814f-6314-11e8-8c3e-227d0f96bf59",
  key: string, // "flowableplay01",
  version: number, // 1,
  name: string, // "FlowablePlay01 BPMN2",
  description?: string, // null,
  tenantId: string, // "",
  deploymentId: string, // "a3fbe46b-6314-11e8-8c3e-227d0f96bf59",
  deploymentUrl: string, // "http://localhost:49586/process-api/repository/deployments/a3fbe46b-6314-11e8-8c3e-227d0f96bf59",
  resource: string, // "http://localhost:49586/process-api/repository/deployments/a3fbe46b-6314-11e8-8c3e-227d0f96bf59/resources//home/acv/Works/MDD/flowableboot01/SVNs_flowableboot01/flowableboot01_trunk/flowableboot01/target/classes/processes/flowableplay01.bpmn20.xml",
  diagramResource?: string, // null,
  category: string, // "http://www.flowable.org/processdef",
  graphicalNotationDefined: boolean, // false,
  suspended: boolean, //false,
  startFormDefined: boolean, //false,
  variables: IVariablespec[],
  transientVariables: IVariablespec[]
}




export interface IVariablespec {
  name: string,
  type: IVariableType
}


export enum IVariableType {
  Vstring   = "string",
  Vnumber   = "number",
  Vboolean  = "boolean",
  Vdate     = "date",
  Vtime     = "time",
  Vdatetime = "datetime"
}



