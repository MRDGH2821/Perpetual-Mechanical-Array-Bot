import * as Constants from '@pma-lib/Constants';
import EnvConfig from '@pma-lib/EnvConfig';
import * as RoleCheck from '@pma-lib/RoleCheck';
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
        let exp = 0;
        let additionalNotes = 'none';
        const selectedRoles = [args.role!];

        exp += RoleCheck.repRoleCheck(selectedRoles, args.user!).exp;

        await RoleCheck.crownRoleCheck(ctx, selectedRoles, args.user!).then((dataArr) => {
          dataArr.forEach((data) => {
            exp += data.exp;
            additionalNotes = data.notes;
          });
        });

        await RoleCheck.abyssRoleCheck(ctx, selectedRoles, args.user!).then((data) => {
          exp += data.exp;
          additionalNotes = data.notes;
        });

        exp += RoleCheck.whaleRoleCheck(selectedRoles, args.user!).exp;

        const finalEmb: RequestTypes.CreateChannelMessageEmbed = {
          title: '**Role Given!**',
          color: Constants.COLORS.EMBED_COLOR,
          description: `<@&${args.role}> given to <@${args.user?.id}>\nTotal Exp: ${exp}`,
        };

        if (additionalNotes !== 'none') {
          finalEmb.fields?.push({
            name: '**Additional Notes**',
            value: additionalNotes,
          });
        }

        await ctx.editOrRespond({
          embeds: [finalEmb],
        });
        await ctx.createMessage({
          flags: MessageFlags.EPHEMERAL,
          content: `>award ${args.user?.id} ${exp}`,
        });

        await ctx.createMessage({
          flags: MessageFlags.EPHEMERAL,
          content:
            'Copy paste that command. And a message by <@485962834782453762> should come up like [this](https://i.imgur.com/yQvOAzZ.png)',
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
          description: `Select Roles to give to @${args.user}. The amount of EXP will be calculated in end.`,
        };
        const target = args.user;
        const rolesSelectMenu = new ComponentActionRow().addSelectMenu({
          customId: 'role_select_menu',
          minValues: 2,
          options: [
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
              default: target?.roles.has(Constants.ROLE_IDS.CROWN.NON_ELE),
              description: 'Crowned their Unaligned Traveler',
              emoji: '👑',
              label: ctx.guild?.roles.get(Constants.ROLE_IDS.CROWN.NON_ELE)?.name,
              value: Constants.ROLE_IDS.CROWN.NON_ELE,
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
              return true;
            }
            if (option.value === Constants.ROLE_IDS.ABYSSAL_CONQUEROR) {
              return true;
            }
            return !target?.roles.has(option.value);
          }),

          async run(menuCtx) {
            console.log(menuCtx);
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
