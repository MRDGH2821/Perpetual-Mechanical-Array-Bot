import EnvConfig from '@pma-lib/EnvConfig';
import { AMC_TECHS } from '@pma-lib/TravelerTechnologies';
import { TechArgs } from '@pma-types/interfaces';
import { ApplicationCommandOptionTypes } from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';

export default new InteractionCommand({
  name: 'amc',
  description: 'Anemo Main Character',
  global: false,
  guildIds: [EnvConfig.guildId as string],
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
            const inputVal = ctx.value.toLowerCase();
            const choiceArr = AMC_TECHS.SKILL_TECHS;
            const values = choiceArr.filter((tech) => tech.name.toLowerCase().includes(inputVal));

            const choices = values.map((tech) => ({
              name: tech.name,
              value: tech.id,
            }));

            ctx.respond({ choices });
          },
        },
      ],
      async run(ctx, args: TechArgs) {
        const techId = args.techs;
        const selectedTech = AMC_TECHS.SKILL_TECHS.find((tech) => tech.id === techId);
        ctx.editOrRespond({
          content: `**${selectedTech?.name}**\n\n${selectedTech?.gif}`,
        });
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
            const inputVal = ctx.value.toLowerCase();
            const choiceArr = AMC_TECHS.BURST_TECHS;
            const values = choiceArr.filter((tech) => tech.name.toLowerCase().includes(inputVal));

            const choices = values.map((tech) => ({
              name: tech.name,
              value: tech.id,
            }));

            ctx.respond({ choices });
          },
        },
      ],
      async run(ctx, args: TechArgs) {
        const techId = args.techs;
        const selectedTech = AMC_TECHS.BURST_TECHS.find((tech) => tech.id === techId);
        ctx.editOrRespond({
          content: `**${selectedTech?.name}**\n\n${selectedTech?.gif}`,
        });
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
