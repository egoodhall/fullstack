import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';

import './index.css';
import SearchPage from './components/SearchPage.jsx';
import HomePage from './components/HomePage';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// Build M-UI theme for app
const getTheme = () => {
  let overwrites = {
    palette: {
      primary1Color: '#2196f3',
      primary2Color: '#1976d2',
      accent1Color: '#f57c00',
      pickerHeaderColor: '#2196f3',
      accent2Color: '#ef6c00'
    },
    tabs: {
      backgroundColor: '#f5f5f5',
      textColor: '#2196f3',
      selectedTextColor: '#ef6c00'
    },
    snackbar: {
      backgroundColor: '#eeeeee',
      textColor: '#212121',
      actionColor: '#1565c0'
    }
  };
  return getMuiTheme(baseTheme, overwrites);
};

const AppContainer = () => (
  <MuiThemeProvider muiTheme={getTheme()}>
    <Router>
      <div>
        <Route exact path='/' component={HomePage}/>
        <Route path='/search' component={SearchPage}/>
      </div>
    </Router>
  </MuiThemeProvider>
);

ReactDOM.render(
  <AppContainer />,
  document.getElementById('root')
);
