export function getKeyByValue (object: {[key in string] : any}, value: any) : string {
  return Object.keys(object).find(key => object[key] === value) as string;
}