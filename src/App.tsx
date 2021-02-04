import React from 'react';
import logo from './dmclogo.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Never give up!
        </p>
        <a
          className="App-link"
          href="http://demasscult.ru"
          target="_blank"
          rel="noopener noreferrer"
        >
          i did a shit
        </a>
      </header>
    </div>
  );
}

export default App;
