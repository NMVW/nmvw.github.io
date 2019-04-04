import React from 'react';

// navigation icons
import ReaderIcon from '@material-ui/icons/ImageSearch';
import NumbersIcon from '@material-ui/icons/Equalizer';
import EditorIcon from '@material-ui/icons/Dashboard';
import Tooltip from '@material-ui/core/Tooltip';

// custom components
import { Reader, Editor } from 'components/blog';
import Numbers from 'components/numbers';
import NavPanel from 'components/nav';

const Layout = props => {
  console.log('[ROOT UI COMPONENT]: Determine viewport mobile/desktop and/or portrait/landscape and adjust layout accordingly');
  const mobile = false;
  let content = props.children;
  if (mobile) content = _.map(props.children, child => child).reverse();
  return <div style={{display: 'flex', flex: 1, flexFlow: 'column nowrap', height: '100%'}}>{ content }</div>
};

export default class App extends React.Component {

  state = {
    view: 'editor',
  };

  static views = [
    { name: 'Reader', value: 'reader', icon: <Tooltip title={"Reader"} placement={"right"} aria-label={"Reader"}><ReaderIcon /></Tooltip> },
    { name: 'Numbers', value: 'numbers', icon: <Tooltip title={"Numbers"} placement={"right"} aria-label={"Numbers"}><NumbersIcon /></Tooltip> },
    { name: 'Editor', value: 'editor', icon: <Tooltip title={"Editor"} placement={"right"} aria-label={"Editor"}><EditorIcon /></Tooltip> },
  ];

  static Main ({ view }) {
    switch(view) {
      case 'reader':
        return <Reader />;
      case 'numbers':
        return <Numbers />;
      case 'editor':
        return <Editor />;
      default:
        return null;
    }
  }

  constructor (props) {
    super(props);
  }

  render () {
    return (
      <Layout>
        <NavPanel
          activeView={this.state.view}
          topViews={App.views}
          toView={view => this.setState({view})}
        >
          <App.Main view={this.state.view} />
        </NavPanel>
      </Layout>
    );
  }
}