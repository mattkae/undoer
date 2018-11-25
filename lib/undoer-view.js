'use babel';
import UndoTracker from './undo-tracker';
import RangeSlider from './range-slider';

export default class UndoerView {
  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('undoer');

    // Create Slider
    this.slider = new RangeSlider(0, 10, 5);
    this.slider.onChange = this.onInput;
    this.element.appendChild(this.slider.getElement());

    // Create content tracker
    this.tracker = new UndoTracker(this.onRangeChange);
  }

  onRangeChange = (position, max) => {
    this.slider.setValues(0, max, position);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  onInput = (value) => {
    this.tracker.changePosition(value);
  }
}
