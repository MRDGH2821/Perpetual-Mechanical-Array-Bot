import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import type { AutocompleteInteraction } from 'discord.js';
import { AMC_PROPS, DMC_PROPS, EMC_PROPS, GMC_PROPS } from '../../lib/TravelerTechnologies';

export default class TravelerTechAutocompleteHandler extends InteractionHandler {
  public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.Autocomplete,
    });
  }

  public override async run(
    interaction: AutocompleteInteraction,
    result: InteractionHandler.ParseResult<this>,
  ) {
    // @ts-ignore
    return interaction.respond(result);
  }

  public override async parse(interaction: AutocompleteInteraction) {
    // Get the focussed (current) option
    const focusedOption = interaction.options.getFocused();
    interaction.client.logger.debug(focusedOption);

    const cmdName = interaction.options.getSubcommand(true);

    let choices: typeof AMC_PROPS.skill.techs | undefined;

    switch (cmdName) {
      case AMC_PROPS.skill.name: {
        choices = AMC_PROPS.skill.techs.filter((tech) => tech.name.includes(focusedOption));
        break;
      }
      case AMC_PROPS.burst.name: {
        choices = AMC_PROPS.burst.techs.filter((tech) => tech.name.includes(focusedOption));
        break;
      }
      case GMC_PROPS.skill.name: {
        choices = GMC_PROPS.skill.techs.filter((tech) => tech.name.includes(focusedOption));
        break;
      }
      case GMC_PROPS.burst.name: {
        choices = GMC_PROPS.burst.techs.filter((tech) => tech.name.includes(focusedOption));
        break;
      }
      case EMC_PROPS.skill.name: {
        choices = EMC_PROPS.skill.techs.filter((tech) => tech.name.includes(focusedOption));
        break;
      }
      case EMC_PROPS.burst.name: {
        choices = EMC_PROPS.burst.techs.filter((tech) => tech.name.includes(focusedOption));
        break;
      }
      case DMC_PROPS.skill.name: {
        choices = DMC_PROPS.skill.techs.filter((tech) => tech.name.includes(focusedOption));
        break;
      }
      case DMC_PROPS.burst.name: {
        choices = DMC_PROPS.burst.techs.filter((tech) => tech.name.includes(focusedOption));
        break;
      }
      default: {
        choices = undefined;
      }
    }

    if (choices) {
      return this.some(
        choices.map((choice) => ({
          name: choice.name,
          value: choice.gif,
        })),
      );
    }
    return this.none();
  }
}
