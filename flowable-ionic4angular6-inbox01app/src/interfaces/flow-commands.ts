
export interface Icommand_StartProcessInstanceByKey {
  processDefinitionId?: string, // null,
  processDefinitionKey: string, // "flowableplay01",
  message?: string, // null,
  businessKey?: string, // null,
  variables?: Icommand_variablevalue[],
  transientVariables?: Icommand_variablevalue[],
  tenantId?: string, // null,
  returnVariables: boolean // false
}


export interface Icommand_variablevalue {
  name: string, // "nrOfHolidays",
  value: any, // 10,
  scope?: string, //null
}




