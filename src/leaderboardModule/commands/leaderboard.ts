import EnvConfig from '@pma-lib/EnvConfig';
import { ApplicationCommandOptionTypes } from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';

export default new InteractionCommand({
  name: 'leaderboard',
  description: 'Leaderboard commands',
  global: false,
  guildIds: [EnvConfig.guildId as string],
  options: [
    {
      name: 'register',
      description: 'Register score',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'contestant',
          description: 'Who made the score? (You can put user ID as well)',
          type: ApplicationCommandOptionTypes.USER,
          required: true,
        },
        {
          name: 'category',
          description: 'Damage Category',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          choices: [
            {
              name: 'Anemo: Palm Vortex',
              value: 'anemo-dmg-skill',
            },
            {
              name: 'Geo: Starfell Sword',
              value: 'geo-dmg-skill',
            },
            {
              name: 'Electro: Lightening Blade',
              value: 'electro-dmg-skill',
            },
            {
              name: 'Universal: 5th normal Atk dmg',
              value: 'uni-dmg-n5',
            },
          ],
        },
        {
          name: 'group_type',
          description: 'Type category',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          choices: [
            {
              name: 'Solo',
              value: 'solo',
            },
            {
              name: 'Open',
              value: 'open',
            },
          ],
        },
        {
          name: 'score',
          description: 'Score i.e. Damage value',
          type: ApplicationCommandOptionTypes.NUMBER,
          required: true,
        },
        {
          name: 'proof_link',
          description: 'Upload proof on traveler showcase channel & copy link to message',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
        },
      ],
      async run(ctx, args) {
        console.log('code reached');
        await ctx.editOrRespond({
          content: `${'something'}`,
        });
      },
    },
  ],
});
