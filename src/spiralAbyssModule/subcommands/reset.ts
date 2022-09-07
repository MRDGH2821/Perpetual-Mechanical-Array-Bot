import { RequestTypes } from 'detritus-client-rest';
import {
  ApplicationCommandOptionTypes,
  MessageComponentButtonStyles,
} from 'detritus-client/lib/constants';
import { InteractionCommandOptionOptions, ParsedArgs } from 'detritus-client/lib/interaction';
import { Member } from 'detritus-client/lib/structures';
import { ComponentActionRow } from 'detritus-client/lib/utils';
import { SimpleEmbed } from '../../botTypes/interfaces';
import { getShardClient } from '../../lib/BotClientExtracted';
import {
  ChannelIds, COLORS, ICONS, ROLE_IDS,
} from '../../lib/Constants';
import { Debugging, PMAEventHandler, StaffCheck } from '../../lib/Utilities';

interface ResetArgs extends ParsedArgs {
  remove_roles?: boolean;
  publish_names?: boolean;
  send_announcement?: boolean;
  announce_with_ping?: boolean;
}

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
    {
      name: 'send_announcement',
      description: 'Will send an announcement (default True)',
      type: ApplicationCommandOptionTypes.BOOLEAN,
      default: true,
    },
    {
      name: 'announce_with_ping',
      description: 'Will announce with a ping (default False)',
      type: ApplicationCommandOptionTypes.BOOLEAN,
      default: false,
    },
  ],
  async onBeforeRun(ctx) {
    return StaffCheck.isCtxStaff(ctx, true);
  },
  async run(ctx, args: ResetArgs) {
    const verifyEmb: SimpleEmbed = {
      title: '**Are you sure?**',
      description: `Performing This action will result in the following -\n 1. Will publish names: \`${args.publish_names}\`\n 2. Will remove roles: \`${args.remove_roles}\`\n 3. Send Announcement message: \`${args.send_announcement}\` \n 4. Will Announce with ping: \`${args.announce_with_ping}\``,
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
          const successEmbed: SimpleEmbed = {
            title: '**Success**',
            description: ` 1. Names Published: \`${args.publish_names}\`\n 2. Roles Removed: \`${args.remove_roles}\`\n 3. Sent Announcement message: \`${args.send_announcement}\`\n  4. Announced with ping: \`${args.announce_with_ping}\``,
            color: COLORS.SUCCESS,
            thumbnail: {
              url: ICONS.CHECK_MARK,
            },
            fields: [
              {
                name: '**Done**',
                value: 'Your command was successfully executed',
              },
            ],
          };

          const files: RequestTypes.File[] = [];
          const abyssRoles = Object.values(ROLE_IDS.SpiralAbyss);

          // perform role backup
          abyssRoles.forEach((abyssRole) => {
            const ids: { id: Member['user']['id'] }[] = [];
            btnCtx.guild?.members
              .filter((user) => user.roles.has(abyssRole))
              .forEach((member) => {
                ids.push({ id: member.user.id });

                // remove role when true
                if (args.remove_roles) {
                  member.removeRole(abyssRole);
                }
              });
            const fileName = `${btnCtx.guild?.roles.get(abyssRole)?.name}_${abyssRole}_.json`;
            files.push({
              filename: fileName,
              value: JSON.stringify(ids),
            });
          });

          // publish names
          if (args.publish_names === true) {
            PMAEventHandler.emit('spiralAbyssPublish', {
              SClient: getShardClient(),
            });
          }

          PMAEventHandler.emit('spiralAbyssRefresh');
          if (args.send_announcement === true) {
            const announceEmb: SimpleEmbed = {
              title: '**New Enemy Lineup!**',
              color: COLORS.SPIRAL_ABYSS,
              description: `Enemy Lineup has changed which means Spiral abyss roles are up for grabs!\nSubmit in-game screenshot or Hoyolab profile link or Hoyolab screenshot at <#${ChannelIds.ROLE_APPLICATION}> as a proof to get the role!\n\nRequirements for obtaining respective roles:`,
              fields: [
                {
                  name: 'Abyssal Conqueror',
                  value: 'Clear Spiral Abyss 36/36 & get all achievements\nTotal exp: `250`',
                },
                {
                  name: 'Abyssal Traveler',
                  value: 'Above requirements + Clear Floor 12 using Traveler\nTotal exp: `500`',
                },
                {
                  name: 'Abyssal Sovereign',
                  value:
                    'Above requirements + Clear Floor 12 using 3 distinct traveler teams (elements can be same) or 3 different traveler elements (teams can be same)\nTotal exp: `5000`',
                },
                {
                  name: '\u200B',
                  value: args.remove_roles
                    ? '||*Yes roles were removed and none of the animals were harmed in this process.*||'
                    : '*No roles were removed nor any animals were hurt in this process.*',
                },
              ],
            };

            ctx.channels.get(ChannelIds.SPIRAL_ABYSS)?.createMessage({
              content: args.announce_with_ping
                ? `<@&${ROLE_IDS.SpiralAbyss.ABYSSAL_CONQUEROR}> <@&${ROLE_IDS.SpiralAbyss.ABYSSAL_TRAVELER}> <@&${ROLE_IDS.SpiralAbyss.ABYSSAL_SOVEREIGN}>`
                : '** **',
              embed: announceEmb,
            });
          }
          await btnCtx.editOrRespond({
            embed: successEmbed,
            files,
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
          btnCtx.editOrRespond({
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
