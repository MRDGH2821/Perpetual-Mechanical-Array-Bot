import {
  Subcommand,
  type SubcommandMapping,
} from "@sapphire/plugin-subcommands";
import type {
  ApplicationCommandOptionData,
  ChatInputCommandInteraction,
} from "discord.js";
import { ApplicationCommandOptionType, MessageFlags } from "discord.js";
import EnvConfig from "../../lib/EnvConfig.js";
import type { ELEMENTS, JSONCmd } from "../../typeDefs/typeDefs.js";
import { getElementProp, getTech, isSkill } from "../lib/TravelerTechnologies.js";

function APISubCommandBuilder(element: ELEMENTS): ApplicationCommandOptionData {
  const eleProp = getElementProp(element);

  return {
    type: ApplicationCommandOptionType.SubcommandGroup,
    name: eleProp.element,
    description: eleProp.description,
    options: [
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: eleProp.skill.name,
        description: eleProp.skill.description,
        options: [
          {
            type: ApplicationCommandOptionType.String,
            name: "tech",
            description: "Select Tech",
            required: true,
            autocomplete: true,
          },
        ],
      },
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: eleProp.burst.name,
        description: eleProp.burst.description,
        options: [
          {
            type: ApplicationCommandOptionType.String,
            name: "tech",
            description: "Select Tech",
            required: true,
            autocomplete: true,
          },
        ],
      },
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: "guide",
        description: `${eleProp.name} guide`,
      },
    ],
  };
}

const cmdDef: JSONCmd = {
  name: "traveler",
  description: "Guild command with sub commands",
  options: [
    APISubCommandBuilder("anemo"),
    APISubCommandBuilder("geo"),
    APISubCommandBuilder("electro"),
    APISubCommandBuilder("dendro"),
  ],
};

function subCommandGroupMaker(element: ELEMENTS): SubcommandMapping {
  const eleProp = getElementProp(element);
  return {
    name: eleProp.element,
    type: "group",
    entries: [
      {
        name: "guide",
        type: "method",
        chatInputRun: "runCmd",
      },
      {
        name: eleProp.skill.name,
        type: "method",
        chatInputRun: "runCmd",
      },
      {
        name: eleProp.burst.name,
        type: "method",
        chatInputRun: "runCmd",
      },
    ],
  };
}

export default class GuildCommand extends Subcommand {
  public constructor(context: Subcommand.Context, options: Subcommand.Options) {
    super(context, {
      ...options,
      name: cmdDef.name,
      description: cmdDef.description,
      subcommands: [
        subCommandGroupMaker("anemo"),
        subCommandGroupMaker("geo"),
        subCommandGroupMaker("electro"),
        subCommandGroupMaker("dendro"),
      ],
    });
  }

  public async runCmd(interaction: ChatInputCommandInteraction) {
    const element = interaction.options.getSubcommandGroup(true);
    const subCommand = interaction.options.getSubcommand(true);
    const eleProp = getElementProp(element as ELEMENTS);
    if (subCommand === "guide") {
      return interaction.reply({ content: eleProp.guide });
    }

    this.container.logger.debug("Obtaining tech input");
    const techId = interaction.options.getString("tech", true);

    this.container.logger.debug("Searching for tech");
    const tech = getTech({
      element: element as ELEMENTS,
      type: isSkill(subCommand) ? "skill" : "burst",
      id: techId,
    });
    this.container.logger.debug(tech);

    if (tech) {
      const { gif } = tech;
      return interaction.reply({
        content: gif,
      });
    }

    return interaction.reply({
      content: `Invalid tech name entered. (Got \`${techId}\`)`,
      flags: MessageFlags.Ephemeral,
    });
  }

  public override registerApplicationCommands(registry: Subcommand.Registry) {
    registry.registerChatInputCommand(cmdDef, {
      guildIds: [EnvConfig.guildId],
    });
  }
}
