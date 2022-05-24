import * as Constants from '@pma-lib/Constants';
import EnvConfig from '@pma-lib/EnvConfig';
import { initialiseSwitcher, roleCheckSwitcher } from '@pma-lib/RoleCheck';
import { canGibRole } from '@pma-lib/StaffCheck';
import { GiveRoleArgs } from '@pma-types/interfaces';
import { RequestTypes } from 'detritus-client-rest';
import { ApplicationCommandOptionTypes, MessageFlags } from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { Member } from 'detritus-client/lib/structures';
import { ComponentActionRow } from 'detritus-client/lib/utils';

export default new InteractionCommand({
  name: 'give-role',
  description: 'Gives role to selected user',
  global: false,
  guildIds: [EnvConfig.guildId as string],

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
      ],

      async onBefore(ctx) {
        const canGib = canGibRole(ctx.member as Member);

        if (!canGib) {
          await ctx.editOrRespond({
            content: `You cannot give roles to anyone, not even to yourself ${Constants.EMOJIS.PepeKekPoint}`,
            flags: MessageFlags.EPHEMERAL,
          });
          return false;
        }
        return true;
      },

      async run(ctx, args: GiveRoleArgs) {
        const selectedRoles = [args.role!];

        initialiseSwitcher(selectedRoles as string[], args);
        roleCheckSwitcher(ctx, {
          exp: -1,
          notes: 'none',
          role: Constants.ROLE_IDS.ARCHONS,
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
      ],
      async onBefore(ctx) {
        const canGib = canGibRole(ctx.member as Member);

        if (!canGib) {
          await ctx.editOrRespond({
            content: `You cannot give roles to anyone, not even to yourself ${Constants.EMOJIS.PepeKekPoint}`,
            flags: MessageFlags.EPHEMERAL,
          });
          return false;
        }
        return true;
      },

      async run(ctx, args: GiveRoleArgs) {
        const firstPage: RequestTypes.CreateChannelMessageEmbed = {
          title: '**Select Roles**',
          description: `Select Roles to give to <@${args.user?.id}>. The amount of EXP will be calculated in end.`,
          color: Constants.COLORS.EMBED_COLOR,
        };

        const target = args.user!;
        const options = [
          {
            description: 'Completed Spiral Abyss 36/36 & all Spiral abyss achievements',
            emoji: '🌀',
            label: ctx.guild?.roles.get(Constants.ROLE_IDS.ABYSSAL_CONQUEROR)?.name,
            value: Constants.ROLE_IDS.ABYSSAL_CONQUEROR,
          },
          {
            default: target?.roles.has(Constants.ROLE_IDS.REPUTATION.MONDSTADT),
            description: '100% Map + Subregions + Achievements + Max Reputation',
            emoji: '🕊️',
            label: ctx.guild?.roles.get(Constants.ROLE_IDS.REPUTATION.MONDSTADT)?.name,
            value: Constants.ROLE_IDS.REPUTATION.MONDSTADT,
          },
          {
            default: target?.roles.has(Constants.ROLE_IDS.REPUTATION.LIYUE),
            description: '100% Map + Subregions + Achievements + Max Reputation',
            emoji: '⚖️',
            label: ctx.guild?.roles.get(Constants.ROLE_IDS.REPUTATION.LIYUE)?.name,
            value: Constants.ROLE_IDS.REPUTATION.LIYUE,
          },
          {
            default: target?.roles.has(Constants.ROLE_IDS.REPUTATION.INAZUMA),
            description: '100% Map + Subregions + Achievements + Max Reputation',
            emoji: '⛩️',
            label: ctx.guild?.roles.get(Constants.ROLE_IDS.REPUTATION.INAZUMA)?.name,
            value: Constants.ROLE_IDS.REPUTATION.INAZUMA,
          },
          {
            description: 'Crowned their Anemo Traveler',
            emoji: '🌪️',
            label: ctx.guild?.roles.get(Constants.ROLE_IDS.CROWN.ANEMO)?.name,
            value: Constants.ROLE_IDS.CROWN.ANEMO,
          },
          {
            description: 'Crowned their Geo Traveler',
            emoji: '🪨',
            label: ctx.guild?.roles.get(Constants.ROLE_IDS.CROWN.GEO)?.name,
            value: Constants.ROLE_IDS.CROWN.GEO,
          },
          {
            description: 'Crowned their Electro Traveler',
            emoji: '⚡',
            label: ctx.guild?.roles.get(Constants.ROLE_IDS.CROWN.ELECTRO)?.name,
            value: Constants.ROLE_IDS.CROWN.ELECTRO,
          },
          {
            default: target?.roles.has(Constants.ROLE_IDS.CROWN.UNALIGNED),
            description: 'Crowned their Unaligned Traveler',
            emoji: '👑',
            label: ctx.guild?.roles.get(Constants.ROLE_IDS.CROWN.UNALIGNED)?.name,
            value: Constants.ROLE_IDS.CROWN.UNALIGNED,
          },
          {
            default: target?.roles.has(Constants.ROLE_IDS.WHALE),
            description: 'Spent $1500, or have c6 5* chars or r5 5* weapons',
            emoji: '💰',
            label: ctx.guild?.roles.get(Constants.ROLE_IDS.WHALE)?.name,
            value: Constants.ROLE_IDS.WHALE,
          },
        ].filter((option) => {
          if (Object.values(Constants.ROLE_IDS.CROWN).includes(option.value)) {
            if (option.value === Constants.ROLE_IDS.CROWN.UNALIGNED && option.default === true) {
              return false;
            }
            return true;
          }
          if (option.value === Constants.ROLE_IDS.ABYSSAL_CONQUEROR) {
            return true;
          }
          return !target?.roles.has(option.value);
        });

        const rolesSelectMenu = new ComponentActionRow().addSelectMenu({
          customId: 'role_select_menu',
          minValues: 1,
          options,
          maxValues: options.length,
          async run(menuCtx) {
            const selectedRoles = menuCtx.data.values!;

            initialiseSwitcher(selectedRoles, args);
            roleCheckSwitcher(menuCtx, {
              exp: -1,
              notes: 'none',
              role: Constants.ROLE_IDS.ARCHONS,
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
});
