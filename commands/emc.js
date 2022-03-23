import { Command } from "@ruinguard/core";
// eslint-disable-next-line no-unused-vars
import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("emc")
    .setDescription("Electro Main Character")
    .addSubcommand((subcommand) => subcommand.setName("guide").setDescription("Guide on EMC")),

  /**
   * shows emc tech & guide
   * @async
   * @function run
   * @param {CommandInteraction} interaction
   */
  async run(interaction) {
    switch (interaction.options.getSubcommand()) {
    case "guide": {
      await interaction.reply("https://keqingmains.com/electro-traveler/");
    }
      // no default
    }
  }
});
