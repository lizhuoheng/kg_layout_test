import G6 from '@antv/g6';
import { data } from './data';
import activateKnode from './activate-knode';
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

G6.registerBehavior('activate-knode', activateKnode);

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
      {
        type: 'collapse-expand-combo',
        trigger: 'dblclick', //click dbclick
        relayout: false,
      },
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
