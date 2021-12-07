import { Command } from "@ruinguard/core";

export default new Command({
  data: {
    name: "gmc",
    description: "Geo Main Character",
    options: [
      {
        type: 2,
        name: "techs",
        description: "Technologies which power GMC",
        options: [
          {
            type: 1,
            name: "rockstep",
            description: "Rock Step",
            options: [
              {
                type: 1,
                name: "default",
                description: "Rockstep using Main Character"
              },
              {
                type: 1,
                name: "noelle",
                description: "Rockstep using Noelle"
              }
            ]
          },
          {
            type: 1,
            name: "phantom_step",
            description: "Phantom step",
            options: [
              {
                type: 1,
                name: "default",
                description: "Phantom step using Main Character"
              },
              {
                type: 1,
                name: "noelle",
                description: "Phantom step using Noelle"
              },
              {
                type: 1,
                name: "diluc",
                description: "Phantom step using Diluc"
              }
            ]
          },
          {
            type: 1,
            name: "solarstep",
            description: "Solar Step"
          }
        ]
      }
    ]
  },

  async run(interaction) {
    await interaction.deferReply("Calculating");
    const option = interaction.options.getSubcommand();
    console.log(option);
    interaction.editReply(`Selected option: ${option}`);
    /*switch (interaction.options.getSubcommand()) {
      case "normal": {
        const expression = interaction.options.getString("expression");
        const result = eval(expression);
        console.log(result);
        await interaction.editReply(`${expression} = ${result}`);
      }
    }*/
  }
});
