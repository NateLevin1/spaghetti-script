const output = document.getElementById("output");
export class State {
  constructor() {
    this.array = [0];
    this.pointer = 0;
    this.memory = 0;
    this._output = "";
  }
  increment() {
    this.array[this.pointer]++;
  }
  decrement() {
    this.array[this.pointer]--;
  }
  pointerRight() {
    this.pointer++;
    if (this.pointer >= this.array.length) {
      this.array.push(0);
    }
  }
  pointerLeft() {
    this.pointer--;
    if (this.pointer < 0) {
      this.array.unshift(0);
      this.pointer++;
    }
  }
  toString() {
    return `tape=${JSON.stringify(this.array)}\nmemory=${
      this.memory
    }\npointer=${this.pointer}`;
  }
  getAtPointer() {
    return this.array[this.pointer];
  }
  setAtPointer(value) {
    this.array[this.pointer] = value;
  }
  getMemory() {
    return this.memory;
  }
  setMemory(value) {
    this.memory = value;
  }
  output(value) {
    console.log(value);
    this._output += value;
  }
  getOutput() {
    return this._output;
  }
  flushOutput() {
    if (this._output.length > 0) {
      alert(this._output);
      output.innerText += this._output;
      console.log("Flushed Output: " + this._output);
      this._output = "";
    } else {
      console.log("No output to flush.");
    }
  }
}
