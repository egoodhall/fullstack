import React, { Component } from 'react';
import { parse } from 'query-string';
import windowSize from 'react-window-size';
import ResultDisplay from './ResultDisplay';
import CustomSearchBar from './CustomSearchBar.jsx';
import { CircularProgress, SelectField, MenuItem, FlatButton, AppBar, IconButton } from 'material-ui';
import { subjects, requirements } from '../helpers/const';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import _ from 'lodash';
import { threeMux } from '../helpers';

const getStyles = (w) => ({
  title: {
    base: {
      textAlign: 'left',
      fontSize: threeMux(w > 991, '3em', w > 768, '2em', '1em'),
      fontWeight: '300',
      margin: 0
    },
    container: {
      display: (w > 1100) ? 'flex' : 'none',
      flexDirection: 'row',
      justifyContent: 'left',
      width: '100%',
      top: threeMux(w > 991, 16, w > 768, 24, 32),
      position: 'fixed',
      zIndex: 7
    }
  },
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

class SearchPage extends Component {

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
      filtersDisabled: true
    };

    this.onRequestSearch = this.onRequestSearch.bind(this);
    this.getNextPageResults = this.getNextPageResults.bind(this);

    this.getResults(this.state.query, this.onRequestSearch);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions.bind(this));
    window.onscroll = () => {
      if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 2 && !this.state.loading && !this.state.search.endOfResults) {
        this.setState({
          loading: true
        }, () => this.getNextPageResults({ ...this.state.query, skip: (this.state.search.page + 1) * 10, limit: 10 }));
      }
    };
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
              endOfResults: this.state.results.length !== 10,
              page: 0,
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
    fetch('https://www.eg.bucknell.edu/~amm042/service/q' + queryString)
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

  getNextPageResults(query, cb = () => {}) {
    const queryString = this.buildQueryString(query);

    // Retrieve data
    fetch('https://www.eg.bucknell.edu/~amm042/service/q' + queryString)
      .then(res => res.json())
      .then(res => {
        if (res.result !== 'success') {
          throw Error('Search failed');
        }
        return res.message;
      })
      .then(data => {
        // Map new classes
        return _(data).map(course => ({
          title: course.Title,
          crn: `${course.CRN}`,
          no: `${course.Department} ${course.CrseNum}`,
          profs: course.Instructor,
          description: course.CrseDesc
        })).sortBy(['no', 'crn']).compact().value();
      })
      .then(data => {
        const newResults = _.flattenDeep([this.state.results, data]);
        this.setState({
          loading: false,
          results: newResults,
          search: {
            ...this.state.search,
            page: this.state.search.page + 1,
            endOfResults: data.length < 10,
            results: newResults
          }
        }, () => cb());
      });
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
    }, () => {
      this.getResults(this.state.query, cb);
    });
  }

  onSearchCleared() {
    this.setState({
      query: { text: '' }
    }, () => this.getResults(this.state.query, this.onRequestSearch));
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

  onFiltersToggled(closed) {
    this.setState({ filtersDisabled: closed });
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
        <div style={styles.search.container}>
          <AppBar iconElementLeft={
            <IconButton onClick={() => this.props.history.push('/')}>
              <ArrowBackIcon />
            </IconButton>
          } style={styles.search.background}/>
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
        <div style={styles.results.container}>
          <ResultDisplay
            query={this.state.search.query.text}
            results={this.state.search.results}
          />
          { this.state.loading && (
            <div style={styles.results.loader}>
              <CircularProgress />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default windowSize(SearchPage);
