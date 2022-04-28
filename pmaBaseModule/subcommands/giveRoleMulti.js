// eslint-disable-next-line no-unused-vars
import { CommandInteraction } from '@ruinguard/core';
import { isStaff } from '../../lib/utilityFunctions.js';

/**
 * @async
 * @function
 * @param {CommandInteraction} interaction
 */
export default async function giveRoleMulti(interaction) {
  await interaction.deferReply();
  const msg = `Member: ${interaction.member.user.tag}\n Is Staff? ${isStaff(
    interaction.member,
  )}\n Can Gib Roles? ${interaction.member}`;
  console.log(msg);
  await interaction.editReply({
    content: msg,
  });
}
