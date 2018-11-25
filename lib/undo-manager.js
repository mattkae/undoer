/*
atom.workspace.getTextEditors().map((editor) => {
  this.addRef(editor.getPath());
});

atom.workspace.onDidAddTextEditor(event => {
  this.tracker.addRef(event.textEditor.getPath());
});

addRef(path) {
  if (!this.data[path]) {
      this.data[path] = path
  }
}

removeRef(path) {
  delete this.data[path]
}

changeRefKey(oldPath, newPath) {
  this.data[newPath] = this.data[oldPath];
  delete this.data[oldPath];
}

getData() {
  return this.data;
}
*/
