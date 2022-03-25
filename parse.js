/*

Example parse:
Input: "[1~:O] ---≡1"
Output: {
    "type": "root",
    "content": [
        {
            "type": "func_call",
            "name": "1"
        }
    ],
    "functions": {
        "1": {
            "type": "function",
            "content": [
                {
                    "type": "inc"
                },
                {
                    "type": "output"
                }
            ],
            "name": "1"
        }
    }
  }
}

*/

import { lex } from "./lex.js";
import { WrappedLex } from "./WrappedLex.js";

export const parse = (text) => {
  const lexArr = lex(text);
  return parseRoot(new WrappedLex(lexArr));
};

function parseRoot(lex) {
  const content = [];
  const functions = {};

  while (lex.hasLeft()) {
    const next = lex.take()[0];
    switch (next.type) {
      case "func_def":
        const name = next.name;
        const parsedFunc = parseFunc(lex, name);
        functions[name] = parsedFunc;
        break;
      case "func_call":
        content.push({ type: "func_call", name: next.name });
        break;
      default:
        throw "Parse Error: '" + next.type + "' is invalid in global scope";
    }
  }

  return { type: "root", content, functions };
}

function parseFunc(lex, name) {
  const content = [];
  while (true) {
    if (!lex.hasLeft()) {
      throw `Expected an end to the function '${name}'`;
    }

    const next = lex.take()[0];
    if (next.type == "func_end") {
      break;
    }

    if (next.type == "func_call_if") {
      const call = lex.take()[0];
      if (call.type != "func_call" && call.type != "func_goto") {
        throw `Parse Error: Expected a call after '{o=${next.num}}', instead found '${call.type}'`;
      }
      content.push({
        type: "func_call_if",
        num: next.num,
        name: call.name,
        isGoto: call.isGoto,
      });
      continue;
    } else if (next.type == "func_def") {
      throw "Parse Error: Cannot define a function in a function.";
    }
    content.push(next);
  }
  return { type: "function", content, name };
}
