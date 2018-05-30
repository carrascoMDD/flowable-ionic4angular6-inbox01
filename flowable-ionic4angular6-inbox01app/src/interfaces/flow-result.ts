import {IResult} from "./flow-iresult"

export abstract class Result implements IResult {
    _v_Type: string;
    _v_Success: boolean;
    _v_Condition?: string;
    _v_Message?: string;
    _v_Details?: any;

    constructor(
        theSuccess: boolean,
        theCondition?: string,
        theMessage?: string,
        theDetails?: any) {
        this._v_Success = theSuccess;
        this._v_Condition = theCondition || null;
        this._v_Message = theMessage || null;
        this._v_Details = theDetails || null;
    }
}

