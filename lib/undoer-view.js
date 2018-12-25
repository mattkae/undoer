'use babel';
import UndoTracker from './undo-tracker';
import RangeSlider from './range-slider';

export default class UndoerView {
  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('undoer');

    // Create empty notifier
    this.emptyNotifier = document.createElement('div');
    this.emptyNotifier.classList.add('empty-notifier');
    this.emptyNotifier.innerHTML = "This file has no undo history yet.";

    // Create Slider
    this.slider = new RangeSlider();
    this.slider.onChange = this.onInput;

    // Create content tracker
    this.tracker = new UndoTracker(this.onRangeChange, this.onEditorUnset);
  }

  onRangeChange = (position, max) => {
    if (max === 0) {
      if (!this.element.contains(this.emptyNotifier)) {
        this.element.appendChild(this.emptyNotifier);
      }

      const sliderElement = this.slider.getElement();
      if (this.element.contains(sliderElement)) {
        this.element.removeChild(sliderElement);
      }
    } else {
      if (this.element.contains(this.emptyNotifier)) {
        this.element.removeChild(this.emptyNotifier);
      }

      this.slider.setValues(0, max, position);
      const sliderElement = this.slider.getElement();
      if (!this.element.contains(sliderElement)) {
        this.element.appendChild(sliderElement);
      }
    }
  };

  onEditorUnset = () => {
    const sliderElement = this.slider.getElement();
    if (this.element.contains(sliderElement)) {
      this.element.removeChild(sliderElement);
    }

    if (this.element.contains(this.emptyNotifier)) {
      this.element.removeChild(this.emptyNotifier);
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
