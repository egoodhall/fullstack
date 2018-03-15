import React, { Component } from 'react';
import { Avatar } from 'material-ui';
import { getUserEmail } from '../helpers/myBucknell';
import PropTypes from 'prop-types';

import {
  blue300,
  orange200
} from 'material-ui/styles/colors';

class ProfessorIcon extends Component {

  constructor(props) {
    super(props);
    this.state = {
      color: (this.props.idx % 2 === 0) ? blue300 : orange200,
      name: this.props.name,
      uname: getUserEmail(this.props.name)
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      color: (newProps.idx % 2 === 0) ? blue300 : orange200,
      name: newProps.name,
      uname: getUserEmail(newProps.name)
    });
  }

  componentWillMount() {
    console.log(this.state);
  }

  render() {
    return (
      <Avatar
        src={`https://my.bucknell.edu/apps/mybucknell/media.userphoto/${this.state.uname}/58/58`}
      />
    );
  }
}

ProfessorIcon.propTypes = {
  idx: PropTypes.number,
  name: PropTypes.string
};

export default ProfessorIcon;
