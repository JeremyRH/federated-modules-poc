exports.sharedPackages = {
  react: {
    // Global variable for non-lazy packages
    root: "React",
    // The version every other package must use
    requiredVersion: "16.x.x",
  },
  "react-dom": {
    root: "ReactDOM",
    requiredVersion: "16.x.x",
  },
  // Polyfills and other runtime code
  "@babel/runtime": {
    root: "BabelRuntime",
    requiredVersion: "7.x.x",
  },
  "@jeremyrh/component-a": {
    // https://webpack.js.org/configuration/output/#outputpublicpath
    publicPath: "/packages/component-a/dist/browser/",
    requiredVersion: "1.x.x",
  },
  "@jeremyrh/component-b": {
    publicPath: "/packages/component-b/dist/browser/",
    requiredVersion: "2.x.x",
  },
  "@jeremyrh/components": {
    publicPath: "/packages/components/dist/browser/",
    requiredVersion: "1.x.x",
  },
};
