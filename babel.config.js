module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-worklets/plugin', // 이 플러그인이 반드시 플러그인 리스트의 맨 마지막에 위치해야 함
    ],
  };
};