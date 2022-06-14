import { ApplicationCommandOptionTypes } from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { TechArgs } from '../../botTypes/interfaces';
import EnvConfig from '../../lib/EnvConfig';
import { EMC_TECHS } from '../../lib/TravelerTechnologies';
import { autoCompleteTech, respondTech } from '../../lib/Utilities';

export default new InteractionCommand({
  name: 'emc',
  description: 'Electro Main Character',
  global: false,
  guildIds: [EnvConfig.guildId],
  options: [
    {
      name: 'bellowing_thunder',
      description: 'EMC Burst',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'techs',
          description: 'Technologies which power burst',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          onAutoComplete(ctx) {
            ctx.respond({
              choices: autoCompleteTech(ctx.value.toLowerCase(), EMC_TECHS.BURST_TECHS),
            });
          },
        },
      ],
      async run(ctx, args: TechArgs) {
        ctx.editOrRespond(respondTech(args.techs!, EMC_TECHS.BURST_TECHS));
      },
    },
    {
      name: 'guide',
      description: 'Guide on EMC',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      async run(ctx) {
        await ctx.editOrRespond({
          content: 'https://keqingmains.com/electro-traveler/',
        });
      },
    },
  ],
});
