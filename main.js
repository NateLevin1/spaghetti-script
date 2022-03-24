import { interpret } from "./interpret.js";
import { parse } from "./parse.js";

window.onerror = (message, source, lineNo, colNo, error) => {
  alert(
    "Javascript Error: \n" +
      message +
      ".\n\nPlease submit a bug report on GitHub if this is not expected behavior."
  );
};
const editor = document.getElementById("editor");
const interpretButton = document.getElementById("interpret-button");

interpretButton.onclick = execute;

function execute() {
  const text = editor.value;
  const parsed = parse(text);
  interpret(parsed);
}
