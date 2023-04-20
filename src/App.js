import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Flow from './pages/Flow';
import 'materialize-css/dist/css/materialize.min.css';
import './styles/main.sass';
import TreeDecomposition from './pages/TreeDecomposition';
import Separators from './pages/Separators';
import SeparatorsBalanced from './pages/SeparatorsBalanced';
import SplitTree from './pages/SplitTree';
import SplitTree2 from './pages/SplitTree2';
import ConnectComponents from './pages/ConnectComponents';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import MinSplit from './pages/MinSplit';
import Color from './pages/Color';
import Nicu from './pages/Nicu';
import { AnimatePresence } from 'framer-motion';



function App() {
  useEffect(() => {
  }, []);
  const location = useLocation();

  return (
      <div className='container'>
        <div className='location'>
          {/* <NavLink activeClassName='active' to="/flow">Flow</NavLink> */}
          <NavLink exact activeClassName='active' to="/"><ion-icon name="home-outline"></ion-icon></NavLink>
          <NavLink activeClassName='active' to="/treedecomposition"><ion-icon name="leaf-outline"></ion-icon></NavLink>
          <NavLink activeClassName='active' to="/separators">S</NavLink>
          <NavLink activeClassName='active' to="/balanced-separators">BS</NavLink>
          <NavLink activeClassName='active' to="/connect-components">CC</NavLink>
          <NavLink activeClassName='active' to="/splitting-tree2">S1</NavLink>
          <NavLink activeClassName='active' to="/page1">CI</NavLink>
          <NavLink activeClassName='active' to="/page2">H1</NavLink>
          <NavLink activeClassName='active' to="/page3">H2</NavLink>
          <NavLink activeClassName='active' to="/splitting-tree">S2</NavLink>
          <NavLink activeClassName='active' to="/min-split">MS</NavLink>
          <NavLink activeClassName='active' to="/nicu">N</NavLink>

          {/* <NavLink exact activeClassName='active' to="/"><ion-icon name="home-outline"></ion-icon></NavLink>
          <NavLink activeClassName='active' to="/treedecomposition">Tree Decomposition</NavLink>
          <NavLink activeClassName='active' to="/separators">Separators</NavLink>
          <NavLink activeClassName='active' to="/balanced-separators">Balanced Separators</NavLink>
          <NavLink activeClassName='active' to="/connect-components">Connect Components</NavLink>
          <NavLink activeClassName='active' to="/splitting-tree2">Split Tree Story</NavLink>
          <NavLink activeClassName='active' to="/page1">Page1</NavLink>
          <NavLink activeClassName='active' to="/page2">Page2</NavLink>
          <NavLink activeClassName='active' to="/page3">Page3</NavLink>
          <NavLink activeClassName='active' to="/splitting-tree">Split Tree Decomposition</NavLink> */}
        </div>
        {/* <div className='header'>
          <NavLink exact activeClassName='active' to="/">Home</NavLink>
          <NavLink activeClassName='active' to="/flow">Flow</NavLink>
          <NavLink activeClassName='active' to="/treedecomposition">Tree Decomposition</NavLink>
          <NavLink activeClassName='active' to="/separators">Separators</NavLink>
          <NavLink activeClassName='active' to="/balanced-separators">Balanced Separators</NavLink>
          <NavLink activeClassName='active' to="/splitting-tree2">Split Tree Story</NavLink>
          <NavLink activeClassName='active' to="/splitting-tree">Split Tree Decomposition</NavLink>
          <NavLink activeClassName='active' to="/connect-components">Connect Components</NavLink>
        </div> */}
        <div className='main'>
          {/* <AnimatePresence mode='wait'> */}
          <AnimatePresence>
            <Routes location={location} key={location.pathname}>
              <Route path="/"                     element={<Home />} />
              <Route path="flow/*"                element={<Flow />} />
              <Route path="treedecomposition/*"   element={<TreeDecomposition />} /> 
              <Route path="separators/*"          element={<Separators />} /> 
              <Route path="balanced-separators/*" element={<SeparatorsBalanced />} /> 
              <Route path="splitting-tree2/*"     element={<SplitTree2 />} /> 
              <Route path="splitting-tree/*"      element={<SplitTree />} /> 
              <Route path="connect-components/*"  element={<ConnectComponents />} />
              <Route path="page1/*"               element={<Page1 />} />
              <Route path="page2/*"               element={<Page2 />} />
              <Route path="page3/*"               element={<Page3 />} />
              <Route path="min-split/*"           element={<MinSplit />} />
              <Route path="color/*"               element={<Color />} />
              <Route path="nicu/*"                element={<Nicu />} />
            </Routes>
         </AnimatePresence>
        </div>
      </div>
  );
}

export default App;