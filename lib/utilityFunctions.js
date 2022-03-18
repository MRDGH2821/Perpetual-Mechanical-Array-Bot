import fetch from "node-fetch";

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
