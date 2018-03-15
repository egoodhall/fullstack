import React, { Component } from 'react';
import { parse } from 'query-string';
import windowSize from 'react-window-size';
import './App.css';
import ResultDisplay from './components/ResultDisplay';
import CustomSearchBar from './components/CustomSearchBar.jsx';
import { SelectField, MenuItem, FlatButton, AppBar } from 'material-ui';
import { subjects, requirements } from './helpers/const';
import _ from 'lodash';
import { threeMux } from './helpers';

const getStyles = (w, h) => ({
  search: {
    bar: {
      position: 'fixed',
      top: '10px',
      zIndex: 4,
      width: threeMux(w > 991, '60em', w > 768, '80%', '93%')
    },
    background: {
      zIndex: 3,
      height: 80,
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
  resultsContainer: {
    marginRight: threeMux(w > 991, '100px', w > 768, '5%', '5px'),
    marginLeft: threeMux(w > 991, '100px', w > 768, '5%', '5px'),
    marginTop: '104px'
  }
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      search: {
        query: {
          text: '',
          limit: 1000
        },
        results: []
      },
      query: parse(this.props.location.search) || { text: '', limit: 1000 },
      results: [],
      styles: getStyles(this.props.windowWidth, this.props.windowHeight)
    };

    this.onRequestSearch = this.onRequestSearch.bind(this);

    this.getResults(this.state.query, this.onRequestSearch);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  componentWillReceiveProps(newProps) {
    const params = parse(newProps.location.search);
    const identicalQueries = _.isEqual(this.state.search.query, params);

    // Check for differences in query prop
    if (!identicalQueries) {
      // Update the query
      this.setState({ query: params }, () => {
        // Retrieve new results (needs to be done here for browser navigation)
        this.getResults(this.state.query, () => {
          // Set new results in search
          this.setState({
            search: {
              query: this.state.query,
              results: this.state.results
            }
          });
        });
      });
    }
  }

  updateDimensions() {
    this.setState({ styles: getStyles(this.props.windowWidth, this.props.windowHeight) });
  }

  getResults(query, cb = () => {}) {
    // Remove 'text' if it needs to be taken out
    if (query.text === '') {
      this.setState({
        query: {
          ...this.state.query,
          text: undefined
        },
        results: []
      });
    }

    // Build a query string for the request
    const queryString = this.buildQueryString(query);

    // Retrieve data
    fetch('http://eg:48484/q' + queryString)
      .then(res => res.json())
      .then(res => {
        if (res.result !== 'success') {
          throw Error('Search failed');
        }
        return res.message;
      })
      .then(data => {
        // Write in results
        this.setState({
          results: _(data).map(course => ({
            title: course.Title,
            crn: `${course.CRN}`,
            no: `${course.Department} ${course.CrseNum}`,
            profs: course.Instructor,
            description: course.CrseDesc
          })).sortBy(['no', 'crn']).compact().value()
        }, () => {
          return cb(queryString);
        });
      });
  }

  buildQueryString(query) {
    let added = 0;
    let queryString = '';
    _(query).keys().forEach((key) => {
      if (query[key] && query[key] !== '') {
        if (added === 0) {
          queryString += `?${key}=${query[key]}`;
        } else {
          queryString += `&${key}=${query[key]}`;
        }
        added += 1;
      }
    });
    return queryString;
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
    }, () => {
      this.getResults(this.state.query, cb);
    });
  }

  onSearchCleared() {
    this.onSearchChanged('', this.onRequestSearch);
  }

  updateFilter(key, value) {
    const newQuery = { ...this.state.query };
    newQuery[key] = value;
    this.setState({
      query: newQuery
    }, () => this.getResults(this.state.query, this.onRequestSearch));
  }

  clearFilters() {
    this.setState({
      query: {
        text: this.state.query.text
      }
    }, () => this.getResults(this.state.query, this.onRequestSearch));
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
          autoWidth={true}
        >
          {_.map(filter.opts, (opt) => (<MenuItem key={ opt.value } value={ opt.value } primaryText={ opt.display || opt.value } />))}
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
    const w = this.props.windowWidth;
    const styles = getStyles(w);
    return (
      <div className="App">
        <div style={styles.search.container}>
          <AppBar style={styles.search.background} showMenuIconButton={false}/>
          <CustomSearchBar
            value={this.state.query.text}
            onChange={(text) => this.onSearchChanged(text)}
            onRequestSearch={() => this.onRequestSearch(this.buildQueryString(this.state.query))}
            handleClear={() => this.onSearchCleared()}
            filters={this.filters(styles)}
            style={styles.search.bar}
          />
        </div>
        <div style={styles.resultsContainer}>
          <ResultDisplay
            query={this.state.search.query.text}
            results={this.state.search.results}
          />
        </div>
      </div>
    );
  }
}

export default windowSize(App);
