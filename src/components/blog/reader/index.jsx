import React from 'react';
import Markdown from '@nixster/pagedown';

import { DomainService } from 'services/api/domain';

export default class Reader extends React.Component {

  state = {
    posts: []
  };

  // look into Discus and repl.it for building community and embedded code editing experience
  // fortune cookie (random fortune cookie saying per visit)
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    DomainService.getPosts().then(posts => {debugger; this.setState({ posts })});
  }

  render () {
    return <pre>{ this.state.posts }</pre>;
  }
}
