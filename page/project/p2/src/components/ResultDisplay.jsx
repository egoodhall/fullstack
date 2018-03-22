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
      <ResultCard key={`${classInfo.no} - ${classInfo.crn}`} {...classInfo}/>
    ));
  }

  render() {
    return (
      <div>
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
