/* eslint-disable @typescript-eslint/no-use-before-define */
import { BaseCollection } from 'detritus-client/lib/collections';
import { MessageComponentButtonStyles, MessageFlags } from 'detritus-client/lib/constants';
import { InteractionContext } from 'detritus-client/lib/interaction';
import { Member } from 'detritus-client/lib/structures';
import { ComponentActionRow, ComponentContext } from 'detritus-client/lib/utils';
import { AfterRoleCheck, SimpleEmbed } from '../botTypes/interfaces';
import { COLORS, ROLE_IDS } from './Constants';
import { PMAEventHandler } from './Utilities';

const toGiveRoles: string[] = [];
const awardedRoles: string[] = [];

let localCopyRoles: string[] = [];
let userTarget: Member;
let totalExp = 0;
let embedDescription = '';

function resetToDefault() {
  localCopyRoles = [];
  totalExp = 0;
  embedDescription = '';
  resultEmbed.description = '';
}

const resultEmbed: SimpleEmbed = {
  color: COLORS.EMBED_COLOR,
  title: '**Roles successfully rewarded!**',
  description: '',
};

export function initialiseSwitcher(selectedRoles: string[], target: Member) {
  toGiveRoles.push(...selectedRoles);
  localCopyRoles.push(...selectedRoles);
  userTarget = target;
  resultEmbed.description += `The following roles have been assigned to <@${userTarget.id}>:\n`;
}

function reputationCheck(
  ctx: InteractionContext,
  target: Member,
  repRole: typeof ROLE_IDS.REPUTATION[keyof typeof ROLE_IDS.REPUTATION],
) {
  target.addRole(repRole);
  const result: AfterRoleCheck = {
    exp: 250,
    notes: 'none',
    role: repRole,
  };
  roleCheckSwitcher(ctx, result);
}

function whaleRoleCheck(
  ctx: InteractionContext,
  target: Member,
  role?: typeof ROLE_IDS.OTHERS.WHALE,
) {
  target.addRole(ROLE_IDS.OTHERS.WHALE || (role as string));
  const result = { exp: 250, notes: 'none', role: ROLE_IDS.OTHERS.WHALE };
  roleCheckSwitcher(ctx, result);
}

function nonEleCrownCheck(
  ctx: InteractionContext,
  target: Member,
  role?: typeof ROLE_IDS.CROWN.UNALIGNED,
) {
  target.addRole(ROLE_IDS.CROWN.UNALIGNED || (role as string));
  const result = {
    exp: 30000,
    notes: 'Paid attention to the game!',
    role: ROLE_IDS.CROWN.UNALIGNED,
  };
  PMAEventHandler.emit('crownRegister', target, { quantity: 1, crownID: ROLE_IDS.CROWN.UNALIGNED });
  roleCheckSwitcher(ctx, result);
}

async function abyssRoleCheck(
  ctx: InteractionContext,
  target: Member,
  roleC?: typeof ROLE_IDS.OTHERS.ABYSSAL_CONQUEROR,
) {
  const abyssRole = ROLE_IDS.OTHERS.ABYSSAL_CONQUEROR || roleC!;
  const result: AfterRoleCheck = {
    exp: 0,
    notes: 'none',
    role: abyssRole,
  };

  const abyssClearRow = new ComponentActionRow()
    .addButton({
      customId: 'clear_normal',
      label: 'Cleared without Traveler',
      emoji: '👎',
      style: MessageComponentButtonStyles.SECONDARY,
      run(btnCtx) {
        result.exp = 250;
        target.addRole(abyssRole);
        PMAEventHandler.emit('abyssRegister', target, false);
        roleCheckSwitcher(btnCtx, result);
      },
    })
    .addButton({
      customId: 'clear_traveler',
      label: 'Cleared with traveler',
      emoji: '👍',
      style: MessageComponentButtonStyles.SUCCESS,
      run(btnCtx) {
        result.exp = 500;
        result.notes = 'Cleared with Traveler!';
        target.addRole(abyssRole);
        PMAEventHandler.emit('abyssRegister', target, false);
        roleCheckSwitcher(btnCtx, result);
      },
    });

  const abyssRoleEmbed: SimpleEmbed = {
    title: '**Cleared Spiral Abyss with Traveler?**',
    color: COLORS.EMBED_COLOR,
    description: `Did <@${target.id}> use on traveler on floor 12 all chambers?`,
  };

  await ctx.editOrRespond({
    embeds: [abyssRoleEmbed],
    components: [abyssClearRow],
  });
}

