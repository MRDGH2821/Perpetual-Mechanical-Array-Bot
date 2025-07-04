import { ApplyOptions } from "@sapphire/decorators";
import { Listener, type ListenerOptions } from "@sapphire/framework";
import { PMAEventHandler } from "../../baseBot/lib/Utilities.js";
import HallOfFameCache from "../lib/HallOfFameCache.js";

@ApplyOptions<ListenerOptions>({
  emitter: PMAEventHandler,
  enabled: true,
  event: "HoFRefresh",
  name: "Hall of Fame Cache Refresher",
})
export default class HoFRefresh extends Listener {
  public run() {
    process.env.HALL_OF_FAME_READY = "false";
    this.container.logger.info("Preparing Hall Of Fame Cache");
    HallOfFameCache.prepareCache()
      .then(() => {
        process.env.HALL_OF_FAME_READY = "true";
        this.container.logger.info("Hall of Fame Cache Ready!");
      })
      .catch((error) => {
        this.container.logger.error(
          "Error preparing Hall of Fame Cache:",
          error,
        );
        process.env.HALL_OF_FAME_READY = "false";
      });
  }
}
