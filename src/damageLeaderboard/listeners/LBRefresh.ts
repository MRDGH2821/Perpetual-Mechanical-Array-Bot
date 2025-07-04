import { ApplyOptions } from "@sapphire/decorators";
import { Listener, type ListenerOptions } from "@sapphire/framework";
import { PMAEventHandler } from "../../baseBot/lib/Utilities.js";
import LeaderboardCache from "../lib/LeaderboardCache.js";

@ApplyOptions<ListenerOptions>({
  emitter: PMAEventHandler,
  enabled: true,
  event: "LBRefresh",
  name: "Leaderboard Cache Refresher",
})
export default class LBRefresh extends Listener {
  public run() {
    process.env.LEADERBOARD_READY = "false";
    this.container.logger.info("Preparing Leaderboard Cache");
    LeaderboardCache.prepareCache()
      .then(() => {
        process.env.LEADERBOARD_READY = "true";
        this.container.logger.info("Leaderboard Cache Ready!");
      })
      .catch((error) => {
        this.container.logger.error(
          "Error preparing Leaderboard Cache:",
          error,
        );
        process.env.LEADERBOARD_READY = "false";
      });
  }
}
