import * as nodemailer from 'nodemailer'
import * as mailConfig from '../config/mail-config'
let smtpOptions: any = {
  /**
   * is the port to connect to (defaults to 25 or 465)
   */
  port: mailConfig.port,
  /**
   * is the hostname or IP address to connect to (defaults to 'localhost')
   */
  host: mailConfig.host,
  /**
   * defines if the connection should use SSL (if true) or not (if false)
   */
  secure: mailConfig.secure,
  // ignoreTLS: true,
  // requireTLS: true,
/*   tls: { rejectUnauthorized: mailConfig.rejectUnauthorized }, */
  /**
   *  defines authentication data (see authentication section below)
   */
/*   auth: {
    user: mailConfig.username,
    pass: mailConfig.password
  }, */
  /**
   * optional hostname of the client, used for identifying to the server
   */
  name: 'Demandas Ceturb',
  /**
   * if true, the connection emits all traffic between client and server as 'log' events
   */
  debug: true
}

let defaultMailOptions: nodemailer.SendMailOptions = {
	/**
	 * The e-mail address of the sender. All e-mail addresses can be plain 'sender@server.com' or formatted 'Sender Name <sender@server.com>', see here for details
	 */
  from: mailConfig.sender,
	/**
	 * An e-mail address that will appear on the Sender: field
	 */
  sender: mailConfig.sender,
	/**
	 * Comma separated list or an array of recipients e-mail addresses that will appear on the To: field
	 */
  to: mailConfig.defaultTo,
	/**
	 * The subject of the e-mail
	 */
  subject: '',
	/**
	 * The plaintext version of the message as an Unicode string, Buffer, Stream or an object {path: '...'}
	 */
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
