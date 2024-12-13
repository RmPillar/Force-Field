import * as THREE from "three";
import Experience from "./Experience";

import vertexShader from "./shaders/base/vertex.glsl";
import fragmentShader from "./shaders/base/fragment.glsl";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // this.resources.on('ready', () => {
    this.init();
    // })
  }

  init() {
    this.addObjects();
  }

  addObjects() {
    this.geometry = new THREE.PlaneGeometry(1, 1);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  update() {}
}
