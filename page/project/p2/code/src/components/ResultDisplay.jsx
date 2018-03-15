import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ResultCard from './ResultCard.jsx';
import _ from 'lodash';

class ResultDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: this.props.query,
      results: this.props.results || []
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      query: newProps.query || '',
      results: newProps.results || []
    });
  }

  buildCards(classes) {
    return _.map(classes, (classInfo) => (
      <ResultCard
        key={`${classInfo.no} - ${classInfo.crn}`}
        classTitle={classInfo.title}
        classNo={classInfo.no}
        crn={classInfo.crn}
        profs={classInfo.profs}
        description={'No More Information'}
      />
    ));
  }

  render() {
    return (
      <div>
        {(this.state.results.length === 0) ? 'No results' : `${this.state.results.length} results`}
        {this.buildCards(this.state.results)}
      </div>
    );
  }
}

ResultDisplay.defaultProps = {
  query: '',
  results: []
};

ResultDisplay.propTypes = {
  query: PropTypes.string,
  results: PropTypes.array
};

export default ResultDisplay;
