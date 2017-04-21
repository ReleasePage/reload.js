import uglify from 'rollup-plugin-uglify';
import config from './rollup.config';

const pkg = require('./package.json');

config.plugins.push(uglify());
config.dest = pkg.minified;

export default config;
