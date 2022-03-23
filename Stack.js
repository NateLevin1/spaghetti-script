export class Stack {
  constructor() {
    this._index = 0;
  }
  peek(amount = 1) {
    return this._get(this._index, amount);
  }
  take(amount = 1) {
    if (this._index + amount > this.getLength()) {
      throw "Parse Error: Expected more text";
    }
    const arr = this._get(this._index, amount);
    this._index += amount;
    return arr;
  }
  hasLeft() {
    return this._index < this.getLength();
  }
  toString() {
    return `Cur: ${JSON.stringify(this.peek())} Remaining: ${JSON.stringify(
      this._get(this._index, this.getLength() - this._index),
      null,
      2
    )}`;
  }
  getIndex() {
    return this._index;
  }
}
