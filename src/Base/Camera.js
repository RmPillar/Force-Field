import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Experience from "./Experience";

export default class Camera {
  constructor(_type = "perspective") {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.renderer = this.experience.renderer;

    this.type = _type;

    this.setInstance();
  }

  setInstance() {
    if (this.type === "perspective") {
      this.setPerspectiveInstance();
      this.setControls();
    } else if (this.type === "orthographic") {
      this.setOrthographicInstance();
    }
  }

  setPerspectiveInstance() {
    if (!this.scene || !this.sizes) {
      return;
    }

    this.instance = new THREE.PerspectiveCamera(
      70,
      this.sizes.width / this.sizes.height,
      0.01,
      10
    );
    this.instance.position.set(0, 0, 1);
    this.scene.add(this.instance);
  }

  setOrthographicInstance() {
    if (!this.scene || !this.sizes) return;

    this.instance = new THREE.OrthographicCamera(
      this.sizes.width / -2,
      this.sizes.width / 2,
      this.sizes.height / 2,
      this.sizes.height / -2,
      1,
      1000
    );
    this.instance.position.set(0, 0, 1);
    this.scene.add(this.instance);
  }

  setControls() {
    if (!this.instance || !this.canvas) {
      return;
    }

    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }

  getVisibleHeightAtZDepth(depth) {
    const vFOV = (this.camera.instance.fov * Math.PI) / 180;

    return 2 * Math.abs(depth) * Math.tan(vFOV / 2);
  }

  getVisibleWidthAtZDepth(depth) {
    const height = this.getVisibleHeightAtZDepth(depth, this.camera.instance);
    return height * this.camera.instance.aspect;
  }

  getViewportDimensionsAtZDepth(depth) {
    return {
      height: this.getVisibleHeightAtZDepth(depth),
      width: this.getVisibleWidthAtZDepth(depth),
    };
  }

  resize() {
    if (this.type === "perspective") {
      this.resizePerspective();
    } else if (this.type === "orthographic") {
      this.resizeOrthographic();
    }
  }

  resizePerspective() {
    if (!this.sizes || !this.instance) {
      return;
    }

    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  resizeOrthographic() {
    if (!this.sizes || !this.instance) return;

    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.left = -this.sizes.width / 2;
    this.instance.right = this.sizes.width / 2;
    this.instance.top = this.sizes.height / 2;
    this.instance.bottom = -this.sizes.height / 2;
    this.instance.updateProjectionMatrix();
  }

  update() {
    if (!this.controls) {
      return;
    }
    this.controls.update();
  }

  destroy() {
    this.scene.remove(this.instance);

    this.instance = null;
  }
}
