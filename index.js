import G6 from '@antv/g6';
import { data } from './data';
import activateKnode from './activate-knode';
import customCentric from './custom-centric';
import kgtooltip from './kg-tooltip';
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

data.nodes.forEach((node) => {
  if (node.userData.irtScore >= 8) {
    node.style = {
      fill: '#72c054',
      stroke: '#aaa',
    };
    node.stateStyles = {
      active: {
        fill: '#72c054',
        // stroke: '#aaa',
        // opacity: 0.1,
      },
    };
    node.labelCfg = {
      style: {
        fill: '#82c246',
      },
    };
  } else if (node.userData.irtScore >= 6) {
    node.style = {
      fill: '#ffb034',
      stroke: '#aaa',
    };
    node.stateStyles = {
      active: {
        fill: '#ffb034',
        // stroke: '#aaa',
        // opacity: 0.1,
      },
    };
    node.labelCfg = {
      style: {
        fill: '#ffb034',
      },
    };
  } else if (node.userData.irtScore >= 0) {
    node.style = {
      fill: '#e94e52',
      stroke: '#aaa',
    };
    node.stateStyles = {
      active: {
        fill: '#e94e52',
        // stroke: '#aaa',
        // opacity: 0.1,
      },
    };
    node.labelCfg = {
      style: {
        fill: '#ec897d',
      },
    };
  } else {
    node.style = {
      fill: '#cdcdcd',
      stroke: '#aaa',
    };
    node.stateStyles = {
      active: {
        fill: '#cdcdcd',
        // stroke: '#aaa',
        // opacity: 0.1,
      },
    };
    node.labelCfg = {
      style: {
        fill: '#aaaaaa',
      },
    };
  }
});

G6.registerBehavior('activate-knode', activateKnode);
// G6.registerBehavior('kg-tooltip', kgtooltip);
G6.registerLayout('custom-centric', customCentric);

const container = document.getElementById('container');
const width = container.scrollWidth;
const height = container.scrollHeight || 580;
// AI布局
// predictLayout 表示预测的布局，如 force 或 radial
// confidence 表示预测的可信度
// const { predictLayout, confidence } = await GraphLayoutPredict.predict(data);

// const tooltip = new G6.Tooltip({
//   // offsetX: 10,
//   // offsetY: 20,
//   getContent(e) {
//     const outDiv = document.createElement('div');
//     outDiv.style.width = '180px';
//     outDiv.innerHTML = `
//       <h4>Tooltip</h4>
//       <ul>
//         <li>Label: ${e.item.getModel().label || e.item.getModel().id}</li>
//       </ul>`;

//     return outDiv;
//   },
//   itemTypes: ['node'],
//   trigger: 'click',
//   fixToNode: 'true',
// });

const graph = new G6.Graph({
  container: 'container',
  renderer: 'canvas', // svg  canvas
  width,
  height,
  // 必须将 groupByTypes 设置为 false，带有 combo 的图中元素的视觉层级才能合理
  groupByTypes: false,
  fitView: true,
  fitViewPadding: 30,
  modes: {
    default: [
      'drag-combo',
      'drag-node',
      // 'drag-canvas',
      {
        type: 'drag-canvas',
        enableOptimize: true, // 拖动 canvas 过程中隐藏所有的边及label
        // allowDragOnItem: true,
      },
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
      // 'kg-tooltip',
      // {
      //   type: 'kg-tooltip',
      //   formatText(model) {
      //     const text = 'ID: ' + model.id + '<br> Label: ' + model.label;
      //     return text;
      //   },
      //   offset: 10,
      // }
    ],
  },
  layout: {
    pipes: [
      {
        type: 'circular', //circular  dagre  concentric
        // 根据节点的某个字段判断是否属于该子图
        nodesFilter: (node) => node.subGraphId === '0',
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
      {
        type: 'grid',
        begin: [1000, 0],
        // radius: 100,
        // angleRatio: 0.5,
        // startRadius: 500,
        // endRadius: 250,
        nodesFilter: (node) => node.subGraphId === '1',
      },
    ],
  },
  animate: true, // Boolean，切换布局时是否使用动画过度，默认为 false
  animateCfg: {
    duration: 500, // Number，一次动画的时长
    easing: 'easeCubic', // String，动画函数
  },
  // plugins: [tooltip], // 配置 Grid 插件和 Minimap 插件
  defaultNode: {
    size: 16,
    style: {
      lineWidth: 1,
      stroke: '#5B8FF9',
      fill: '#C6E5FF',
    },
    labelCfg: {
      style: {
        fill: '#6395f9', //#6395f9  #9ec9ff
        fontSize: 12,
        background: {
          // fill: '#ffffff',
          // fillOpacity: 0.8,
          // stroke: '#9EC9FF',
          padding: [2, 2, 2, 2],
          radius: 2,
        },
      },
      position: 'bottom',
    },
  },
  // nodeStateStyles: {
  //   active: {
  //     lineWidth: 2,
  //     // fill: '#009a44',
  //     stroke: '#009a44',
  //     // opacity: 0.1,
  //   },
  // },
  defaultEdge: {
    //type: 'arc', //polyline
    size: 2,
    color: '#f5f5f590',
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
  edgeStateStyles: {
    active: {
      // color: '#5f95ff66',
      opacity: 0.7,
      endArrow: {
        path: 'M 0,0 L 8,3 L 8,-3 Z',
        fill: '#5f95ff66',
      },
    },
  },
  defaultCombo: {
    type: 'circle', // rect  circle
    style: {
      fillOpacity: 0.1,
      // lineWidth: 1,
      // stroke: '#5B8FF9',
      fill: '#C6E5FF',
    },
    labelCfg: {
      style: {
        fill: '#313131',
        fontSize: 20,
      },
    },
  },
});
graph.data(data);
// const combos = graph.getCombos();
// combos.forEach((combo, index) => {
//   const hasSelected = combo.hasState('selected');
//   graph.setItemState(combo, 'visible ', false);
// });

graph.render();

//首次学习时，只展开第一个combo？？待定
// graph.on('afterrender', (evt) => {
// const combos = graph.getCombos();
// combos.forEach((combo, index) => {
//   if (!combo || combo.destroyed || combo.getType() !== 'combo') return;
//   if (index) graph.collapseCombo(combo);
//   // graph.setItemState(combo, 'visible ', false);
//   // combo.hide();
//   graph.refreshPositions();
//   //graph.updateCombos()
// });
// combos.forEach((combo, index) => {
//   if (!combo || combo.destroyed || combo.getType() !== 'combo') return;
//   // if (index) graph.collapseCombo(combo);
//   // graph.setItemState(combo, 'visible ', false);
//   setTimeout(() => {
//     combo.show();
//   }, 100 * index);
//   // graph.refreshPositions();
//   //graph.updateCombos()
// });
// });

// graph.on('afteractivaterelations', evt => {
//   const { item } = evt;
//   graph.updateItem(item, {
//     // 节点的样式
//     style: {
//       stroke: 'green',
//     },
//   });
// });

if (typeof window !== 'undefined')
  window.onresize = () => {
    if (!graph || graph.get('destroyed')) return;
    if (!container || !container.scrollWidth || !container.scrollHeight) return;
    graph.changeSize(container.scrollWidth, container.scrollHeight);
  };
