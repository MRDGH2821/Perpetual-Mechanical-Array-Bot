import { ApplicationCommandOptionTypes } from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { TechArgs } from '../../botTypes/interfaces';
import EnvConfig from '../../lib/EnvConfig';
import { EMC_TECHS } from '../../lib/TravelerTechnologies';

export default new InteractionCommand({
  name: 'emc',
  description: 'Electro Main Character',
  global: false,
  guildIds: [EnvConfig.guildId as string],
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
            const inputVal = ctx.value.toLowerCase();
            const choiceArr = EMC_TECHS.BURST_TECHS;
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
        const selectedTech = EMC_TECHS.BURST_TECHS.find((tech) => tech.id === techId);
        ctx.editOrRespond({
          content: `**${selectedTech?.name}**\n\n${selectedTech?.gif}`,
        });
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
