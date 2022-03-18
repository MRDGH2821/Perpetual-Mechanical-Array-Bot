import { Command } from "@ruinguard/core";
import { Constants } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("hall-of-fame")
    .setDescription("See the Hall of fame")
    .addSubcommand((subcommand) => subcommand
      .setName("view")
      .setDescription("View members of the Hall Of Fame")
      .addStringOption((option) => option
        .setName("category")
        .setDescription("Select the category")
        .setRequired(true)
        .addChoice("Herrscher of Wind", "anemo-crown")
        .addChoice("Jūnzhǔ of Earth", "geo-crown")
        .addChoice("Ten'nō of Thunder", "electro-crown")
        .addChoice("Arbitrator of Fate", "unaligned-crown")
        .addChoice("Abyssal Conquerors: All time", "spiral-abyss-once")
        .addChoice(
          "Abyssal Conquerors: Current Cycle",
          "current-spiral-abyss"
        )))
    .addSubcommand((subcommand) => subcommand
      .setName("setup")
      .setDescription("Setup Hall of Fame")
      .addChannelOption((option) => option
        .setName("channel")
        .setRequired(true)
        .setDescription("Select channel where leaderboard updates will come")
        .addChannelType(Constants.ChannelTypes.GUILD_TEXT)))
    .addSubcommand((subcommand) => subcommand
      .setName("refresh_cache")
      .setDescription("Refresh Hall Of Fame Cache"))
});
