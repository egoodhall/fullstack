import React, { Component } from 'react';
import './App.css';
import { Accordion, ImageDisplay } from './components';
import _ from 'lodash';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      breeds: {},
      displayedBreed: ''
    };
    this.buildAccordionList = this.buildAccordionList.bind(this);
    this.getImg = this.getImg.bind(this);
  }

  componentWillMount() {
    this.getBreedList();
  }

  getBreedList() {
    fetch('https://dog.ceo/api/breeds/list/all')
      .then(response => response.json())
      .then(json => {
      // Handle any errors received
        if (json.status !== 'success') {
          throw new Error('Error status returned: ' + json.status);
        }
        // Pull out the message
        return json.message;
      })
      .then(breeds => {
        console.log('New breeds!');
        this.setState({ breeds: breeds });
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  buildAccordionList() {
    console.log('Building accordion list');
    return _.map(_.keys(this.state.breeds), (breed) => {
      return (
        <Accordion
          key={breed}
          breed={breed}
          subBreeds={this.state.breeds[breed]}
          onClick={this.getImg}
        />
      );
    });
  }

  getImg(breed, subBreed) {
    const breedPath = subBreed ? `${breed}/${subBreed}` : breed;
    fetch('https://dog.ceo/api/breed/' + breedPath + '/images/random')
      .then(response => response.json()) // Unwrap response json
      .then(json => {
      // Handle any errors received
        if (json.status !== 'success') {
          throw new Error('Error status returned: ' + json.status);
        }
        // Pull out the message
        return json.message;
      })
      .then(link => {
        this.setState({ displayedBreed: link });
      });
  }

  render() {
    return (
      <div className="App">
        <div className="accordion-list">
          <h2 className="App-title">Breeds</h2>
          {this.buildAccordionList()}
        </div>
        <ImageDisplay src={this.state.displayedBreed} />
      </div>
    );
  }
}

export default App;
