import React from 'react';
import ReactDOM from 'react-dom';

import { Blog } from './components';

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<Blog />, wrapper) : false;