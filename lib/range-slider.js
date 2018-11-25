'use babel'

export default class RangeSlider {
  constructor(min, max, position) {
    this.min = min;
    this.max = max;
    this.position = position;
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
    this.handle.style.left = `calc(${this.getHandlePositionPercent()}%)`;
    this.element.appendChild(this.handle);

    this.ticksContainer = document.createElement('ul');
    for (var itr = this.min; itr < this.max; itr++) {
      let tick = document.createElement('li');
      tick.innerHTML = itr;
      this.ticksContainer.appendChild(tick);
    }
    this.ticksContainer.classList.add('ticks');
    this.element.appendChild(this.ticksContainer);
  }

  getHandlePositionPercent() {
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
      this.handle.style.left = `${this.clamp(0, this.width, ev.clientX - this.offsetX)}px`;
    }
  };
}
