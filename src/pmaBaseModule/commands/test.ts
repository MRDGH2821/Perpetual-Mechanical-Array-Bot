import {
  InteractionCallbackTypes,
  MessageComponentButtonStyles,
  MessageFlags,
} from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { ComponentActionRow } from 'detritus-client/lib/utils';
import EnvConfig from '../../lib/EnvConfig';

export default new InteractionCommand({
  name: 'test',
  description: 'experimental command',
  global: false,
  guildIds: [EnvConfig.guildId!],

  async run(ctx) {
    const getRoleRow = new ComponentActionRow()
      .addButton({
        label: 'Get role',
        style: MessageComponentButtonStyles.SUCCESS,
        run(btnCtx) {
          btnCtx.member?.addRole('984388373693210635');
          btnCtx.createResponse(InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, {
            content: 'Role given!',
            flags: MessageFlags.EPHEMERAL,
          });
        },
      })
      .addButton({
        label: 'Remove role',
        style: MessageComponentButtonStyles.DANGER,
        run(btnCtx) {
          btnCtx.member?.removeRole('984388373693210635');
          btnCtx.createResponse(InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, {
            content: 'Role removed!',
            flags: MessageFlags.EPHEMERAL,
          });
        },
      });

    ctx.editOrRespond({
      embed: {
        title: 'Become Another Test Subject!',
        description: 'Click on the respective button to get/remove the role <@&984388373693210635>',
      },
      components: [getRoleRow],
    });
  },
});
