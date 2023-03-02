import React, { useEffect, useState } from 'react';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Flow from './pages/Flow';
import Skrillex from './pages/Skrillex';
import './styles/main.sass';
import TreeDecomposition from './pages/TreeDecomposition';
import Separators from './pages/Separators';
import SeparatorsBalanced from './pages/SeparatorsBalanced';
import SplitTree from './pages/SplitTree';




function App() {
  useEffect(() => {
  }, []);

  return (
    <Router>
      <div className='container'>
        <div className='header'>
          <Link to="/">Home</Link>
          <Link to="/flow">Flow</Link>
          <Link to="/treedecomposition">Tree Decomposition</Link>
          <Link to="/separators">Separators</Link>
          <Link to="/balanced-separators">Balanced Separators</Link>
          <Link to="/splitting-tree">Split Tree Decomposition</Link>
        </div>
        <div className='main'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="flow/*" element={<Flow />} />
          <Route path="treedecomposition/*" element={<TreeDecomposition />} /> 
          <Route path="separators/*" element={<Separators />} /> 
          <Route path="balanced-separators/*" element={<SeparatorsBalanced />} /> 
          <Route path="splitting-tree/*" element={<SplitTree />} /> 
        </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;