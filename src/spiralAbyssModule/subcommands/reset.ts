import {
  ApplicationCommandOptionTypes,
  MessageComponentButtonStyles,
} from 'detritus-client/lib/constants';
import { InteractionCommandOptionOptions } from 'detritus-client/lib/interaction';
import { Member } from 'detritus-client/lib/structures';
import { ComponentActionRow } from 'detritus-client/lib/utils';
import { SimpleEmbed } from '../../botTypes/interfaces';
import { getShardClient } from '../../lib/BotClientExtracted';
import {
  ChannelIds, COLORS, ICONS, ROLE_IDS,
} from '../../lib/Constants';
import db from '../../lib/Firestore';
import { Debugging, PMAEventHandler, StaffCheck } from '../../lib/Utilities';

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
      name: 'delete_cache',
      description: 'Deletes spiral abyss cache (default True)',
      type: ApplicationCommandOptionTypes.BOOLEAN,
      default: true,
    },
    {
      name: 'clear_database',
      description: 'Deletes spiral abyss database entries (default True)',
      type: ApplicationCommandOptionTypes.BOOLEAN,
      default: true,
    },
  ],
  async onBeforeRun(ctx) {
    return StaffCheck.isCtxStaff(ctx, true);
  },
  async run(ctx, args) {
    const verifyEmb: SimpleEmbed = {
      title: '**Are you sure?**',
      description: `Performing This action will result in the following -\n 1. Will delete Spiral Abyss cache \`${args.delete_cache}\` \n 2. Will clear database entries \`${args.clear_database}\` \n 3. Will publish names: \`${args.publish_names}\`\n 4. Will remove roles: \`${args.remove_roles}\``,
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
            description: ` 1. Spiral Abyss cache deleted: \`${args.delete_cache}\` \n 2. Database entries cleared: \`${args.clear_database}\` \n 3. Names Published: \`${args.publish_names}\`\n 4. Roles Removed: \`${args.remove_roles}\``,
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

          const ids: { id: Member['user']['id'] }[] = [];

          const dbIds: any[] = [];

          const abyssRole = ROLE_IDS.OTHERS.ABYSSAL_CONQUEROR;

          // perform role backup
          await btnCtx.guild?.members
            .filter((user) => user.roles.has(abyssRole))
            .forEach((member) => {
              ids.push({ id: member.user.id });

              // remove role when true
              if (args.remove_roles) {
                member.removeRole(abyssRole);
              }
            });

          // perform db backup
          await db
            .collection('spiral-abyss-current')
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((snap) => {
                dbIds.push(snap.data());
              });
            });

          // publish names
          if (args.publish_names === true) {
            PMAEventHandler.emit('spiralAbyssPublish', {
              SClient: getShardClient(),
              deleteCache: args.delete_cache,
              clearDB: args.clear_database,
            });
          }

          PMAEventHandler.emit('spiralAbyssRefresh');
          if (args.remove_roles === true) {
            const announceEmb: SimpleEmbed = {
              title: '**New Enemy Lineup!**',
              color: COLORS.SPIRAL_ABYSS,
              description: `Enemy Lineup has changed which means Spiral abyss roles are up for grabs!\nSubmit in-game screenshot or Hoyolab profile link or Hoyolab screenshot at <#${ChannelIds.ROLE_APPLICATION}> as a proof to get the role!\n\n(~~Yes roles are removed~~)`,
            };

            ctx.channels.get(ChannelIds.SPIRAL_ABYSS)?.createMessage({
              embed: announceEmb,
            });
          }

          await btnCtx.editOrRespond({
            embed: successEmbed,
            files: [
              {
                filename: 'db_ids_spiral_abyss.json',
                value: JSON.stringify(dbIds),
              },
              {
                filename: 'member_ids_spiral_abyss.json',
                value: JSON.stringify(ids),
              },
            ],
          });
          console.log('DB Ids Length: ', dbIds.length);
          console.log('DB Ids str len: ', JSON.stringify(dbIds).length);
          console.log('Member Ids Length: ', ids.length);
          console.log('Member Ids str len: ', JSON.stringify(ids).length);
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
