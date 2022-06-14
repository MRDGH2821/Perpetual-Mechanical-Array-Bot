import { ApplicationCommandOptionTypes } from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { TechArgs } from '../../botTypes/interfaces';
import EnvConfig from '../../lib/EnvConfig';
import { GMC_TECHS } from '../../lib/TravelerTechnologies';
import { autoCompleteTech, respondTech } from '../../lib/Utilities';

export default new InteractionCommand({
  name: 'gmc',
  description: 'Geo Main Character',
  global: false,
  guildIds: [EnvConfig.guildId],
  options: [
    {
      name: 'starfell_sword',
      description: 'GMC Skill',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'techs',
          description: 'Technologies which power skill',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          onAutoComplete(ctx) {
            ctx.respond({
              choices: autoCompleteTech(ctx.value.toLowerCase(), GMC_TECHS.SKILL_TECHS),
            });
          },
        },
      ],
      async run(ctx, args: TechArgs) {
        ctx.editOrRespond(respondTech(args.techs!, GMC_TECHS.SKILL_TECHS));
      },
    },
    {
      name: 'wake_of_earth',
      description: 'GMC Burst',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'techs',
          description: 'Technologies which power burst',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          onAutoComplete(ctx) {
            ctx.respond({
              choices: autoCompleteTech(ctx.value.toLowerCase(), GMC_TECHS.BURST_TECHS),
            });
          },
        },
      ],
      async run(ctx, args: TechArgs) {
        ctx.editOrRespond(respondTech(args.techs!, GMC_TECHS.BURST_TECHS));
      },
    },
    {
      name: 'guide',
      description: 'Guide on GMC',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      async run(ctx) {
        await ctx.editOrRespond({
          content: 'https://keqingmains.com/geo-traveler/',
        });
      },
    },
  ],
});
