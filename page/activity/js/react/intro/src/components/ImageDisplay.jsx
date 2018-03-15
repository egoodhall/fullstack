import React, { Component } from 'react';
import _ from 'lodash';
import './index.css';

class ImageDisplay extends Component {

  constructor(props) {
    super(props);
    this.state = {
      animating: false,
      src: this.props.src || '',
      imgOpacity: 0,
      ldrOpacity: 0
    };
  }

  waitUntil(trigger, cb) {
    var waitTimer = setInterval(() => {
      if (trigger()) {
        clearInterval(waitTimer);
        return cb();
      }
      return null;
    }, 5);
  }

  fadeImg(inOut = 'in') {
    console.log(`Fading image ${inOut}`);
    this.setState({ animating: true }, () => {

      // Modifiers for direction
      let mod = inOut === 'in' ? 1 : -1;
      let imgOpacity = inOut === 'in' ? 0 : 1;
      let ldrOpacity = inOut === 'in' ? 1 : 0;

      // Loop with timing until complete
      const timer = setInterval(() => {
        imgOpacity += 0.02 * mod;
        ldrOpacity -= 0.02 * mod;
        this.setState({
          imgOpacity,
          ldrOpacity,
          animating: ((inOut === 'in') ? this.state.imgOpacity >= 1 : this.state.ldrOpacity >= 1)
        }, () => {
          // When finished, stop
          if ((inOut === 'in') ? imgOpacity >= 1 : ldrOpacity >= 1) {
            clearInterval(timer);
          }
        });
      }, 5);
    });
  }

  componentWillReceiveProps(newProps) {
    console.log('New Props!');
    console.log(newProps);
    if (newProps.src !== this.state.src) {
      this.waitUntil(
        () => !this.state.animating,
        () => {
          this.fadeImg('out');
          this.waitUntil(
            () => !this.state.animating,
            () => this.setState({ src: newProps.src })
          );
        }
      );
    }
  }

  render() {
    return (
      <div className="img-container">
        <h1>Dogs!</h1>
        <img onLoad={() => this.waitUntil(() => !this.state.animating, () => this.fadeImg('in'))}
          style={{ opacity: this.state.imgOpacity }} className="img-root" src={this.state.src} />
        <div style={{ opacity: this.state.ldrOpacity }} id="loader" className="sk-cube-grid">
          <div className="sk-cube sk-cube1"></div>
          <div className="sk-cube sk-cube2"></div>
          <div className="sk-cube sk-cube3"></div>
          <div className="sk-cube sk-cube4"></div>
          <div className="sk-cube sk-cube5"></div>
          <div className="sk-cube sk-cube6"></div>
          <div className="sk-cube sk-cube7"></div>
          <div className="sk-cube sk-cube8"></div>
          <div className="sk-cube sk-cube9"></div>
        </div>
      </div>
    );
  }
}

export default ImageDisplay;
