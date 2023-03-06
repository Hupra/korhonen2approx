import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Flow from './pages/Flow';
import './styles/main.sass';
import TreeDecomposition from './pages/TreeDecomposition';
import Separators from './pages/Separators';
import SeparatorsBalanced from './pages/SeparatorsBalanced';
import SplitTree from './pages/SplitTree';
import SplitTree2 from './pages/SplitTree2';




function App() {
  useEffect(() => {
  }, []);

  return (
    <Router>
      <div className='container'>
        <div className='header'>
          <NavLink exact activeClassName='active' to="/">Home</NavLink>
          <NavLink activeClassName='active' to="/flow">Flow</NavLink>
          <NavLink activeClassName='active' to="/treedecomposition">Tree Decomposition</NavLink>
          <NavLink activeClassName='active' to="/separators">Separators</NavLink>
          <NavLink activeClassName='active' to="/balanced-separators">Balanced Separators</NavLink>
          <NavLink activeClassName='active' to="/splitting-tree">Split Tree Decomposition</NavLink>
          <NavLink activeClassName='active' to="/splitting-tree2">Split Tree Story</NavLink>
        </div>
        <div className='main'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="flow/*" element={<Flow />} />
          <Route path="treedecomposition/*" element={<TreeDecomposition />} /> 
          <Route path="separators/*" element={<Separators />} /> 
          <Route path="balanced-separators/*" element={<SeparatorsBalanced />} /> 
          <Route path="splitting-tree/*" element={<SplitTree />} /> 
          <Route path="splitting-tree2/*" element={<SplitTree2 />} /> 
        </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;