import { pickRandom } from '@sapphire/utilities';
import type { Message, MessageMentionOptions } from 'discord.js';
import CoolDownManager from '../../lib/CoolDownManager';
import type { DBQuotes } from '../../typeDefs/typeDefs';
import QuotesManager from './QuotesManager';
import { parseBoolean } from './Utilities';

type TriggerCondition = {
  envName?: string;
  searchString: string | RegExp;
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

  conditionFn?: (sourceMessage: Message) => Promise<boolean>;

  async customCondition() {
    if (this.conditionFn) {
      if (!this.sourceMessage) {
        throw new Error('No source message set');
      }
      return this.conditionFn(this.sourceMessage);
    }
    return Promise.resolve(true);
  }

  actionFn?: (botMessage: Message, sourceMessage: Message) => Promise<any>;

  async customAction() {
    if (this.actionFn) {
      if (!this.botMessage) {
        throw new Error('No bot message set');
      }
      if (!this.sourceMessage) {
        throw new Error('No source message set');
      }
      return this.actionFn(this.botMessage, this.sourceMessage);
    }
    return Promise.resolve();
  }

  allowedMentions: MessageMentionOptions = {
    roles: [],
    users: [],
    repliedUser: false,
  };

  botMessage?: Message;

  sourceMessage?: Message;

  constructor({
    name,
    quotes,
    conditions,
    quoteCategories,
    coolDownTime = 0,
    coolDownInstance = defaultCDM,
    allowedMentions = {
      roles: [],
      users: [],
      repliedUser: false,
    },
  }: {
    name: string;
    quotes: string[];
    conditions: TriggerCondition;
    quoteCategories: DBQuotes[];
    coolDownTime?: number;
    coolDownInstance?: CoolDownManager;
    allowedMentions?: MessageMentionOptions;
  }) {
    this.name = name;
    this.quotes = quotes;
    this.conditions = conditions;
    this.quoteCategories = quoteCategories;
    this.coolDown = {
      instance: coolDownInstance,
      time: coolDownTime,
    };
    this.#prepareQuotes();
    this.allowedMentions = allowedMentions;
  }

  setBotMessage(botMessage: Message) {
    this.botMessage = botMessage;
    return this;
  }

  setSourceMessage(sourceMessage: Message) {
    this.sourceMessage = sourceMessage;
    return this;
  }

  setCustomCondition(conditionFn: (...args: any) => Promise<boolean>) {
    this.conditionFn = conditionFn;
    return this;
  }

  setCustomAction(actionFn: (botMessage: Message, sourceMessage: Message) => Promise<any>) {
    this.actionFn = actionFn;
    return this;
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

    const hasCustomConditionPassed = await this.customCondition();

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
