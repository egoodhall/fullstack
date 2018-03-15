import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';

import './index.css';
import App from './App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import * as Colors from 'material-ui/styles/colors';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// Build M-UI theme for app
const getTheme = () => {
  let overwrites = {
    'palette': {
      'primary1Color': Colors.blue500,
      'primary2Color': Colors.lightBlue700,
      'accent1Color': Colors.deepOrangeA200,
      'pickerHeaderColor': Colors.lightBlue500
    }
  };
  return getMuiTheme(baseTheme, overwrites);
};

const AppContainer = () => (
  <MuiThemeProvider muiTheme={getTheme()}>
    <Router>
      <Route exact path='/(search)?' component={App}/>
    </Router>
  </MuiThemeProvider>
);

ReactDOM.render(
  <AppContainer />,
  document.getElementById('root')
);
