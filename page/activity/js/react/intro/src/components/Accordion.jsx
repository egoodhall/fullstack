import React, { Component } from 'react';
import _ from 'lodash';

class Accordion extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: props.breed,
      subBreeds: props.subBreeds,
      displaySubBreeds: false,
      prefixChar: '▸'
    };
    this.buildSubBreeds = this.buildSubBreeds.bind(this);
    this.buildPrimaryBreed = this.buildPrimaryBreed.bind(this);
    this.toggleSubBreeds = this.toggleSubBreeds.bind(this);
  }

  componentWillReceiveProps(newProps) {
    console.log('New Props!');
    this.setState({
      name: newProps.breed,
      subBreeds: newProps.subBreeds
    });
  }

  buildSubBreeds() {
    return this.state.displaySubBreeds ? _.map(this.state.subBreeds, (breed) => (<p onClick={() => this.props.onClick(this.state.name)} key={breed}>{_.capitalize(breed)}</p>)) : [];
  }

  buildPrimaryBreed() {
    if (this.state.subBreeds.length !== 0) {
      return (
        <h3 onClick={this.toggleSubBreeds}>{this.state.prefixChar} {_.capitalize(this.state.name)}</h3>
      );
    } else {
      return (
        <h3 onClick={() => this.props.onClick(this.state.name)}>{_.capitalize(this.state.name)}</h3>
      );
    }
  }

  toggleSubBreeds() {
    if (this.state.displaySubBreeds) {
      this.setState({ displaySubBreeds: false, prefixChar: '▸'});
    } else {
      this.setState({ displaySubBreeds: true, prefixChar: '▹'});
    }
  }

  render() {
    return (
      <div style={{ cursor: 'default' }}>
        {this.buildPrimaryBreed()}
        <ul>
          {this.buildSubBreeds()}
        </ul>
      </div>
    );
  }
}

export default Accordion;
