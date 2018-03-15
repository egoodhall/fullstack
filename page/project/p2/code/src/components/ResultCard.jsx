import React, { Component } from 'react';
import { Card, CardText, CardTitle } from 'material-ui';
import { fmtName } from '../helpers/myBucknell';
import _ from 'lodash';
import ProfessorIcon from './ProfessorIcon';
import PropTypes from 'prop-types';

class ResultCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      classTitle: this.props.classTitle,
      classNo: this.props.classNo,
      description: this.props.description,
      crn: this.props.crn,
      profs: _.map(_.split(this.props.profs, '\n'), (prof) => fmtName(prof))
    };
  }

  cardTitle(no, title) {
    return `${no} - ${title}`;
  }

  cardSubTitle(crn) {
    return `CRN: ${crn}`;
  }

  buildProfIcons(names) {
    return _.map(names, (name, idx) => (
      <ProfessorIcon key={idx} idx={idx} name={name}/>
    ));
  }

  render() {
    return (
      <div style={{ marginLeft: '10px', margin: '10px' }}>
        <Card>
          <CardTitle
            title={this.cardTitle(this.state.classNo, this.state.classTitle)}
            subtitle={this.cardSubTitle(this.state.crn)}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true}>
            Taught by: {_.join(this.state.profs, ', ')} <br/>
            {this.state.description}
          </CardText>
        </Card>
      </div>
    );
  }
}

ResultCard.defaultProps = {
  classTitle: 'Unnamed Class',
  classNo: '????',
  description: 'No description available',
  crn: '??????',
  profs: 'STAFF'
};

ResultCard.propTypes = {
  classTitle: PropTypes.string,
  classNo: PropTypes.string,
  description: PropTypes.string,
  crn: PropTypes.string,
  profs: PropTypes.string
};

export default ResultCard;
