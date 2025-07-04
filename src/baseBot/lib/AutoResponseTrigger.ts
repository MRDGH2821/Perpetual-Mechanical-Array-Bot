import { container } from "@sapphire/framework";
import { pickRandom } from "@sapphire/utilities";
import type { Message, MessageMentionOptions } from "discord.js";
import CoolDownManager from "../../lib/CoolDownManager.js";
import type { DBQuotes } from "../../typeDefs/typeDefs.js";
import QuotesManager from "./QuotesManager.js";
import { parseBoolean } from "./Utilities.js";

type TriggerCondition = {
  envName?: string;
  searchString: RegExp | string;
}
type ConditionFunction =
  | ((...args: unknown[]) => Promise<boolean>)
  | ((message: Message) => Promise<boolean>);

const defaultCDM = new CoolDownManager();
export default class AutoResponseTrigger {
  name: string;

  quotes: string[];

  conditions: TriggerCondition;

  quoteCategories: DBQuotes[];

  coolDown?: {
    instance: CoolDownManager;
    time: number;
  };

  conditionFn?: (sourceMessage: Message) => Promise<boolean>;

  async customCondition() {
    if (this.conditionFn) {
      if (!this.sourceMessage) {
        throw new Error("No source message set");
      }

      return this.conditionFn(this.sourceMessage);
    }

    return true;
  }

  actionFn?: (botMessage: Message, sourceMessage: Message) => Promise<unknown>;

  async customAction() {
    if (this.actionFn) {
      if (!this.botMessage) {
        throw new Error("No bot message set");
      }

      if (!this.sourceMessage) {
        throw new Error("No source message set");
      }

      return this.actionFn(this.botMessage, this.sourceMessage);
    }

    
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
    allowedMentions?: MessageMentionOptions;
    conditions: TriggerCondition;
    coolDownInstance?: CoolDownManager;
    coolDownTime?: number;
    name: string;
    quoteCategories: DBQuotes[];
    quotes: string[];
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

  setCustomCondition(conditionFn: ConditionFunction) {
    this.conditionFn = conditionFn;
    return this;
  }

  setCustomAction(
    actionFn: (botMessage: Message, sourceMessage: Message) => Promise<unknown>,
  ) {
    this.actionFn = actionFn;
    return this;
  }

  #prepareQuotes() {
    const quotesDB: string[] = [
      `There should be a quote for \`${this.name}\` here 🤔`,
    ];
    for (const quoteName of this.quoteCategories) {
      quotesDB.push(...QuotesManager.getQuotes(quoteName));
    }

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

  async canAct(text?: string) {
    if (!this.sourceMessage) {
      throw new Error("No source message set");
    }

    const content = text || this.sourceMessage.content;
    const { envName, searchString } = this.conditions;

    const isEnvPassed = envName ? parseBoolean(process.env[envName]) : true;

    const searchRegex = new RegExp(searchString, "gimu");
    const matches = content.match(searchRegex);
    const hasSearchPassed = matches ? matches.length > 0 : false;

    const isCooled = this.hasCooledDown();

    const hasCustomConditionPassed = await this.customCondition();
    /*
    if (this.sourceMessage?.author.username === 'MRDGH2821') {
      container.logger.debug({
        name: this.name,
        isEnvPassed,
        hasSearchPassed,
        isCooled,
        hasCustomConditionPassed,
      });
    }
    */

    return (
      isEnvPassed && hasSearchPassed && isCooled && hasCustomConditionPassed
    );
  }

  refreshCoolDown() {
    return this.coolDown?.instance.add(this.name, this.coolDown.time);
  }

  async log(context?: string) {
    if (this.sourceMessage?.author.username === "MRDGH2821") {
      container.logger.debug({
        name: this.name,
        context,
        canAct: await this.canAct().catch(() => false),
        customCondition: await this.customCondition().catch(() => false),
        sourceMsgID: this.sourceMessage?.id,
        botMsgID: this.botMessage?.id,
        sourceContent: this.sourceMessage?.content,
        hasCooledDown: this.hasCooledDown(),
        coolDownTime: this.coolDown?.instance.check(this.name),
      });
    }
  }
}
