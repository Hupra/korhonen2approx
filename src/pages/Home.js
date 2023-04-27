import React, { useEffect, useState } from 'react';
import Sandbox from './components/Sandbox3';
import AnimatedPage from './components/AnimatedPage';
import { Link, useLocation } from 'react-router-dom';
import { InlineMath } from 'react-katex';
import SB from './components/SB';

function Home() {
  const location = useLocation();
  return (
    <>
    <AnimatedPage>

    {/* <div className='sidebar'>
      <div className='sidebar_bubble'><SB style={{ height: '100vh', width: '100vw' }}>
      <h2>Treewidth 2 approximation</h2>
      <p>Welcome to the interactive learning experience for Korhonen's 2-approximation algorithm for treewidth!</p>
      <p>In this guide, we will walk you through each step of the algorithm, providing clear explanations 
        and engaging tasks to help you gain a deeper understanding of how it works. We 
        hope you have a fun learning experience! 😊</p>
      <hr/>
      <Link to="/treedecomposition" className='button'>Start<ion-icon name="arrow-forward-outline"></ion-icon></Link>
      </SB></div></div> */}
    <div className='content frontpage'>
    <div className='intro-img'>
      <div className='intro-content'>
      <h1>Treewidth 2 Approximation</h1>
      <h3>Welcome to an interactive learning experience for<br/> Korhonen's 2-approximation algorithm for treewidth!</h3>
      <Link to="/treedecomposition" className='button focus'>Start<ion-icon name="arrow-forward-outline"></ion-icon></Link>
      </div>
      <p className=''></p>
    </div>
    {/* <Sandbox/> */}
    </div>
    </AnimatedPage>

    </>
  );
}




export default Home;