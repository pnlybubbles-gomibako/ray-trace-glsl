import request from 'superagent';

class Renderer {
  constructor(canvasId) {
    this.c = document.getElementById(canvasId);
    this.x = this.c.clientWidth;
    this.y = this.c.clientHeight;
    this.gl = this.c.getContext('webgl');
    this.p = this.gl.createProgram();
    this.status = null;
    this.uni = {};
  }

  generate(i, source) {
    const k = this.gl.createShader(this.gl.VERTEX_SHADER - i);
    this.gl.shaderSource(k, source);
    this.gl.compileShader(k);
    this.gl.attachShader(this.p, k);
    return this.gl.getShaderInfoLog(k);
  }

  attach(vsSrc, fsSrc, cb) {
    this.get(vsSrc).then((res) => {
      const err = this.generate(0, res.text);
      if (err) {
        throw new Error(err);
      }
      return this.get(fsSrc);
    }).then((res) => {
      const err = this.generate(1, res.text);
      if (err) {
        throw new Error(err);
      }
      this.gl.linkProgram(this.p);
      this.status = this.gl.getProgramParameter(this.p, this.gl.LINK_STATUS);
      if (cb) {
        cb();
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  start() {
    this.gl.useProgram(this.p);
    this.uni = {};
    this.uni = {};
    this.uni.time = this.gl.getUniformLocation(this.p, 't');
    this.uni.resolution = this.gl.getUniformLocation(this.p, 'r');
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([-1, 1, 0, -1, -1, 0, 1, 1, 0, 1, -1, 0]), this.gl.STATIC_DRAW);
    const a = this.gl.getAttribLocation(this.p, 'position');
    this.gl.enableVertexAttribArray(a);
    this.gl.vertexAttribPointer(a, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.viewport(0, 0, this.x, this.y);
    this.render(0);
  }

  render(ts) {
    if (!this.status) {
      return;
    }
    const d = ts * 0.001;
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.uniform1f(this.uni.time, d);
    this.gl.uniform2fv(this.uni.resolution, [this.x, this.y]);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    this.gl.flush();
    requestAnimationFrame(this.render.bind(this));
  }

  get(path) {
    return new Promise((resolve, reject) => {
      request.get(path).end((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
}

export default Renderer;
