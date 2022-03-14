import { modifyCSS, createDom } from '@antv/dom-util';

export default {
  getDefaultCfg() {
    return {
      item: 'node',
      offset: 10,
      formatText(model) {
        const text = 'ID: ' + model.id + '<br> Label: ' + model.label;
        return text;
      },
    };
  },
  getEvents() {
    return {
      // 'node:mouseenter': 'onMouseEnter',
      // 'node:mouseleave': 'onMouseLeave',
      // 'node:mousemove': 'onMouseMove',
      'node:click': 'onMouseEnter',
      'combo:click': 'onMouseEnter',
      'canvas:click': 'onMouseLeave',
      'node:mousemove': 'onMouseMove',
      afterremoveitem: 'onMouseLeave',
    };
  },
  onMouseEnter(e) {
    const { item } = e;
    this.currentTarget = item;
    this.showTooltip(e);
    this.graph.emit('tooltipchange', { item: e.item, action: 'show' });
  },
  onMouseMove(e) {
    if (!this.shouldUpdate(e)) {
      this.hideTooltip();
      return;
    }
    if (!this.currentTarget || e.item !== this.currentTarget) {
      return;
    }
    this.updatePosition(e);
  },
  onMouseLeave(e) {
    if (!this.shouldEnd(e)) {
      return;
    }
    this.hideTooltip();
    this.graph.emit('tooltipchange', {
      item: this.currentTarget,
      action: 'hide',
    });
    this.currentTarget = null;
  },
  showTooltip(e) {
    let { container } = this;
    if (!e.item || e.item.destroyed) {
      return;
    }

    if (!container) {
      container = this.createTooltip(this.graph.get('canvas'));
      this.container = container;
    }
    const text = this.formatText(e.item.get('model'), e);
    container.innerHTML = text;
    modifyCSS(this.container, { visibility: 'visible' });
    this.updatePosition(e);
  },
  hideTooltip() {
    modifyCSS(this.container, {
      visibility: 'hidden',
    });
  },
  updatePosition(e) {
    const shouldBegin = this.get('shouldBegin');
    const { width, height, container, graph } = this;
    if (!shouldBegin(e)) {
      modifyCSS(container, {
        visibility: 'hidden',
      });
      return;
    }
    const point = graph.getPointByClient(e.clientX, e.clientY);
    let { x, y } = graph.getCanvasByPoint(point.x, point.y);
    const bbox = container.getBoundingClientRect();
    if (x > width / 2) {
      x -= bbox.width;
    } else {
      x += this.offset;
    }
    if (y > height / 2) {
      y -= bbox.height;
    } else {
      y += this.offset;
    }
    const left = `${x}px`;
    const top = `${y}px`;
    modifyCSS(this.container, { left, top, visibility: 'visible' });
  },
  createTooltip(canvas) {
    const el = canvas.get('el');
    el.style.position = 'relative';
    const container = createDom(
      `<div class="g6-tooltip g6-${this.item}-tooltip"></div>`
    );
    el.parentNode.appendChild(container);
    modifyCSS(container, {
      position: 'absolute',
      visibility: 'visible',
    });
    this.width = canvas.get('width');
    this.height = canvas.get('height');
    this.container = container;
    this.graph.get('tooltips').push(container);
    return container;
  },
};
