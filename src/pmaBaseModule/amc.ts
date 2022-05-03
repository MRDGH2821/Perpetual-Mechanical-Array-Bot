import { ApplicationCommandOptionTypes } from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import EnvConfig from 'lib/EnvConfig';
import { AMC_TECHS } from '../lib/TravelerTechnologies';

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

          async onAutoComplete(ctx) {
            const choices: { name: string; value: string }[] = [];
            AMC_TECHS.SKILL_TECHS.forEach((skill) => {
              const dat = {
                name: skill.name,
                value: skill.id,
              };
              choices.push(dat);
            });
            await ctx.respond({ choices });
          },

          async run(ctx) {
            const techId = ctx.options?.get('tech');
            const skillTech = AMC_TECHS.SKILL_TECHS.find((skill) => skill.id === techId?.value)
              || AMC_TECHS.SKILL_TECHS[0];
            ctx.editOrRespond({
              content: `**${skillTech.name || 'possibly undefined'}**\n\n${skillTech?.gif}`,
            });
          },
        },
      ],
    },
  ],
});
