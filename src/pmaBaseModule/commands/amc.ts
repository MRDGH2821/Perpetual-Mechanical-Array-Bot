import { ApplicationCommandOptionTypes } from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { TechArgs } from '../../botTypes/interfaces';
import EnvConfig from '../../lib/EnvConfig';
import { AMC_TECHS } from '../../lib/TravelerTechnologies';
import { autoCompleteTech, respondTech } from '../../lib/Utilities';

export default new InteractionCommand({
  name: 'amc',
  description: 'Anemo Main Character',
  global: false,
  guildIds: [EnvConfig.guildId],
  options: [
    {
      name: 'palm_vortex',
      description: 'AMC Skill',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'techs',
          description: 'Technologies which power skill',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          onAutoComplete(ctx) {
            ctx.respond({
              choices: autoCompleteTech(ctx.value.toLowerCase(), AMC_TECHS.SKILL_TECHS),
            });
          },
        },
      ],
      async run(ctx, args: TechArgs) {
        ctx.editOrRespond(respondTech(args.techs!, AMC_TECHS.SKILL_TECHS));
      },
    },
    {
      name: 'gust_surge',
      description: 'AMC Burst',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'techs',
          description: 'Technologies which power burst',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          onAutoComplete(ctx) {
            ctx.respond({
              choices: autoCompleteTech(ctx.value.toLowerCase(), AMC_TECHS.BURST_TECHS),
            });
          },
        },
      ],
      async run(ctx, args: TechArgs) {
        ctx.editOrRespond(respondTech(args.techs!, AMC_TECHS.BURST_TECHS));
      },
    },
    {
      name: 'guide',
      description: 'Guide on AMC',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      async run(ctx) {
        await ctx.editOrRespond({
          content: 'https://keqingmains.com/anemo-traveler/',
        });
      },
    },
  ],
});
