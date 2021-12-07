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
      }
      /*  {
        type: 1,
        name: 'amc',
        description: 'AMC Calculator',
        options: [
          {
            type: 3,
            name:
          }
        ]
      }*/
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
      }
    }
  }
});
