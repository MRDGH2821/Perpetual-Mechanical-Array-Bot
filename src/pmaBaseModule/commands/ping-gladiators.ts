import { ApplicationCommandOptionTypes, MessageFlags } from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { ChannelIds, ROLE_IDS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';

export default new InteractionCommand({
  name: 'ping-gladiators',
  description: 'Pings gladiators in voter channel',
  global: false,
  guildIds: [EnvConfig.guildId],
  options: [
    {
      name: 'ping_archons',
      description: 'Ping Archons?',
      type: ApplicationCommandOptionTypes.BOOLEAN,
      default: false,
    },
  ],
  onBeforeRun(ctx) {
    if (ctx.member?.roles.has(ROLE_IDS.OTHERS.BATTLE_CASTER)) {
      return true;
    }
    ctx.editOrRespond({
      content: 'You do not have the required role to use this command.',
      flags: MessageFlags.EPHEMERAL,
    });
    return false;
  },
  run(ctx, args) {
    const text = `<@&${ROLE_IDS.OTHERS.GLADIATORS}>${
      args.ping_archons ? `<@&${ROLE_IDS.OTHERS.ARCHONS}>` : ' '
    }`;

    ctx.editOrRespond({
      content: 'Will be pinged soon',
      flags: MessageFlags.EPHEMERAL,
    });

    const voterChannel = ctx.channels.get(ChannelIds.ARENA_OF_VOTERS);
    voterChannel?.createMessage({
      content: text,
    });
  },
});
