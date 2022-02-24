import { Command } from '@ruinguard/core';

export default new Command({
  data: {
    name: 'gmc',
    description: 'Geo Main Character',
    options: [
      {
        type: 1,
        name: 'starfell_sword',
        description: 'GMC skill',
        options: [
          {
            type: 3,
            name: 'techs',
            description: 'Technologies which power skill',
            required: true,
            choices: [
              {
                value: 'rockstep',
                name: 'Rock Step'
              },
              {
                value: 'rockstep_noelle',
                name: 'Rockstep using Noelle'
              },
              {
                value: 'phantom_step',
                name: 'Phantom step'
              },
              {
                value: 'phantom_step_noelle',
                name: 'Phantom step using Noelle'
              },
              {
                value: 'phantom_step_diluc',
                name: 'Phantom step using Diluc'
              },
              {
                value: 'solarstep',
                name: 'Solar Step'
              },
              {
                value: 'star_wall',
                name: 'Star Wall'
              },
              {
                value: 'aimrock',
                name: 'Aim Starfell sword'
              }
            ]
          }
        ]
      }
    ]
  },
  async run(interaction) {
    await interaction.deferReply('gmc');
    const option = interaction.options.getString('techs');
    let gif,
      name;
    switch (option) {
    case 'rockstep':
      gif = 'https://i.imgur.com/Hwqb8ng.mp4';
      name = 'Rock step';
      break;
    case 'rockstep_noelle':
      gif = 'https://i.imgur.com/mtTFyzo.mp4';
      name = 'Rockstep using Noelle';
      break;
    case 'phantom_step':
      gif = 'https://i.imgur.com/R1l9a1e.mp4';
      name = 'Phantom step';
      break;
    case 'phantom_step_noelle':
      gif = 'https://i.imgur.com/kUzqUF1.mp4';
      name = 'Phantom step using Noelle';
      break;
    case 'phantom_step_diluc':
      gif = 'https://i.imgur.com/1cbBwCr.mp4';
      name = 'Phantom step using Diluc';
      break;
    case 'solarstep':
      gif = 'https://i.imgur.com/6zhpNF3.mp4';
      name = 'Solar Step';
      break;
    case 'star_wall':
      gif = 'https://i.imgur.com/bF1lrtI.mp4';
      name = 'Star Wall';
      break;
    case 'aimrock':
      gif = 'https://i.imgur.com/1xn1Cd9.mp4';
      name = 'Aim Starfell sword';
      break;
    }
    await interaction.editReply({ content: `**${name}**\n\n${gif}` });
  }
});
