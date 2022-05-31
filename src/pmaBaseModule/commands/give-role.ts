import { GiveRoleArgs } from '@bot-types/interfaces';
import {
  ACH_ROLES, COLORS, EMOJIS, ROLE_IDS
} from '@lib/Constants';
import EnvConfig from '@lib/EnvConfig';
import { initialiseSwitcher, roleCheckSwitcher } from '@lib/RoleCheck';
import { StaffCheck } from '@lib/Utilities';
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
            const values = ACH_ROLES.filter((r) => r.name.toLowerCase().includes(input));

            const choices = values.map((role) => ({
              name: role.name,
              value: role.value,
            }));

            ctx.respond({ choices });
          },
        },
      ],

      async onBefore(ctx) {
        const canGib = StaffCheck.canGibRole(ctx.member as Member);

        if (!canGib) {
          await ctx.editOrRespond({
            content: `You cannot give roles to anyone, not even to yourself ${EMOJIS.PepeKekPoint}`,
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
          role: ROLE_IDS.OTHERS.ARCHONS,
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
        const canGib = StaffCheck.canGibRole(ctx.member as Member);

        if (!canGib) {
          await ctx.editOrRespond({
            content: `You cannot give roles to anyone, not even to yourself ${EMOJIS.PepeKekPoint}`,
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
          color: COLORS.EMBED_COLOR,
        };

        const target = args.user!;
        const options = [
          {
            description: 'Completed Spiral Abyss 36/36 & all Spiral abyss achievements',
            emoji: '🌀',
            label: ctx.guild?.roles.get(ROLE_IDS.OTHERS.ABYSSAL_CONQUEROR)?.name,
            value: ROLE_IDS.OTHERS.ABYSSAL_CONQUEROR,
          },
          {
            default: target?.roles.has(ROLE_IDS.REPUTATION.MONDSTADT),
            description: '100% Map + Subregions + Achievements + Max Reputation',
            emoji: '🕊️',
            label: ctx.guild?.roles.get(ROLE_IDS.REPUTATION.MONDSTADT)?.name,
            value: ROLE_IDS.REPUTATION.MONDSTADT,
          },
          {
            default: target?.roles.has(ROLE_IDS.REPUTATION.LIYUE),
            description: '100% Map + Subregions + Achievements + Max Reputation',
            emoji: '⚖️',
            label: ctx.guild?.roles.get(ROLE_IDS.REPUTATION.LIYUE)?.name,
            value: ROLE_IDS.REPUTATION.LIYUE,
          },
          {
            default: target?.roles.has(ROLE_IDS.REPUTATION.INAZUMA),
            description: '100% Map + Subregions + Achievements + Max Reputation',
            emoji: '⛩️',
            label: ctx.guild?.roles.get(ROLE_IDS.REPUTATION.INAZUMA)?.name,
            value: ROLE_IDS.REPUTATION.INAZUMA,
          },
          {
            description: 'Crowned their Anemo Traveler',
            emoji: '🌪️',
            label: ctx.guild?.roles.get(ROLE_IDS.CROWN.ANEMO)?.name,
            value: ROLE_IDS.CROWN.ANEMO,
          },
          {
            description: 'Crowned their Geo Traveler',
            emoji: '🪨',
            label: ctx.guild?.roles.get(ROLE_IDS.CROWN.GEO)?.name,
            value: ROLE_IDS.CROWN.GEO,
          },
          {
            description: 'Crowned their Electro Traveler',
            emoji: '⚡',
            label: ctx.guild?.roles.get(ROLE_IDS.CROWN.ELECTRO)?.name,
            value: ROLE_IDS.CROWN.ELECTRO,
          },
          {
            default: target?.roles.has(ROLE_IDS.CROWN.UNALIGNED),
            description: 'Crowned their Unaligned Traveler',
            emoji: '👑',
            label: ctx.guild?.roles.get(ROLE_IDS.CROWN.UNALIGNED)?.name,
            value: ROLE_IDS.CROWN.UNALIGNED,
          },
          {
            default: target?.roles.has(ROLE_IDS.OTHERS.WHALE),
            description: 'Spent $1500, or have c6 5* chars or r5 5* weapons',
            emoji: '💰',
            label: ctx.guild?.roles.get(ROLE_IDS.OTHERS.WHALE)?.name,
            value: ROLE_IDS.OTHERS.WHALE,
          },
        ].filter((option) => {
          if (Object.values(ROLE_IDS.CROWN).includes(option.value as ROLE_IDS.CROWN)) {
            if (option.value === ROLE_IDS.CROWN.UNALIGNED && option.default === true) {
              return false;
            }
            return true;
          }
          if (option.value === ROLE_IDS.OTHERS.ABYSSAL_CONQUEROR) {
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
              role: ROLE_IDS.OTHERS.ARCHONS,
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
