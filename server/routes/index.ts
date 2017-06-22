import * as JSData from 'js-data'
import { Application, Router } from 'express'
import { Config } from 'js-data-dao'
import { DemandRouter } from './demand-router'
import { AppConfig } from '../config/app-config'

export namespace main {
  export const callRoutes = (app: Application, store: JSData.DataStore, passport: any, appConfig: Config.AppConfig): Application => {
    const router: Router = Router()

    router.use('/api/v1/ping', (req, res, nex) => res.json('pong'))
    router.use('/api/v1/demands', new DemandRouter(store, appConfig).getRouter())

    app.use( AppConfig.requestPath, router )

    return app
  }
}
