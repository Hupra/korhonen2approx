import React, { useEffect, useState } from 'react';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import Sandbox from './components/Sandbox3';
import Sandbox2 from './components/Sandbox2';
import AnimatedPage from './components/AnimatedPage';
import { Link } from 'react-router-dom';

cytoscape.use( cola ); // register extension


function Home() {
  return (
    <>
    <AnimatedPage>

    <div className='sidebar'>
    <Link to="/separators" className='button'>Next</Link>

    </div>
    <div className='content'>
    <Sandbox/>
    <Sandbox2/>
    </div>
    </AnimatedPage>

    </>
  );
}




export default Home;