import { Client, Event } from "@ruinguard/core";
import { db } from "../lib/firebase.cjs";

export default new Event({
  event: "hofAbyssReset",

  /**
   * @async
   * @function run
   * @param {Client} client
   * @param {Object} resetOptions
   * @param {Date} resetOptions.cycleStartDate
   */
  async run(client, { cycleStartDate }) {
    const datHook = (
        await db.collection("hall-of-fame").doc("webhook")
          .get()
      ).data(),
      webhook = client.fetchWebhook(datHook.webhookID);
  
      
  
    }
});
