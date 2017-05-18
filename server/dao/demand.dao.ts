import * as JSData from 'js-data'
import { BaseDAO } from '.'
import { Demand } from '../models'
import { IDemand } from '../interfaces'
import { Config, Services } from 'js-data-dao'

/**
 * classe de persistencia da fonte de informação
 *
 * @export
 * @class SourceDAO
 * @extends {Models.DAO<ISource>}
 */
export class DemandDAO extends BaseDAO<IDemand> {
  storedb: JSData.DataStore
  serviceLib: Services.ServiceLib
  constructor( store: JSData.DataStore, appConfig: Config.AppConfig ) {
    const schema: any = {
      type: 'object',
      properties: {
        type: { type: 'number' },
        description: { type: 'string' },
        approved: { type: 'boolean' },
        payload: { type: 'object' }
      },
      required: [ 'type', 'payload' ]
    }
    const relations: any = {}
    const joins: Array<string> = [ 'surveys' ]
    super( store, Demand, 'demands', schema, relations, joins )
  }
}
