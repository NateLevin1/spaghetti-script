import { Stack } from "./Stack.js";
export class Str extends Stack {
  constructor(str) {
    super();
    this._str = str;
  }
  _get(start, amount) {
    return this._str.substring(start, start + amount);
  }
  getLength() {
    return this._str.length;
  }

  isNextNumber() {
    if (this.hasLeft()) {
      // can't use the Number() constructor because it is often wrong (eg Number(" ") == 0)
      return /[0-9]+/.test(this.peek());
    }
    return false;
  }
  getFollowingNumber(errorMsg, options = { allowNegative: false }) {
    if (
      !this.isNextNumber() &&
      !(options.allowNegative && this.peek() == "-")
    ) {
      throw errorMsg;
    }
    let num = this.take();
    while (this.isNextNumber()) {
      num += this.take();
    }
    return num;
  }
}
