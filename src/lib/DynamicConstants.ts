import QuotesManager from "../baseBot/lib/QuotesManager.js";
import type { DBQuotes } from "../typeDefs/typeDefs.js";

export const ABYSS_QUOTES = [
  "*You stare into the abyss and you feel some presence staring over you*",
  "*Darkness beseech upon the emptiness of the void, howling and yet nothing calls back*",
  "*The path of the Copium ends here, Your journey has come to an end*",
  "*The darkness breaks upon the dawning night, the night sky bleaks upon the emptiness*",
  "*Well.. thats it folks*",
  "*When you stare into the Abyss*\n*The Abyss stars back at you*",
  "https://tenor.com/view/john-cena-cena-are-you-sure-are-you-sure-about-that-are-you-sure-about-that-meme-gif-23133134",
  "https://tenor.com/view/staring-into-space-gif-8743533",
  "https://tenor.com/view/stare-into-the-abyss-the-grinch-jim-carrey-how-the-grinch-stole-christmas-stare-into-nothingness-gif-18820322",
  "https://tenor.com/view/cave-dive-darkness-leap-gif-5803442",
  "https://tenor.com/view/full-bore-and-into-the-abyss-davy-jones-abyss-dark-bore-gif-22332324",
]
  .concat(
    QuotesManager.getQuotes("abyssGifs"),
    QuotesManager.getQuotes("abyssQuotes"),
  )
  .flat();
export const QUOTE_CATEGORIES: DBQuotes[] = [
  "FBIGifs",
  "FBIQuotes",
  "RNGMuteQuotes",
  "RNGMuteReasons",
  "TikTokGifs",
  "TikTokQuotes",
  "abyssGifs",
  "abyssQuotes",
  "banHammerReasons",
  "bonkGifs",
  "crowdSourcedBonkReasons",
  "crowdSourcedHornyBonkReasons",
  "hornyBonkGifs",
  "leakQuotes",
  "leaksMuteReasons",
  "selfHornyBonkGifs",
  "yoyoverseQuotes",
];
