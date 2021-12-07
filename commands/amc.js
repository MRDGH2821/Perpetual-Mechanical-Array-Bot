import { Command } from "@ruinguard/core";

export default new Command({
  data: {
    name: "amc",
    description: "Anemo Main Character",
    options: [
      {
        type: 1,
        name: "gust_surge",
        description: "AMC Burst",
        options: [
          {
            type: 3,
            name: "techs",
            description: "Technologies which power burst",
            choices: [
              {
                value: "cyronadoguoba",
                name: "Cyronado: Guoba"
              },
              {
                value: "cyronadobaron",
                name: "Cyronado: Baron Bunny"
              }
            ]
          }
        ]
      }
    ]
  },
  async run(interaction) {
    await interaction.deferReply("gmc");
    const option = interaction.options.getString("techs");
    let gif;
    let name;
    switch (option) {
      case "cyronadoguoba":
        gif = "https://i.imgur.com/v2OWCkz.mp4";
        name = "Rock step";
        break;
      case "cyronadobaron":
        gif = "https://i.imgur.com/sjEmHjY.mp4";
        name = "Rockstep using Noelle";
        break;
    }
    await interaction.editReply({ content: `**${name}**\n\n${gif}` });
  }
});
