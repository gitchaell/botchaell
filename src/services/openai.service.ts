import { Configuration, OpenAIApi } from 'openai';
import Logger from './log.service';

export class OpenAIService {

  _bot: OpenAIApi;
  _botname: string = 'BOTCHAELL';
  _messages: [string, string][] = []; // [who, message]
  _max_messages: number = 100;

  constructor({ openAIkey }: { openAIkey: string }) {
    this._bot = new OpenAIApi(new Configuration({ apiKey: openAIkey }));
    Logger.info('OpenAI Service initialized');
  }

  public async reply(phone: string, inputMessage: string): Promise<string> {

    this.addMessage(phone, inputMessage);

    const response = await this._bot.createCompletion({
      model: 'text-davinci-002',
      prompt: this.getPrompt(),
      temperature: 0.5,
      max_tokens: 60,
      top_p: 0.3,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
      best_of: 1,
    });

    const outputMessage = response.data.choices && response.data.choices[0].text
      ? response.data.choices[0].text
      : '';

    this.addMessage(this._botname, outputMessage);

    return outputMessage.replace(this._botname + ':', '');
  }

  private addMessage(who: string, message: string) {

    if (this._messages.length > this._max_messages)
      this._messages.shift();

    this._messages.push([who, message]);
  }

  private getPrompt(): string {
    const prompt = this._messages
      .map(([who, message]) => `${who}:${message}`)
      .join('\n');
    console.log(prompt);
    return prompt;
  }


  // private clearMessage(message: string) {
  //   return message
  //     .replace(/[\t\r\n]/gm, ' ')
  //     .replace(/[\s]+/gm, ' ');
  // }
}

