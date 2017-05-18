import * as JSData from 'js-data'
import { IDemand } from '../interfaces'
import { DemandController } from '../controllers'
import { Routes, Config } from 'js-data-dao'
import { Router } from 'express'

export class DemandRouter extends Routes.PersistRouter<IDemand, DemandController> {
  controller: DemandController
  router: Router

  constructor( store: JSData.DataStore, config: Config.AppConfig ) {
    const ctrl = new DemandController( store, config )
    super( store, ctrl )
  }
}
