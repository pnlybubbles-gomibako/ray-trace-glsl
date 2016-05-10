import Renderer from './src/renderer';

const r = new Renderer('c');
r.attach('./vs.glsl', './fs.glsl', () => {
  r.start();
});
