import type { ChatInputCommandErrorPayload, Events } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';
import { codeBlock } from '@sapphire/utilities';
import { MessageFlags } from 'discord.js';

export default class ChatInputCommandErrorEvent extends Listener<
  typeof Events.ChatInputCommandError
> {
  public async run(err: Error, payload: ChatInputCommandErrorPayload) {
    const { interaction } = payload;
    const errMsg = `${err}\n\n${codeBlock('md', JSON.stringify(err, null, 2))}`;
    return interaction.deferred
      ? interaction.editReply({
          content: `An error occurred\n\n${errMsg}`,
        })
      : interaction.reply({
          content: `An error occurred\n\n${errMsg}`,
          flags: MessageFlags.Ephemeral,
        });
  }
}
