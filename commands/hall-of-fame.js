// eslint-disable-next-line no-unused-vars
import { CommandInteraction, Constants } from "discord.js";
import CheckRolePerms from "../lib/staff-roles.js";
import { Command } from "@ruinguard/core";
import { SlashCommandBuilder } from "@discordjs/builders";
import { hof_view } from "../subcommands/hall-of-fame_view.js";

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
      .setDescription("Refresh Hall Of Fame Cache")),

  /**
   * hall of fame main command
   * @async
   * @function
   * @param {CommandInteraction} interaction
   */
  async run(interaction) {
    switch (interaction.options.getSubcommand()) {
    case "view": {
      console.log("view subcommand selected");
      await hof_view(interaction);
      break;
    }

    case "setup": {
      console.log("setup subcommand selected");
      const hofChannel = interaction.options.getChannel("channel"),
        isMod = new CheckRolePerms(interaction.member);
      if (isMod.isStaff(interaction.member)) {
        await interaction.reply({
          content: `Selected Channel: ${hofChannel} `,
          ephemeral: true
        });
        interaction.client.emit("hofChannelUpdate", hofChannel);
      }
      else {
        await interaction.reply({
          content: "Only mods can change Hall Of fame channel",
          ephemeral: true
        });
      }
      break;
    }

    case "refresh_cache": {
      console.log("refresh subcommand selected");
      const isMod = new CheckRolePerms(interaction.member);

      if (isMod.isStaff(interaction.member)) {
        await interaction.reply({
          content:
              "Refresh initiated, please wait for some time before viewing hall of fame",
          ephemeral: true
        });
        interaction.client.emit("hofRefresh", interaction.client);
      }
      else {
        await interaction.reply({
          content:
              "Only mods can force a refresh, since it is a time consuming operation",
          ephemeral: true
        });
      }
      break;
    }
      // no default
    }
  }
});
