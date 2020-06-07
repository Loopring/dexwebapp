const webpack = require('webpack');
const {
  override,
  addWebpackPlugin,
  fixBabelImports,
  addLessLoader,
  setWebpackOptimizationSplitChunks,
  addWebpackAlias
} = require('customize-cra');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const path = require('path');

const GitRevisionPlugin = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin();

// Deployment on Heroku
// During Heroku builds, the SOURCE_VERSION and STACK environment variables are set:
var onHeroku = process.env.SOURCE_VERSION && process.env.STACK;
// If we're on Heroku, we don't have access to the .git directory so we can't
// rely on git commands to get the version. What we *do* have during Heroku
// builds is a SOURCE_VERSION env with the git SHA of the commit being built,
// so we can use that instead to generate the version file.
function getCommitHash() {
  try {
    return onHeroku ? process.env.SOURCE_VERSION : gitRevisionPlugin.commithash();
  } catch (error) {
    return ""
  }
}

const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');

module.exports = override(
  addWebpackAlias({
    // lodash: path.resolve(__dirname, 'node_modules/lodash'),
    'bn.js': path.resolve(__dirname, 'node_modules/bn.js/lib/bn.js')
  }),
  addWebpackPlugin(new AntdDayjsWebpackPlugin()),
  addWebpackPlugin(
    new DuplicatePackageCheckerPlugin({
      verbose: true,
      strict: true
    })
  ),
  // addWebpackPlugin(gitRevisionPlugin),
  addWebpackPlugin(
    new webpack.DefinePlugin({
      'process.env.COMMITHASH': JSON.stringify(getCommitHash()),
      'process.env.TIME':
        '"' +
        new Date().toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong' }) +
        '/SH"'
    })
  ),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  setWebpackOptimizationSplitChunks({
    // https://webpack.js.org/plugins/split-chunks-plugin/
    chunks: 'async',
    maxSize: 4000000,
    maxAsyncRequests: 8,
    maxInitialRequests: 6
  }),
  addLessLoader({
    javascriptEnabled: true,

    // https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
    modifyVars: {
      '@font-family': 'Montserrat, sans-serif',
      '@btn-shadow': '0px',
      '@animation-duration-slow': '0s !important',
      '@wave-animation-width': '0px',
      '@modal-body-padding': '16px 60px 32px 60px'
    }
  })
);
