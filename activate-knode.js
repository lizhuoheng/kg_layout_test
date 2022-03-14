export default {
  getDefaultCfg() {
    return {
      // 可选 mouseenter || click
      // 选择 click 会监听 touch，mouseenter 不会监听
      trigger: 'click',
      activeState: 'selected', //active
      // inactiveState: 'inactive',
      resetSelected: false,
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
    graph.setItemState(item, activeState, true);
    // 动画地移动，并配置动画
    graph.focusItem(item, true, {
      easing: 'easeCubic',
      duration: 500,
    });

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
      graph.setItemState(otherEnd, activeState, true);
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

  // onNodeClick(e) {
  //   console.log('---------evt;');
  //   const graph = this.graph;
  //   const item = e.item;
  //   if (item.hasState(this.selectedState)) {
  //     graph.setItemState(item, this.selectedState, false);
  //     return;
  //   }
  //   // this 上即可取到配置，如果不允许多个 'active'，先取消其他节点的 'active' 状态
  //   if (!this.multiple) {
  //     this.removeNodesState();
  //   }
  //   // 置点击的节点状态 'active' 为 true
  //   graph.setItemState(item, this.selectedState, true);
  // },
  // onCanvasClick(e) {
  //   // shouldUpdate 可以由用户复写，返回 true 时取消所有节点的 'active' 状态，即将 'active' 状态置为 false
  //   if (this.shouldUpdate(e)) {
  //     this.removeNodesState();
  //   }
  // },
  // removeNodesState() {
  //   graph.findAllByState('node', this.selectedState).forEach((node) => {
  //     graph.setItemState(node, this.selectedState, false);
  //   });
  //   graph.findAllByState('combo', this.selectedState).forEach((combo) => {
  //     graph.setItemState(combo, this.selectedState, false);
  //   });
  // },
};
