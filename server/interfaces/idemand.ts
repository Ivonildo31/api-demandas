import { IBaseModel } from '.'

export interface IDemand extends IBaseModel {

  /**
   * Typo da demanda
   *
   * @type {number}
   * @memberOf IDemand
   */
  type: number

  /**
   * Descrição da demanda
   *
   * @type {string}
   * @memberOf IDemand
   */
  description: string

  /**
   * Indica se a demanda foi aprovada ou não
   *
   * @type {boolean}
   * @memberOf IDemand
   */
  approved: boolean

  /**
   * Payload: Qualquer informação específica sobre a demanda
   *
   * @type {*}
   * @memberOf IDemand
   */
  payload: any
}
