import { Module } from "@ruinguard/core";
import { arrayOfFilesGenerator } from "./filesExporter.js";

const events = await arrayOfFilesGenerator("./hallOfFameEvents");

export default await new Module({
  events,
  name: "Hall Of Fame Events"
});
