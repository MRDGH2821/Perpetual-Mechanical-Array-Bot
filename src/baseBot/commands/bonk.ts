import { ApplyOptions } from "@sapphire/decorators";
import { isGuildMember } from "@sapphire/discord.js-utilities";
import { Command } from "@sapphire/framework";
import { pickRandom } from "@sapphire/utilities";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import { COLORS } from "../../lib/Constants.js";
import EnvConfig from "../../lib/EnvConfig.js";
import BonkUtilities from "../lib/BonkUtilities.js";

@ApplyOptions<Command.Options>({
  name: "bonk",
  description: "Bonk a member!",
})
export default class GuildCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        dm_permission: false,
        dmPermission: false,
        type: ApplicationCommandType.ChatInput,
        options: [
          {
            name: "target",
            description: "Who is the target?",
            required: true,
            type: ApplicationCommandOptionType.User,
          },
          {
            name: "reason",
            description: "Reason to bonk",
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
          },
          {
            name: "is_horny",
            description: "Is the target horny?",
            type: ApplicationCommandOptionType.Boolean,
          },
          {
            name: "ping_target",
            description:
              "Should I ping your target to let them know they are bonked?",
            type: ApplicationCommandOptionType.Boolean,
          },
        ],
      },
      {
        guildIds: [EnvConfig.guildId],
      },
    );
  }

  public override async autocompleteRun(
    interaction: Command.AutocompleteInteraction,
  ) {
    const bonk = new BonkUtilities();

    const focus = interaction.options.getFocused().toLowerCase();

    const choices = bonk.allReasons.filter((rs) =>
      rs.toLowerCase().includes(focus),
    );

    const finalChoices = pickRandom(choices, 25).map((choice) => ({
      name: choice,
      value: choice,
    }));

    interaction.respond(finalChoices);
  }

  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction,
  ) {
    const target = interaction.options.getMember("target");
    if (!isGuildMember(target)) {
      throw new Error("Target could not be fetched");
    }

    const isHorny = interaction.options.getBoolean("is_horny") || false;

    let reason = interaction.options.getString("reason") || "none";
    const isTargetSelf = target.id === interaction.user.id;
    const pingTarget = interaction.options.getBoolean("ping_target") || false;

    const bonk = new BonkUtilities(reason);

    if (reason === "none") {
      reason = isHorny ? bonk.bonkHornyReason() : bonk.bonkReason();
    }

    let url = bonk.bonkGif();
    if (isHorny || bonk.isHorny(reason)) {
      url = isTargetSelf ? bonk.selfHornyBonkGif() : bonk.hornyBonkGif();
    }

    const description = `\`${target.user.tag}\` You have been bonked!\nReason: ${reason}`;

    return interaction.reply({
      content: pingTarget ? target.toString() : undefined,
      embeds: [
        {
          title: "**Bonked!**",
          description,
          color: COLORS.EMBED_COLOR,
          thumbnail: {
            url: target.displayAvatarURL(),
          },
          image: {
            url,
          },
        },
      ],
      allowedMentions: {
        parse: pingTarget ? ["users"] : [],
        repliedUser: pingTarget,
      },
    });
  }
}
