import _ from 'lodash';
import { combineReducers } from 'redux';

class Reducer {

  actionPaths = {/* VIRTUAL */};

  reduce = (initialState={}) => (state={}, action={ type: '', payload: {} }) => {
    const pathExists = typeof this.actionPaths[action.type] === 'function';
    return pathExists ? this.actionPaths[action.type](state, action.payload): state;
  }
}

class ActiveReducer extends Reducer {

  actionPaths = {
    "SET_ACTIVE": this.activate,
    "UNSET_ACTIVE": this.deactivate
  }

  activate (state, { type, id }) {
    return { ...state, ...{ [type]: id } };
  }

  deactivate (state, { type }) {
    const trimmedState = { ...state };
    delete trimmedState[type];
    return trimmedState;
  }
}

const active = new ActiveReducer();

export default combineReducers({
  active: active.reduce()
});
