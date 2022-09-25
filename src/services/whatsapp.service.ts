
import * as QR from 'qrcode-terminal';
import * as Whatsapp from 'whatsapp-web.js';
import { OpenAIService } from './openai.service';
import Logger from './log.service';

export class WhatsappService {

  private _sessionKey?: string;
  private _phone?: string;
  private _client?: Whatsapp.Client;
  private _bot: OpenAIService;

  constructor({ openAIkey, phone, sessionKey }: {
    openAIkey: string,
    phone: string,
    sessionKey: string,
  }) {

    this._bot = new OpenAIService({ openAIkey });

    this.setPhone(phone);
    this.setSessionKey(sessionKey);
    this.setClient();

  }

  public setPhone(phone: string) {
    this._phone = phone;
    Logger.info('Whatsapp Phone: ' + phone);
  }

  public setSessionKey(sessionKey: string) {
    this._sessionKey = sessionKey;
    Logger.info('Whatsapp Session Key: ' + sessionKey);
  }

  public setClient() {

    if (!this._sessionKey)
      throw Logger.error('Whatsapp Session Key not provided');

    if (!this._phone)
      throw Logger.error('Whatsapp Phone not provided');


    this._client = new Whatsapp.Client({
      authStrategy: new Whatsapp.LocalAuth({ clientId: this._sessionKey })
    });

    this._client
      .on('qr', (qr: string) => QR.generate(qr, { small: true }))
      .on('authenticated', () => Logger.info('Whatsapp Client authenticated'))
      .on('auth_failure', () => Logger.info('Whatsapp Client authentication failed'))
      .on('ready', () => Logger.info('Whatsapp Client is Ready'))
      .on('message', (message) => {
        this._bot.reply(message.from, message.body).then(content => {
          this._client!.sendMessage(message.from, content);
        })
      });

    this._client.initialize()
      .then(() => Logger.info('Whatsapp Client initialized'));
  }

}
