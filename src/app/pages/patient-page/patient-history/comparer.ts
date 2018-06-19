export class Comparer {
  constructor() {
  }

  static VALUE_CREATED = 'created';
  static VALUE_UPDATED = 'updated';
  static VALUE_DELETED = 'deleted';

  compare(obj1, obj2) {
    const dif = {};
    this.compareInternal(obj1, obj2, dif, '');
    return dif;
  }

  private compareInternal(obj1, obj2, diff, path) {
    if (this.isFunction(obj1) || this.isFunction(obj2)) {
      throw new Error('Invalid argument. Function given, object expected.');
    }
    if (this.isValue(obj1) || this.isValue(obj2)) {
      const type = this.compareValues(obj1, obj2);
      if (type) {
        diff[path] = {
          type: type,
          data: (obj1 === undefined) ? obj2 : obj1
        };
        if (type === Comparer.VALUE_UPDATED) {
          diff[path].before = obj1;
          diff[path].after = obj2;
        }
      }
      return;
    }

    Array.from(new Set(Object.keys(obj1).concat(...Object.keys(obj2))).keys()).forEach(k => {
      if (this.isFunction(obj1[k])) {
        return;
      }
      this.compareInternal(obj1[k], obj2[k], diff, path.length > 0 ? `${path}.${k}` : k);
    });
  }

  private compareValues(value1, value2) {
    if (value1 === value2) {
      return undefined;
    }
    if (this.isDate(value1) && this.isDate(value2) && value1.getTime() === value2.getTime()) {
      return undefined;
    }
    if ('undefined' === typeof(value1)) {
      return Comparer.VALUE_CREATED;
    }
    if ('undefined' === typeof(value2)) {
      return Comparer.VALUE_DELETED;
    }

    return Comparer.VALUE_UPDATED;
  }

  private isFunction(obj) {
    return {}.toString.apply(obj) === '[object Function]';
  }

  private isArray(obj) {
    return {}.toString.apply(obj) === '[object Array]';
  }

  private isDate(obj) {
    return {}.toString.apply(obj) === '[object Date]';
  }

  private isObject(obj) {
    return {}.toString.apply(obj) === '[object Object]';
  }

  private isValue(obj) {
    return !this.isObject(obj) && !this.isArray(obj);
  }
}
