import { RequestTypes } from 'detritus-client-rest';
import {
  ApplicationCommandOptionTypes,
  MessageComponentTypes,
  MessageFlags,
} from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { ComponentActionRow, ComponentSelectMenuOptionData } from 'detritus-client/lib/utils';
import { GiveRoleArgs } from '../../botTypes/interfaces';
import * as Constants from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';
import { initialiseSwitcher, roleCheckSwitcher } from '../../lib/RoleCheck';
import { Debugging, randomArrPick, StaffCheck } from '../../lib/Utilities';

export default new InteractionCommand({
  name: 'give-role',
  description: 'Gives role to selected user',
  global: false,
  guildIds: [EnvConfig.guildId],
  onBeforeRun(ctx) {
    return StaffCheck.isCtxStaff(ctx, true);
  },
  options: [
    {
      name: 'one',
      description: 'Give one role!',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'user',
          description: 'Select user',
          type: ApplicationCommandOptionTypes.USER,
          required: true,
        },
        {
          name: 'role',
          description: 'Select Role',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          async onAutoComplete(ctx) {
            const input = ctx.value.toLowerCase();
            const values = Constants.ACH_ROLES.filter((r) => r.name.toLowerCase().includes(input));

            const choices = values.map((role) => ({
              name: role.name,
              value: role.value,
            }));

            ctx.respond({ choices });
          },
        },
        {
          name: 'proof_link',
          description: 'Provide message link as proof',
          type: ApplicationCommandOptionTypes.STRING,
          default: false,
        },
      ],
      async run(ctx, args: GiveRoleArgs) {
        const selectedRoles = [args.role!];

        if (!Constants.ACH_ROLES.find((prop) => prop.value === args.role)) {
          return ctx.editOrRespond({
            content: `<@&${args.role}> is not a valid role`,
            flags: MessageFlags.EPHEMERAL,
          });
        }
        initialiseSwitcher(selectedRoles as string[], args.user!, args.proof_link);
        return roleCheckSwitcher(ctx, {
          exp: -1,
          notes: 'none',
          role: Constants.ROLE_IDS.OTHERS.ARCHONS,
        });
      },
    },
    {
      name: 'multi',
      description: 'Give multiple roles!',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'user',
          description: 'Select user',
          type: ApplicationCommandOptionTypes.USER,
          required: true,
        },
        {
          name: 'proof_link',
          description: 'Provide message link as proof',
          type: ApplicationCommandOptionTypes.STRING,
          default: false,
        },
      ],
      async run(ctx, args: GiveRoleArgs) {
        ctx.editOrRespond({
          embed: {
            description: 'Loading...',
          },
        });
        const firstPage: RequestTypes.CreateChannelMessageEmbed = {
          title: '**Select Roles**',
          description: `Select Roles to give to <@${args.user?.id}>. The amount of EXP will be calculated in end.`,
          color: Constants.COLORS.EMBED_COLOR,
        };

        const target = args.user!;
        const roles = await ctx.guild?.fetchRoles();
        if (!roles) {
          throw new Error('Fetching roles failed');
        }
        const EMOJIS_ARR = ctx.emojis.toArray();
        const optionsArr: ComponentSelectMenuOptionData[] = [
          {
            default: target?.roles.has(Constants.ROLE_IDS.SpiralAbyss.ABYSSAL_TRAVELER),
            description: 'Completed Spiral Abyss 36/36 using Traveler',
            emoji:
              EMOJIS_ARR.find(
                (emoji) => emoji.id === Constants.EMOJIS.DvalinHYPE.match(/\d+/gm)![0],
              ) || '😎',
            label: roles.get(Constants.ROLE_IDS.SpiralAbyss.ABYSSAL_TRAVELER)?.name,
            value: Constants.ROLE_IDS.SpiralAbyss.ABYSSAL_TRAVELER,
          },
          {
            default: target?.roles.has(Constants.ROLE_IDS.SpiralAbyss.ABYSSAL_CONQUEROR),
            description: '36/36 with 3 different Traveler elements ',
            emoji: '🌀',
            label: roles.get(Constants.ROLE_IDS.SpiralAbyss.ABYSSAL_CONQUEROR)?.name,
            value: Constants.ROLE_IDS.SpiralAbyss.ABYSSAL_CONQUEROR,
          },
          {
            // default: target?.roles.has(Constants.ROLE_IDS.SpiralAbyss.ABYSSAL_SOVEREIGN),
            description: '36/36 using 4 distinct Traveler elements & 4 distinct teams ',
            emoji:
              EMOJIS_ARR.find(
                (emoji) => emoji.id === Constants.EMOJIS.DullBlade.match(/\d+/gm)![0],
              ) || '⚔️',
            label: roles.get(Constants.ROLE_IDS.SpiralAbyss.ABYSSAL_SOVEREIGN)?.name,
            value: Constants.ROLE_IDS.SpiralAbyss.ABYSSAL_SOVEREIGN,
          },
          {
            default: target?.roles.has(Constants.ROLE_IDS.REPUTATION.MONDSTADT),
            description: '100% Map + Subregions + Achievements + Max Reputation',
            emoji: '🕊️',
            label: roles.get(Constants.ROLE_IDS.REPUTATION.MONDSTADT)?.name,
            value: Constants.ROLE_IDS.REPUTATION.MONDSTADT,
          },
          {
            default: target?.roles.has(Constants.ROLE_IDS.REPUTATION.LIYUE),
            description: '100% Map + Subregions + Achievements + Max Reputation',
            emoji: '⚖️',
            label: roles.get(Constants.ROLE_IDS.REPUTATION.LIYUE)?.name,
            value: Constants.ROLE_IDS.REPUTATION.LIYUE,
          },
          {
            default: target?.roles.has(Constants.ROLE_IDS.REPUTATION.INAZUMA),
            description: '100% Map + Subregions + Achievements + Max Reputation',
            emoji: '⛩️',
            label: roles.get(Constants.ROLE_IDS.REPUTATION.INAZUMA)?.name,
            value: Constants.ROLE_IDS.REPUTATION.INAZUMA,
          },
          {
            default: target?.roles.has(Constants.ROLE_IDS.REPUTATION.SUMERU),
            description: '100% Map + Subregions + Achievements + Max Reputation',
            emoji: '🌴',
            label: roles.get(Constants.ROLE_IDS.REPUTATION.SUMERU)?.name,
            value: Constants.ROLE_IDS.REPUTATION.SUMERU,
          },
          {
            description: 'Crowned their Anemo Traveler',
            emoji:
              EMOJIS_ARR.find((emoji) => emoji.id === Constants.EMOJIS.Anemo.match(/\d+/gm)![0])
              || '🌪️',
            label: roles.get(Constants.ROLE_IDS.CROWN.ANEMO)?.name,
            value: Constants.ROLE_IDS.CROWN.ANEMO,
          },
          {
            description: 'Crowned their Geo Traveler',
            emoji:
              EMOJIS_ARR.find((emoji) => emoji.id === Constants.EMOJIS.Geo.match(/\d+/gm)![0])
              || '🪨',
            label: roles.get(Constants.ROLE_IDS.CROWN.GEO)?.name,
            value: Constants.ROLE_IDS.CROWN.GEO,
          },
          {
            description: 'Crowned their Electro Traveler',
            emoji:
              EMOJIS_ARR.find(
                (emoji) => emoji.id === Constants.EMOJIS.Electro.match(/\d+/gm)![0],
              ) || '⚡',
            label: roles.get(Constants.ROLE_IDS.CROWN.ELECTRO)?.name,
            value: Constants.ROLE_IDS.CROWN.ELECTRO,
          },
          {
            description: 'Crowned their Dendro Traveler',
            emoji:
              EMOJIS_ARR.find((emoji) => emoji.id === Constants.EMOJIS.Dendro.match(/\d+/gm)![0])
              || '🌲',
            label: roles.get(Constants.ROLE_IDS.CROWN.DENDRO)?.name,
            value: Constants.ROLE_IDS.CROWN.DENDRO,
          },
          {
            default: target?.roles.has(Constants.ROLE_IDS.CROWN.UNALIGNED),
            description: 'Crowned their Unaligned Traveler',
            emoji:
              EMOJIS_ARR.find((emoji) => emoji.id === Constants.EMOJIS.Void.match(/\d+/gm)![0])
              || '👑',
            label: roles.get(Constants.ROLE_IDS.CROWN.UNALIGNED)?.name,
            value: Constants.ROLE_IDS.CROWN.UNALIGNED,
          },
          {
            default: target?.roles.has(Constants.ROLE_IDS.OTHERS.WHALE),
            description: 'Spent $1500, or have c6 5* chars or r5 5* weapons',
            emoji: randomArrPick(['🐋', '🐳', '💰']),
            label: roles.get(Constants.ROLE_IDS.OTHERS.WHALE)?.name,
            value: Constants.ROLE_IDS.OTHERS.WHALE,
          },
        ].filter((option) => {
          // if option is crown role
          if (
            Object.values(Constants.ROLE_IDS.CROWN).includes(
              option.value as Constants.ROLE_IDS.CROWN,
            )
          ) {
            // hide unaligned crown role once obtained
            return !(
              option.value === Constants.ROLE_IDS.CROWN.UNALIGNED && option.default === true
            );
          }
          // if option is spiral abyss role
          if (
            Object.values(Constants.ROLE_IDS.SpiralAbyss).includes(
              option.value as Constants.ROLE_IDS.SpiralAbyss,
            )
          ) {
            // do not hide the role
            return true;
          }
          return !target.roles.has(option.value);
        });
        const rolesSelectMenu = new ComponentActionRow().addSelectMenu({
          customId: 'role_select_menu',
          minValues: 1,
          options: optionsArr,
          maxValues: optionsArr.length,
          label: 'role_select_menu',
          type: MessageComponentTypes.SELECT_MENU,
          async run(menuCtx) {
            const selectedRoles = menuCtx.data.values!;

            initialiseSwitcher(selectedRoles, args.user!, args.proof_link);
            roleCheckSwitcher(menuCtx, {
              exp: -1,
              notes: 'none',
              role: Constants.ROLE_IDS.OTHERS.ARCHONS,
            });
          },
        });
        await ctx.editOrRespond({
          embeds: [firstPage],
          components: [rolesSelectMenu],
        });
      },
    },
  ],
  async onRunError(ctx, args, error: Error) {
    Debugging.leafDebug(error, true);
    ctx.editOrRespond({
      content: `${ctx.owners.first()?.mention}`,
      embed: {
        title: '**An Error Occurred**',
        color: Constants.COLORS.ERROR,
        description: `An error occurred, error details in the file.\nInput: ${args}`,
      },
      files: [
        {
          value: `${error}`,
          filename: 'Give-Role-Error.txt',
        },
        {
          value: JSON.stringify(args),
          filename: 'Args_provided.json',
        },
      ],
    });
  },
});
