import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Flow from './pages/Flow';
import 'materialize-css/dist/css/materialize.min.css';
import './styles/main.sass';
import TreeDecomposition from './pages/TreeDecomposition';
import NiceTreeDecomposition from './pages/NiceTreeDecomposition';
import Separators from './pages/Separators';
import SeparatorsBalanced from './pages/SeparatorsBalanced';
import SplitTree from './pages/SplitTree';
import SplitTree2 from './pages/SplitTree2';
import ConnectComponents from './pages/ConnectComponents';
import Continuity from './pages/Continuity';
import HomeBag from './pages/HomeBag';
import Color from './pages/Color';
import Nicu from './pages/Nicu';
import Radu from './pages/Radu';
import { AnimatePresence } from 'framer-motion';
import Pruning from './pages/Pruning';
import Introduction from './pages/Introduction';
import useWindowSize from './pages/components/useWindowSize';


function App() {
  const ALL = useRef();
  const [fullNav, setFullNav] = useState(false);
  const location = useLocation();
  const window_size = useWindowSize();
  
  // adjust site to work on different resolutions
  useEffect(() => {
    const screen_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const scale = screen_height / 1080;
    if(scale<1) ALL.current.style.zoom = scale;
  }, [window_size]);

  return (
      <div ref={ALL} className='container'>
        
        <div className={!fullNav ? ' location active' : 'location'}>
        <a href='' onClick={() => setFullNav(!fullNav)}><ion-icon name="reorder-four-outline"></ion-icon></a>
          {/* <NavLink activeClassName='active' to="/flow">Flow</NavLink> */}
          <NavLink exact activeClassName='active' to="/"><ion-icon name="home-outline"></ion-icon></NavLink>
          <NavLink activeClassName='active' to="/treedecomposition"><ion-icon name="leaf-outline"></ion-icon></NavLink>
          <NavLink activeClassName='active' to="/introduction">I</NavLink>
          <NavLink activeClassName='active' to="/separators">S</NavLink>
          <NavLink activeClassName='active' to="/balanced-separators">BS</NavLink>
          <NavLink activeClassName='active' to="/connect-components">CC</NavLink>
          <NavLink activeClassName='active' to="/splitting-tree2">S1</NavLink>
          <NavLink activeClassName='active' to="/continuity">CI</NavLink>
          <NavLink activeClassName='active' to="/homebag">HB</NavLink>
          <NavLink activeClassName='active' to="/min-split">MS</NavLink>
          <NavLink activeClassName='active' to="/pruning">P</NavLink>
          <NavLink activeClassName='active' to="/nice-treedecomposition">NT</NavLink>
          <NavLink activeClassName='active' to="/nicu">N</NavLink>
          <NavLink activeClassName='active' to="/radu">RD</NavLink>
    </div>

    <div className={fullNav ? ' location-full active' : 'location-full'}>
          {/* <NavLink activeClassName='active' to="/flow">Flow</NavLink> */}
          <a onClick={() => setFullNav(!fullNav)}><ion-icon name="close-outline"></ion-icon></a>
          <NavLink onClick={() => setFullNav(false)} exact activeClassName='active' to="/">Home</NavLink>
          <NavLink onClick={() => setFullNav(false)} activeClassName='active' to="/treedecomposition">Tree Decomposition</NavLink>
          <NavLink onClick={() => setFullNav(false)} activeClassName='active' to="/introduction">Introducton</NavLink>
          <NavLink onClick={() => setFullNav(false)} activeClassName='active' to="/separators">Separators</NavLink>
          <NavLink onClick={() => setFullNav(false)} activeClassName='active' to="/balanced-separators">Balanced Separatos</NavLink>
          <NavLink onClick={() => setFullNav(false)} activeClassName='active' to="/connect-components">Connected Components</NavLink>
          <NavLink onClick={() => setFullNav(false)} activeClassName='active' to="/splitting-tree2">Splitting T</NavLink>
          <NavLink onClick={() => setFullNav(false)} activeClassName='active' to="/continuity">Continuity Issue</NavLink>
          <NavLink onClick={() => setFullNav(false)} activeClassName='active' to="/homebag">Home Bag</NavLink>
          <NavLink onClick={() => setFullNav(false)} activeClassName='active' to="/min-split">Minimum Split</NavLink>
          <NavLink onClick={() => setFullNav(false)} activeClassName='active' to="/pruning">Pruning</NavLink>
          <NavLink onClick={() => setFullNav(false)} activeClassName='active' to="/nice-treedecomposition">Nice Tree Decomposition</NavLink>
          <NavLink onClick={() => setFullNav(false)} activeClassName='active' to="/nicu">Nicu</NavLink>
          <NavLink onClick={() => setFullNav(false)} activeClassName='active' to="/radu">Radu Demo</NavLink>
    </div>
        
        <div className={fullNav ? ' main active' : 'main'}>
          {/* <AnimatePresence mode='wait'> */}
          <AnimatePresence>
            
            <Routes location={location} key={location.pathname}>
              <Route path="/"                         element={<Home />} /> 
              <Route path="flow/*"                    element={<Flow />} /> 
              <Route path="treedecomposition/*"       element={<TreeDecomposition />} /> 
              <Route path="introduction/*"            element={<Introduction />} /> 
              <Route path="separators/*"              element={<Separators />} /> 
              <Route path="balanced-separators/*"     element={<SeparatorsBalanced />} /> 
              <Route path="splitting-tree2/*"         element={<SplitTree2 />} /> 
              <Route path="connect-components/*"      element={<ConnectComponents />} />
              <Route path="continuity/*"              element={<Continuity />} /> 
              <Route path="homebag/*"                 element={<HomeBag />} /> 
              <Route path="min-split/*"               element={<SplitTree />} /> 
              <Route path="color/*"                   element={<Color />} /> 
              <Route path="pruning/*"                 element={<Pruning />} />
              <Route path="nice-treedecomposition/*"  element={<NiceTreeDecomposition />} />
              <Route path="nicu/*"                    element={<Nicu />} /> 
              <Route path="radu/*"                    element={<Radu />} /> 
            </Routes>
         </AnimatePresence>
        </div>
      </div>
  );
}

export default App;