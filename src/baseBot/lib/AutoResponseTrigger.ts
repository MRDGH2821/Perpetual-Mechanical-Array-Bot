import { pickRandom } from '@sapphire/utilities';
import CoolDownManager from '../../lib/CoolDownManager';
import type { DBQuotes } from '../../typeDefs/typeDefs';
import QuotesManager from './QuotesManager';
import { parseBoolean } from './Utilities';

export default class AutoResponseTrigger {
  name: string;

  quotes: string[];

  conditions: {
    envName: string | undefined;
    searchString: string;
  };

  quoteNames: DBQuotes[];

  coolDown?: {
    time: number;
    instance: CoolDownManager;
  };

  constructor(
    name: string,
    quotes: string[],
    conditions: any,
    quoteNames: DBQuotes[],
    coolDownTime = 0,
    coolDownInstance = new CoolDownManager(),
  ) {
    this.name = name;
    this.quotes = quotes;
    this.conditions = conditions;
    this.quoteNames = quoteNames;
    this.coolDown = {
      instance: coolDownInstance,
      time: coolDownTime,
    };

    this.#prepareQuotes();
  }

  #prepareQuotes() {
    const quotesDB: string[] = [];
    this.quoteNames.forEach((quoteName) => {
      quotesDB.push(...QuotesManager.getQuotes(quoteName));
    });
    this.quotes.push(...quotesDB);

    this.quotes = this.quotes.flat();
  }

  getQuote() {
    return pickRandom(this.quotes);
  }

  isCooledDown() {
    if (!this.coolDown) {
      return true;
    }

    const { instance } = this.coolDown;

    return instance.check(this.name) < 0;
  }

  canAct(message: string) {
    const { envName, searchString } = this.conditions;

    const isEnvPassed = envName ? parseBoolean(process.env[envName]) : true;

    const isSearchPassed = message.includes(searchString);

    return isEnvPassed && isSearchPassed && this.isCooledDown();
  }
}
