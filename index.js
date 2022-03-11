import G6 from '@antv/g6';
import { data } from './data';
// import { GraphLayoutPredict } from '@antv/vis-predict-engine';

// data.nodes.forEach((node) => {
//   switch (node.comboId) {
//     case 'A':
//       node.style = {
//         fill: '#C4E3B2',
//         stroke: '#aaa',
//       };
//       break;
//     case 'B':
//       node.style = {
//         fill: '#99C0ED',
//         stroke: '#aaa',
//       };
//       break;
//     case 'C':
//       node.style = {
//         fill: '#eee',
//         stroke: '#aaa',
//       };
//       break;
//     default:
//       node.style = {
//         fill: '#FDE1CE',
//         stroke: '#aaa',
//       };
//       break;
//   }
// });

G6.registerBehavior('activate-knode', {
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
});

const container = document.getElementById('container');
const width = container.scrollWidth;
const height = container.scrollHeight || 580;
// AI布局
// predictLayout 表示预测的布局，如 force 或 radial
// confidence 表示预测的可信度
// const { predictLayout, confidence } = await GraphLayoutPredict.predict(data);
const graph = new G6.Graph({
  container: 'container',
  renderer: 'canvas', // svg  canvas
  width,
  height,
  fitView: true,
  fitViewPadding: 30,
  modes: {
    default: [
      // 'drag-combo',
      // 'drag-node',
      'drag-canvas',
      'zoom-canvas',
      // 'click-select',
      'activate-knode',
      // {
      //   type: 'collapse-expand-combo',
      //   trigger: 'dbclick', //click dbclick
      //   relayout: false,
      // },
      // {
      //   type: 'activate-relations',
      //   trigger: 'click',
      //   resetSelected: true,
      // },
    ],
  },
  layout: {
    type: 'circular', //circular  dagre  concentric
    startRadius: 250,
    endRadius: 500,
    angleRatio: 1,
    // divisions:3,
    //rankdir: 'LR',
    //align: 'UL',
    sortByCombo: true,
    controlPoints: true,
    nodesepFunc: () => 1,
    ranksepFunc: () => 1,
  },
  defaultNode: {
    size: 15,
    style: {
      lineWidth: 1,
      stroke: '#5B8FF9',
      fill: '#C6E5FF',
    },
    labelCfg: {
      style: {
        fill: '#9ec9ff',
        fontSize: 12,
        background: {
          // fill: '#ffffff',
          stroke: '#9EC9FF',
          padding: [2, 2, 2, 2],
          radius: 2,
        },
      },
      position: 'bottom',
    },
  },
  defaultEdge: {
    //type: 'arc', //polyline
    size: 2,
    color: '#f5f5f5',
    style: {
      endArrow: {
        path: 'M 0,0 L 8,3 L 8,-3 Z',
        fill: '#f5f5f5',
        // path: G6.Arrow.vee(10, -20, 10), // 内置箭头，参数为箭头宽度、长度、偏移量 d（默认为 0）
        // d: 10 // 偏移量
      },
      // radius: 5,
    },
    labelCfg: {
      style: {
        fill: '#9ec9ff',
        fontSize: 8,
        background: {
          fill: '#f6bd16',
          stroke: '#9EC9FF',
          padding: [2, 2, 2, 2],
          radius: 2,
        },
      },
      position: 'bottom',
    },
  },
  defaultCombo: {
    type: 'circle', // rect  circle
    style: {
      fillOpacity: 0.1,
    },
    labelCfg: {
      style: {
        fontSize: 20,
      },
    },
  },
});
graph.data(data);
graph.render();

// graph.on('node:click', (evt) => {
//   // clearFocusItemState(graph);
//   // clearFocusEdgeState(graph);
//   const { item } = evt;

//   // highlight the clicked node, it is down by click-select
//   graph.setItemState(item, 'focus', true);

//     // 将相关边也高亮
//     const relatedEdges = item.getEdges();
//     relatedEdges.forEach((edge) => {
//       graph.setItemState(edge, 'focus', true);
//     });

// });

if (typeof window !== 'undefined')
  window.onresize = () => {
    if (!graph || graph.get('destroyed')) return;
    if (!container || !container.scrollWidth || !container.scrollHeight) return;
    graph.changeSize(container.scrollWidth, container.scrollHeight);
  };
