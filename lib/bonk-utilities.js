import { AetherBonk, BoreasKek, HmmMine, HmmTher } from './emoteIDs.js';
import { formatEmoji, memberNicknameMention } from '@discordjs/builders';

export default class Bonk {
  bonkGifs = [
    'https://c.tenor.com/CsXEC2e1F6MAAAAC/klee-klee-bonk.gif',
    'https://c.tenor.com/KGlqdROpWEEAAAAd/genshin-keqing.gif',
    'https://c.tenor.com/636jxoYmHfgAAAAd/bonk-ultimate-bonk.gif',
    'https://c.tenor.com/GQVoTVtfLvoAAAAC/psyduck-farfetchd.gif',
    'https://c.tenor.com/yaEqa7kN91MAAAAd/zhongli-bonk.gif',
    'https://c.tenor.com/tfgcD7qcy1cAAAAC/bonk.gif',
    'https://c.tenor.com/CrmEU2LKix8AAAAC/anime-bonk.gif',
    'https://c.tenor.com/1T5bgBYtMgUAAAAC/head-hit-anime.gif',
    'https://c.tenor.com/CX31Svv6EIgAAAAd/rise-of-the-tmnt-rise-of-the-teenage-mutant-ninja-turtles.gif',
    'https://c.tenor.com/YexSKCMH9QAAAAAS/cheems-bonk.gif',
    'https://c.tenor.com/KrWVp75o3XkAAAAC/bonkdog-bonk.gif',
    'https://c.tenor.com/Gt6h5r_8C9YAAAAC/korone-hololive.gif',
    'https://c.tenor.com/K0u17jE1AaEAAAAC/minion-bonk.gif',
    'https://c.tenor.com/jYnasASWWO8AAAAd/koko-klee-klee-koko.gif',
    'https://c.tenor.com/cMG9mO4Ofe0AAAAC/bonk-ez.gif',
    'https://c.tenor.com/pJLEID1hql4AAAAC/bonk-among-us.gif',
    'https://c.tenor.com/onXBTwunE5kAAAAC/riamu-idolmaster.gif',
    'https://c.tenor.com/rRO7BFsBdd8AAAAC/genshin-impact-noelle.gif'
  ];

  hornyBonkGifs = [
    'https://c.tenor.com/8pGG6mJFMRsAAAAM/bonk-bonk-go-to-jail.gif',
    'https://c.tenor.com/TKbDxDPCkegAAAAC/horny-jail-go-to-horny-jail.gif',
    'https://tenor.com/view/hornyjail-bonk-baseballbat-kitty-cat-gif-19401897',
    'https://c.tenor.com/klRPXgXo6qIAAAAC/bonk-horny-jail.gif',
    'https://c.tenor.com/wnPpsKLFBjkAAAAC/horny-jail-one-piece-horny.gif',
    'https://c.tenor.com/gO3rkBum8K8AAAAd/gun-horny.gif',
    'https://c.tenor.com/KmgugL5sGv4AAAAC/go-to.gif',
    'https://c.tenor.com/vFYXLvCcb20AAAAd/sushi-bonk-sushidog.gif',
    'https://c.tenor.com/vfMW-Jqe9XoAAAAC/mv-milgram.gif',
    'https://c.tenor.com/2ZoiM0gQ_roAAAAC/total-drama-anne-maria.gif',
    'https://c.tenor.com/qN7K6H8dwTcAAAAC/squareposting-aerith.gif',
    'https://c.tenor.com/7KUIyxbhYBUAAAAd/honkai-impact.gif',
    'https://c.tenor.com/Ft5IsmgCxF4AAAAC/bonk-bonk-patrol.gif',
    'https://c.tenor.com/1oPg2SIlx9AAAAAC/genshin-impact-lisa.gif',
    'https://c.tenor.com/lbLIs_2bD8oAAAAd/raiden-bonk.gif',
    'https://c.tenor.com/G5mrFLtLJxgAAAAd/bonk-horny.gif',
    'https://c.tenor.com/S5v-oX_rN8QAAAAC/pramanix-arknights.gif'
  ];

