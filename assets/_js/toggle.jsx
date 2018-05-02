import React from 'react'
import ReactDOM from 'react-dom'


class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // This binding is normally necessary to make `this` work in the callback,
    // but not with the exprimental public class fields syntax enabled by
    // Babel’s transform-class-properties plugin.
    //this.handleClick = this.handleClick.bind(this);
  }

  handleClick = () => {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}


export default Toggle
