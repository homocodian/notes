import React from 'react';
import ReactDom from 'react-dom'
import App from './App'
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDom.render(
  <Router>
    <CssBaseline />
    <App />
  </Router>,
  document.getElementById("root")
)