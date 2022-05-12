import { COLORS, ROLE_IDS } from '@pma-lib/Constants';
import { AfterRoleCheck } from '@pma-types/interfaces';
import { RequestTypes } from 'detritus-client-rest';
import { MessageComponentButtonStyles, Snowflake } from 'detritus-client/lib/constants';
import { InteractionContext } from 'detritus-client/lib/interaction';
import { Member } from 'detritus-client/lib/structures';
import { ComponentActionRow } from 'detritus-client/lib/utils';

const exp = 250;

export function repRoleCheck(roles: Array<Snowflake>, target: Member): AfterRoleCheck[] {
  const results: AfterRoleCheck[] = [];
  Object.values(ROLE_IDS.REPUTATION).forEach((repRole) => {
    if (roles.includes(repRole)) {
      target.addRole(repRole);
      results.push({
        exp,
        notes: 'none',
        role: repRole,
      });
    }
  });
  return results;
}

export async function crownRoleCheck(
  ctx: InteractionContext,
  roles: Array<Snowflake>,
  target: Member,
): Promise<AfterRoleCheck[]> {
  const finalResult: AfterRoleCheck[] = [];
  const elementalRoles = Object.values(ROLE_IDS.CROWN).filter(
    (role) => role !== ROLE_IDS.CROWN.NON_ELE,
  );
  if (roles.includes(ROLE_IDS.CROWN.NON_ELE)) {
    finalResult.push({
      role: ROLE_IDS.CROWN.NON_ELE,
      exp: 30000,
      notes: 'Paid Close Attention!',
    });
  }

  elementalRoles.forEach(async (eleRole) => {
    if (roles.includes(eleRole)) {
      const crownAmtRow = new ComponentActionRow()
        .addButton({
          customId: '1',
          emoji: '1️⃣',
          style: MessageComponentButtonStyles.SECONDARY,
          async run() {
            target.addRole(eleRole);
            finalResult.push({
              role: eleRole,
              exp,
              notes: '1',
            });
          },
        })
        .addButton({
          customId: '2',
          emoji: '2️⃣',
          style: MessageComponentButtonStyles.SECONDARY,
          async run() {
            target.addRole(eleRole);
            finalResult.push({
              role: eleRole,
              exp: exp * 2,
              notes: '2',
            });
          },
        })
        .addButton({
          customId: '3',
          emoji: '3️⃣',
          style: MessageComponentButtonStyles.SECONDARY,
          async run() {
            await target.addRole(eleRole);
            finalResult.push({
              role: eleRole,
              exp: exp * 2 * 3,
              notes: '3',
            });
          },
        });

      const crownRoleEmbed: RequestTypes.CreateChannelMessageEmbed = {
        title: '**How many crowns?**',
        color: COLORS.EMBED_COLOR,
        description: `How many crowns did <@${target}> use on traveler for <@&${eleRole}>`,
      };

      await ctx.editOrRespond({
        embeds: [crownRoleEmbed],
        components: [crownAmtRow],
      });
    }
  });

  return finalResult;
}

export async function abyssRoleCheck(
  ctx: InteractionContext,
  roles: Array<Snowflake | string>,
  target: Member,
): Promise<AfterRoleCheck> {
  let expGrant = 0;
  let notes = 'none';
  const abyssRole = ROLE_IDS.ABYSSAL_CONQUEROR;
  if (roles.includes(abyssRole)) {
    const abyssClearRow = new ComponentActionRow()
      .addButton({
        customId: 'clear_normal',
        label: 'Cleared without traveler? 👎',
        style: MessageComponentButtonStyles.SECONDARY,
        async run() {
          expGrant = exp;
          target.addRole(abyssRole);
        },
      })
      .addButton({
        customId: 'clear_traveler',
        label: 'Cleared with traveler? 👍',
        style: MessageComponentButtonStyles.SECONDARY,
        async run() {
          expGrant = exp * 2;
          notes = 'Cleared with Traveler!';
          target.addRole(abyssRole);
        },
      });

    const abyssRoleEmbed: RequestTypes.CreateChannelMessageEmbed = {
      title: '**Cleared Spiral Abyss with Traveler?**',
      color: COLORS.EMBED_COLOR,
      description: `Did <@${target}> use on traveler on floor 12 all chambers?`,
    };

    await ctx.editOrRespond({
      embeds: [abyssRoleEmbed],
      components: [abyssClearRow],
    });
  }

  return {
    exp: expGrant,
    notes,
    role: abyssRole,
  };
}

export function whaleRoleCheck(roles: Array<Snowflake>, target: Member): AfterRoleCheck {
  let expGrant = 0;
  if (roles.includes(ROLE_IDS.WHALE)) {
    expGrant += exp;
    target.addRole(ROLE_IDS.WHALE);
  }
  return {
    exp: expGrant,
    notes: 'none',
    role: ROLE_IDS.WHALE,
  };
}
