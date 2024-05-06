import { isGuildMember } from '@sapphire/discord.js-utilities';
import { Precondition } from '@sapphire/framework';
import type {
  APIInteractionGuildMember,
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  GuildMember,
  Message,
} from 'discord.js';
import { ROLE_IDS } from '../../lib/Constants';

export default class BattleCasterOnly extends Precondition {
  public override messageRun(message: Message) {
    return this.applyCondition(message.member);
  }

  public override chatInputRun(interaction: ChatInputCommandInteraction) {
    return this.applyCondition(interaction.member);
  }

  public override contextMenuRun(interaction: ContextMenuCommandInteraction) {
    return this.applyCondition(interaction.member);
  }

  private applyCondition(member?: GuildMember | APIInteractionGuildMember | null) {
    if (isGuildMember(member)) {
      return this.condition(member);
    }
    return this.error({
      message: 'Guild member cannot be fetched',
    });
  }

  private condition(member: GuildMember) {
    const isBattleCaster = member.roles.cache.has(ROLE_IDS.OTHERS.BATTLE_CASTER);

    return isBattleCaster
      ? this.ok()
      : this.error({
          identifier: 'battle-caster-only',
          message: 'This command is available only for Battle Casters',
        });
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    BattleCasterOnly: never;
  }
}
