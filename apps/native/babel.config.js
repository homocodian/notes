module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      "nativewind/babel",
      "react-native-reanimated/plugin"
    ],
    env: {
      production: {
        plugins: ["react-native-paper/babel", "transform-remove-console"]
      }
    }
  };
};
