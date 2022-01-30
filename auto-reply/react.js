function isHorny(text) {
  const reallyHorny
    = /h+o+r+n+(y|i)/gim.test(text)
    || /s+e+g+s/gim.test(text)
    || /s+e+x/gim.test(text);
  if (reallyHorny) {
    console.log('Horny Detected in msg');
    return true;
  }
  return false;
}

export default function react(message) {
  const msg = message.content;
  if (/(c+o+o+k+i+e)|🍪/gim.test(msg)) {
    message.react('🍪');
  }
  if (/(r+i+c+e)|🍚|🍙|🍘|🎑|🌾/gim.test(msg)) {
    const rices = ['🍚', '🍙', '🍘', '🎑', '🌾'];
    const rice = rices[Math.floor(Math.random() * rices.length)];
    message.react(rice);
  }
  if (/(s+u+s+h+i)|🍣/gim.test(msg)) {
    message.react('🍣');
  }
  if (/(b+r+e+a+d)|🍞|🥐|🥖|🥪/gim.test(msg)) {
    const breads = ['🍞', '🥐', '🥖', '🥪'];
    const bread = breads[Math.floor(Math.random() * breads.length)];
    message.react(bread);
  }

  if (isHorny(msg)) {
    const emotes = [
      '<:AntiHornyElixir:810751842883207168>',
      '<:HmmTher:830243224105779290>',
      '<:HmmMine:830243258960838717>',
      '<:AetherBonk:821169357765345291>',
    ];

    const emote = emotes[Math.floor(Math.random() * emotes.length)];
    message.react(emote);
  }

  if (/(q+u+a+c+k)|(h+o+n+k)|🦆/gim.test(msg)) {
    const unavaiableEmotes = [
      '<:GoosetherAlert:907305613892145162>',
      '<:goose:907301800472883230>',
      '<:QuackStab:859333036851855361>',
      '<:goose_stab:907301775365767227>',
      '<:goose_pizza:907301733519196220>',
    ];
    console.log(unavaiableEmotes[1]);
    const emotes = [
      '<:AetherNoU:905099437767024712>',
      '<:BoreasKek:829620211190595605>',
      '<:GoosetherConfuse:907307618677178368>',
      '<:FakeNooz:865259265471152138>',
      '<a:pepeduck:907293876073680946>',
      '<a:goose:907301647896690738>',
      '🦆',
    ];
    const emote = emotes[Math.floor(Math.random() * emotes.length)];
    message.react(emote);
  }
}
