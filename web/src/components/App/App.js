import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Routes from '../Routs';

const Root = ({ locale, ...props }) => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">Welcome to getsky trading!</h1>
    </header>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/search">Search</Link></li>
    </ul>
    <Routes {...props} />
  </div>
);

export default () => (
  <Router>
    <Switch>
      <Route path="/" render={props => <Root {...props} locale="en" />} />
    </Switch>
  </Router>
);
