import { IBaseModel } from '.'

export interface IDemand extends IBaseModel {

    /**
     * 
     * 
     * @type {number}
     * @memberOf IDemand
     */
    type: number

    /**
     * 
     * 
     * @type {string}
     * @memberOf IDemand
     */
    description: string

    /**
     * 
     * 
     * @type {boolean}
     * @memberOf IDemand
     */
    approved: boolean

    /**
     * 
     * 
     * @type {*}
     * @memberOf IDemand
     */
    payload: any
}
