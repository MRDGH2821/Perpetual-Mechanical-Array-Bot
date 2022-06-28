import {
  ApplicationCommandOptionTypes,
  MessageComponentButtonStyles,
} from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { ComponentActionRow } from 'detritus-client/lib/utils';
import { COLORS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';
import { StaffCheck } from '../../lib/Utilities';

export default new InteractionCommand({
  name: 'code',
  description: 'Genshin impact code formatter',
  global: false,
  guildIds: [EnvConfig.guildId],
  options: [
    {
      name: 'genshin_code',
      description: 'Enter the code',
      type: ApplicationCommandOptionTypes.STRING,
      required: true,
    },
    {
      name: 'rewards',
      description: 'Enter the rewards obtainable from redeeming code',
      type: ApplicationCommandOptionTypes.STRING,
      default: '_Only one way to find out_',
    },
  ],
  onBeforeRun(ctx) {
    return StaffCheck.isCtxStaff(ctx, true);
  },
  async run(ctx, args) {
    await ctx.editOrRespond({
      embed: {
        title: '**Genshin Impact Code!**',
        color: COLORS.EMBED_COLOR,
        description: `Code: [${args.genshin_code}](https://genshin.hoyoverse.com/en/gift?code=${args.genshin_code})\nRewards: ${args.rewards}`,
      },
      components: [
        new ComponentActionRow().addButton({
          label: 'Redeem code',
          style: MessageComponentButtonStyles.LINK,
          url: `https://genshin.hoyoverse.com/en/gift?code=${args.genshin_code}`,
        }),
      ],
    });
    await ctx.createMessage({
      content: args.genshin_code,
    });
  },
});
