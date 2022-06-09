import {
  ApplicationCommandOptionTypes,
  InteractionCallbackTypes,
  MessageComponentButtonStyles,
} from 'detritus-client/lib/constants';
import { InteractionCommandOptionOptions } from 'detritus-client/lib/interaction';
import { Member } from 'detritus-client/lib/structures';
import { ComponentActionRow } from 'detritus-client/lib/utils';
import { SimpleEmbed } from '../../botTypes/interfaces';
import { COLORS, ICONS, ROLE_IDS } from '../../lib/Constants';
import db from '../../lib/Firestore';
import { Debugging, StaffCheck } from '../../lib/Utilities';

const reset: InteractionCommandOptionOptions = {
  name: 'reset',
  description: 'Use this command on Spiral Abyss Reset',
  type: ApplicationCommandOptionTypes.SUB_COMMAND,
  options: [
    {
      name: 'remove_roles',
      description: 'Announces reset then Removes the spiral abyss role from members',
      type: ApplicationCommandOptionTypes.BOOLEAN,
      required: true,
    },
    {
      name: 'publish_names',
      description: 'Publishes names of travelers who cleared Spiral Abyss 36/36 (default True)',
      type: ApplicationCommandOptionTypes.BOOLEAN,
      default: true,
    },
  ],
  onBeforeRun(ctx) {
    return StaffCheck.isCtxStaff(ctx, true);
  },
  async run(ctx, args) {
    const verifyEmb: SimpleEmbed = {
      title: '**Are you sure?**',
      description: `Performing This action will result in the following -\n 1. Spiral Abyss cache + database entries will be cleared\n 2.Will publish names: \`${args.publish_names}\`\n 3. Will remove roles: \`${args.remove_roles}\``,
      color: COLORS.EMBED_COLOR,
      thumbnail: {
        url: '',
      },
    };

    const verifyRow = new ComponentActionRow()
      .addButton({
        label: 'Yes, do it!',
        emoji: '✅',
        style: MessageComponentButtonStyles.DANGER,
        async run(btnCtx) {
          verifyEmb.fields = [
            {
              name: '**Done**',
              value: 'Your command was successfully executed',
            },
          ];
          verifyEmb.color = COLORS.SUCCESS;
          verifyEmb.thumbnail!.url = ICONS.CHECK_MARK;

          const ids: { id: Member['user']['id'] }[] = [];

          const dbIds: any = [];
          await btnCtx.guild?.members
            .filter((user) => user.roles.has(ROLE_IDS.OTHERS.ABYSSAL_CONQUEROR))
            .forEach((member) => ids.push({ id: member.user.id }));
          await db
            .collection('spiral-abyss-current')
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((snap) => {
                dbIds.push(snap.data());
              });
            });

          await btnCtx.createResponse(InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, {
            embed: verifyEmb,
            files: [
              {
                description: 'IDs of people who had spiral abyss role',
                filename: 'member_ids_spiral_abyss.txt',
                value: JSON.stringify(ids),
              },
              {
                description: 'IDs stored in database',
                filename: 'db_ids_spiral_abyss.txt',
                value: JSON.stringify(dbIds),
              },
            ],
          });
        },
        onError(errCtx, err) {
          Debugging.leafDebug(err);
          errCtx.editOrRespond({
            content: Debugging.debug(err),
          });
        },
      })
      .addButton({
        label: 'No, I was going to do a mistake!',
        emoji: '❌',
        style: MessageComponentButtonStyles.SUCCESS,
        run(btnCtx) {
          verifyEmb.fields?.push({
            name: '**Not Done**',
            value: 'Your command was not executed',
          });
          verifyEmb.color = COLORS.ERROR;
          verifyEmb.thumbnail!.url = ICONS.CROSS_MARK;
          btnCtx.createResponse(InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, {
            embed: verifyEmb,
          });
        },
      });

    await ctx.editOrRespond({
      embed: verifyEmb,
      components: [verifyRow],
    });
  },
};

export default reset;
