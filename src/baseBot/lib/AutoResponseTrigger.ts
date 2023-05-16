import { pickRandom } from '@sapphire/utilities';
import type { Message } from 'discord.js';
import CoolDownManager from '../../lib/CoolDownManager';
import type { DBQuotes } from '../../typeDefs/typeDefs';
import QuotesManager from './QuotesManager';
import { parseBoolean } from './Utilities';

type TriggerCondition = {
  envName?: string;
  searchString: string | RegExp;
  customCondition?(...args: any): Promise<boolean> | boolean;
};

const defaultCDM = new CoolDownManager();
export default class AutoResponseTrigger {
  name: string;

  quotes: string[];

  conditions: TriggerCondition;

  quoteCategories: DBQuotes[];

  coolDown?: {
    time: number;
    instance: CoolDownManager;
  };

  customAction?: (sourceMessage: Message, botMessage: Message) => any;

  constructor({
    name,
    quotes,
    conditions,
    quoteCategories,
    coolDownTime = 0,
    coolDownInstance = defaultCDM,
    customAction = (sourceMessage: Message, botMessage: Message) =>
      `${sourceMessage.content}\n\n${botMessage.content}`,
  }: {
    name: string;
    quotes: string[];
    conditions: TriggerCondition;
    quoteCategories: DBQuotes[];
    coolDownTime?: number;
    coolDownInstance?: CoolDownManager;

    customAction?: (sourceMessage: Message, botMessage: Message) => any;
  }) {
    this.name = name;
    this.quotes = quotes;
    this.conditions = conditions;
    this.quoteCategories = quoteCategories;
    this.coolDown = {
      instance: coolDownInstance,
      time: coolDownTime,
    };

    this.customAction = customAction;
    this.#prepareQuotes();
  }

  #prepareQuotes() {
    const quotesDB: string[] = [`There should be a quote for \`${this.name}\` here 🤔`];
    this.quoteCategories.forEach((quoteName) => {
      quotesDB.push(...QuotesManager.getQuotes(quoteName));
    });
    this.quotes.push(...quotesDB);

    this.quotes = this.quotes.flat();
    this.refreshCoolDown();
  }

  getQuote() {
    return pickRandom(this.quotes);
  }

  hasCooledDown() {
    if (!this.coolDown) {
      return true;
    }

    const { instance } = this.coolDown;

    return instance.check(this.name) < 0;
  }

  async canAct(message: string) {
    const { envName, searchString } = this.conditions;

    const isEnvPassed = envName ? parseBoolean(process.env[envName]) : true;

    const searchRegex = new RegExp(searchString, 'gimu');
    const matches = message.match(searchRegex);
    const hasSearchPassed = matches ? matches.length > 0 : false;

    const isCooled = this.hasCooledDown();

    const hasCustomConditionPassed = this.conditions.customCondition
      ? await this.conditions.customCondition()
      : true;

    /*
    container.logger.debug({
      name: this.name,
      isEnvPassed,
      hasSearchPassed,
      isCooled,
    });
    */

    return isEnvPassed && hasSearchPassed && isCooled && hasCustomConditionPassed;
  }

  refreshCoolDown() {
    return this.coolDown?.instance.add(this.name, this.coolDown.time);
  }
}
