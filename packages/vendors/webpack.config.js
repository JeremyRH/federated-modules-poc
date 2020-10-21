module.exports = {
  mode: "production",
  entry: "./index",
  output: {
    filename: "vendors.js",
    publicPath: "/packages/vendors/dist/vendors.js",
  },
};
