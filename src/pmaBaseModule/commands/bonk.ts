import { RequestTypes } from 'detritus-client-rest';
import { ApplicationCommandOptionTypes } from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import BonkUtilities from '../../lib/BonkUtilities';
import { COLORS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';

export default new InteractionCommand({
  name: 'bonk',
  description: 'Select a member to bonk them',
  global: false,
  guildIds: [EnvConfig.guildId as string],
  options: [
    {
      name: 'target',
      description: 'The member to bonk',
      required: true,
      type: ApplicationCommandOptionTypes.USER,
    },
    {
      name: 'reason',
      description: 'Reason to bonk',
      type: ApplicationCommandOptionTypes.STRING,
      default: 'none',
    },
    {
      name: 'is_horny',
      description: 'Is the target horny?',
      type: ApplicationCommandOptionTypes.BOOLEAN,
      default: false,
    },
    {
      name: 'ping_target',
      description: 'Ping Target?',
      type: ApplicationCommandOptionTypes.BOOLEAN,
      default: false,
    },
  ],
  async run(ctx, args) {
    const isHorny = args.is_horny;
    const bonk = new BonkUtilities();
    const { target } = args;
    let { reason } = args;
    const isSelf = ctx.user === target;

    const embedMsg: RequestTypes.CreateChannelMessageEmbed = {
      title: '**Bonked!**',
      color: COLORS.EMBED_COLOR,
      thumbnail: {
        url: target.avatarUrl,
      },
      image: {
        url: '',
      },
    };

    if (reason === 'none') {
      if (isHorny) {
        reason = bonk.bonkHornyReason();
      } else {
        reason = bonk.bonkReason();
      }
    }

    if (isHorny || bonk.isHorny(reason)) {
      if (isSelf) {
        embedMsg.image!.url = bonk.selfHornyBonkGif();
      } else {
        embedMsg.image!.url = bonk.hornyBonkGif();
      }
    } else {
      embedMsg.image!.url = bonk.bonkGif();
    }

    embedMsg.description = `\`${target}\` You have been bonked!\nReason: ${reason}`;

    const content = args.ping_target ? `<@${target.id}>` : ' ';

    await ctx.editOrRespond({
      content,
      embeds: [embedMsg],
    });
  },
});
