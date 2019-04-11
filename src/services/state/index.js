import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import reducers from './reducers';

class Store {

  // TODO: persist store locally

  get = () => this._store;

  constructor (initialState={}, debug=false) {
    const config = [reducers, initialState];
    if (debug) config.push(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
    this._store = createStore(...config);
  }
}

const StateProvider = ({ debug, store, children }) => <Provider store={(new Store(store, debug)).get()}>{ children }</Provider>;
export { StateProvider };
