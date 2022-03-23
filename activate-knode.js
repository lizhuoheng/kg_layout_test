import { each } from '@antv/util';

/**
 * 遍历 Combo 下的所有 Combo
 * @param data 指定的 Combo
 * @param fn
 */
const traverseCombo = (data, fn) => {
  if (fn(data) === false) {
    return;
  }

  if (data) {
    const combos = data.get('combos');
    if (combos.length === 0) {
      return false;
    }
    each(combos, (child) => {
      traverseCombo(child, fn);
    });
  }
};

/**
 * 计算如果要把指定item缩放到图中心的话，对应的zoom center坐标
 * @param zoomValue 指定的绝对缩放值
 * @param item 指定的item
 */
const getzoomCenter = (zoomValue, currentZoom, gcPoint, itemPoint) => {
  const ratio = currentZoom / (zoomValue - currentZoom);
  const zCenterX = (1 + ratio) * itemPoint.x - ratio * gcPoint.x;
  const zCenterY = (1 + ratio) * itemPoint.y - ratio * gcPoint.y;
  return { x: zCenterX, y: zCenterY };
};

export default {
  getDefaultCfg() {
    return {
      // 可选 mouseenter || click
      // 选择 click 会监听 touch，mouseenter 不会监听
      trigger: 'click',
      activeState: 'active', //active
      // inactiveState: 'inactive',
      resetSelected: false,
      autoFocus: false,
      shouldUpdate() {
        return true;
      },
    };
  },
  getEvents() {
    if (this.get('trigger') === 'mouseenter') {
      return {
        'node:mouseenter': 'setAllItemStates',
        'combo:mouseenter': 'setAllItemStates',
        'node:mouseleave': 'clearActiveState',
        'combo:mouseleave': 'clearActiveState',
      };
    }
    return {
      'node:click': 'setAllItemStates',
      'node:dblclick': 'inspectItem',
      'combo:click': 'setAllItemStates',
      'canvas:click': 'clearActiveState',
      'node:touchstart': 'setOnTouchStart',
      'combo:touchstart': 'setOnTouchStart',
      // 'canvas:touchend': 'clearOnTouchStart',
    };
  },

  setOnTouchStart(e) {
    const self = this;
    try {
      const touches = e.originalEvent.touches;
      const event1 = touches[0];
      const event2 = touches[1];

      if (event1 && event2) {
        return;
      }

      e.preventDefault();
    } catch (e) {
      console.warn('Touch original event not exist!');
    }
    self.setAllItemStates(e);
  },
  clearOnTouchStart(e) {
    const self = this;
    try {
      const touches = e.originalEvent.touches;
      const event1 = touches[0];
      const event2 = touches[1];

      if (event1 && event2) {
        return;
      }

      e.preventDefault();
    } catch (e) {
      console.warn('Touch original event not exist!');
    }
    self.clearActiveState(e);
  },
  setAllItemStates(e) {
    const item = e.item;
    const graph = this.graph;
    this.item = item;
    this.currentItemChildCombos = [];
    if (!this.shouldUpdate(e.item, { event: e, action: 'activate' })) {
      return;
    }
    const self = this;
    const activeState = this.activeState;
    const inactiveState = this.inactiveState;
    const nodes = graph.getNodes();
    const combos = graph.getCombos();
    const edges = graph.getEdges();
    const vEdges = graph.get('vedges');
    const nodeLength = nodes.length;
    const comboLength = combos.length;
    const edgeLength = edges.length;
    const vEdgeLength = vEdges.length;

    for (let i = 0; i < nodeLength; i++) {
      const node = nodes[i];
      const hasSelected = node.hasState('selected');
      if (self.resetSelected) {
        if (hasSelected) {
          graph.setItemState(node, 'selected', false);
        }
      }
      graph.setItemState(node, activeState, false);
      if (inactiveState) {
        graph.setItemState(node, inactiveState, true);
      }
    }
    for (let i = 0; i < comboLength; i++) {
      const combo = combos[i];
      const hasSelected = combo.hasState('selected');
      if (self.resetSelected) {
        if (hasSelected) {
          graph.setItemState(combo, 'selected', false);
        }
      }
      graph.setItemState(combo, activeState, false);
      if (inactiveState) {
        graph.setItemState(combo, inactiveState, true);
      }
    }

    for (let i = 0; i < edgeLength; i++) {
      const edge = edges[i];
      graph.setItemState(edge, activeState, false);
      if (inactiveState) {
        graph.setItemState(edge, inactiveState, true);
      }
    }

    for (let i = 0; i < vEdgeLength; i++) {
      const vEdge = vEdges[i];
      graph.setItemState(vEdge, activeState, false);
      if (inactiveState) {
        graph.setItemState(vEdge, inactiveState, true);
      }
    }

    if (inactiveState) {
      graph.setItemState(item, inactiveState, false);
    }

    //激活Combo中的所有Node
    if (item.getType() === 'combo') {
      graph.setItemState(item, activeState, true);
      traverseCombo(item, (param) => {
        if (param.destroyed) {
          return false;
        }
        //激活Combo（param）下所有的Node
        const childNodes = param.getNodes();
        each(childNodes, (item) => {
          graph.setItemState(item, activeState, true);
        });
        return true;
      });
    } else {
      graph.setItemState(item, activeState, true);
    }

    //添加focus动画
    if (this.get('autoFocus')) {
      // graph.focusItem(item);
      // graph.zoomTo(0.6, { x: 0, y: 0 }, true);
      const currentZoom = graph.getZoom();
      const zoomValue = 0.8;
      if (Math.abs(currentZoom - zoomValue) < 0.01) {
        graph.focusItem(item);
      } else {
        // const gcPoint = graph.getGraphCenterPoint();
        const gcPoint = {
          x: graph.get('width') / 2,
          y: graph.get('height') / 2,
        };

        const itemPoint = { x: e.canvasX, y: e.canvasY };
        // const canvas = this.graph.get('canvas');
        // const itemPoint = canvas.getPointByClient(e.clientX, e.clientY);

        // const group = item.get('group');
        // let matrix = group.getMatrix();
        // if (!matrix) matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
        // const itemPoint = graph.getCanvasByPoint(matrix[6], matrix[7]);
        graph.zoomTo(
          zoomValue,
          getzoomCenter(zoomValue, currentZoom, gcPoint, itemPoint),
          true
        );
      }
    }

    const rEdges = item.getEdges();
    const rEdgeLegnth = rEdges.length;
    for (let i = 0; i < rEdgeLegnth; i++) {
      const edge = rEdges[i];
      let otherEnd;
      if (edge.getSource() === item) {
        otherEnd = edge.getTarget();
      } else {
        otherEnd = edge.getSource();
      }
      if (inactiveState) {
        graph.setItemState(otherEnd, inactiveState, false);
      }
      // graph.setItemState(otherEnd, activeState, true);
      graph.setItemState(edge, inactiveState, false);
      graph.setItemState(edge, activeState, true);
      edge.toFront();
    }
    graph.emit('afteractivaterelations', { item: e.item, action: 'activate' });
  },
  clearActiveState(e) {
    const self = this;
    const graph = self.get('graph');
    if (!self.shouldUpdate(e.item, { event: e, action: 'deactivate' })) {
      return;
    }

    const activeState = this.activeState;
    const inactiveState = this.inactiveState;

    const autoPaint = graph.get('autoPaint');
    graph.setAutoPaint(false);
    const nodes = graph.getNodes() || [];
    const combos = graph.getCombos() || [];
    const edges = graph.getEdges() || [];
    const vEdges = graph.get('vedges') || [];
    const nodeLength = nodes.length;
    const comboLength = combos.length;
    const edgeLength = edges.length;
    const vEdgeLength = vEdges.length;

    for (let i = 0; i < nodeLength; i++) {
      const node = nodes[i];
      graph.clearItemStates(node, [activeState, inactiveState]);
    }
    for (let i = 0; i < comboLength; i++) {
      const combo = combos[i];
      graph.clearItemStates(combo, [activeState, inactiveState]);
    }
    for (let i = 0; i < edgeLength; i++) {
      const edge = edges[i];
      graph.clearItemStates(edge, [activeState, inactiveState, 'deactivate']);
    }
    for (let i = 0; i < vEdgeLength; i++) {
      const vEdge = vEdges[i];
      graph.clearItemStates(vEdge, [activeState, inactiveState, 'deactivate']);
    }
    graph.paint();
    graph.setAutoPaint(autoPaint);
    graph.emit('afteractivaterelations', {
      item: e.item || self.get('item'),
      action: 'deactivate',
    });
  },

  //inspectItem 只显示item和与它直接关联的其它节点
  inspectItem(e) {
    const item = e.item;
    const graph = this.graph;
    this.item = item;
    this.currentItemChildCombos = [];
    // if (!this.shouldUpdate(e.item, { event: e, action: 'activate' })) {
    //   return;
    // }
    const self = this;
    const activeState = this.activeState;
    const inactiveState = this.inactiveState;
    const nodes = graph.getNodes();
    const combos = graph.getCombos();
    const edges = graph.getEdges();
    const vEdges = graph.get('vedges');
    const nodeLength = nodes.length;
    const comboLength = combos.length;
    const edgeLength = edges.length;
    const vEdgeLength = vEdges.length;

    for (let i = 0; i < nodeLength; i++) {
      const node = nodes[i];
      node.hide();
      graph.setItemState(node, activeState, false);
      graph.setItemState(node, 'selected', false);
    }
    for (let i = 0; i < comboLength; i++) {
      const combo = combos[i];
      combo.hide();
      graph.setItemState(combo, activeState, false);
    }

    for (let i = 0; i < edgeLength; i++) {
      const edge = edges[i];
      edge.hide();
      graph.setItemState(edge, activeState, false);
    }

    for (let i = 0; i < vEdgeLength; i++) {
      const vEdge = vEdges[i];
      vEdge.hide();
      graph.setItemState(vEdge, activeState, false);
    }

    if (inactiveState) {
      graph.setItemState(item, inactiveState, false);
    }

    // graph.setItemState(item, activeState, true);
    graph.setItemState(item, 'selected', true);
    item.show();

    const rEdges = item.getEdges();
    const rEdgeLegnth = rEdges.length;
    for (let i = 0; i < rEdgeLegnth; i++) {
      const edge = rEdges[i];
      edge.show();
      graph.setItemState(edge, inactiveState, false);
      graph.setItemState(edge, activeState, true);
      // edge.toFront();
      let otherEnd;
      if (edge.getSource() === item) {
        otherEnd = edge.getTarget();
      } else {
        otherEnd = edge.getSource();
      }
      if (inactiveState) {
        graph.setItemState(otherEnd, inactiveState, false);
      }
      otherEnd.show();
      // graph.setItemState(otherEnd, activeState, true);
    }

    const currentZoom = graph.getZoom();
    const zoomValue = 1;
    if (Math.abs(currentZoom - zoomValue) < 0.01) {
      graph.focusItem(item);
    } else {
      // const gcPoint = graph.getGraphCenterPoint();
      const gcPoint = {
        x: graph.get('width') / 2,
        y: graph.get('height') / 2,
      };
      const itemPoint = { x: e.canvasX, y: e.canvasY };
      graph.zoomTo(
        zoomValue,
        getzoomCenter(zoomValue, currentZoom, gcPoint, itemPoint),
        true
      );
    }

    // const CenterPoint = graph.getViewPortCenterPoint();
    // graph.updateLayout({
    //   pipes: [
    //     {
    //       type: 'custom-centric',
    //       // nodesFilter: (node) => node.subGraphId ,
    //       focusNode: item,
    //       center: [CenterPoint.x, CenterPoint.y], // 可选，
    //       radius: 150,
    //     },
    //   ],
    // });

    // graph.zoomTo(
    //   1,
    //   {
    //     x: graph.get('width') / 2,
    //     y: graph.get('height') / 2,
    //   },
    //   true
    // );

    // console.log('item-matrix: ', matrix);
    // console.log('item-e.canvas:', e.canvasX, e.canvasY);
    // console.log('getViewPortCenterPoint', graph.getViewPortCenterPoint());
    // console.log('ViewPortCenterPoint-Canvas', graph.getCanvasByPoint(graph.getViewPortCenterPoint().x, graph.getViewPortCenterPoint().y));
    // console.log('getGraphCenterPoint', graph.getGraphCenterPoint());
    // console.log('graph-width-height:',graph.get('width'), graph.get('height'))
  },

};
