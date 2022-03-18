import { Event } from "@ruinguard/core";
// eslint-disable-next-line no-unused-vars
import { User } from "discord.js";
import { db } from "../lib/firebase.cjs";

export default new Event({
  event: "leaderboardEntry",

  /**
   * submits score for leaderboard
   * @function run
   * @param {User} target - user whose score is registered
   * @param {object} submission - properties of submission
   * @param {string} submission.elementCategory - elemental category
   * @param {string} submission.proof - submission proof link
   * @param {number} submission.score - damage score
   * @param {string} submission.typeCategory - solo or open category
   */
  async run(target, { elementCategory, proof, score, typeCategory }) {
    console.log("Entry received, saving to database");
    const collectionName = `${elementCategory}-${typeCategory}`,
      submission = {
        elementCategory,
        proof,
        score,
        typeCategory,
        userID: target.id
      };
    await db
      .collection(collectionName)
      .doc(target.id)
      .set(submission)
      .then(() => console.log("Leaderboard Entry submitted!"))
      .catch((error) => {
        console.log("An error occurred while submitting leaderboard entry");
        console.error(error);
      });

    target.client.emit("leaderboardRefresh", target.client);
    console.log("Refresh initiated");
  }
});
