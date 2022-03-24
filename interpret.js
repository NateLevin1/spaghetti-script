import { State } from "./State.js";

export const interpret = (parse) => {
  console.log(parse);
  const state = new State();
  interpretFunction(parse.content, parse, state);
  alert(state.getOutput());
  console.log("Program finished executing.\n" + state);
};

function interpretFunction(content, parse, state) {
  for (const instr of content) {
    interpretInstruction(instr, parse, state);
  }
}

function interpretInstruction(instr, parse, state) {
  switch (instr.type) {
    case "func_call_if":
      // This uses fallthrough to execute the function in the same way
      // as "func_call" if there is no break statement.
      // We run the break if the value is not what it should be so that
      // no fallthrough occurs.
      if (instr.num != state.getAtPointer()) {
        break;
      }
    case "func_call":
      const fn = parse.functions[instr.name];
      if (!fn) throw "Runtime Error: Unknown function '" + instr.name + "'";
      interpretFunction(fn.content, parse, state);
      break;
    case "inc":
      state.increment();
      break;
    case "dec":
      state.decrement();
      break;
    case "input":
      // repeat until we get valid input
      let num;
      while (true) {
        const input = prompt("Please input a value (number/single letter)");
        if (!input) {
          alert("Stopping program because no input was provided!");
          throw "Runtime Error: Stopped by user";
        }
        if (/[0-9]+/.test(input)) {
          num = Number(input);
        } else {
          // if text, then make sure only one char and set to number
          if (input.length == 1) {
            num = input.charCodeAt(0);
          } else {
            alert(
              "Invalid input! Please enter a single character or a number."
            );
            continue;
          }
        }
        break;
      }
      state.setAtPointer(num);
      break;
    case "output":
      state.output(state.getAtPointer() + " ");
      break;
    case "ascii_output":
      state.output(String.fromCharCode(state.getAtPointer()));
      break;
    case "fork_right":
      state.pointerRight();
      break;
    case "fork_left":
      state.pointerLeft();
      break;
    default:
      throw "Unknown instruction type '" + instr.type + "'";
  }
}
