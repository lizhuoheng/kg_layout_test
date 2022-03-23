import { mix } from '@antv/util';

export default {
  /**
   * 定义自定义行为的默认参数，会与用户传入的参数进行合并
   */
  getDefaultCfg() {
    return {
      center: [0, 0], // 布局的中心
      focusNode: 'nodeId',
      radius: 100,
      // biSep: 100, // 两部分的间距
      // nodeSep: 20, // 同一部分的节点间距
      // direction: 'horizontal', // 两部分的分布方向
      // nodeSize: 20, // 节点大小
    };
  },
  /**
   * 初始化
   * @param {object} data 数据
   */
  init(data) {
    const self = this;
    self.nodes = data.nodes;
    self.edges = data.edges;
  },
  /**
   * 执行布局
   */
  execute() {
    const self = this;
    const { nodes, radius, center, focusNode } = self;

    const origin = { x: center[0], y: center[1] };

    // const origin = [width / 2, height / 2];
    // const radius = width < height ? width / 3 : height / 3;
    // const radius = 100;
    const fnode = nodes.find((node) => {
      return node.id == focusNode.get('id');
    });
    fnode.x = origin.x;
    fnode.y = origin.y;

    const rnodes = nodes.filter((node) => {
      return node.id != focusNode.get('id');
    });
    const n = rnodes.length;
    const angleSep = (Math.PI * 2) / n;

    rnodes.forEach(function (node, i) {
      const angle = i * angleSep + Math.PI;
      node.x = radius * Math.cos(angle) + origin.x;
      node.y = radius * Math.sin(angle) + origin.y;
    });
  },
  /**
   * 根据传入的数据进行布局
   * @param {object} data 数据
   */
  layout(data) {
    const self = this;
    self.init(data);
    self.execute();
  },
  /**
   * 更新布局配置，但不执行布局
   * @param {object} cfg 需要更新的配置项
   */
  updateCfg(cfg) {
    const self = this;
    mix(self, cfg);
  },
  /**
   * 销毁
   */
  destroy() {
    const self = this;
    self.positions = null;
    self.nodes = null;
    self.edges = null;
    self.destroyed = true;
  },
};
