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
    'Because why not <:BoreasKek:829620211190595605>'
  ];

  bonkGif() {
    return this.bonkGifs[Math.floor(Math.random() * this.bonkGifs.length)];
  }

  hornyBonkGif() {
    return this.hornyBonkGifs[
      Math.floor(Math.random() * this.hornyBonkGifs.length)
    ];
  }

  selfHornyBonkGif() {
    return this.selfHornyBonkGifs[
      Math.floor(Math.random() * this.selfHornyBonkGifs.length)
    ];
  }

  randomBonkGif() {
    return this.allBonkGifs[
      Math.floor(Math.random() * this.allBonkGifs.length)
    ];
  }

  bonkReason() {
    return this.reasons[Math.floor(Math.random() * this.reasons.length)];
  }
}
