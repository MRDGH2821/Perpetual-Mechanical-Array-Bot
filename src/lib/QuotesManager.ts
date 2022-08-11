import { BaseCollection } from 'detritus-utils';
import { DBQuotes, DBQuotesCollection } from '../botTypes/types';
import db from './Firestore';
import { PMAEventHandler } from './Utilities';

export const DBquotes = <DBQuotesCollection> new BaseCollection();

export async function getDBQuotes(option: DBQuotes): Promise<string[]> {
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

export async function getQuotes(option: DBQuotes): Promise<string[]> {
  return new Promise((res, rej) => {
    const quotesArray = DBquotes.get(option);

    if (quotesArray) {
      res(quotesArray);
    } else {
      rej(new Error(`No quotes/GIFs/reasons exist for "${option}"`));
    }
  });
}

export async function addQuote(option: DBQuotes, quote: string, triggerRefresh: boolean = true) {
  const newArray = await getQuotes(option);
  newArray.push(quote);
  const data = { array: newArray };
  await db.collection('quotes-gifs-reasons').doc(option).set(data, {
    merge: true,
  });
  if (triggerRefresh) {
    PMAEventHandler.emit('quotesRefresh', true);
  }
}

// console.log(await getQuotes('RNGMuteQuotes'));
