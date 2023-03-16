import React, { useEffect, useState } from 'react';
import Sandbox from './components/Sandbox3';
import AnimatedPage from './components/AnimatedPage';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
    <AnimatedPage>

    <div className='sidebar'>
    <Link to="/treedecomposition" className='button'>Next</Link>

    </div>
    <div className='content'>
    <Sandbox/>
    </div>
    </AnimatedPage>

    </>
  );
}




export default Home;