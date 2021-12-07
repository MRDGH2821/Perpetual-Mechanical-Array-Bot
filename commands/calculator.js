import { Command } from "@ruinguard/core";

export default new Command({
  data: {
    name: "calculator",
    description: "Calculates stuff",
    options: [
      {
        type: 1,
        name: "normal",
        description: "Functions like your regular calculator",
        options: [
          {
            type: 3,
            name: "expression",
            description: "Enter expression",
            required: "true"
          }
        ]
      },
      {
        type: 1,
        name: "damage",
        description: "Damage Calculator",
        options: [
          {
            type: 4,
            name: "total_attack",
            description: "Enter total attack",
            required: true
          },
          {
            type: 10,
            name: "crit_rate",
            description: "Enter Critical Rate%",
            required: true
          },
          {
            type: 10,
            name: "crit_dmg",
            description: "Enter Critical Dmg%",
            required: true
          }
        ]
      },
      {
        type: 1,
        name: "dmg_compare",
        description: "Compare Damage",
        options: [
          {
            type: 4,
            name: "atk_1",
            description: "Enter total attack for Set 1",
            required: true
          },
          {
            type: 10,
            name: "crit_rate_1",
            description: "Enter Critical Rate% for Set 1",
            required: true
          },
          {
            type: 10,
            name: "crit_dmg_1",
            description: "Enter Critical Dmg% for Set 1",
            required: true
          },
          {
            type: 4,
            name: "atk_2",
            description: "Enter total attack for Set 2",
            required: true
          },
          {
            type: 10,
            name: "crit_rate_2",
            description: "Enter Critical Rate% for Set 2",
            required: true
          },
          {
            type: 10,
            name: "crit_dmg_2",
            description: "Enter Critical Dmg% for Set 2",
            required: true
          }
        ]
      }
      /*  {
        type: 1,
        name: "gmce",
        description: "Starfell Sword Damage Calculator",
        options: [
          {
            type: 4,
            name: "char_level",
            description: "Enter Character level",
            required: true
          },
          {
            type: 4,
            name: "talent_level",
            description: "Enter Talent level",
            required: true
          },
          {
            type: 4,
            name: "atk",
            description: "Enter total attack ",
            required: true
          },
          {
            type: 10,
            name: "crit_rate",
            description: "Enter Critical Rate%",
            required: true
          },
          {
            type: 10,
            name: "crit_dmg",
            description: "Enter Critical Dmg%",
            required: true
          },
          {
            type: 10,
            name: "geo_dmg",
            description: "Enter Geo Dmg Bonus%",
            required: true
          }
        ]
      } */
    ]
  },

  async run(interaction) {
    await interaction.deferReply("Calculating");
    console.log(interaction.options.getSubcommand());
    switch (interaction.options.getSubcommand()) {
      case "normal": {
        const expression = interaction.options.getString("expression");
        const result = eval(expression);
        console.log(result);
        await interaction.editReply(`${expression} = ${result}`);
        break;
      }
      case "damage": {
        const atk = interaction.options.getInteger("total_attack");
        const cr = interaction.options.getNumber("crit_rate");
        const cdmg = interaction.options.getNumber("crit_dmg");
        const result = atk * (1 + ((cr / 100) * cdmg) / 100);
        await interaction.editReply(
          `**Damage Calculation:**\n\n${atk} * (1 + ${cr / 100} * ${cdmg /
            100}) = ${result}`
        );
        break;
      }
      case "dmg_compare": {
        const atk1 = interaction.options.getInteger("atk_1");
        const cr1 = interaction.options.getNumber("crit_rate_1");
        const cdmg1 = interaction.options.getNumber("crit_dmg_1");
        const atk2 = interaction.options.getInteger("atk_2");
        const cr2 = interaction.options.getNumber("crit_rate_2");
        const cdmg2 = interaction.options.getNumber("crit_dmg_2");

        const result1 = atk1 * (1 + ((cr1 / 100) * cdmg1) / 100);
        const result2 = atk2 * (1 + ((cr2 / 100) * cdmg2) / 100);
        let preferred;
        if (result1 > result2) {
          preferred = "First Set preferred";
        } else if (result1 < result2) {
          preferred = "Second Set preferred";
        } else {
          preferred = "Any set should do";
        }
        await interaction.editReply(
          `**Damage Comparision:**\n\nFirst set = **${result1}**\nSecond set = **${result2}**\n\nVerdict: ${preferred}`
        );
        break;
      }
      /*  case "gmce":{
        const charlvl = interaction.options.getInteger("char_level");
        const talentlvl = interaction.options.getInteger("talent_level");
        const atk = interaction.options.getInteger("atk");
        const cr = interaction.options.getNumber("crit_rate");
        const cdmg = interaction.options.getNumber("crit_dmg");
        const gdmg = interaction.options.getNumber("geo_dmg");

      } */
    }
  }
});
