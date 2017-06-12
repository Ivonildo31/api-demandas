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

  public routers () {
    let ctrl = this.controller

    this.router.get( '/', ( req: any, res, next ) => this.respond( ctrl.findAll( req, res, next ), res, next ) )
    this.router.get( '/:id', ( req: any, res, next ) => this.respond( ctrl.find( req, res, next ), res, next ) )
    this.router.post( '/', ( req: any, res, next ) => this.respond( ctrl.create( req, res, next ), res, next ) )
    this.router.post( '/query', ( req: any, res, next ) => this.respond( ctrl.query( req, res, next ), res, next ) )
  }
}
