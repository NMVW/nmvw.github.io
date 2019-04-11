/*
  Stateful Event API Assumptions:
  1. decoupled from client workflows =>  light payload "events" hinting to client to seek updates from API
  2. high failure probability (spotty connection, offline mode disabled, etc.)
*/
class OfflineEventSource {
  /*
    Mocked SSE for dev or offline mode
  */

  _listeners = {};

  constructor (SSE_endpoint, options) {
    console.warn("[SSE]: offline mode");
  }

  onmessage () {/* Virtual Method */}
  onerror () {/* Virtual Method */}

  close () {
    console.warn('[SSE]: terminating connection for already offline mode');
  }

  addEventListener (event_name, cb) {
    if (this._listeners[event_name]) {
      this._listeners[event_name].push(cb);
    } else {
      this._listeners[event_name] = [cb];
    }
  }
  removeEventListeners (event_name) {
    delete this._listeners[event_name];
  }

  emitEvent ({name='custom_event', value='initialized'}) {
    if (this._listeners[name]) this._listeners[name].forEach(sub => sub({name, value}));
  }
}

export class EventService {
  // Browser compatability: https://developer.mozilla.org/en-US/docs/Web/API/EventSource#Browser_compatibility

  static _singleton = null;

  static get sse () {
    return EventService._singleton;
  }

  _subscribers = [];

  constructor (env) {
    // client sse configuration
    if (!EventSource) throw Error('EventSource API not available');
    if (EventService._singleton) throw ('EventSource singleton initialized');
    EventService._singleton = this.init(env);
  }

  init (env) {
    // TODO: offer debug offline mode option to toggle between live SSE and local stub
    const SSE_endpoint = `/clientevents/clientevents/${env.clientId}`;
    const SSE_options = { withCredentials: false };
    // const source = new EventSource(SSE_endpoint, SSE_options);
    const source = new OfflineEventSource(SSE_endpoint, SSE_options);
    source.onmessage = this._message.bind(this);
    source.onerror = this._fail;
    source.addEventListener("custom_event", e => console.log("CUSTOM SSE EVENT (custom_event)", e));
    return source;
  }

  _message (ev) {
    this.publish(JSON.parse(ev.data));
    // update stateful app channel from here
    console.log("DEFAULT SSE EVENT (onmessage)", ev);
  }

  _fail (ev) {
    console.log("EventSource failed.", ev); // offline, permission issue, etc.
  }

  subscribe (cb) {
    this._subscribers.push(cb);
    const index = this._subscribers.length - 1;
    return () => this._subscribers = this._subscribers.filter((s, i) => i !== index);
  }
  publish (msg) {
    this._subscribers.forEach(sub => sub(msg));
  }

  release () {
    EventService.sse.close(); // terminate the SSE connection
  }
}
