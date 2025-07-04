import { ApplyOptions } from "@sapphire/decorators";
import { Listener, type ListenerOptions } from "@sapphire/framework";
import { QUOTE_CATEGORIES } from "../../lib/DynamicConstants.js";
import QuotesManager from "../lib/QuotesManager.js";
import { PMAEventHandler } from "../lib/Utilities.js";

@ApplyOptions<ListenerOptions>({
  name: "RefreshQuotes",
  emitter: PMAEventHandler,
  event: "RefreshQuotes",
  enabled: true,
})
export default class RefreshQuotesEvent extends Listener {
  public async run() {
    const { logger } = this.container;
    const promises: Promise<void>[] = [];
    logger.info("Refreshing quotes");
    for (const category of QUOTE_CATEGORIES) {
      const promise = QuotesManager.prepareCache(category)
        .then(() => logger.debug(`Quotes refreshed from ${category}`))
        .catch((error) => logger.error(error));
      promises.push(promise);
    }

    await Promise.all(promises)
      .then(() => logger.info("Quotes refresh done"))
      .catch((error) => logger.error(error));
  }
}
