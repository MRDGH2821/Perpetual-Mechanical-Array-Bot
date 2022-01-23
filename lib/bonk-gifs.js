export default class Bonk {
  bonkGifs = [
    'https://c.tenor.com/CsXEC2e1F6MAAAAC/klee-klee-bonk.gif',
    'https://c.tenor.com/KGlqdROpWEEAAAAd/genshin-keqing.gif',
    'https://c.tenor.com/636jxoYmHfgAAAAd/bonk-ultimate-bonk.gif',
    'https://c.tenor.com/GQVoTVtfLvoAAAAC/psyduck-farfetchd.gif',
    'https://c.tenor.com/yaEqa7kN91MAAAAd/zhongli-bonk.gif',
    'https://c.tenor.com/tfgcD7qcy1cAAAAC/bonk.gif',
  ];
  hornyBonkGifs = [
    'https://c.tenor.com/8pGG6mJFMRsAAAAM/bonk-bonk-go-to-jail.gif',
    'https://c.tenor.com/TKbDxDPCkegAAAAC/horny-jail-go-to-horny-jail.gif',
  ];
  selfHornyBonkGifs = this.hornyBonkGifs.concat([
    'https://c.tenor.com/wCqp5yu_7awAAAAS/horny-bonk-bonk.gif',
  ]);

  allBonkGifs = this.selfHornyBonkGifs.concat(this.bonkGifs);

  reasons = [
    'Unspecified',
    '||For no reason :joy:||',
    'You need no reason to be told',
    'Because you are my Test Subject uwu',
    'Ah my hands slipped',
    'Just because...',
    'Because why not <:BoreasKek:829620211190595605>',
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
