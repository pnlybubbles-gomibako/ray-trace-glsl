precision mediump float;
uniform float t;
uniform vec2  r;

void main(void){
  float a = gl_FragCoord.y / 512.0;
  gl_FragColor = vec4(vec3(a), 1.0);
}
