import { Precondition } from '@sapphire/framework';
import type { ChatInputCommandInteraction, ContextMenuCommandInteraction } from 'discord.js';
import { isStaff } from '../lib/Utilities';

export default class ModOnly extends Precondition {
  public override chatInputRun(interaction: ChatInputCommandInteraction) {
    return this.logicRun(interaction);
  }

  public override contextMenuRun(interaction: ContextMenuCommandInteraction) {
    return this.logicRun(interaction);
  }

  private logicRun(interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction) {
    if (interaction.member) {
      if (isStaff(interaction.member)) {
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
}

declare module '@sapphire/framework' {
  interface Preconditions {
    ModOnly: never;
  }
}
