import React, { Component, PureComponent } from 'react';

import { HashRouter as Router, Route, Switch } from 'react-router-dom';



import SelectHome from "./pages/selectHome"
import Preview from "./pages/preview"
import Home from "./home"
import TestMasonry from './components/testMasonry'
import TestFlip from './components/testFlip'

// 使用异步组件加载工具方法加载组件
//import asyncComponent from '../components/route/AsyncComponent';
// const AsyncHome = asyncComponent(() => import('@pages/Basic'));
// const AsyncTask = asyncComponent(() => import('@pages/Task'));



export default class App extends PureComponent {
  // constructor(props) {
  //   super(props);
  // }

  render() {

    return (
      <Router>
        <div>
          {/* <Route exact path="/" component={SelectHome} /> */}
          <Route path="/home" component={Home} />
          <Route path="/creator" component={SelectHome} />
          <Route path="/preview" component={Preview} />
          <Route path="/masonry" component={TestMasonry} />
          <Route path="/flip" component={TestFlip} />
        </div>
      </Router>
    );

  }
}

