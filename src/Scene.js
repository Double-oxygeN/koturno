/**
 * Class representing a game scene.
 * If you want to create new scene, please extend it.
 * @param {string} name scene name
 */
class Scene {
  constructor(name) {
    this.name = name;
    Object.freeze(this);
  }

  /**
   * Initialize the state.
   * @param {State} state previous state
   * @param {Counters} counters counters
   * @param {Game} game game itself
   * @returns {State} initialized state
   */
  init(state, counters, game) {
    return state;
  }

  /**
   * Update the state.
   * @param {State} state previous state
   * @param {ActionManager} action user inputs
   * @param {Counters} counters counters
   * @param {SoundManager} sound sound manager
   * @param {Game} game game itself
   * @returns {State} updated state
   */
  update(state, action, counters, sound, game) {
    return state;
  }

  /**
   * Draw on the canvas.
   * @param {State} state previous state
   * @param {ActionManager} action user inputs
   * @param {Counters} counters counters
   * @param {Painter} painter graphics controller
   * @param {Game} game game itself
   */
  draw(state, action, counters, painter, game) {
    painter.background("#ffffff");
    painter.text(this.name, game.width / 2, game.height / 2, { size: 64 }).fill("#000000");
  }

  /**
   * Transition to the next scene.
   * @param {State} state previous state
   * @param {ActionManager} action user inputs
   * @param {Counters} counters counters
   * @param {Game} game game itself
   * @returns {Transition} transition
   */
  transition(state, action, counters, game) {
    return Transition.Stay();
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[Scene ${this.name}]`;
  }
}