async function crownCheck(
  ctx: InteractionContext,
  target: Member,
  crownRole: typeof ROLE_IDS.CROWN[keyof typeof ROLE_IDS.CROWN],
) {
  const result: AfterRoleCheck = {
    exp: 0,
    notes: 'none',
    role: crownRole,
  };

  const crownAmtRow = new ComponentActionRow()
    .addButton({
      customId: '1',
      emoji: '1️⃣',
      style: MessageComponentButtonStyles.SECONDARY,
      run(btnCtx) {
        result.exp = 250;
        result.notes = '1 crowns';
        target.addRole(crownRole);
        PMAEventHandler.emit('crownRegister', target, { quantity: 1, crownID: crownRole });
        roleCheckSwitcher(btnCtx, result);
      },
    })
    .addButton({
      customId: '2',
      emoji: '2️⃣',
      style: MessageComponentButtonStyles.SECONDARY,
      run(btnCtx) {
        result.exp = 250 * 2;
        result.notes = '2 crowns';
        target.addRole(crownRole);
        PMAEventHandler.emit('crownRegister', target, { quantity: 2, crownID: crownRole });
        roleCheckSwitcher(btnCtx, result);
      },
    })
    .addButton({
      customId: '3',
      emoji: '3️⃣',
      style: MessageComponentButtonStyles.SECONDARY,
      run(btnCtx) {
        result.exp = 250 * 2 * 3;
        result.notes = '3 crowns';
        target.addRole(crownRole);
        PMAEventHandler.emit('crownRegister', target, { quantity: 3, crownID: crownRole });
        roleCheckSwitcher(btnCtx, result);
      },
    });

  const crownRoleEmbed: SimpleEmbed = {
    title: '**How many Crowns?**',
    color: COLORS.EMBED_COLOR,
    description: `How many crowns did <@${target.id}> use on traveler for <@&${crownRole}>`,
  };

  await ctx.editOrRespond({
    embeds: [crownRoleEmbed],
    components: [crownAmtRow],
  });
}

const roleFunctions = new BaseCollection<string, Function>()
  .set(ROLE_IDS.OTHERS.WHALE, whaleRoleCheck)
  .set(ROLE_IDS.OTHERS.ABYSSAL_CONQUEROR, abyssRoleCheck)
  .set(ROLE_IDS.REPUTATION.MONDSTADT, reputationCheck)
  .set(ROLE_IDS.REPUTATION.LIYUE, reputationCheck)
  .set(ROLE_IDS.REPUTATION.INAZUMA, reputationCheck)
  .set(ROLE_IDS.CROWN.ANEMO, crownCheck)
  .set(ROLE_IDS.CROWN.GEO, crownCheck)
  .set(ROLE_IDS.CROWN.ELECTRO, crownCheck)
  .set(ROLE_IDS.CROWN.UNALIGNED, nonEleCrownCheck);

export function roleCheckSwitcher(
  ctx: InteractionContext | ComponentContext,
  beforeSwitchResults: AfterRoleCheck,
) {
  if (beforeSwitchResults.exp > 0) {
    embedDescription
      += beforeSwitchResults.notes !== 'none'
        ? `✦ <@&${beforeSwitchResults.role}>: ${beforeSwitchResults.notes} (+${beforeSwitchResults.exp})\n`
        : `✦ <@&${beforeSwitchResults.role}> (+${beforeSwitchResults.exp})\n`;
    totalExp += beforeSwitchResults.exp;
  }
  if (localCopyRoles.length > 0) {
    const workingRole = localCopyRoles[0];
    awardedRoles.push(workingRole);
    localCopyRoles = localCopyRoles.filter((role) => role !== workingRole);
    const roleFunction = roleFunctions.get(workingRole);
    roleFunction!(ctx, userTarget, workingRole);
    return;
  }
  embedDescription += `\n**Total exp:** ${totalExp}`;
  resultEmbed.description = `${resultEmbed.description}${embedDescription}`;
  ctx
    .editOrRespond({
      embeds: [resultEmbed],
    })
    .then(async () => {
      await ctx.createMessage({
        flags: MessageFlags.EPHEMERAL,
        content: `>award ${userTarget.id} ${totalExp}`,
      });

      await ctx.createMessage({
        flags: MessageFlags.EPHEMERAL,
        content:
          'Copy paste that command. And a message by <@485962834782453762> should come up like [this](https://i.imgur.com/yQvOAzZ.png)',
      });

      resetToDefault();
    });
}
