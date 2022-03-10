import { db } from './firebase.cjs';

const elementCategories = [
  'anemo-dmg-skill',
  'geo-dmg-skill',
  'electro-dmg-skill',
  'uni-dmg-n5'
];

/**
 * returns array of data sorted by score from database
 * @async
 * @function leaderboardData
 * @param {string} element -'anemo-dmg-skill', 'geo-dmg-skill', 'electro-dmg-skill', 'uni-dmg-n5'
 * @param {string} type - solo or open, default solo
 * @param {number} topEntries - top 'N' entries, default is complete database
 * @returns {Promise<Array<{elementCategory: string, userID: string, typeCategory: string, proof: string, score: number}>>} - array of database entries
 */
export async function leaderboardData(element, type, topEntries = 0) {
  console.log('type:', type);
  const dataArray = [];
  if (elementCategories.includes(element)) {
    if (
      type.toLowerCase().startsWith('solo') ||
      type.toLowerCase().startsWith('open')
    ) {
      await db
        .collection(`${element}-${type.toLowerCase()}`)
        .orderBy('score', 'desc')
        .limit(topEntries)
        .get()
        .then((query) => {
          query.forEach((docSnap) => {
            dataArray.push(docSnap.data());
          });
        });
    }
    else {
      throw new Error(`"${type}" is not a valid type`);
    }
  }
  else {
    throw new Error(`"${element}" is not a valid element`);
  }
  return dataArray;
}

console.log(await leaderboardData(elementCategories[1], 'solo'));
