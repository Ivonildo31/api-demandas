import * as JSData from 'js-data'
import * as mailConfig from '../config/mail-config'
import * as moment from 'moment'
import { BaseDAO } from '.'
import { Demand } from '../models'
import { IDemand } from '../interfaces'
import { Config, Interfaces, Services } from 'js-data-dao'
import { mailService } from '../services/mail'

enum FeedBackType {
  LinhaNaoAparece = 0,
  LocalizacaoErrada = 1,
  ErroNoHorario = 2,
  ErroNaPrevisao = 3,
  OutroProblema = 4
}

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
    try {
      this.sendEmail( demand )
    } catch ( err ) {
      console.error( err )
    }
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

  private sendEmail ( demand: IDemand ) {
    mailService.send( mailConfig.defaultTo, 'Feedback Transcol Online', this.getEmailBody( demand ) )
  }

  private getEmailBody ( demand: IDemand ) {
    let payload = demand.payload
    let mailBody = `Data de envio: ${moment( demand.createdAt ).format( 'DD/MM/YYYY HH:mm:ss' )}\n`
    mailBody += `tipo: ${this.getTypeDemand( payload.type )}\n`

    // Ajusta a data do horário informado, pois no formulário ele preenche a data como 1/1/1970.
    // TODO: Por enquanto utilizando a data de criação. Mas deve ser ajustado no formulário do aplicativo.
    mailBody += payload.date ? `hora: ${moment( demand.createdAt.substring( 0, 11 ) + payload.date.substring( 11 ) ).format( 'HH:mm' )}\n` : ''

    mailBody += payload.line ? `linha: ${payload.line}\n` : ''
    mailBody += payload.stop ? `ponto: ${payload.stop}\n` : ''
    mailBody += payload.text ? `descrição: ${payload.text}\n` : ''
    mailBody += payload.user ? `usuário: ${this.getUser( payload.user )}\n` : ''
    return mailBody
  }

  private getUser ( user: any ) {
    if ( user.ananonymous ) {
      return 'usuário anônimo'
    } else {
      return `
        nome: ${user.nome}
        email: ${user.email}`
    }
  }

  private getTypeDemand ( type: number ) {
    switch ( type ) {
      case FeedBackType.LinhaNaoAparece: return 'Linha não aparece'
      case FeedBackType.LocalizacaoErrada: return 'Localização errada'
      case FeedBackType.ErroNoHorario: return 'Erro no horário'
      case FeedBackType.ErroNaPrevisao: return 'Erro na previsão'
      default: return 'Outro problema'
    }
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
