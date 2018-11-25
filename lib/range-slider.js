'use babel'

export default class RangeSlider {
  constructor(min, max, position) {
    this.isDragging = false;
    this.offsetX = 0;
    this.width = 0;

    this.element = document.createElement('div');
    this.element.classList.add('range-slider');

    this.rail = document.createElement('div');
    this.rail.classList.add('rail');
    this.element.appendChild(this.rail);

    this.handle = document.createElement('span');
    this.handle.classList.add('handle');
    this.handle.onmousedown = this.onDragStart;
    this.element.appendChild(this.handle);

    this.setValues(min, max, position);
  }

  setValues = (min, max, position) => {
    this.min = min;
    this.max = max;
    this.position = (position == undefined) ? this.max : position;

    // Set handle position
    this.handle.style.left = `calc(${this.calculateHandlePositionPercent()}%)`;

    // Set all ticks
    if (this.ticksList) {
      this.ticksList.forEach(tick => {
        this.element.removeChild(tick);
      });
    }

    this.ticksList = [];
    for (var itr = this.min; itr <= this.max; itr++) {
      let tick = document.createElement('span');
      tick.innerHTML = itr;
      tick.style.left = `${((itr - this.min) / (this.max - this.min)) * 100}%`;
      tick.classList.add('tick');
      if (itr == this.position) {
        tick.classList.add('selected');
      }
      tick.id = `tick-${itr}`;
      this.ticksList.push(tick);
      this.element.appendChild(tick);
    }
  }

  calculateHandlePositionPercent() {
    return ((this.position - this.min) / (this.max - this.min)) * 100;
  }

  getElement() {
    return this.element;
  }

  onDragStart = (ev) => {
    this.isDragging = true;
    let rect = this.element.getBoundingClientRect();
    this.offsetX = rect.left;
    this.width = rect.width;
    this.handle.classList.add('dragging');

    document.addEventListener("mouseup", this.onDragEnd);
    document.addEventListener("mousemove", this.onDrag);
  };

  onDragEnd = (ev) => {
    this.isDragging = false;
    this.handle.classList.remove('dragging');
    this.handle.style.left = `calc(${this.calculateHandlePositionPercent()}%)`;

    document.removeEventListener("mouseup", this.onDragEnd);
    document.removeEventListener("mousemove", this.onDrag);
  };

  clamp = (min, max, value) => {
    return value < min ? min : value > max ? max : value;
  }

  onDrag = (ev) => {
    if (!this.isDragging) {
      return;
    }

    if (ev.clientX) {
      let leftValue = +this.clamp(0, this.width, ev.clientX - this.offsetX);
      this.handle.style.left = `${leftValue}px`;

      previousTick = document.getElementById(`tick-${this.position}`);
      if (previousTick) {
        previousTick.classList.remove('selected');
      }
      this.position = Math.round((leftValue / this.width) * (this.max - this.min) + this.min);
      currentTick = document.getElementById(`tick-${this.position}`);
      if (currentTick) {
        currentTick.classList.add('selected');
      }

      if (this.onChange) {
        this.onChange(this.position);
      }
    }
  };
}
