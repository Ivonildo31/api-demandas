import * as JSData from 'js-data'
import { Application } from 'express'
import { Config } from 'js-data-dao'
import { DemandRouter } from './demand-router'

export namespace main {
  export const callRoutes = (app: Application, store: JSData.DataStore, passport: any, appConfig: Config.AppConfig): Application => {
    app.use('/api/v1/ping', (req, res, nex) => res.json('pong'))
    app.use('/api/v1/demands', new DemandRouter(store, appConfig).getRouter())

    return app
  }
}
