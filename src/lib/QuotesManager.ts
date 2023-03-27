import { Collection } from 'discord.js';
import type { DBQuotes, DBQuotesCollection } from '../typeDefs/typeDefs';
import db from './Firestore';

export const DBquotes = new Collection() as DBQuotesCollection;

async function getDBQuotes(option: DBQuotes): Promise<string[]> {
  return new Promise((res) => {
    let quotesArray: string[] = [];
    db.collection('quotes-gifs-reasons')
      .doc(option)
      .get()
      .then((docSnap) => {
        const data = docSnap.data();
        if (data) {
          quotesArray = data.array as unknown as string[];
          res(quotesArray);
        } else {
          res([]);
        }
        // rej(new Error(`No quotes/GIFs/reasons exist for "${option}"`));
      });
  });
}

export async function setDBQuotes(option: DBQuotes) {
  const quotesArray = await getDBQuotes(option);
  DBquotes.set(option, quotesArray);
}

export function getQuotes(option: DBQuotes): string[] {
  const quotesArray = DBquotes.get(option);

  if (quotesArray) {
    return quotesArray;
  }
  return [];
  // throw new Error(`No quotes/GIFs/reasons exist for "${option}"`);
}

export async function addQuote(option: DBQuotes, quote: string) {
  const newArray = getQuotes(option);
  newArray.push(quote);
  const data = { array: newArray };
  await db.collection('quotes-gifs-reasons').doc(option).set(data, {
    merge: true,
  });
}

// console.log(await getQuotes('RNGMuteQuotes'));
