var editor = document.getElementById("editor");
const output = document.getElementById("output");
document.getElementById("clear").onclick = () => {
  output.innerHTML = "";
};
document.getElementById("fork").onclick = () => {
  addToEditor("≡");
};
document.getElementById("right").onclick = () => {
  addToEditor("⇢");
};
document.getElementById("left").onclick = () => {
  addToEditor("⇠");
};
document.getElementById("func").onclick = () => {
  let currentFunctionNumber = 0;
  let funcs = editor.value.match(/\[\d+/g);
  for (func in funcs) {
    let newFuncNum = funcs[func].split("");
    newFuncNum.shift();
    newFuncNum = newFuncNum.join("");
    let cur = parseInt(newFuncNum); //parseInt(funcs[func].charAt(1));
    if (cur >= currentFunctionNumber) {
      currentFunctionNumber = cur + 1;
    }
  }
  addToEditor("[" + currentFunctionNumber + "");
};
function saveEditor() {
  localStorage.setItem("spaghetti-save", editor.value);
}
function loadEditor() {
  editor.value = localStorage.getItem("spaghetti-save");
}
document.getElementById("save-button").onclick = () => {
  saveEditor();
};
document.getElementById("load-button").onclick = () => {
  loadEditor();
};
editor.addEventListener("keydown", (event) => {
  let ctrlDown = event.ctrlKey || event.metaKey;

  if (ctrlDown && !event.shiftKey) {
    switch (event.key) {
      case "=":
        event.preventDefault();
        addToEditor("≡");
        break;
      case "-":
        event.preventDefault();
        addToEditor("~");
        break;
      case "\\":
      case ";":
        addToEditor("⑂");
        break;
      case ",":
      case "[":
        event.preventDefault();
        addToEditor("⇠");
        break;
      case ".":
      case "]":
        addToEditor("⇢");
        break;
      case "s":
        event.preventDefault();
        saveEditor();
        break;
      case "l":
        event.preventDefault();
        loadEditor();
        break;
    }
  }
});

function addToEditor(toAdd) {
  editor.insertAtCaret(toAdd);
  editor.focus();
}

// Insert at the cursor positioon
HTMLTextAreaElement.prototype.insertAtCaret = function (text) {
  text = text || "";
  if (document.selection) {
    // IE
    this.focus();
    var sel = document.selection.createRange();
    sel.text = text;
  } else if (this.selectionStart || this.selectionStart === 0) {
    // Others
    var startPos = this.selectionStart;
    var endPos = this.selectionEnd;
    this.value =
      this.value.substring(0, startPos) +
      text +
      this.value.substring(endPos, this.value.length);
    this.selectionStart = startPos + text.length;
    this.selectionEnd = startPos + text.length;
  } else {
    this.value += text;
  }
};
