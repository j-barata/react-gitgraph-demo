import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import GitGraphWidget from './GitGraphWidget'

class App extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React GitGraph Demo</h1>
        </header>
        <p className="App-intro">
          This is an experimental GitGraph (<code>http://gitgraphjs.com</code>) representation, based on a JSON data import.<br />
          Have a look at the source code (<code>http://github.com/react-gitgraph-demo</code>), which is an adaptation of an existing snippet (<code>https://gist.github.com/YMA-MDL/b1d7284a8cebc3ecf36829984859656b</code>).
        </p>
        <hr/>
        <div>
        <p>
          <GitGraphWidget />
        </p>
        </div>
      </div>
    );
  }
}

export default App;
