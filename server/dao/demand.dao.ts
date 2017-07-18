import * as JSData from 'js-data'
import { BaseDAO } from '.'
import { Demand } from '../models'
import { IDemand } from '../interfaces'
import { Config, Interfaces, Services } from 'js-data-dao'

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
        payload: { type: 'string' }
      },
      required: [ 'type', 'description', 'approved', 'payload' ]
    }
    const relations: any = {}
    const joins: Array<string> = [ '' ]
    super( store, Demand, 'demands', schema, relations, joins )
  }

  public async findAll ( query: Object = {}, user: Interfaces.IBaseUser, options?: any ): Promise<Array<IDemand>> {
    let demands = await super.findAll( query, user, options )
    demands.map( d => this.parsePayload( d ) )
    return demands
  }

  public async find ( id: string, user: Interfaces.IBaseUser, options?: any ): Promise<IDemand> {
    let demand = await super.find( id, user, options )
    demand = this.parsePayload( demand )
    return demand
  }

  public async create ( obj: IDemand, userP: any, options?: any ): Promise<IDemand> {
    obj = this.stringfyPayload( obj )
    let demand = await super.create( obj, userP, options )
    demand = this.parsePayload( demand )
    return demand
  }

  public async update ( id: string, user: Interfaces.IBaseUser, obj: IDemand ): Promise<IDemand> {
    obj = this.stringfyPayload( obj )
    let demand = await super.update( id, user, obj )
    demand = this.parsePayload( demand )
    return demand
  }

  public async paginatedQuery (
    search: any = {},
    user: Interfaces.IBaseUser,
    page?: number,
    limit?: number,
    order?: Array<string> | Array<Array<string>>,
    options?: any ): Promise<Interfaces.IResultSearch<IDemand>> {
    let result = await super.paginatedQuery( search, user, page, limit, order, options )
    result.result.map(( r: IDemand ) => this.parsePayload( r ) )
    return result
  }

  private parsePayload ( demand: IDemand ) {
    if ( typeof demand.payload === 'string' && demand.payload.trim() ) {
      demand.payload = JSON.parse( demand.payload )
    }
    return demand
  }

  private stringfyPayload ( demand: IDemand ) {
    if ( typeof demand.payload === 'object' ) {
      demand.payload = JSON.stringify( demand.payload )
    }
    return demand
  }
}
