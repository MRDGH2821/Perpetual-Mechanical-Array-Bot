import { Command } from "@ruinguard/core";
// eslint-disable-next-line no-unused-vars
import { CommandInteraction } from "discord.js";
import { GMCTechs } from "../lib/TravelerTechnologies.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("gmc")
    .setDescription("Geo Main Character")
    .addSubcommand((subcommand) => subcommand
      .setName("starfell_sword")
      .setDescription("GMC Skill")
      .addStringOption((option) => option
        .setName("techs")
        .setDescription("Technologies which power skill")
        .setRequired(true)
        .setAutocomplete(true)))
    .addSubcommand((subcommand) => subcommand
      .setName("wake_of_earth")
      .setDescription("GMC Burst")
      .addStringOption((option) => option
        .setName("techs")
        .setDescription("Technologies which power burst")
        .setRequired(true)
        .setAutocomplete(true)))
    .addSubcommand((subcommand) => subcommand.setName("guide").setDescription("Guide on GMC")),

  /**
   * displays GMC techs & guide
   * @async
   * @function run
   * @param {CommandInteraction} interaction - interaction object
   */
  async run(interaction) {
    switch (interaction.options.getSubcommand()) {
    case "starfell_sword": {
      const selectedID = interaction.options.getString("techs"),
        skill = GMCTechs.skillTechs.find((tech) => tech.id === selectedID);
      console.log(selectedID);
      await interaction.reply({
        content: `**${skill.name}**\n\n${skill.gif}`
      });
      break;
    }
    case "wake_of_earth": {
      const selectedID = interaction.options.getString("techs"),
        skill = GMCTechs.burstTechs.find((tech) => tech.id === selectedID);
      console.log(selectedID);
      await interaction.reply({
        content: `**${skill.name}**\n\n${skill.gif}`
      });
      break;
    }

    case "guide": {
      await interaction.reply({
        content: "https://keqingmains.com/gmc"
      });
    }

      // no default
    }
  }
});
