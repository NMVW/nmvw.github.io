import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { StateProvider } from 'services/state';

// entrypoint
import App from 'components';

// debug settings
if (CLIENT_CONFIG['debug'] && module.hot) module.hot.accept(); // HMR

const Provider = ({ debug, store, styles, children }) => (
  <StateProvider debug={debug} store={store}>
    <MuiThemeProvider theme={createMuiTheme(styles.material_ui)}>
      { children }
    </MuiThemeProvider>
  </StateProvider>
);

// TODO: hydrate from endpoint SSR
const initialState = {};

// mount App
ReactDOM.render(
  <Provider debug={true} store={initialState} styles={STYLES}>
    <App env={CLIENT_CONFIG} />
  </Provider>
  ,
  document.getElementById("app")
);
