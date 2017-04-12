import config from './rollup.config';

const pkg = require('./package.json');

config.dest = pkg.module;
config.format = 'amd';

export default config;
