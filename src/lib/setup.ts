import "@sapphire/plugin-logger/register";
import {
  ApplicationCommandRegistries,
  RegisterBehavior,
} from "@sapphire/framework";
import * as colorette from "colorette";

// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= "development";

// Set default behavior to bulk overwrite
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(
  RegisterBehavior.BulkOverwrite,
);

// Enable colorette
colorette.createColors({ useColor: true });
