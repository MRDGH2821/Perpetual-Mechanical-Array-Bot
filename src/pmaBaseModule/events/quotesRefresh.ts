import BotEvent from '../../lib/BotEvent';
import { botQuoteCategories } from '../../lib/DynamicConstants';
import { getQuotes, setDBQuotes } from '../../lib/QuotesManager';
import { Debugging } from '../../lib/Utilities';

export default new BotEvent({
  event: 'quotesRefresh',
  on: true,
  async listener() {
    console.log('Starting Quotes refresh');
    const promises: Promise<void>[] = [];
    botQuoteCategories.forEach((category) => {
      const promise = setDBQuotes(category)
        .then(() => console.log(`${category} refresh done`))
        .catch((err) => {
          console.log('An error occurred while refreshing:');
          Debugging.leafDebug(err, true);
        });

      promises.push(promise);
    });

    await Promise.all(promises)
      .then(() => console.log('Quotes refresh done'))
      .catch((err) => {
        console.log('There was an error');
        Debugging.leafDebug(err, true);
      });

    console.log(await getQuotes('RNGMuteQuotes'));
  },
});
