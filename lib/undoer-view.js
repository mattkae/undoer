'use babel';
import UndoTracker from './undo-tracker';
import RangeSlider from './range-slider';

export default class UndoerView {
  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('undoer');

    /* Create slider element
    this.slider = document.createElement('input');
    this.slider.classList.add('slider');
    this.slider.type = 'range';
    this.slider.min = 0;
    this.slider.max = 1;
    this.slider.value = 1;
    this.slider.oninput = this.onInput;
    this.element.appendChild(this.slider);
    */

    // Create file tracker
    this.slider = new RangeSlider(0, 10, 5);
    this.element.appendChild(this.slider.getElement());
    this.tracker = new UndoTracker(this.onRangeChange);
  }

  onRangeChange = (position, max) => {
    this.slider.value = position;
    this.slider.max = max;
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

  onInput = (ev) => {
    const value = +ev.target.value;
    this.tracker.changePosition(value);
  }
}
