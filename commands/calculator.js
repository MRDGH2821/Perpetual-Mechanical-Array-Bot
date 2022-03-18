/* eslint-disable no-magic-numbers */
// eslint-disable-next-line no-unused-vars
import { CommandInteraction, MessageEmbed } from "discord.js";
import { abs, parse, print, round } from "mathjs";
import { Command } from "@ruinguard/core";
import { EmbedColor } from "../lib/constants.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("calculate")
    .setDescription("Calculates Stuff")
    .addSubcommand((subcommand) => subcommand
      .setName("expression")
      .setDescription("Your regular calculator")
      .addStringOption((option) => option
        .setName("expr")
        .setDescription("Enter Expression")
        .setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName("damage")
      .setDescription("Calculates damage of your character")
      .addNumberOption((option) => option
        .setName("total_attack")
        .setDescription("Enter total attack")
        .setRequired(true))
      .addNumberOption((option) => option
        .setName("crit_rate")
        .setDescription("Enter Critical Rate%")
        .setRequired(true))
      .addNumberOption((option) => option
        .setName("crit_dmg")
        .setDescription("Enter Critical Dmg%")
        .setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName("dmg_compare")
      .setDescription("Compares Damage of character equipping 2 different sets")
      .addNumberOption((option) => option
        .setName("atk_1")
        .setDescription("Enter total attack for Set 1")
        .setRequired(true))
      .addNumberOption((option) => option
        .setName("crit_rate_1")
        .setDescription("Enter Critical Rate% for Set 1")
        .setRequired(true))
      .addNumberOption((option) => option
        .setName("crit_dmg_1")
        .setDescription("Enter Critical Dmg% for Set 1")
        .setRequired(true))
      .addNumberOption((option) => option
        .setName("atk_2")
        .setDescription("Enter total attack for Set 2")
        .setRequired(true))
      .addNumberOption((option) => option
        .setName("crit_rate_2")
        .setDescription("Enter Critical Rate% for Set 2")
        .setRequired(true))
      .addNumberOption((option) => option
        .setName("crit_dmg_2")
        .setDescription("Enter Critical Dmg% for Set 2")
        .setRequired(true))),

  /**
   * calculates stuff
   * @async
   * @function run
   * @param {CommandInteraction} interaction - interaction object
   */
  async run(interaction) {
    const dmgExp = parse("atk * (1 + ( (cRate/100)*(cDmg/100) ) )"),
      dmgFormula = dmgExp.compile();
    await interaction.deferReply();
    console.log("Subcommand: ", interaction.options.getSubcommand());
    switch (interaction.options.getSubcommand()) {
    case "expression": {
      const expr = interaction.options.getString("expr"),
        result = new MessageEmbed()
          .setColor(EmbedColor)
          .setTitle("**Result**");
      if (expr.includes("\\")) {
        result.setDescription(`Please check your expression. \nDo not put back slash or unrecognisable symbols\n\nInput: \`${expr}\``);
      }
      else {
        const output = parse(expr).evaluate();
        result.setDescription(`**\`${expr}\`** = **\`${output}\`**`);
      }
      await interaction.editReply({ embeds: [result] });
      break;
    }
    case "damage": {
      const atk = interaction.options.getNumber("total_attack"),
        cDmg = interaction.options.getNumber("crit_dmg"),
        cRate = interaction.options.getNumber("crit_rate"),
        dmgOutput = dmgFormula.evaluate({
          atk,
          cDmg,
          cRate
        }),
        resultEmb = new MessageEmbed()
          .setColor(EmbedColor)
          .setTitle("**Damage Calculator**")
          .addFields([
            {
              name: "**Stats**",
              value: `Attack: \`${atk}\` \nCrit Rate: \`${cRate}%\` \nCrit Damage: \`${cDmg}%\``
            },
            {
              name: "**Result**",
              value: print("$atk * (1 + ($cr% * $cd%)) = **$res**", {
                atk,
                cd: cDmg,
                cr: cRate,
                res: round(dmgOutput, 2)
              })
            }
          ]);

      await interaction.editReply({ embeds: [resultEmb] });
      break;
    }
    case "dmg_compare": {
      const atk1 = interaction.options.getNumber("atk_1"),
        atk2 = interaction.options.getNumber("atk_2"),
        cDmg1 = interaction.options.getNumber("crit_dmg_1"),
        cDmg2 = interaction.options.getNumber("crit_dmg_2"),
        cRate1 = interaction.options.getNumber("crit_rate_1"),
        cRate2 = interaction.options.getNumber("crit_rate_2"),
        dmg1 = dmgFormula.evaluate({
          atk: atk1,
          cDmg: cDmg1,
          cRate: cRate1
        }),
        dmg2 = dmgFormula.evaluate({
          atk: atk2,
          cDmg: cDmg2,
          cRate: cRate2
        }),
        preferredCent = parse(" ( top / bot ) * 100").evaluate({
          bot: (dmg1 + dmg2) / 2,
          top: abs(dmg1 - dmg2)
        }),
        resultEmb = new MessageEmbed().setColor(EmbedColor);
      let preferred = "Any set should do";
      if (dmg1 > dmg2) {
        preferred = `First Set preferred (+${round(preferredCent, 2)}%)`;
      }
      else if (dmg1 < dmg2) {
        preferred = `Second Set preferred (+${round(preferredCent, 2)}%)`;
      }
      else {
        preferred = "Any set should do";
      }

      resultEmb.setTitle("**Damage Comparision**").addFields([
        {
          name: "**First Set**",
          value: `Attack: \`${atk1}\` \nCrit Rate: \`${cRate1}%\` \nCrit Damage: \`${cDmg1}%\` \n\nResult: ${round(
            dmg1,
            2
          )}`
        },
        {
          name: "**Second Set**",
          value: `Attack: \`${atk2}\` \nCrit Rate: \`${cRate2}%\` \nCrit Damage: \`${cDmg2}%\` \n\nResult: ${round(
            dmg2,
            2
          )}`
        },
        {
          name: "**Verdict**",
          value: preferred
        }
      ]);

      await interaction.editReply({ embeds: [resultEmb] });
    }
      // no default
    }
  }
});
