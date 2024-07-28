import { Collection } from 'discord.js';
import db from '../../lib/Database/Firestore';
import type { DBQuotes, DBQuotesCollection } from '../../typeDefs/typeDefs';

export default class QuotesManager {
  static #DBquotes = new Collection() as DBQuotesCollection;

  static async #fetchDBQuotes(option: DBQuotes): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let quotesArray: string[] = [];
      db.collection('quotes-gifs-reasons')
        .doc(option)
        .get()
        .then((docSnap) => {
          const data = docSnap.data();
          if (data) {
            quotesArray = data.array as unknown as string[];
            return resolve(quotesArray);
          }
          return resolve([]);

          // rej(new Error(`No quotes/GIFs/reasons exist for "${option}"`));
        })
        .catch(reject);
    });
  }

  static async prepareCache(option: DBQuotes) {
    const quotesArray = await this.#fetchDBQuotes(option);
    this.#DBquotes.set(option, quotesArray);
  }

  static getQuotes(option: DBQuotes): string[] {
    const quotesArray = this.#DBquotes.get(option);

    if (quotesArray) {
      return quotesArray;
    }
    return [];
    // throw new Error(`No quotes/GIFs/reasons exist for "${option}"`);
  }

  static async add(option: DBQuotes, quote: string) {
    const newArray = this.getQuotes(option);
    newArray.push(quote);
    const data = { array: newArray };
    await db.collection('quotes-gifs-reasons').doc(option).set(data, {
      merge: true,
    });
  }
}
// container.logger.log(await getQuotes('RNGMuteQuotes'));
