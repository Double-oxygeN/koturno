/**
 * Copyright 2017 Double_oxygeN
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


const _privates = new WeakMap();
const getPrivates = self => {
  let p = _privates.get(self);
  if (!p) _privates.set(self, p = {});
  return p;
};

/**
 * Class representing a state.
 * @param {any[]} [data=[]] pairs of state name and value
 */
export default class State {
  constructor(data) {
    getPrivates(this).data = new Map(data);
  }

  /**
   * Clone itself.
   * @returns {State} clone
   */
  clone() {
    return new State(getPrivates(this).data.entries());
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
   * @param {any} state state value
   * @returns {State} new state
   */
  setState(name, state) {
    return new State(new Map(getPrivates(this).data.entries()).set(name, state).entries());
  }

  /**
   * Set states at once.
   * @param {Object} obj object whose keys are state names and whose values are state values
   * @returns {State} new state
   */
  setStates(obj) {
    return new State(Object.keys(obj).reduce((m, key) => m.set(key, obj[key]), new Map(getPrivates(this).data.entries())).entries());
  }

  /**
   * Set state if `condition` is true.
   * @param {string} name state name
   * @param {any} state state value
   * @param {boolean} condition condition
   * @returns {State} new state
   */
  setStateIfTrue(name, state, condition) {
    return condition ? this.setState(name, state) : this;
  }

  /**
   * Check whether the state of the name exists or not.
   * @param {string} name state name
   * @returns {boolean} `true` if exists
   */
  hasState(name) {
    return getPrivates(this).data.has(name);
  }

  /**
   * Get the state.
   * If there is no state of the name, it returns the default value.
   * @param {string} name state name
   * @param {any} [defaultValue=null] default value
   * @returns {any} state or default value
   */
  getState(name, defaultValue = null) {
    return this.hasState(name) ? getPrivates(this).data.get(name) : defaultValue;
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
    return new State(Object.keys(obj).reduce((m, key) => m.has(key) ? m.set(key, obj[key](m.get(key))) : m, new Map(getPrivates(this).data.entries())).entries());
  }

  /**
   * Remove the state.
   * @param {...string} names state names
   * @returns {State} new state
   */
  removeState(...names) {
    return new State(names.reduce((m, key) => {
      m.delete(key);
      return m;
    }, new Map(getPrivates(this).data.entries())).entries());
  }

  /**
   * Return state name list.
   * @returns {string[]} state names list
   */
  names() {
    return Array.from(getPrivates(this).data.keys());
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
