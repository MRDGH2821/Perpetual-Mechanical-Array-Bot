import { Event } from "@ruinguard/core";

export default new Event({
  event: "error",

  /**
   * logs errors
   * @function run
   * @param {Error} err - error object
   */
  run(err) {
    console.log("Error: ");
    console.error(err);
  }
});
