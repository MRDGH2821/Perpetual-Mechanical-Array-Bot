import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import type { ButtonInteraction } from 'discord.js';
import { ROLE_IDS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';

export default class UnMuteButton extends InteractionHandler {
  public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.Button,
    });
  }

  public override parse(interaction: ButtonInteraction) {
    if (interaction.customId !== 'unmute_me_rng') return this.none();

    return this.some();
  }

  public async run(interaction: ButtonInteraction) {
    const guild = await interaction.client.guilds.fetch(EnvConfig.guildId);
    const member = await guild.members.fetch(interaction.user);
    const { logger } = interaction.client;
    const unMuteReason = "Removed freeze mute role on user's request (muted by RNG luck)";
    await member.roles.remove(ROLE_IDS.OTHERS.FROZEN_RNG, unMuteReason).catch(logger.debug);
    await member.disableCommunicationUntil(0, unMuteReason).catch(logger.debug);

    await interaction.editReply({
      content: 'Timeout/mute role is successfully removed',
      components: [],
    });
  }
}
