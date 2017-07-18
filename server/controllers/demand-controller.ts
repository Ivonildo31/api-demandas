import * as JSData from 'js-data'
import * as express from 'express'
import { IDemand } from '../interfaces'
import { DemandDAO } from '../dao'
import { Controllers, Config } from 'js-data-dao'
import { mailService } from '../services/mail'
import * as mailConfig from '../config/mail-config'

export class DemandController extends Controllers.BasePersistController<IDemand> {
  collection: DemandDAO
  constructor( store: JSData.DataStore, appConfig: Config.AppConfig ) {
    super( new DemandDAO( store, appConfig ) )
  }

  public sendMail ( req: Request, res: express.Response, next?: express.NextFunction ): void {
    mailService.send( mailConfig.defaultTo, 'teste assunto uhuu', 'teste texto aposdjf paoisdj çaklsj dfçkl' )
    res.send( true )
  }
}
