export function debug(obj: any) {
  return JSON.stringify(obj, null, 2);
}

export function leafDebug(obj: any) {
  console.log(debug(obj));
}
