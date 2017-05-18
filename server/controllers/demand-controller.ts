import * as JSData from 'js-data'
import { IDemand } from '../interfaces'
import { DemandDAO } from '../dao'
import { Controllers, Config } from 'js-data-dao'

export class DemandController extends Controllers.BasePersistController<IDemand> {
  collection: DemandDAO
  constructor( store: JSData.DataStore, appConfig: Config.AppConfig ) {
    super( new DemandDAO( store, appConfig ) )
  }
}
