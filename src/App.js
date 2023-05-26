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
import MinSplit from './pages/MinSplit';
import SplittingT from './pages/SplittingT';
import ConnectComponents from './pages/ConnectComponents';
import Continuity from './pages/Continuity';
import HomeBag from './pages/HomeBag';
import Color from './pages/Color';
import { AnimatePresence } from 'framer-motion';
import Pruning from './pages/Pruning';
import Introduction from './pages/Introduction';
import useWindowSize from './pages/components/useWindowSize';
import Playground from './pages/Playground';


function App() {
  const ALL = useRef();
  const [fullNav, setFullNav] = useState(false);
  const location = useLocation();
  const window_size = useWindowSize();
  
  // adjust site to work on different resolutions
  useEffect(() => {
    const screen_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const scale = screen_height / 970;
    if(scale<1) ALL.current.style.zoom = scale;
  }, [window_size]);

  return (
      <div ref={ALL} className='container'>
        
        <div className={!fullNav ? ' location active' : 'location'}>
        <a href='' onClick={() => setFullNav(!fullNav)}><ion-icon name="reorder-four-outline"></ion-icon></a>
          <NavLink activeclassname='active' to="/" exact="true"><ion-icon name="home-outline"></ion-icon></NavLink>
          <NavLink activeclassname='active' to="/treedecomposition">T</NavLink>
          <NavLink activeclassname='active' to="/introduction">I</NavLink>
          <NavLink activeclassname='active' to="/separators">S</NavLink>
          <NavLink activeclassname='active' to="/balanced-separators">BS</NavLink>
          <NavLink activeclassname='active' to="/connect-components">CC</NavLink>
          <NavLink activeclassname='active' to="/splitting-t">ST</NavLink>
          <NavLink activeclassname='active' to="/continuity">CI</NavLink>
          <NavLink activeclassname='active' to="/homebag">HB</NavLink>
          <NavLink activeclassname='active' to="/min-split">MS</NavLink>
          <NavLink activeclassname='active' to="/pruning">P</NavLink>
          <NavLink activeclassname='active' to="/nice-treedecomposition">NT</NavLink>
          <NavLink activeclassname='active' to="/sandbox">SB</NavLink>
    </div>

    <div className={fullNav ? ' location-full active' : 'location-full'}>
          <a onClick={() => setFullNav(!fullNav)}><ion-icon name="close-outline"></ion-icon></a>
          <NavLink onClick={() => setFullNav(false)} activeclassname='active' to="/" exact="true">Home</NavLink>
          <NavLink onClick={() => setFullNav(false)} activeclassname='active' to="/treedecomposition">Tree Decomposition</NavLink>
          <NavLink onClick={() => setFullNav(false)} activeclassname='active' to="/introduction">Introducton</NavLink>
          <NavLink onClick={() => setFullNav(false)} activeclassname='active' to="/separators">Separators</NavLink>
          <NavLink onClick={() => setFullNav(false)} activeclassname='active' to="/balanced-separators">Balanced Separatos</NavLink>
          <NavLink onClick={() => setFullNav(false)} activeclassname='active' to="/connect-components">Connected Components</NavLink>
          <NavLink onClick={() => setFullNav(false)} activeclassname='active' to="/splitting-t">Splitting T</NavLink>
          <NavLink onClick={() => setFullNav(false)} activeclassname='active' to="/continuity">Continuity Issue</NavLink>
          <NavLink onClick={() => setFullNav(false)} activeclassname='active' to="/homebag">Home Bag</NavLink>
          <NavLink onClick={() => setFullNav(false)} activeclassname='active' to="/min-split">Minimum Split</NavLink>
          <NavLink onClick={() => setFullNav(false)} activeclassname='active' to="/pruning">Pruning</NavLink>
          <NavLink onClick={() => setFullNav(false)} activeclassname='active' to="/nice-treedecomposition">Nice Tree Decomposition</NavLink>
          <NavLink onClick={() => setFullNav(false)} activeclassname='active' to="/sandbox">Sandbox</NavLink>
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
              <Route path="splitting-t/*"             element={<SplittingT />} /> 
              <Route path="connect-components/*"      element={<ConnectComponents />} />
              <Route path="continuity/*"              element={<Continuity />} /> 
              <Route path="homebag/*"                 element={<HomeBag />} /> 
              <Route path="min-split/*"               element={<MinSplit />} /> 
              <Route path="color/*"                   element={<Color />} /> 
              <Route path="pruning/*"                 element={<Pruning />} />
              <Route path="nice-treedecomposition/*"  element={<NiceTreeDecomposition />} />
              <Route path="sandbox/*"              element={<Playground />} />
            </Routes>
         </AnimatePresence>
        </div>
      </div>
  );
}

export default App;