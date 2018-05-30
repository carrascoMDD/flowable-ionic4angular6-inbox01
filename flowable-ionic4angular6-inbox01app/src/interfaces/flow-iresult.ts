import { ITyped } from './flow-ityped';

export interface IResult extends ITyped {
    _v_Success: boolean;
    _v_Condition?: string;
    _v_Message?: string;
    _v_Details?: any
}

