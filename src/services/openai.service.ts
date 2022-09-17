import { Configuration, OpenAIApi } from 'openai';
import Logger from './log.service';

export class OpenAIService {

  _bot: OpenAIApi;
  _messages: string[] = [];
  _max_messages: number = 100;

  constructor({ openAIkey }: { openAIkey: string }) {
    this._bot = new OpenAIApi(new Configuration({ apiKey: openAIkey }));
    Logger.info('OpenAI Service initialized');
  }

  public async reply(inputMessage: string): Promise<string> {

    this.addMessage(inputMessage);

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

    this.addMessage(outputMessage);

    return this.clearMessage(outputMessage);
  }

  private clearMessage(message: string) {
    return message
      .replace(/[\t\r\n]/gm, ' ')
      .replace(/[\s]+/gm, ' ');
  }

  private addMessage(message: string) {

    if (this._messages.length > this._max_messages)
      this._messages.shift();

    this._messages.push(this.clearMessage(message));
  }

  private getPrompt() {
    return this._messages.join('\n');
  }
}

