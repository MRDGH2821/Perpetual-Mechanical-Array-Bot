import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import type { AutocompleteInteraction } from 'discord.js';
import type { KitTechnology } from '../../../typeDefs/typeDefs';
import { AMC_PROPS, DMC_PROPS, EMC_PROPS, GMC_PROPS } from '../../lib/TravelerTechnologies';

export default class TravelerTechAutocompleteHandler extends InteractionHandler {
  public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.Autocomplete,
      enabled: true,
      name: 'TravelerTechAutoComplete',
    });
  }

  public override async run(
    interaction: AutocompleteInteraction,
    result: InteractionHandler.ParseResult<this>,
  ) {
    return interaction.respond(result);
  }

  public override async parse(interaction: AutocompleteInteraction) {
    // Get the focussed (current) option
    const focused = interaction.options.getFocused();
    interaction.client.logger.debug({ focused });

    const focusedOption = focused.toLowerCase();

    const cmdName = interaction.options.getSubcommand(true);

    let choices: KitTechnology[] | undefined;

    switch (cmdName) {
      case AMC_PROPS.skill.name: {
        choices = AMC_PROPS.skill.techs.filter((tech) =>
          tech.name.toLowerCase().includes(focusedOption),
        );
        break;
      }
      case AMC_PROPS.burst.name: {
        choices = AMC_PROPS.burst.techs.filter((tech) =>
          tech.name.toLowerCase().includes(focusedOption),
        );
        break;
      }
      case GMC_PROPS.skill.name: {
        choices = GMC_PROPS.skill.techs.filter((tech) =>
          tech.name.toLowerCase().includes(focusedOption),
        );
        break;
      }
      case GMC_PROPS.burst.name: {
        choices = GMC_PROPS.burst.techs.filter((tech) =>
          tech.name.toLowerCase().includes(focusedOption),
        );
        break;
      }
      case EMC_PROPS.skill.name: {
        choices = EMC_PROPS.skill.techs.filter((tech) =>
          tech.name.toLowerCase().includes(focusedOption),
        );
        break;
      }
      case EMC_PROPS.burst.name: {
        choices = EMC_PROPS.burst.techs.filter((tech) =>
          tech.name.toLowerCase().includes(focusedOption),
        );
        break;
      }
      case DMC_PROPS.skill.name: {
        choices = DMC_PROPS.skill.techs.filter((tech) =>
          tech.name.toLowerCase().includes(focusedOption),
        );
        break;
      }
      case DMC_PROPS.burst.name: {
        choices = DMC_PROPS.burst.techs.filter((tech) =>
          tech.name.toLowerCase().includes(focusedOption),
        );
        break;
      }
      default: {
        choices = undefined;
      }
    }
    interaction.client.logger.debug({ choices });
    if (choices) {
      return this.some(
        choices
          .map((choice) => ({
            name: choice.name,
            value: choice.id,
          }))
          .slice(0, 24),
      );
    }
    return this.none();
  }
}
