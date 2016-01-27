import npm from 'rollup-plugin-npm';

export default {
  plugins: [npm({jsnext: true})],
  moduleId: 'd3',
  moduleName: 'd3',
  format: 'cjs',
  banner: '/* jshint esnext: true, -W097 */'
};
