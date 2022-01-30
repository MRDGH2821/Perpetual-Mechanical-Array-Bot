import { Event } from '@ruinguard/core';

export default new Event({
  event: 'interactionCreate',
  run(interaction) {
    console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.\nUser ID: ${interaction.user.id}, Command: ${interaction.commandName}\n---`);
    interaction.client._onInteractionCreate(interaction);
  },
});
