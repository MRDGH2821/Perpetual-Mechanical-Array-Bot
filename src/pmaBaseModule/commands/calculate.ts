import { GatewayRawEvents } from 'detritus-client';
import { ApplicationCommandOptionTypes } from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { parse, print, round } from 'mathjs';
import { COLORS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';

const dmgExp = parse('atk * (1 + ( (cRate/100)*(cDmg/100) ) )');
const dmgFormula = dmgExp.compile();
export default new InteractionCommand({
  name: 'calc',
  description: 'Calculates stuff',
  global: false,
  guildIds: [EnvConfig.guildId as string],
  options: [
    {
      name: 'expression',
      description: 'Your regular Calculator',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'expr',
          description: 'Enter expression',
          required: true,
          type: ApplicationCommandOptionTypes.STRING,
        },
      ],
      async run(ctx, args) {
        const resultEmb: GatewayRawEvents.RawMessageEmbed = {
          title: '**Result**',
          color: COLORS.EMBED_COLOR,
        };

        const { expr } = args;

        if (expr.includes('\\')) {
          resultEmb.description = `Please check your expression. \nDo not put back slash or unrecognisable symbols\n\nInput: \`${expr}\``;
        } else {
          const output = parse(expr).evaluate();
          resultEmb.description = `**\`${expr}\`** = **\`${output}\`**`;
        }

        ctx.editOrRespond({ embeds: [resultEmb] });
      },
    },
    {
      name: 'damage',
      description: 'Calculates damage of your character',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'total_attack',
          description: 'Enter total attack',
          type: ApplicationCommandOptionTypes.NUMBER,
          required: true,
        },
        {
          name: 'crit_rate',
          description: 'Enter Critical Rate%',
          type: ApplicationCommandOptionTypes.NUMBER,
          required: true,
        },
        {
          name: 'crit_dmg',
          description: 'Enter Critical Dmg%',
          type: ApplicationCommandOptionTypes.NUMBER,
          required: true,
        },
      ],
      async run(ctx, args) {
        const atk = args.total_attack;
        const cDmg = args.crit_dmg;
        const cRate = args.crit_rate;
        const dmgOutput = dmgFormula.evaluate({
          atk,
          cDmg,
          cRate,
        });
        const result = print('$atk * (1 + ($cr% * $cd%)) = **$res**', {
          atk,
          cd: cDmg,
          cr: cRate,
          res: round(dmgOutput, 2),
        });
        const resultEmb: GatewayRawEvents.RawMessageEmbed = {
          title: '**Damage Calculator**',
          color: COLORS.EMBED_COLOR,
          fields: [
            {
              name: '**Stats**',
              value: `Attack: \`${atk}\` \nCrit Rate: \`${cRate}%\` \nCrit Damage: \`${cDmg}%\``,
            },
            {
              name: '**Result**',
              value: result as unknown as string,
            },
          ],
        };

        await ctx.editOrRespond({
          embeds: [resultEmb],
        });
      },
    },
  ],
});
