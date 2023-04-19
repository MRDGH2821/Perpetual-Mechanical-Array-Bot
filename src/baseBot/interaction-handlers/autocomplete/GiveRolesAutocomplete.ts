import {
  InteractionHandler,
  InteractionHandlerTypes,
  type PieceContext,
} from '@sapphire/framework';
import type { AutocompleteInteraction } from 'discord.js';
import { ACHIEVEMENT_ROLES } from '../../../lib/Constants';

export default class GiveRolesAutocompleteHandler extends InteractionHandler {
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
    return interaction.respond(result);
  }

  public override async parse(interaction: AutocompleteInteraction) {
    // Only run this interaction for the command with ID '1000802763292020737'
    if (!['give-role', 'one', 'multi'].includes(interaction.commandName)) return this.none();

    // Get the focused (current) option
    const focusedOption = interaction.options.getFocused();

    const input = focusedOption.toLowerCase();

    const values = ACHIEVEMENT_ROLES.filter((role) => role.name.toLowerCase().includes(input));

    // Ensure that the option name is one that can be autocompleted, or return none if not.
    return this.some(values);
  }
}
