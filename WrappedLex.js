import { Stack } from "./Stack.js";
export class WrappedLex extends Stack {
  constructor(lexArr) {
    super();
    this._arr = lexArr;
  }
  _get(start, amount) {
    return this._arr.slice(start, start + amount);
  }
  getLength() {
    return this._arr.length;
  }
}
