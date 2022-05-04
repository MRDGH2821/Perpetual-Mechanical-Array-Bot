import { GatewayRawEvents } from 'detritus-client';
import { ApplicationCommandOptionTypes } from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import {
  abs, parse, print, round,
} from 'mathjs';
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
    {
      name: 'damage',
      description: 'Calculates damage of your character',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'atk_1',
          description: 'Enter total attack for Set 1',
          type: ApplicationCommandOptionTypes.NUMBER,
          required: true,
        },
        {
          name: 'crit_rate_1',
          description: 'Enter Critical Rate% for Set 1',
          type: ApplicationCommandOptionTypes.NUMBER,
          required: true,
        },
        {
          name: 'crit_dmg_1',
          description: 'Enter Critical Dmg% for Set 1',
          type: ApplicationCommandOptionTypes.NUMBER,
          required: true,
        },
        {
          name: 'atk_2',
          description: 'Enter total attack for Set 2',
          type: ApplicationCommandOptionTypes.NUMBER,
          required: true,
        },
        {
          name: 'crit_rate_2',
          description: 'Enter Critical Rate% for Set 2',
          type: ApplicationCommandOptionTypes.NUMBER,
          required: true,
        },
        {
          name: 'crit_dmg_2',
          description: 'Enter Critical Dmg% for Set 2',
          type: ApplicationCommandOptionTypes.NUMBER,
          required: true,
        },
      ],
      async run(ctx, args) {
        const atk1 = args.atk_1;
        const atk2 = args.atk_2;
        const cDmg1 = args.crit_dmg_1;
        const cDmg2 = args.crit_dmg_2;
        const cRate1 = args.crit_rate_1;
        const cRate2 = args.crit_rate_2;

        const dmg1 = dmgFormula.evaluate({
          atk: atk1,
          cDmg: cDmg1,
          cRate: cRate1,
        });

        const dmg2 = dmgFormula.evaluate({
          atk: atk2,
          cDmg: cDmg2,
          cRate: cRate2,
        });

        const preferredCent = parse(' ( top / bot ) * 100').evaluate({
          bot: (dmg1 + dmg2) / 2,
          top: abs(dmg1 - dmg2),
        });

        let preferred = 'Any set should do';
        if (dmg1 > dmg2) {
          preferred = `First Set preferred (+${round(preferredCent, 2)}%)`;
        } else if (dmg1 < dmg2) {
          preferred = `Second Set preferred (+${round(preferredCent, 2)}%)`;
        } else {
          preferred = 'Any set should do';
        }

        const resultEmb: GatewayRawEvents.RawMessageEmbed = {
          title: '**Damage Comparision**',
          color: COLORS.EMBED_COLOR,
          fields: [
            {
              name: '**First Set**',
              value: `Attack: \`${atk1}\` \nCrit Rate: \`${cRate1}%\` \nCrit Damage: \`${cDmg1}%\` \n\nResult: ${round(
                dmg1,
                2,
              )}`,
              inline: true,
            },
            {
              name: '**Second Set**',
              value: `Attack: \`${atk2}\` \nCrit Rate: \`${cRate2}%\` \nCrit Damage: \`${cDmg2}%\` \n\nResult: ${round(
                dmg2,
                2,
              )}`,
            },
            {
              name: '**Verdict**',
              value: preferred,
            },
          ],
        };

        await ctx.editOrRespond({ embeds: [resultEmb] });
      },
    },
  ],
});
