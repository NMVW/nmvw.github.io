// import { logger } from 'models/utils';


export default class Observer {
  // DOWN STREAM DATA FLOW ONLY

  // Observer: maintains state_tree ("subject") and notifies on model event paths

  /*
    state_tree ("subject") = {
      "<model_name>": {
        "list": [sub1, sub2],
        "<model_id>": {
          "list": [sub3, sub5],
          "<submodel_name>": {
            "list": [sub7, sub8],
            "<submodel_id>": {
              "list": [sub4, sub6]
            }
          }
        }
        ...
      }
      ...
    }
  */

  constructor() {
    this.logger = msg => console.log(`[${this.constructor.name.toUpperCase()}]: ${msg}`);
    this.state_tree = {};
  }

  // PRIVATE
  _fetch_slice(path='') {
    // i.e. 'model.mid.submodel.sid'
    // will fetch or create arbitrary slice of state_tree ("subject") list
    path = path.split('.');
    let level = this.state_tree;
    for (let depth in path) {
      let name = path[depth];
      let exists = level[name];
      if (!exists) level[name] = {"list": []};
      level = level[name];
    }
    return level;
  }

  // PUBLIC
  notify(path, data) {
    const subscriber_list = this._fetch_slice(path).list;
    for (let index in subscriber_list) {
      subscriber_list[index](data);
    }
    this.logger('log', 'notified subscribers on "%s" slice of payload %s', path, data);
    this.logger('log', 'state tree: %s', this.state_tree);
  }
  subscribe(path, update=slice=>slice) {
    const subscriber_index = this._fetch_slice(path).list.push(update) - 1;
    this.logger('log', 'subscribed on "%s" slice', path);
    this.logger('log', 'state tree: %s', this.state_tree);
    return () => delete this._fetch_slice(path).list[subscriber_index]; // unsubscribe should be bound to consuming component
  }
}
