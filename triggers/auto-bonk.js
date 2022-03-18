import { CooldownManager, Event, MessageEmbed } from "@ruinguard/core";
import Bonk from "../lib/bonk-utilities.js";
import { EmbedColor } from "../lib/constants.js";
// eslint-disable-next-line no-unused-vars
import { Message } from "discord.js";
const fiveMins = 300000,
  icd = new CooldownManager();

// eslint-disable-next-line no-magic-numbers
icd.add("bonkCD", 0);

export default new Event({
  event: "messageCreate",

  /**
   * message create event
   * @async
   * @function run
   * @param {Message} message - message object
   */
  async run(message) {
    const bonk = new Bonk(message.content);

    if (bonk.isHorny(message.content)) {
      const embedReply = new MessageEmbed()
          .setColor(EmbedColor)
          .setTitle("**Bonked!**")
          .setDescription(bonk.bonkHornyReason())
          .setImage(bonk.hornyBonkGif()),
        timeLeft = await icd.check("bonkCD");
      console.log("ICD: ", timeLeft);
      // eslint-disable-next-line no-magic-numbers
      if (timeLeft < 1 || timeLeft === false) {
        await message
          .reply({
            embeds: [embedReply]
          })
          .catch(console.error);
        await icd.add("bonkCD", fiveMins);
      }
      else {
        console.log("Reached else part, Bonk CD: ", await icd.check("bonkCD"));
      }
    }
  }
});
