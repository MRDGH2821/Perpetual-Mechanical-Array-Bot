import { ApplicationCommandOptionTypes, MessageFlags } from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { TechArgs } from '../../botTypes/interfaces';
import EnvConfig from '../../lib/EnvConfig';
import { GMC_TECHS } from '../../lib/TravelerTechnologies';

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
            const inputVal = ctx.value.toLowerCase();
            const choiceArr = GMC_TECHS.SKILL_TECHS;
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
        const selectedTech = GMC_TECHS.SKILL_TECHS.find((tech) => tech.id === techId);
        if (selectedTech !== undefined) {
          ctx.editOrRespond({
            content: `**${selectedTech.name}**\n\n${selectedTech.gif}`,
          });
        } else {
          ctx.editOrRespond({
            content: `Tech named \`${args.techs}\` does not exist`,
            flags: MessageFlags.EPHEMERAL,
          });
        }
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
            const inputVal = ctx.value.toLowerCase();
            const choiceArr = GMC_TECHS.BURST_TECHS;
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
        const selectedTech = GMC_TECHS.BURST_TECHS.find((tech) => tech.id === techId);
        if (selectedTech !== undefined) {
          ctx.editOrRespond({
            content: `**${selectedTech.name}**\n\n${selectedTech.gif}`,
          });
        } else {
          ctx.editOrRespond({
            content: `Tech named \`${args.techs}\` does not exist`,
            flags: MessageFlags.EPHEMERAL,
          });
        }
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
