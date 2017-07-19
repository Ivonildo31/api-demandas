import * as nodemailer from 'nodemailer'
import * as mailConfig from '../config/mail-config'
let smtpOptions: any = {
  port: mailConfig.port,
  host: mailConfig.host,
  secure: mailConfig.secure,
  name: 'Demandas Ceturb'
}

let defaultMailOptions: nodemailer.SendMailOptions = {
  from: mailConfig.sender,
  sender: mailConfig.sender,
  to: mailConfig.defaultTo,
  subject: '',
  text: ''
}

let transporter = nodemailer.createTransport( smtpOptions )

export let mailService = {
  send: ( to: string, subject: string, text: string ): any => {
    let mailOptions = {
      to: to,
      subject: subject,
      text: text
    }
    mailOptions = Object.assign( {}, defaultMailOptions, mailOptions )

    transporter.sendMail( mailOptions, ( error: Error, info: nodemailer.SentMessageInfo ) => {
      console.log( info )
      if ( error ) {
        console.error( error )
      }
    } )
  }
}
