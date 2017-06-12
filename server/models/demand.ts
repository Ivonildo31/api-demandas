import { IDemand } from '../interfaces'
import { Models } from 'js-data-dao'
/**
 * classe da fonte de informação
 *
 * @export
 * @class Source
 * @extends {Models.BaseModel}
 * @implements {ISource}
 */
export class Demand extends Models.BaseModel implements IDemand {
  type: number
  description: string
  approved: boolean
  payload: any

  constructor( obj: IDemand ) {
    super( obj )
    this.type = obj.type
    this.description = obj.description
    this.approved = obj.approved || false
    this.payload = obj.payload || ''
  }
}
