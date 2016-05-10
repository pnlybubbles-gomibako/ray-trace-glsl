precision mediump float;
uniform float t;
uniform vec2  r;

struct Ray{
  vec3 origin;
  vec3 direction;
};

void main(void){
  vec2 p = (gl_FragCoord.xy * 2.0 - r) / min(r.x, r.y);
  Ray ray;
  ray.origin = vec3(0.0, 0.0, 5.0);
  ray.direction = normalize(vec3(p.x, p.y, -1.0));
  gl_FragColor = vec4(ray.direction, 1.0);
}
