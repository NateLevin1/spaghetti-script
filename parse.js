/*

Example parse:
Input: "[1~:O] ---≡1"
Output: {
  type: "root",
  content: [
    {
      type: "function"
      name: "1",
      content: [
        {
          type: "increment"
        },
        {
          type: "output"
        }
      ]
    },
    {
      type: "call",
      name: "1"
    }
  ]
}

*/

import { lex } from "./lex.js";

export const parse = (text) => {
  const lexed = lex(text);
  console.log("Lex: ", lexed);
  return parseRoot(lexed);
};

function parseRoot(lexed) {}
