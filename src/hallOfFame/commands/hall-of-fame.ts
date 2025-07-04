import { Subcommand } from "@sapphire/plugin-subcommands";
import { ApplicationCommandOptionType, time } from "discord.js";
import { COLORS } from "../../lib/Constants.js";
import EnvConfig from "../../lib/EnvConfig.js";
import { viewBook } from "../../lib/utils.js";
import { HoFJobSchedule } from "../../scheduledTasks.js";
import type { ELEMENTS, JSONCmd } from "../../typeDefs/typeDefs.js";
import { HALL_OF_FAME_ELEMENT_CHOICES } from "../lib/Constants.js";
import HallOfFameCache from "../lib/HallOfFameCache.js";

const cmdDef: JSONCmd = {
  name: "hall-of-fame",
  description: "Hall of Fame commands",
  options: [
    {
      type: 1,
      name: "ranks",
      description: "Show Hall of Fame rankings",
      options: [
        {
          name: "element",
          description: "Select Element",
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: HALL_OF_FAME_ELEMENT_CHOICES,
        },
        {
          name: "crown_quantity",
          description: "Select Crown Quantity",
          type: ApplicationCommandOptionType.Integer,
          required: true,
          choices: [
            { name: "One (1)", value: 1 },
            { name: "Two (2)", value: 2 },
            { name: "Three (3)", value: 3 },
          ],
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "when-refresh",
      description: "When does the Hall of Fame refresh?",
    },
  ],
};
export default class GuildCommand extends Subcommand {
  public constructor(context: Subcommand.Context, options: Subcommand.Options) {
    super(context, {
      ...options,
      name: cmdDef.name,
      description: cmdDef.description,
      preconditions: ["HoFCacheCheck"],
      subcommands: [
        {
          name: cmdDef.options![0].name,
          type: "method",
          async chatInputRun(interaction) {
            const element = interaction.options.getString(
              "element",
              true,
            ) as ELEMENTS;
            let qty = interaction.options.getInteger("crown_quantity", true) as
              | 1
              | 2
              | 3;
            await interaction.deferReply({
              ephemeral: true,
            });

            if (element === "unaligned") {
              qty = 1;
            }

            const embeds = await HallOfFameCache.generateEmbeds(
              element,
              qty,
              10,
            );
            const pager = await viewBook(embeds);
            return pager(interaction);
          },
        },
        {
          name: cmdDef.options![1].name,
          type: "method",
          async chatInputRun(interaction) {
            const hofPublish = HoFJobSchedule.nextInvocation();
            return interaction.reply({
              embeds: [
                {
                  title: "Hall of Fame Refresh Schedule",
                  description: `Next refresh is scheduled at: ${time(hofPublish)} (${time(
                    hofPublish,
                    "R",
                  )})`,
                  color: COLORS.EMBED_COLOR,
                  footer: {
                    text: "Note: It will roughly take 30 mins to reflect new data in respective channel",
                  },
                },
              ],
            });
          },
        },
      ],
    });
  }

  public override registerApplicationCommands(registry: Subcommand.Registry) {
    registry.registerChatInputCommand(cmdDef, {
      guildIds: [EnvConfig.guildId],
    });
  }
}
