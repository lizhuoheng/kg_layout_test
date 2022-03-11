import G6 from '@antv/g6';

/**
 * format the string
 * @param {string} str The origin string
 * @param {number} maxWidth max width
 * @param {number} fontSize font size
 * @return {string} the processed result
 */
export const fittingString = (str, maxWidth, fontSize) => {
  let currentWidth = 0;
  let res = str;
  const pattern = new RegExp('[\u4E00-\u9FA5]+'); // distinguish the Chinese charactors and letters
  str.split('').forEach((letter, i) => {
    if (currentWidth > maxWidth) return;
    if (pattern.test(letter)) {
      // Chinese charactors
      currentWidth += fontSize;
    } else {
      // get the width of single letter according to the fontSize
      currentWidth += G6.Util.getLetterWidth(letter, fontSize);
    }
    if (currentWidth > maxWidth) {
      res = `${res.substr(0, i)}\n${res.substr(i)}`;
      currentWidth = 0;
    }
  });
  return res;
};

const globalFontSize = 11;

export const data = {
  nodes: [
    {
      id: '0',
      label: fittingString('0【基础】集合的概念与性质', 65, globalFontSize),

      comboId: 'A',
    },
    {
      id: '1',
      label: fittingString('1【基础】判断能否构成集合', 65, globalFontSize),
      comboId: 'A',
    },
    {
      id: '2',
      label: fittingString(
        '2【基础】集合相等的判断与相关计算',
        65,
        globalFontSize
      ),
      comboId: 'A',
    },
    {
      id: '3',
      label: fittingString('3判断元素与集合的关系', 65, globalFontSize),
      comboId: 'B',
    },
    {
      id: '4',
      label: fittingString('4根据元素与集合的关系求参数', 65, globalFontSize),
      comboId: 'B',
    },
    {
      id: '5',
      label: fittingString('5根据集合中元素的个数求参数', 65, globalFontSize),
      comboId: 'B',
    },
    // {
    //   id: '6',
    //   label: fittingString('[废弃]利用元素的互异性求参数', 65, globalFontSize),
    //   comboId: 'C',
    // },
    {
      id: '7',
      label: fittingString('7求集合元素的个数', 65, globalFontSize),
      comboId: 'C',
    },
    {
      id: '8',
      label: fittingString('8集合元素互异性的应用', 65, globalFontSize),
      comboId: 'C',
    },
    {
      id: '9',
      label: fittingString('9描述法表示集合', 65, globalFontSize),
      comboId: 'D',
    },
    {
      id: '10',
      label: fittingString('10列举法表示集合', 65, globalFontSize),
      comboId: 'D',
    },
    // {
    //   id: '11',
    //   label: fittingString('11判断子集的个数', 65, globalFontSize),
    //   comboId: 'E',
    // },
    {
      id: '12',
      label: fittingString('12求集合的子集与子集个数', 65, globalFontSize),
      comboId: 'E',
    },
    {
      id: '13',
      label: fittingString('13判断两个集合的包含关系', 65, globalFontSize),
      comboId: 'E',
    },
    {
      id: '14',
      label: fittingString('14根据集合的包含关系求参数', 65, globalFontSize),
      comboId: 'E',
    },
    {
      id: '15',
      label: fittingString('15集合相等与子集的关系', 65, globalFontSize),
      comboId: 'E',
    },
    {
      id: '16',
      label: fittingString('16空集的概念与性质', 65, globalFontSize),
    },
    {
      id: '17',
      label: fittingString('17交集的概念及运算', 65, globalFontSize),
      comboId: 'F',
    },
    {
      id: '18',
      label: fittingString('18根据交集结果逆向分析', 65, globalFontSize),
      comboId: 'F',
    },
    {
      id: '19',
      label: fittingString('19并集的概念及运算', 65, globalFontSize),
      comboId: 'F',
    },
    {
      id: '20',
      label: fittingString('20根据并集结果逆向分析', 65, globalFontSize),
      comboId: 'F',
    },
    {
      id: '21',
      label: fittingString('21补集、全集的概念及运算', 65, globalFontSize),
      comboId: 'F',
    },
    {
      id: '22',
      label: fittingString('22根据补集结果逆向分析', 65, globalFontSize),
      comboId: 'F',
    },
    {
      id: '23',
      label: fittingString('23集合的交并补混合运算', 65, globalFontSize),
      comboId: 'G',
    },
    {
      id: '24',
      label: fittingString(
        '24根据交并补混合运算结果逆向分析',
        65,
        globalFontSize
      ),
      comboId: 'G',
    },
    {
      id: '25',
      label: fittingString('25Venn图的基本应用', 65, globalFontSize),
      comboId: 'H',
    },
    {
      id: '26',
      label: fittingString('26容斥原理的应用', 65, globalFontSize),
      comboId: 'H',
    },
    {
      id: '28',
      label: fittingString('27集合中的新定义问题', 65, globalFontSize),
    },
  ],
  edges: [
    {
      source: '0',
      target: '1',
      // label: '前驱',
    },
    {
      source: '0',
      target: '2',
      // label: '前驱',
    },
    {
      source: '0',
      target: '3',
      // label: '前驱',
    },
    {
      source: '3',
      target: '4',
    },
    {
      source: '0',
      target: '5',
    },
    {
      source: '0',
      target: '8',
    },
    {
      source: '0',
      target: '7',
    },
    {
      source: '0',
      target: '9',
    },
    {
      source: '0',
      target: '10',
    },
    {
      source: '0',
      target: '12',
    },
    {
      source: '12',
      target: '13',
    },
    {
      source: '13',
      target: '14',
    },
    {
      source: '2',
      target: '15',
    },
    {
      source: '13',
      target: '15',
    },
    {
      source: '0',
      target: '16',
    },
    {
      source: '16',
      target: '12',
    },
    {
      source: '0',
      target: '17',
    },
    {
      source: '17',
      target: '18',
    },
    {
      source: '0',
      target: '19',
    },
    {
      source: '19',
      target: '20',
    },
    {
      source: '0',
      target: '21',
    },
    {
      source: '21',
      target: '22',
    },
    {
      source: '17',
      target: '23',
    },
    {
      source: '17',
      target: '23',
    },
    {
      source: '19',
      target: '23',
    },
    {
      source: '21',
      target: '23',
    },
    {
      source: '23',
      target: '24',
    },
    {
      source: '13',
      target: '25',
    },
    {
      source: '23',
      target: '25',
    },
    {
      source: '25',
      target: '26',
    },
  ],
  combos: [
    {
      id: 'A',
      label: '集合的概念',
      style: {
        fill: '#C4E3B2',
        stroke: '#C4E3B2',
      },
    },
    {
      id: 'B',
      label: '元素与集合',
      style: {
        stroke: '#99C0ED',
        fill: '#99C0ED',
      },
    },
    {
      id: 'C',
      label: '集合性质的应用',
      style: {
        stroke: '#ff7575',
        fill: '#ff7575',
      },
    },
    {
      id: 'D',
      label: '集合的表示方法',
      style: {
        stroke: '#C4E3B2',
        fill: '#C4E3B2',
      },
    },
    {
      id: 'E',
      label: '集合间的基本关系',
      style: {
        stroke: '#99C0ED',
        fill: '#99C0ED',
      },
    },
    {
      id: 'F',
      label: '集合的基本运算',
      style: {
        stroke: '#ff7575',
        fill: '#ff7575',
      },
    },
    {
      id: 'G',
      label: '集合的交并补混合运算',
      style: {
        stroke: '#C4E3B2',
        fill: '#C4E3B2',
      },
    },
    {
      id: 'H',
      label: 'Venn图',
      style: {
        stroke: '#99C0ED',
        fill: '#99C0ED',
      },
    },
  ],
};
