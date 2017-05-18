import { DemandRouter } from './demand-router'
import * as express from 'express'
import * as JSData from 'js-data'
import { Config } from 'js-data-dao'
import { pathRoute } from '../config/api-middleware'

export namespace main {
  export const callRoutes = (app: express.Application, store: JSData.DataStore, passport: any, appConfig: Config.AppConfig): express.Application => {
    app.use(`${pathRoute}/api/v1/ping`, (req, res, nex) => res.json('pong'))
    app.use(`${pathRoute}/api/v1/demands`, new DemandRouter(store, appConfig).getRouter())

    return app
  }
}
