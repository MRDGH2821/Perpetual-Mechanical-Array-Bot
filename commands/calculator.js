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
        await interaction.editReply(`\`${expression}\` = ${result}`);
        break;
      }
      case "damage": {
        const atk = interaction.options.getInteger("total_attack");
        const cr = interaction.options.getNumber("crit_rate");
        const cdmg = interaction.options.getNumber("crit_dmg");
        const result = atk * (1 + ((cr / 100) * cdmg) / 100);
        await interaction.editReply({
          embeds: [
            {
              title: "Damage Calculation",
              description: `This command allows you to calculate an estimated "damage" that you can achieve from three stats: Attack, Crit Rate and Crit Damage. \nIdeally, you would want a damage value above 4000 for main dps units, and well-invested units tend to reach 5000+ above damage values.`,
              fields: [
                {
                  name: "**Stats**",
                  value: `Attack: \`${atk}\` \nCrit Rate: \`${cr}%\` \nCrit Damage: \`${cdmg}\``
                },
                {
                  name: "**Result**",
                  value: `${atk} * (1 + ${cr / 100} * ${cdmg /
                    100}) = ${Math.round(result * 100) / 100}`
                }
              ]
            }
          ]
        });
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
        await interaction.editReply({
          embeds: [
            {
              title: `**Damage Comparision**`,
              description: `This command allows you to compare two sets based only on three factors, namely Attack, Crit Rate and Crit Damage. \nThis serves as a simple way to compare sets, but is not the only way to evaluate which set is better since other variables (such as external bonuses or buffs) can exist. \nIdeally, you would want a damage value above 4000 for main dps units, and well-invested units tend to reach 5000+ damage values.`,
              fields: [
                {
                  name: "**First Set**",
                  value: `Attack: \`${atk1}\` \nCrit Rate: \`${cr1}%\` \nCrit Damage: \`${cdmg1}%\` \n\nResult: \`${Math.round(
                    result1 * 100
                  ) / 100}\``
                },
                {
                  name: "**Second Set**",
                  value: `Attack: \`${atk2}\` \nCrit Rate: \`${cr2}%\` \nCrit Damage: \`${cdmg2}%\` \n\nResult: \`${Math.round(
                    result2 * 100
                  ) / 100}\``
                },
                {
                  name: "**Verdict**",
                  value: preferred
                }
              ]
            }
          ]
        });
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
