const path = require("path");
const { ModuleFederationPlugin } = require("webpack").container;
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { sharedPackages } = require("./sharedPackages");

function getContainerName(packageName) {
  return packageName.replace(/(^[^a-z]|[^a-z\d])/gi, "_");
}

function getShared(packageName) {
  const externals = { commonjs: {}, window: {} };
  const modules = {};
  const remotes = {};

  for (const [key, { root, requiredVersion, publicPath }] of Object.entries(
    sharedPackages
  )) {
    if (packageName === key) {
      continue;
    }
    externals.commonjs[key] = { commonjs: key };
    if (root) {
      externals.window[key] = root;
    }
    if (requiredVersion) {
      modules[key] = {
        requiredVersion,
        import: false,
      };
    }
    if (publicPath) {
      const containerName = getContainerName(key);
      remotes[key] = `${containerName}@${path.posix.join(
        publicPath,
        containerName
      )}.js`;
    }
  }

  return {
    externals,
    modules,
    remotes,
  };
}

const rules = [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
      options: {
        plugins: [
          "@babel/plugin-transform-react-jsx",
          "@babel/plugin-transform-runtime",
        ],
      },
    },
  },
];

exports.getWebpackConfig = function getWebpackConfig({
  packageName,
  publicPath,
  outputPath,
  exposes,
}) {
  const shared = getShared(packageName);
  const isSharedPackage = sharedPackages.hasOwnProperty(packageName);
  const containerName = getContainerName(packageName);
  const defaultEntry = exposes.default;

  return [
    // Browser build
    {
      name: packageName,
      mode: "production",
      entry: isSharedPackage ? {} : defaultEntry,
      output: {
        path: path.join(outputPath, "browser"),
        filename: `${containerName}.js`,
        chunkFilename: "[name].[contenthash:14].js",
        publicPath: isSharedPackage
          ? sharedPackages[packageName].publicPath
          : publicPath,
      },
      module: { rules },
      externals: shared.externals.window,
      externalsType: "window",
      plugins: [
        new CleanWebpackPlugin(),
        new ModuleFederationPlugin({
          name: containerName,
          exposes: isSharedPackage ? Object.values(exposes) : undefined,
          shared: shared.modules,
          remotes: shared.remotes,
        }),
      ],
      optimization: {
        minimize: false,
        chunkIds: "named",
      },
    },
    // Node.js build
    {
      mode: "development",
      entry: defaultEntry,
      output: {
        path: path.join(outputPath, "node"),
        filename: "[name].js",
        libraryTarget: "commonjs",
      },
      target: "node",
      module: { rules },
      externals: shared.externals.commonjs,
      externalsType: "commonjs",
      devtool: false,
    },
  ];
};
