import type {
  ChatInputCommandDeniedPayload,
  Events,
  UserError,
} from "@sapphire/framework";
import { Listener } from "@sapphire/framework";

export default class ChatInputCommandDeniedEvent extends Listener<
  typeof Events.ChatInputCommandDenied
> {
  public async run(
    { context, message: content }: UserError,
    { interaction }: ChatInputCommandDeniedPayload,
  ) {
    // `context: { silent: true }` should make UserError silent:
    // Use cases for this are for example permissions error when running the `eval` command.
    if (Reflect.get(new Object(context), "silent")) return true;

    if (interaction.deferred || interaction.replied) {
      return interaction.editReply({
        content,
        allowedMentions: { users: [interaction.user.id], roles: [] },
      });
    }

    return interaction.reply({
      content,
      allowedMentions: { users: [interaction.user.id], roles: [] },
      ephemeral: true,
    });
  }
}
