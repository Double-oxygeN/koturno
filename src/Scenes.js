/**
 * Class representing game scenes.
 * @param {Scene[]} scenes an array of scenes
 */
class Scenes {
  constructor(scenes) {
    this.scenes = new Map();
    scenes.forEach(scene => this.scenes.set(scene.name, scene));
  }

  /**
   * Add new scene.
   * @param {Scene} scene new scene
   * @returns {boolean} If this already has the scene of the same name, returns `false`.
   */
  addScene(scene) {
    if (this.hasScene(scene.name)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Check if this has the scene.
   * @param {string} name the scene name
   * @returns {boolean} `true` if this has the scene
   */
  hasScene(name) {
    return this.scenes.has(name);
  }

  /**
   * Returns the scene.
   * @param {string} name the scene name
   * @returns {?Scene} the scene
   */
  getScene(name) {
    if (this.hasScene(name)) {
      return this.get(name);
    } else {
      throw new Error(`Scenes has no scene of name ${name}!`);
      return null;
    }
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[Scenes]`;
  }
}
