import { Precondition } from '@sapphire/framework';
import type {
  APIInteractionGuildMember,
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  GuildMember,
} from 'discord.js';
import { isStaff } from '../lib/Utilities';

export default class ModOnly extends Precondition {
  public override chatInputRun(interaction: ChatInputCommandInteraction) {
    if (interaction.member) {
      if (this.checkStaff(interaction.member)) {
        return this.ok();
      }
      return this.error({
        message: 'Only Mods can use this',
      });
    }
    return this.error({
      message: 'This command can only be used in server',
    });
  }

  public override contextMenuRun(interaction: ContextMenuCommandInteraction) {
    if (interaction.member) {
      if (this.checkStaff(interaction.member)) {
        return this.ok();
      }
      return this.error({
        message: 'Only Mods can use this',
      });
    }
    return this.error({
      message: 'This command can only be used in server',
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private checkStaff(member: GuildMember | APIInteractionGuildMember) {
    return isStaff(member);
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    ModOnly: never;
  }
}
