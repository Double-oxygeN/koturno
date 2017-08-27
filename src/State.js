/**
 * Class representing a state.
 * @param {any[]} [data=[]] pairs of state name and value
 */
class State {
  constructor(data) {
    this.data = new Map(data);
  }

  /**
   * Clone itself.
   * @returns {State} clone
   */
  clone() {
    return new State(this.data.entries());
  }

  /**
   * Initialize a state.
   * @param {Object} obj object whose keys are state names and whose values are state values
   * @returns {State} new state
   */
  static init(obj) {
    return new State(Object.keys(obj).map(key => [key, obj[key]]));
  }

  /**
   * Set state of the name.
   * @param {string} name state name
   * @param {} state state value
   * @returns {State} new state
   */
  setState(name, state) {
    const clone = this.clone();
    clone.data.set(name, state);
    return clone;
  }

  /**
   * Set states at once.
   * @param {Object} obj object whose keys are state names and whose values are state values
   * @returns {State} new state
   */
  setStates(obj) {
    const clone = this.clone();
    Object.keys(obj).forEach(key => clone.data.set(key, obj[key]));
    return clone;
  }

  /**
   * Check whether the state of the name exists or not.
   * @param {string} name state name
   * @returns {boolean} `true` if exists
   */
  hasState(name) {
    return this.data.has(name);
  }

  /**
   * Get the state.
   * @param {string} name state name
   * @returns {} state or null
   */
  getState(name) {
    return this.hasState(name) ? this.data.get(name) : null;
  }

  /**
   * Modify the state.
   * @param {string} name state name
   * @param {function} f state modifier
   * @returns {State} new state
   */
  modifyState(name, f) {
    return this.hasState(name) ? this.setState(name, f(this.getState(name))) : this;
  }

  /**
   * Modify states at once.
   * @param {Object} obj object whose keys are state names and whose values are state modifiers
   * @returns {State} new state
   */
  modifyStates(obj) {
    const clone = this.clone();
    Object.keys(obj).forEach(key => this.hasState(key) && clone.data.set(key, obj[key](this.getState(key))));
    return clone;
  }

  /**
   * Remove the state.
   * @param {string} name state name
   * @returns {State}
   */
  removeState(name) {
    const clone = this.clone();
    clone.data.delete(name);
    return clone;
  }

  /**
   * Return state name list.
   * @returns {string[]} state names lisr
   */
  names() {
    return Array.from(this.data.keys());
  }

  /**
   * Convert to properties.
   * @returns {string} state properties
   */
  toProperties() {
    return this.names().map(name => `${name} = ${this.getState(name)}`).join('\n');
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[State ${this.data.size}]`;
  }
}
