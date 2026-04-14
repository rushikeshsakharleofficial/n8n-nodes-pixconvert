const { src, dest, series } = require('gulp');

function buildIcons() {
  return src('nodes/**/*.{svg,png,json}').pipe(dest('dist/nodes'));
}

exports['build:icons'] = series(buildIcons);
