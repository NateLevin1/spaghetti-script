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
    case "=":
      assert(str.take(3), "==≡", "Expected '==≡' after raw '='", str);
      const name = str.getFollowingNumber(
        "Lexer Error: Expected a function number after '===≡'"
      );
      return { type: "func_call", name, isGoto: true };
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
          const afterO = str.peek();
          if (afterO == "A") {
            return { type: "ascii_output" };
          }
          return { type: "output" };
        case "o":
          return { type: "input" };
        default:
          throw "Lexer Error: Expected 'o' or 'O' after colon";
      }
    }
    case "{": {
      assert(str.take(), "o", "Expected 'o' after '{'", str);
      assert(str.take(), "=", "Expected '=' after '{o'", str);
      const num = str.getFollowingNumber(
        "Lexer Error: Expected a number after '{o='",
        { allowNegative: true }
      );
      assert(str.take(), "}", `Expected '}' after '{o=${num}'`, str);
      return { type: "func_call_if", num };
    }
    case "⑂":
      return { type: "flush_output" };
  }
}

function assert(taken, shouldBe, msg, str) {
  if (taken != shouldBe)
    throw `Lexer Error: ${msg}, saw '${taken}' at character ${str.getIndex()}`;
}
