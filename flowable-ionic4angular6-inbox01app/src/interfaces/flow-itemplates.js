"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IvariableType;
(function (IvariableType) {
    IvariableType["Vstring"] = "string";
    IvariableType["Vnumber"] = "number";
    IvariableType["Vboolean"] = "boolean";
    IvariableType["Vdate"] = "date";
    IvariableType["Vtime"] = "time";
    IvariableType["Vdatetime"] = "datetime";
})(IvariableType = exports.IvariableType || (exports.IvariableType = {}));
var a = {
    "processDefinitionId": null,
    "processDefinitionKey": "flowableplay01",
    "message": null,
    "businessKey": null,
    "variables": [{
            "@class": "org.flowable.rest.service.api.engine.variable.RestVariable",
            "name": "nrOfHolidays",
            "value": 10,
            "scope": null
        }, {
            "@class": "org.flowable.rest.service.api.engine.variable.RestVariable",
            "name": "description",
            "value": "Family reunion",
            "scope": null
        }, {
            "@class": "org.flowable.rest.service.api.engine.variable.RestVariable",
            "name": "employee",
            "value": "ACV",
            "scope": null
        }],
    "transientVariables": null,
    "tenantId": null,
    "returnVariables": false
};
