export function debug(obj: any) {
  return JSON.stringify(obj, null, 2);
}

export function leafDebug(obj: any) {
  console.log(debug(obj));
}

export function leaderboardLinkCheck(link: string) {
  return link.startsWith('https://discord.com/channels/803424731474034709/876121506680287263/');
}
