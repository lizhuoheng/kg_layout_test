import G6 from '@antv/g6';
import { data } from './data';
import activateKnode from './activate-knode';
import customCentric from './custom-centric';
import kgtooltip from './kg-tooltip';

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
G6.registerNode(
  'circle-animate',
  {
    afterDraw(cfg, group) {
      let r = cfg.size / 2;
      if (isNaN(r)) {
        r = cfg.size[0] / 2;
      }
      // 第一个背景圆
      const back1 = group.addShape('circle', {
        zIndex: -3,
        attrs: {
          x: 0,
          y: 0,
          r,
          fill: 'red', //cfg.color
          opacity: 0.6,
        },
        // must be assigned in G6 3.3 and later versions. it can be any value you want
        name: 'circle-shape1',
      });
      // 第二个背景圆
      const back2 = group.addShape('circle', {
        zIndex: -2,
        attrs: {
          x: 0,
          y: 0,
          r,
          fill: 'red', // 为了显示清晰，随意设置了颜色
          opacity: 0.6,
        },
        // must be assigned in G6 3.3 and later versions. it can be any value you want
        name: 'circle-shape2',
      });
      // 第三个背景圆
      const back3 = group.addShape('circle', {
        zIndex: -1,
        attrs: {
          x: 0,
          y: 0,
          r,
          fill: 'red',
          opacity: 0.6,
        },
        // must be assigned in G6 3.3 and later versions. it can be any value you want
        name: 'circle-shape3',
      });
      group.sort(); // 排序，根据 zIndex 排序

      // 第一个背景圆逐渐放大，并消失
      back1.animate(
        {
          r: r + 10,
          opacity: 0.1,
        },
        {
          repeat: true, // 循环
          duration: 3000,
          easing: 'easeCubic',
          delay: 0, // 无延迟
        }
      );

      // 第二个背景圆逐渐放大，并消失
      back2.animate(
        {
          r: r + 10,
          opacity: 0.1,
        },
        {
          repeat: true, // 循环
          duration: 3000,
          easing: 'easeCubic',
          delay: 1000, // 1 秒延迟
        }
      ); // 1 秒延迟

      // 第三个背景圆逐渐放大，并消失
      back3.animate(
        {
          r: r + 10,
          opacity: 0.1,
        },
        {
          repeat: true, // 循环
          duration: 3000,
          easing: 'easeCubic',
          delay: 2000, // 2 秒延迟
        }
      );
    },
  },
  'circle'
);

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

const panel = document.createElement('div');
panel.id = 'panel';
const nebulaModeBtn = document.createElement('input');
nebulaModeBtn.type = 'button';
nebulaModeBtn.value = '显示所有节点（探索模式/专注模式？）';

panel.appendChild(nebulaModeBtn);

container.appendChild(panel);

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
    color: '#f5f5f500', //#f5f5f590
    style: {
      endArrow: {
        path: 'M 0,0 L 8,3 L 8,-3 Z',
        fill: '#f5f5f500', //#f5f5f5
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

// graph.on('afterlayout', (evt) => {
//   if (graph.cfg.layout.type && graph.cfg.layout.type == 'custom-centric') {
//     // nebulaModeBtn.disabled = false;
//     // focusModeBtn.disabled = true;
//   } else {
//     // nebulaModeBtn.disabled = true;
//     // focusModeBtn.disabled = false;
//   }
// });

nebulaModeBtn.addEventListener('click', (e) => {
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
    node.show();
    if (node.hasState('selected')) {
      graph.setItemState(node, 'selected', false);
      graph.setItemState(node, 'active', true);
    } else {
    }
    // graph.setItemState(node, 'active', false);
  }
  for (let i = 0; i < comboLength; i++) {
    const combo = combos[i];
    combo.show();
    // graph.setItemState(combo, 'active', false);
  }

  for (let i = 0; i < edgeLength; i++) {
    const edge = edges[i];
    edge.show();
    // graph.setItemState(edge, 'active', false);
  }

  for (let i = 0; i < vEdgeLength; i++) {
    const vEdge = vEdges[i];
    vEdge.show();
    // graph.setItemState(vEdge, 'active', false);
  }
  // graph.updateLayout({
  //   pipes: [
  //     {
  //       type: 'circular', //circular  dagre  concentric
  //       // 根据节点的某个字段判断是否属于该子图
  //       nodesFilter: (node) => node.subGraphId === '0',
  //       startRadius: 250,
  //       endRadius: 500,
  //       angleRatio: 1,
  //       // divisions:3,
  //       //rankdir: 'LR',
  //       //align: 'UL',
  //       sortByCombo: true,
  //       controlPoints: true,
  //       nodesepFunc: () => 1,
  //       ranksepFunc: () => 1,
  //     },
  //     {
  //       type: 'grid',
  //       begin: [1000, 0],
  //       // radius: 100,
  //       // angleRatio: 0.5,
  //       // startRadius: 500,
  //       // endRadius: 250,
  //       nodesFilter: (node) => node.subGraphId === '1',
  //     },
  //   ],
  // });
});

var item = graph.findById('20');
item.update({ type: 'circle-animate' });

if (typeof window !== 'undefined')
  window.onresize = () => {
    if (!graph || graph.get('destroyed')) return;
    if (!container || !container.scrollWidth || !container.scrollHeight) return;
    graph.changeSize(container.scrollWidth, container.scrollHeight);
  };
