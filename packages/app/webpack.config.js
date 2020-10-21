const path = require("path");
const {
  getWebpackConfig,
} = require("@jeremyrh/build-tooling/getWebpackConfig");
const packageJson = require("./package.json");

module.exports = getWebpackConfig({
  packageName: packageJson.name,
  exposes: {
    "default": "./index",
  },
  // https://webpack.js.org/configuration/output/#outputpath
  outputPath: path.resolve(__dirname, "dist"),
  // https://webpack.js.org/configuration/output/#outputpublicpath
  publicPath: "/packages/app/dist/browser/",
});
