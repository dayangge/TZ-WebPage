const path = require('path');
export default {
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: '天子棋牌官网',
      keywords:'天子棋牌',
      dll: false,
      hardSource: false,
      routes: {
        exclude: [
          /models/,
          /services/,
          /_components/,
        ],
      },
    }],
  ],
  alias: {
    config: path.resolve(__dirname, './src/config'),
    components: path.resolve(__dirname, './src/components'),
    utils: path.resolve(__dirname, './src/utils'),
    pages: path.resolve(__dirname, './src/pages'),
    services: path.resolve(__dirname, './src/services'),
    assets: path.resolve(__dirname, './src/assets'),
    style: path.resolve(__dirname, './src/style'),
  }
}
