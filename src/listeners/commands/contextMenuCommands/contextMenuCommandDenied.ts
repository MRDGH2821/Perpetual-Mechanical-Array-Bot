import type {
  ContextMenuCommandDeniedPayload,
  Events,
  UserError,
} from "@sapphire/framework";
import { Listener } from "@sapphire/framework";

export default class ContextMenuCommandDeniedEvent extends Listener<
  typeof Events.ContextMenuCommandDenied
> {
  public async run(
    { context, message: content }: UserError,
    { interaction }: ContextMenuCommandDeniedPayload,
  ) {
    // `context: { silent: true }` should make UserError silent:
    // Use cases for this are for example permissions error when running the `eval` command.
    // eslint-disable-next-line no-new-object
    if (Reflect.get(new Object(context), "silent")) return;

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