  selfHornyBonkGifs = this.hornyBonkGifs.concat(['https://c.tenor.com/_qREHP6VgcwAAAAC/telepurte-bonk.gif']);

  allBonkGifs = this.selfHornyBonkGifs.concat(this.bonkGifs);

  reasons = [
    'Unspecified',
    '||For no reason :joy:||',
    'You need no reason to be told',
    'Because you are my Test Subject uwu',
    'Ah my hands slipped',
    'Just because...',
    `Because why not ${formatEmoji(BoreasKek)}`
  ];

  hornyReasons = [
    'You need no reason to be told',
    `No Horni ${HmmMine}`,
    `No Horni ${HmmTher}`,
    `No Segs ${HmmMine}`,
    `No Segs ${HmmTher}`,
    AetherBonk,
    '*You are the sole reason why this chat has become impure*',
    '***You shall be bonked***'
  ];

  crowdSourcedHornyReasons = [
    `"Simply un good" - ${memberNicknameMention('823564960671072336')}`,
    `"You can do better than that" - ${memberNicknameMention('621330211220226049')}`,
    `"Do better" - ${memberNicknameMention('621330211220226049')}`,
    `"You suck" - ${memberNicknameMention('505390548232699906')}`
  ];

  allHornyReasons = this.hornyReasons.concat(this.crowdSourcedHornyReasons);

  allReasons = this.reasons.concat(this.allHornyReasons);

  /**
   * initialises class
   * @constructor
   * @param {string} message - the message to check
   */
  Bonk(message) {
    this.message = message;
  }

  /**
   * checks whether given msg is horny or not
   * @function isHorny
   * @param {string} msg - the message to test against
   * @returns {boolean} - is the msg horny type?
   */
  isHorny(msg) {
    const checkMsg = msg || this.message,
      notHorny =
        (/((n+o)|(n+o+t))\s((h+o+r+n+(y|i))|(s+e+g+s)|(s+e+x))/gimu).test(checkMsg),
      reallyHorny =
        (/h+o+r+n+(y|i)/gimu).test(checkMsg) ||
        (/s+e+g+s/gimu).test(checkMsg) ||
        (/s+e+x/gimu).test(checkMsg);

    console.log('Horny msg detected?: ', reallyHorny && !notHorny);
    return reallyHorny && !notHorny;
  }

  /**
   * selects a random bonk gif
   * @function bonkGif
   * @returns {string} - a random bonk gif link
   */
  bonkGif() {
    console.log('Random bonk gif selected');
    return this.bonkGifs[Math.floor(Math.random() * this.bonkGifs.length)];
  }

  /**
   * selects a random horny bonk gif
   * @function hornyBonkGif
   * @returns {string} - a random horny bonk gif link
   */
  hornyBonkGif() {
    console.log('Random horny bonk gif selected');
    return this.hornyBonkGifs[
      Math.floor(Math.random() * this.hornyBonkGifs.length)
    ];
  }

  /**
   * selects a random self horny bonk gif
   * @function selfHornyBonkGif
   * @returns {string} - a random self horny bonk gif link
   */
  selfHornyBonkGif() {
    console.log('Random self horny bonk gif selected');
    return this.selfHornyBonkGifs[
      Math.floor(Math.random() * this.selfHornyBonkGifs.length)
    ];
  }

  /**
   * selects a random gif from complete collection
   * @function randomBonkGif
   * @returns {string} - a random gif from complete collection
   */
  randomBonkGif() {
    console.log('Random bonk gif from complete collection selected');
    return this.allBonkGifs[
      Math.floor(Math.random() * this.allBonkGifs.length)
    ];
  }

  /**
   * selects a random reason to bonk
   * @function bonkReason
   * @returns {string} - a random reason to bonk
   */
  bonkReason() {
    return this.reasons[Math.floor(Math.random() * this.reasons.length)];
  }

  /**
   * selects a random horny reason to bonk
   * @function bonkHornyReason
   * @returns {string} - a random reason to bonk horny
   */
  bonkHornyReason() {
    return this.allHornyReasons[
      Math.floor(Math.random() * this.allHornyReasons.length)
    ];
  }
}
