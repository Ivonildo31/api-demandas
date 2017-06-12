
/**
 * busca as variaveis de ambiente no arquivo .env
 */
import * as dotenv from 'dotenv'
dotenv.config()
import * as compression from 'compression'
import * as express from 'express'
import * as JSData from 'js-data'
import { Config, Application } from 'js-data-dao'

/**
 * importacao das rotas
 */
import * as routes from './routes'

class MainApp extends Application {

  constructor() {
    let cfg: Config.AppConfig = new Config.AppConfig()

    super( cfg, routes.main.callRoutes )
  }

  handleParsers ( app: express.Application ): express.Application {
    app.use( compression() )

    return super.handleParsers( app )
  }

  handlePassport ( app: express.Application, store: JSData.DataStore, passport: any ): express.Application {
    // required for passport
    // this.passport = passportJwt( store, passport, this.appConfig )
    app.use( this.passport.initialize() )
    return app
  }
}

/**
 * para enviar a aplicacao a nivel do server será sempre levado o objeto app criado ao instanciar a aplicacao
 */
export let application = (new MainApp()).app
