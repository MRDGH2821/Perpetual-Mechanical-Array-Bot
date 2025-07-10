import type {
  Events,
  MessageCommandDeniedPayload,
  UserError,
} from "@sapphire/framework";
import { Listener } from "@sapphire/framework";

export default class MessageCommandDeniedEvent extends Listener<
  typeof Events.MessageCommandDenied
> {
  public async run(
    { context, message: content }: UserError,
    { message }: MessageCommandDeniedPayload,
  ) {
    // `context: { silent: true }` should make UserError silent:
    // Use cases for this are for example permissions error when running the `eval` command.
    // eslint-disable-next-line no-new-object
    if (Reflect.get(new Object(context), "silent")) return;

    return message.reply({
      content,
      allowedMentions: { users: [message.author.id], roles: [] },
    });
  }
}
