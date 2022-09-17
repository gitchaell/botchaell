import { WhatsappService } from './services/whatsapp.service';

require('dotenv').config();

(({ openAIkey, phone, sessionKey }) => {

  new WhatsappService({ openAIkey, phone, sessionKey });

})({
  openAIkey: process.env.OPEN_AI_KEY!,
  phone: process.env.PHONE!,
  sessionKey: process.env.WHATSAPP_SESSION_KEY!,
});
