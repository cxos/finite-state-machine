class FSM {
  /**
     * Creates new FSM instance.
     * @param config
     */
  constructor(config) {
    if (!config) {
      throw new Error();
    }
    this.config = config;
    this.states = [config.initial];
    this.history = [];
  }

  /**
     * Returns active state.
     * @returns {String}
     */
  getState() {
    return this.states[this.states.length - 1];
  }

  /**
     * Goes to specified state.
     * @param state
     */
  changeState(state) {
    if (!this.config.states[state]) {
      throw new Error();
    }
    this.states = [state];
  }

  /**
     * Changes state according to event transition rules.
     * @param event
     */
  trigger(event) {
    const path = this.config.states[this.getState()].transitions[event];

    if (!path) {
      throw new Error();
    }

    this.states.push(path);
    this.history = [];
  }

  /**
     * Resets FSM state to initial.
     */
  reset() {
    this.states = [this.config.initial];
  }

  /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
  getStates(event) {
    if (!event) {
      return Object.keys(this.config.states);
    }

    const statuses = [];

    Object.keys(this.config.states).forEach((state) => {
      if (this.config.states[state].transitions[event]) {
        statuses.push(state);
      }
    });

    return statuses;
  }

  /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
  undo() {
    if (this.states.length !== 1) {
      this.history.push(this.states.pop());
      return true;
    }

    if (this.states[0] !== this.config.initial) {
      this.states[0] = this.config.initial;
      return true;
    }

    return false;
  }

  /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
  redo() {
    if (this.history.length === 0) {
      return false;
    }

    this.states.push(this.history.pop());
    return true;
  }

  /**
     * Clears transition history
     */
  clearHistory() {
    this.history = [];

    if (this.states.length) {
      this.states = [this.config.initial];
    }
  }
}

module.exports = FSM;
