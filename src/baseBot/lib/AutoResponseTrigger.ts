import { pickRandom } from '@sapphire/utilities';
import CoolDownManager from '../../lib/CoolDownManager';
import type { DBQuotes } from '../../typeDefs/typeDefs';
import QuotesManager from './QuotesManager';
import { parseBoolean } from './Utilities';

type TriggerCondition = {
  envName: string | undefined;
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

  constructor(
    name: string,
    quotes: string[],
    conditions: TriggerCondition,
    quoteCategories: DBQuotes[],
    coolDownTime = 0,
    coolDownInstance = defaultCDM,
  ) {
    this.name = name;
    this.quotes = quotes;
    this.conditions = conditions;
    this.quoteCategories = quoteCategories;
    this.coolDown = {
      instance: coolDownInstance,
      time: coolDownTime,
    };

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

  canAct(message: string) {
    const { envName, searchString } = this.conditions;

    const isEnvPassed = envName ? parseBoolean(process.env[envName]) : true;

    const searchRegex = new RegExp(searchString, 'gimu');
    const isSearchPassed = searchRegex.test(message);

    const isCooled = this.hasCooledDown();

    return isEnvPassed && isSearchPassed && isCooled;
  }

  refreshCoolDown() {
    return this.coolDown?.instance.add(this.name, this.coolDown.time);
  }
}
