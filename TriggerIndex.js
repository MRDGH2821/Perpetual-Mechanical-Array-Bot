import { Module } from "@ruinguard/core";
import { arrayOfFilesGenerator } from "./filesExporter.js";

const events = await arrayOfFilesGenerator("./triggers");

export default await new Module({
  events,
  name: "PMA Triggers"
});
