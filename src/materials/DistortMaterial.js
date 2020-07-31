import { MeshPhysicalMaterial } from 'three'
import { extend } from 'react-three-fiber'
import distort from '../glsl/distort.vert'

export default class DistortMaterial extends MeshPhysicalMaterial {
  constructor(parameters) {
    super(parameters)
    this.setValues(parameters)
    this._time = { value: 0 }
    this._distort = { value: 0.4 }
    this._radius = { value: 1 }
  }

  onBeforeCompile(shader) {
    shader.uniforms.time = this._time
    shader.uniforms.radius = this._radius
    shader.uniforms.distort = this._distort

    shader.vertexShader = `
      uniform float time;
      uniform float radius;
      uniform float distort;
      uniform float factor;
      varying vec3 vColor;
      ${distort}
      ${shader.vertexShader}
    `
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
        float updateTime = time / 50.0;
        float noise = snoise(vec3(position / 2.0 + updateTime * 5.0));
<<<<<<< HEAD:src/materials/DistortMaterial.js
        vColor = hsv2rgb(vec3(noise * distort * 0.3 + updateTime, 0.2, 1.0));
=======

>>>>>>> 7dc3475c1a8ae7e1449d7337c63859b549c708e5:src/materials/distort.js
        vec3 transformed = vec3(position * (noise * pow(distort, 2.0) + radius));
        gl_Position = vec4(position * 5.0, 1.0);
        `,
    )
  }

  get time() {
    return this._time.value
  }

  set time(v) {
    this._time.value = v
  }

  get distort() {
    return this._distort.value
  }

  set distort(v) {
    this._distort.value = v
  }

  get radius() {
    return this._radius.value
  }

  set radius(v) {
    this._radius.value = v
  }
}

extend({ DistortMaterial })
