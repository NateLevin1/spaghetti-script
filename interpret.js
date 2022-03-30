import { State } from "./State.js";

const output = document.getElementById("output");
export const interpret = (parse) => {
  console.log(parse);
  const state = new State();
  interpretFunction(parse.content, parse, state);
  state.flushOutput();
  output.innerText += "\n\n\n\nState:\n" + state.toString();
  console.log("Program finished executing.\n" + state);
};

function interpretFunction(content, parse, state) {
  for (const instr of content) {
    const suspendExecution = interpretInstruction(instr, parse, state);
    if (suspendExecution) break;
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
    case "func_goto":
      return interpretFunctionCallFromParse(instr, parse, state);
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
        const input = prompt(
          "Please input a value:\n(any number or a single letter, \\0-9 for literal number as ascii)"
        );
        if (!input) {
          alert("Stopping program because no input was provided!");
          throw "Runtime Error: Stopped by user";
        }
        if (/^-?[0-9]+$/.test(input)) {
          num = Number(input);
        } else {
          // if text, then make sure only one char and set to number
          let charToLookAt = 0;
          if (/^\\[0-9]$/.test(input)) {
            // Interpret as a string, without backslash (just the number)
            // This allows for getting the ascii value of a number instead
            // of the number itself
            charToLookAt = 1;
          } else if (input.length != 1) {
            // This is an `else` because  if it is an escaped number the length
            // can be two. We still need to check it is only one character for
            // regular strings though, so we do that here
            alert(
              "Invalid input! Please enter a single character or a number."
            );
            continue;
          }

          num = input.charCodeAt(charToLookAt);
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
    case "flush_output":
      state.flushOutput();
      break;
    default:
      throw "Unknown instruction type '" + instr.type + "'";
  }
}

function interpretFunctionCallFromParse(instr, parse, state) {
  const fn = parse.functions[instr.name];
  if (!fn) throw "Runtime Error: Unknown function '" + instr.name + "'";
  interpretFunction(fn.content, parse, state);

  // suspend execution if it is a goto function (===≡n)
  return instr.isGoto;
}
