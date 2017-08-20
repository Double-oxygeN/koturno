/**
 * Class representing a game.
 * @param {Object} obj various settings
 * @param {Scenes} obj.scenes game scenes
 */
class Game {
  constructor(obj) {
    if (['scenes'].every(param => param in obj)) {
      this.scenes = obj.scenes;
    } else {
      throw new Error("Game must have 'scenes'!");
      debugger;
    }
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[Game]`;
  }
}
