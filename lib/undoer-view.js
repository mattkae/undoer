'use babel';
import UndoTracker from './undo-tracker';
import RangeSlider from './range-slider';

export default class UndoerView {
  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('undoer');

    // Create Slider
    this.slider = new RangeSlider();
    this.slider.onChange = this.onInput;

    // Create content tracker
    this.tracker = new UndoTracker(this.onRangeChange, this.onEditorUnset);
  }

  onRangeChange = (position, max) => {
    this.slider.setValues(0, max, position);
    const sliderElement = this.slider.getElement();
    if (!this.element.contains(sliderElement)) {
      this.element.appendChild(sliderElement);
    }
  };

  onEditorUnset = () => {
    const sliderElement = this.slider.getElement();
    if (this.element.contains(sliderElement)) {
      this.element.removeChild(sliderElement);
    }
  };

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
