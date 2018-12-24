'use babel';

export default class UndoTracker {
  constructor(onRangeChange, onEditorUnset) {
    this.data = {};
    this.activeEditor = undefined;
    this.undoStackSize = 0;
    this.redoStackSize = 0;
    this.onRangeChange = onRangeChange;
    this.onEditorUnset = onEditorUnset;

    this.registerCallbacks();
    this.setActiveEditor(atom.workspace.getActiveTextEditor());
  }

  registerCallbacks() {
    atom.workspace.onDidChangeActiveTextEditor(editor => {
      this.setActiveEditor(editor);
    });
  }

  onStackSizeChange() {
    this.onRangeChange(this.undoStackSize, this.undoStackSize + this.redoStackSize);
  }

  doesEditorHaveHistory() {
    return this.activeEditor
      && this.activeEditor.buffer
      && this.activeEditor.buffer.historyProvider
      && this.activeEditor.buffer.historyProvider.undoStack;
  }

  setPosition = () => {
    if (this.activeEditor.buffer.historyProvider.undoStack) {
      this.undoStackSize = 0;

      this.activeEditor.buffer.historyProvider.undoStack.forEach((item) => {
        if (!item.isBarrier) {
          this.undoStackSize++;
        }
      });
    }
    if (this.activeEditor.buffer.historyProvider.redoStack) {
      this.redoStackSize = this.activeEditor.buffer.historyProvider.redoStack.length;
    }
    this.onStackSizeChange();
  }

  setStackCallbacks() {
    let setPosition = this.setPosition;
    const pushDefinition = {
      configurable: true,
      enumerable: false,
      writable: true,
      value: function(...args)
      {
          let result = Array.prototype.push.apply(this, args);
          setPosition();
          return result;
      }
    };

    Object.defineProperty(this.activeEditor.buffer.historyProvider.undoStack, "push", pushDefinition);
    Object.defineProperty(this.activeEditor.buffer.historyProvider.redoStack, "push", pushDefinition);
  }

  setActiveEditor(activeEditor) {
    this.activeEditor = activeEditor;

    if (!this.activeEditor) {
      this.onEditorUnset();
    } else if (this.doesEditorHaveHistory()) {
      this.setStackCallbacks();
      this.setPosition();
    }
  }

  changePosition = (newPosition) => {
      while (newPosition > this.undoStackSize) {
        this.activeEditor.redo();
        this.setPosition();
      }
      while (newPosition < this.undoStackSize) {
        this.activeEditor.undo();
        this.setPosition();
      }
    }
}
