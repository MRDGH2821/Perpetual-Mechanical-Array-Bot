import {
  SlashCommandBuilder,
  channelMention,
  roleMention
} from "@discordjs/builders";
import { botSpamID, commandCenterID } from "../lib/channelIDs.js";
import { ArchonsID } from "../lib/roleIDs.js";
import { Command } from "@ruinguard/core";
// eslint-disable-next-line no-unused-vars
import { CommandInteraction } from "discord.js";
import { LuminePadoru } from "../lib/emoteIDs.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("padoru")
    .setDescription("Will sing Padoru (as text)"),

  /**
   * will sing padoru as text
   * @async
   * @function run
   * @param {CommandInteraction} interaction - interaction object
   */
  async run(interaction) {
    const { channel } = interaction;
    if (channel.id === botSpamID || channel.id === commandCenterID) {
      await interaction.reply({
        content: `Merry Christmas ${interaction.user.tag}!`
      });
      await channel.send(`${roleMention(ArchonsID)} Hashire sori yo`);
      await channel.send(`${roleMention(ArchonsID)} Kazeno yuu ni`);
      await channel.send(`${roleMention(ArchonsID)} Tsukkimihara wo`);
      await channel.send(`${roleMention(ArchonsID)} PADORU PADORU`);
      await channel.send(`${LuminePadoru}${LuminePadoru}${LuminePadoru}${LuminePadoru}`);
      await channel.send({ stickers: ["912034014112649276"] });
    }
    else {
      await interaction.reply({
        content: `Please use ${channelMention(botSpamID)}`,
        ephemeral: true
      });
    }
  }
});
