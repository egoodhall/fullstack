import React, { Component } from 'react';
import { parse } from 'query-string';
import windowSize from 'react-window-size';
import CustomSearchBar from './CustomSearchBar.jsx';
import { SelectField, MenuItem, FlatButton, AppBar } from 'material-ui';
import { subjects, requirements } from '../helpers/const';
import _ from 'lodash';
import { threeMux } from '../helpers';

const getStyles = (w) => ({
  title: {
    base: {
      textAlign: 'center',
      fontSize: '6em',
      fontWeight: '300'
    },
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      bottom: '55%',
      position: 'fixed'
    }
  },
  search: {
    bar: {
      position: 'fixed',
      top: '45%',
      zIndex: 4,
      width: threeMux(w > 991, '60em', w > 768, '80%', '93%')
    },
    background: {
      zIndex: -1,
      height: '100%',
      position: 'fixed'
    },
    container: {
      justifyContent: 'center',
      display: 'flex',
      flexGrow: 1
    },
    filter: {
      marginLeft: '8px',
      marginRight: '8px',
      top: threeMux(w > 991, '-20px', w > 768, '-20px', '-12px')
    },
    button: {
      top: threeMux(w > 991, '-40px', w > 768, '-40px', '-8px')
    }
  },
  results: {
    loader: {
      justifyContent: 'center',
      display: 'flex',
      flexGrow: 1,
      margin: 20
    },
    container: {
      marginRight: threeMux(w > 991, '100px', w > 768, '5%', '5px'),
      marginLeft: threeMux(w > 991, '100px', w > 768, '5%', '5px'),
      marginTop: '104px'
    }
  }
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      search: {
        query: {
          text: ''
        },
        results: []
      },
      query: parse(this.props.location.search) || { text: '', limit: 1000 },
      results: [],
      filtersDisabled: true
    };

    this.onRequestSearch = this.onRequestSearch.bind(this);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  updateDimensions() {
    this.setState({ styles: getStyles(this.props.windowWidth, this.props.windowHeight) });
  }

  buildQueryString(query) {
    return `?${_(query)
      .keys()
      .filter((key) => query[key] && query[key] !== '')
      .map((key) => `${key}=${encodeURIComponent(query[key])}`)
      .join('&')}`;
  }

  onRequestSearch(queryString) {
    // Push the new path
    if (queryString !== '') {
      this.props.history.push(`/search${queryString}`);
    } else {
      this.props.history.push('/');
    }
  }

  onSearchChanged(text, cb = () => {}) {
    this.setState({
      query: {
        ...this.state.query,
        text
      }
    });
  }

  onSearchCleared() {
    this.setState({
      query: { text: '' }
    });
  }

  updateFilter(key, value) {
    const newQuery = { ...this.state.query };
    newQuery[key] = value;
    this.setState({
      query: newQuery
    });
  }

  clearFilters() {
    this.setState({
      query: {
        text: this.state.query.text
      }
    });
  }

  onFiltersToggled(disabled) {
    this.setState({ filtersDisabled: disabled });
  }

  filters(styles) {
    const filters = {
      Department: {
        text: 'Department',
        opts: subjects
      },
      CCCReq: {
        text: 'Requirement',
        opts: requirements
      }
    };
    const filterComponents = _(filters).keys().map((type) => {
      const filter = filters[type];
      return (
        <SelectField
          key={type}
          floatingLabelText={filter.text}
          value={this.state.query[type]}
          onChange={(event, key, value) => this.updateFilter(type, value)}
          style={styles.search.filter}
          disabled={this.state.filtersDisabled}
          autoWidth={true}
        >
          {_.map(filter.opts, (opt) => (
            <MenuItem
              key={ opt.value }
              value={ opt.value }
              primaryText={ opt.display || opt.value }
              disabled={this.state.filtersDisabled}
            />
          ))}
        </SelectField>
      );
    }).compact().value();
    filterComponents.push((
      <FlatButton
        key="clear-filters"
        style={styles.search.button}
        label="Clear Filters"
        onClick={() => this.clearFilters()}
        secondary={true}
      />
    ));
    return filterComponents;
  }

  render() {
    const styles = getStyles(this.props.windowWidth);
    return (
      <div>
        <AppBar style={styles.search.background} showMenuIconButton={false}/>
        <div style={styles.title.container}>
          <h1 style={{...styles.title.base, color: '#0d47a1'}}>Class&nbsp;</h1>
          <h1 style={{...styles.title.base, color: '#ffa726'}}>Search</h1>
        </div>
        <div style={styles.search.container}>
          <CustomSearchBar
            value={this.state.query.text}
            onChange={(text) => this.onSearchChanged(text)}
            onRequestSearch={() => this.onRequestSearch(this.buildQueryString(this.state.query))}
            handleClear={() => this.onSearchCleared()}
            filters={this.filters(styles)}
            onFiltersToggled={(open) => this.onFiltersToggled(open)}
            style={styles.search.bar}
          />
        </div>
      </div>
    );
  }
}

export default windowSize(App);
