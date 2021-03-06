import {
  AbyssalConquerorID,
  AnemoCrownID,
  ElectroCrownID,
  GeoCrownID,
  InazumaReputationID,
  LiyueReputationID,
  MondstadtReputationID,
  NonEleCrownID,
  WhaleID
} from "../lib/roleIDs.js";
import { Command } from "@ruinguard/core";
// eslint-disable-next-line no-unused-vars
import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { giveRoleMulti } from "../subcommands/give-role_multi.js";
import { giveRoleOne } from "../subcommands/give-role_one.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("give-role")
    .setDescription("Gives role to a selected user!")
    .addSubcommand((subcommand) => subcommand
      .setName("multi")
      .setDescription("Give multiple roles")
      .addUserOption((option) => option.setName("user").setDescription("Select user")
        .setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName("one")
      .setDescription("Gives role to a selected user!")
      .addUserOption((option) => option.setName("user").setDescription("Select user")
        .setRequired(true))
      .addStringOption((option) => option
        .setName("role")
        .setDescription("Give one role")
        .setRequired(true)
        .addChoice("Abyssal Conqueror π", AbyssalConquerorID)
        .addChoice("Ten'nΕ of Thunder πβοΈ", ElectroCrownID)
        .addChoice("JΕ«nzhΗ of Earth ππ", GeoCrownID)
        .addChoice("Herrscher of Wind ππ¬οΈ", AnemoCrownID)
        .addChoice("Illustrious in Inazuma πΆβοΈ", InazumaReputationID)
        .addChoice("Legend in Liyue πΆπ", LiyueReputationID)
        .addChoice("Megastar in Mondstadt πΆπ¬οΈ", MondstadtReputationID)
        .addChoice("Affluent Adventurer π°", WhaleID)
        .addChoice("Arbitrator of Fate π", NonEleCrownID))),

  /**
   * gives role to selected user
   * @async
   * @function run
   * @param {CommandInteraction} interaction - interaction object
   */
  async run(interaction) {
    switch (interaction.options.getSubcommand()) {
    case "multi": {
      await giveRoleMulti(interaction);
      break;
    }
    case "one": {
      await giveRoleOne(interaction);
      break;
    }
      // no default
    }
  }
});
