export class FieldFilter {
  private blacklist: RegExp[];
  constructor(blacklist: string[]) {
    this.blacklist = blacklist.map(s => new RegExp(s));
  }

  filter(obj) {
    if (!obj) return obj;
    const res = {};
    Object.keys(obj).forEach(k => {
      if (!this.blacklist.some(r => r.test(k))) {
        res[k] = obj[k];
      }
    });
    return res;
  }
}
