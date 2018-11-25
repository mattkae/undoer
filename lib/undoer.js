'use babel';

import UndoerView from './undoer-view';
import { CompositeDisposable } from 'atom';

export default {

  undoerView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.undoerView = new UndoerView(state.undoerViewState);
    this.modalPanel = atom.workspace.addTopPanel({
      item: this.undoerView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'undoer:toggle': () => this.toggle(),
      'undoer:undo': () => this.undo(),
      'undoer:redo': () => this.redo()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.undoerView.destroy();
  },

  serialize() {
    return {
      undoerViewState: this.undoerView.serialize()
    };
  },

  toggle() {
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },

  undo() {
    console.log("Undid");
  },

  redo() {
    console.log("Redid");
  }
};
