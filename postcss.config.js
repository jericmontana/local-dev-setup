module.exports = {
    plugins: {
      'postcss-import': {},
      'postcss-simple-vars': {},
      'postcss-nested': {},
      'postcss-mixins': {},
      'postcss-custom-media': {},
      'postcss-custom-properties':{},
      'postcss-preset-env': {
        autoprefixer: {
          grid: true,
          overrideBrowserslist: ["last 2 versions"],
        },
        features: {
          'has-pseudo-class': true,
          'nesting-rules': false,
        },
      },
      'cssnano': {
        preset: 'default',
      },
    },
};