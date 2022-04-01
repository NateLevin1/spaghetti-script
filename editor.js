const editor = document.getElementById("editor");
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
  insertAtCaret(editor, toAdd);
  editor.focus();
}

// Insert at the cursor positioon
const insertAtCaret = (textarea, text) => {
  if (document.selection) {
    // IE
    textarea.focus();
    const sel = document.selection.createRange();
    sel.text = text;
  } else if (textarea.selectionStart || textarea.selectionStart === 0) {
    // Others
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    textarea.value =
      textarea.value.substring(0, startPos) +
      text +
      textarea.value.substring(endPos, textarea.value.length);
    textarea.selectionStart = startPos + text.length;
    textarea.selectionEnd = startPos + text.length;
  } else {
    textarea.value += text;
  }
};

if (localStorage.getItem("spaghetti-save")) {
  // if they have something saved, then load it
  loadEditor();
}
