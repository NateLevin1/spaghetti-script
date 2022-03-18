export class Str {
  constructor(str) {
    this._index = 0;
    this._str = str;
  }
  _get(start, amount) {
    return this._str.substring(start, start + amount);
  }
  peek(amount = 1) {
    return this._get(this._index, amount);
  }
  take(amount = 1) {
    if (this._index + amount > this._str.length) {
      throw "Lexer Error: Expected more text";
    }
    const s = this._get(this._index, amount);
    this._index += amount;
    return s;
  }
  hasLeft() {
    return this._index < this._str.length;
  }

  isNextNumber() {
    if (this.hasLeft()) {
      return !isNaN(Number(this.peek()));
    }
    return false;
  }
  getFollowingNumber(errorMsg) {
    if (!this.isNextNumber()) {
      throw errorMsg;
    }
    let num = this.take();
    while (this.isNextNumber()) {
      num += this.take();
    }
    return num;
  }
}
