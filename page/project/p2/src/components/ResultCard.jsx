import React, { Component } from 'react';
import { Card, CardTitle, CardMedia, List, ListItem, FlatButton, Paper } from 'material-ui';
import { fmtName, parseLink } from '../helpers';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { SocialPerson, ActionAssignment, DeviceAccessTime, ActionRoom } from 'material-ui/svg-icons';

class ResultCard extends Component {

  fmtCourse(no, section, title) {
    return `${no}-${section} - ${title}`;
  }

  fmtCRN(crn) {
    return `CRN: ${crn}`;
  }

  render() {
    return (
      <div style={{ marginLeft: '10px', margin: '10px' }}>
        <Card>
          <CardTitle
            title={this.fmtCourse(this.props.no, this.props.section, this.props.title)}
            subtitle={_(this.props.profs).split(/\n/).map((name) => fmtName(name)).join(', ')} leftIcon={<SocialPerson />}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardMedia expandable={true}>
            <List>
              <ListItem primaryText={this.fmtCRN(this.props.crn)} leftIcon={<ActionAssignment />}/>
              <ListItem primaryText={this.props.time} leftIcon={<DeviceAccessTime />} />
              <ListItem primaryText={this.props.room !== '' ? this.props.room : 'TBA'} leftIcon={<ActionRoom />} />
            </List>
          </CardMedia>
          <CardMedia>
            <Paper zDepth={0}>
              <FlatButton label='Desc' onClick={() => window.open(parseLink(this.props.description))} style={{ margin: '8px'}} secondary={true}/>
            </Paper>
          </CardMedia>
        </Card>
      </div>
    );
  }
}

ResultCard.defaultProps = {
  title: 'Unnamed Class',
  no: '????',
  description: 'No description available',
  crn: '??????',
  profs: 'STAFF',
  time: 'TBA',
  room: 'TBA',
  section: -1
};

ResultCard.propTypes = {
  title: PropTypes.string,
  no: PropTypes.string,
  description: PropTypes.string,
  crn: PropTypes.string,
  profs: PropTypes.string,
  time: PropTypes.string,
  room: PropTypes.string,
  section: PropTypes.number
};

export default ResultCard;
