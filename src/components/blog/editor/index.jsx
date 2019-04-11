import React from 'react';

// custom npm
import Markdown from '@nixster/pagedown';
import h2m from 'h2m';

// mui
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/SaveAlt';

import Timestamp from './time-stamp';

export default class Editor extends React.Component {

  // TODO: inject markdown from html source
  state = {
    markdownContent: '',
    timeStamp: new Date()
  }

  // look into Discus and repl.it for building community and embedded code editing experience
  // fortune cookie (random fortune cookie saying per visit)
  constructor (props) {
    super(props);
    this.editor = new MDEditor();
    this.updateMD = this.updateMD.bind(this);
    this.updateTS = this.updateTS.bind(this);
  }

  componentDidMount () {
    this.editor.activate(); // bind md input to live preview
    debugger;
    this.loadPost(1);
  }

  loadPost (id) {
    const postHTML = localStorage.getItem('postHTML') || '';
    this.setState({ markdownContent: this.editor.html2Md(postHTML) });
  }
  savePost () {
    const postHTML = this.editor.md2Html(this.state.markdownContent);
    localStorage.setItem('postHTML', postHTML);
  }

  updateMD (markdownContent) {
    this.setState({ markdownContent });
  }
  updateTS (timeStamp) {
    this.setState({ timeStamp });
  }

  static InputArea ({ markdown, update }) {
    // TODO: gain programmatic control of text area to hydrate per post (hydrate from local storage)
    //   <div dangerouslySetInnerHTML={{__html: this.editor.preview()}}></div>
    return [
      <List key="controls" id="wmd-button-bar" />,
      <TextField
        key="post-markdown"
        fullWidth
        multiline
        id="wmd-input"
        label="Post"
        style={{ margin: 8 }}
        placeholder="Edit Post"
        helperText="Start writing..."
        margin="normal"
        variant="outlined"
        helperText="Inspiration strikes when it does"
        value={markdown}
        onChange={ev => update(ev.target.value)}
        InputLabelProps={{ shrink: true }}
      />,
      <Typography key="post-html" id="wmd-preview"></Typography>
    ];
  }

  render () {
    return [
      <Editor.InputArea
        markdown={this.state.markdownContent}
        update={this.updateMD}
      />,
      <Tooltip title={"Save"}>
        <IconButton onClick={this.savePost} color="primary" variant="contained" size="small">
           <SaveIcon />
         </IconButton>
      </Tooltip>,
      <Timestamp
        ts={this.state.timeStamp}
        update={this.updateTS}
      />
    ];
  }
}


class MDEditor {

  /*
      Markdown converter and previewer (new posts/ loaded posts)
  */

  constructor () {
    this.converter = new Markdown.Converter();
    this._editor = new Markdown.Editor(this.converter, undefined, {title: 'Markdown'});
  }

  activate = () => this._editor.run();
  md2Html = md => this.converter.makeHtml(md);
  html2Md = html => h2m(html);
}
