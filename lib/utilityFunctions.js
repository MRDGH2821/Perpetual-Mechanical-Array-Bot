// eslint-disable-next-line no-unused-vars
import { Client, Collection } from "discord.js";
import ProgressBar from "progress";
import fetch from "node-fetch";
import { hofData } from "./HallOfFameManager.js";
import { leaderboardData } from "./LeaderboardManager.js";

/* eslint-disable no-useless-escape */
const URLregexp1 =
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/gu,
  URLregexp2 =
    /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/giu;

/**
 * checks if given URL is valid or not
 * @param {string} url - link/URL
 * @returns {boolean} - whether given URL is valid or not
 */
export function isURLvalid(url) {
  return URLregexp1.test(url) || URLregexp2.test(url);
}

/**
 * returns a joke
 * @function getJoke
 * @param {string} type - type of joke
 * @returns {Promise<JSON>} - returns joke in JSON format
 */
export async function getJoke(type = "Any") {
  const jokeAPI = `https://v2.jokeapi.dev/joke/${type}?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&safe-mode`,
    jokeResponse = await fetch(jokeAPI);

  return jokeResponse.json();
}

/**
 * sets leaderboard data into collection
 * @async
 * @function leaderboardSetData
 * @param {object} dataProps
 * @param {"anemo-dmg-skill"|"geo-dmg-skill"|"electro-dmg-skill"|"uni-dmg-n5"} dataProps.dmgCategory
 * @param {"open"|"solo"} dataProps.type
 * @param {Collection} dataProps.collection
 * @param {Client} dataProps.client
 */
export async function leaderboardSetData({
  dmgCategory,
  type,
  collection,
  client
}) {
  const lbData = await leaderboardData(dmgCategory, type),
    // eslint-disable-next-line sort-vars
    lbBar = new ProgressBar(
      `Refresh Started! Damage Category: ${dmgCategory}-${type}, Loading Cache: [:bar] (:current/:total), Time Taken: :elapsed second(s), ETA: :eta`,
      {
        callback: () => {
          console.log("Refresh Complete");
        },
        total: lbData.length
      }
    );
  for (const data of lbData) {
    client.users.fetch(data.userID).then((User) => {
      const dataToPut = {
        User,
        data
      };
      collection.set(data.userID, dataToPut);
      lbBar.tick();
    });
  }
}

/**
 * sets hall of fame data into collection
 * @async
 * @function leaderboardSetData
 * @param {object} dataProps
 * @param {"anemo-crown"|"geo-crown"|"electro-crown"|"unaligned-crown"|"spiral-abyss-once"|"current-spiral-abyss"} dataProps.dmgCategory
 * @param {Collection} dataProps.collection
 * @param {Client} dataProps.client
 */
export async function hallOfFameSetData({
  dmgCategory,
  collection,
  client
}) {
  const lbData = await hofData(dmgCategory),
    // eslint-disable-next-line sort-vars
    lbBar = new ProgressBar(
      `Refresh Started! Hall of Fame Category: ${dmgCategory}, Loading Cache: [:bar] (:current/:total), Time Taken: :elapsed second(s), ETA: :eta`,
      {
        callback: () => {
          console.log("Refresh Complete");
        },
        total: lbData.length
      }
    );
  for (const data of lbData) {
    client.users.fetch(data.userID).then((User) => {
      const dataToPut = {
        User,
        data
      };
      collection.set(data.userID, dataToPut);
      lbBar.tick();
    });
  }
}
