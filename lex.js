import { Str } from "./Str.js";

export const lex = (text) => {
  const str = new Str(text);
  let counter = 0;
  let finalLex = [];
  while (str.hasLeft()) {
    const oneLex = lexOnce(str);
    if (oneLex) {
      finalLex.push(oneLex);
    }
    counter++;
    if (counter > 5_000) {
      throw "Lexing failed: Looped too many times";
    }
  }
  return finalLex;
};

function lexOnce(str) {
  const char = str.take();
  switch (char) {
    case "[": {
      const name = str.getFollowingNumber(
        "Lexer Error: Expected a function number after '['"
      );
      return { type: "func_def", name };
    }
    case "]":
      return { type: "func_end" };
    case "~":
      return { type: "inc" };
    case "-":
      if (str.peek(3) == "--≡") {
        str.take(3);
        const name = str.getFollowingNumber(
          "Lexer Error: Expected a function number after '---≡'"
        );
        return { type: "func_call", name };
      }
      return { type: "dec" };
    case "⇢":
    case "→":
      return { type: "fork_right" };
    case "⇠":
    case "←":
      return { type: "fork_left" };
    case ":": {
      const next = str.take();
      switch (next) {
        case "O":
          return { type: "output" };
        case "o":
          return { type: "input" };
        default:
          throw "Lexer Error: Expected 'o' or 'O' after colon";
      }
    }
    case "{": {
      assert(str.take() == "o", "Expected 'o' after '{'");
      assert(str.take() == "=", "Expected '=' after '{o'");
      const num = str.getFollowingNumber(
        "Lexer Error: Expected a number after '{o='"
      );
      assert(str.take() == "}", `Expected '}' after '{o=${num}'`);
    }
  }
}

function assert(bool, msg) {
  if (bool) throw `Lexer Error: ${msg}`;
}
