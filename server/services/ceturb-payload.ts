import * as moment from 'moment'
import { IDemand } from '../interfaces'

enum FeedBackType {
  LinhaNaoAparece = 0,
  LocalizacaoErrada = 1,
  ErroNoHorario = 2,
  ErroNaPrevisao = 3,
  OutroProblema = 4
}

const getTypeDemand = ( type: number ) => {
  switch ( type ) {
    case FeedBackType.LinhaNaoAparece: return 'Linha não aparece'
    case FeedBackType.LocalizacaoErrada: return 'Localização errada'
    case FeedBackType.ErroNoHorario: return 'Erro no horário'
    case FeedBackType.ErroNaPrevisao: return 'Erro na previsão'
    default: return 'Outro problema'
  }
}
const getUser = ( user: any ) => {
  if ( user.ananonymous ) {
    return 'usuário anônimo'
  } else {
    return `
        nome: ${user.nome}
        email: ${user.email}`
  }
}

export let ceturbPayload = {
  getEmailBody ( demand: IDemand ) {
    let payload = demand.payload
    let mailBody = `Data de envio: ${moment( demand.createdAt ).format( 'DD/MM/YYYY HH:mm:ss' )}\n`
    mailBody += `tipo: ${getTypeDemand( payload.type )}\n`

    // Ajusta a data do horário informado, pois no formulário ele preenche a data como 1/1/1970.
    // TODO: Por enquanto utilizando a data de criação. Mas deve ser ajustado no formulário do aplicativo.
    mailBody += payload.date ? `hora: ${moment( demand.createdAt.substring( 0, 11 ) + payload.date.substring( 11 ) ).format( 'HH:mm' )}\n` : ''

    mailBody += payload.line ? `linha: ${payload.line}\n` : ''
    mailBody += payload.stop ? `ponto: ${payload.stop}\n` : ''
    mailBody += payload.text ? `descrição: ${payload.text}\n` : ''
    mailBody += payload.user ? `usuário: ${getUser( payload.user )}\n` : ''
    return mailBody
  }
}
