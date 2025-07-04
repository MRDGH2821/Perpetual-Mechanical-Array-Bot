import {
  container,
  InteractionHandler,
  InteractionHandlerTypes,
} from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { type ButtonInteraction } from "discord.js";
import { ROLE_IDS } from "../../lib/Constants.js";
import EnvConfig from "../../lib/EnvConfig.js";

export default class UnMuteButton extends InteractionHandler {
  public constructor(
    ctx: InteractionHandler.LoaderContext,
    options: InteractionHandler.Options,
  ) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.Button,
    });
  }

  public override parse(interaction: ButtonInteraction) {
    if (interaction.customId !== "unmute_me_rng") return this.none();

    return this.some();
  }

  public async run(interaction: ButtonInteraction) {
    await interaction.deferUpdate();

    const guild = await interaction.client.guilds.fetch(EnvConfig.guildId);
    const member = await guild.members.fetch(interaction.user);
    const diff = Date.now() - interaction.message.createdTimestamp;

    /*
    this.container.logger.debug({
      createdTimestamp: interaction.message.createdTimestamp,
      now: Date.now(),
      diff,
      oneHour: Time.Hour,
    });
*/

    if (diff > Time.Hour) {
      this.container.logger.info(
        "Will not unmute user because 1 hour has passed since the unmute message being sent.",
        {
          memberID: member.id,
        },
      );

      return interaction.editReply({
        content:
          "Cannot remove timeout/mute role after 1 hour has passed.\nYou may contact mods regarding this matter",
        components: [],
      });
    }

    this.container.logger.debug("Removing roles/timeout");
    const unMuteReason =
      "Removed freeze mute role on user's request (muted by RNG luck)";
    await member.roles
      .remove(ROLE_IDS.OTHERS.FROZEN_RNG, unMuteReason)
      .catch(container.logger.debug);
    await member
      .disableCommunicationUntil(null, unMuteReason)
      .catch(container.logger.debug);

    this.container.logger.debug("Editing msg to remove button");
    return interaction.editReply({
      content: "Timeout/mute role is successfully removed",
      components: [],
    });
  }
}
