import React, { useEffect, useState } from 'react';
import Sandbox from './components/Sandbox3';
import AnimatedPage from './components/AnimatedPage';
import { Link, useLocation } from 'react-router-dom';
import { InlineMath } from 'react-katex';


function Home() {
  const location = useLocation();
  return (
    <>
    <AnimatedPage>

    <div className='sidebar'>
      <div className='sidebar_bubble'>
      <h2>Treewidth 2 approximation</h2>
      <p>Welcome to the interactive learning experience for Korhonen's 2-approximation algorithm for treewidth!</p>
      <p>This algorithm takes a graph <InlineMath math="G"/>, integer <InlineMath math="k"/>, and a tree decomposition <InlineMath math="T"/> of <InlineMath math="G"/> with width at most <InlineMath math="4k+3"/>, then iteratively attempts to construct a new tree decomposition with a smaller width. The process continues until either a tree decomposition with width <InlineMath math="\leq 2k + 1"/> is found or it returns that <InlineMath math="tw(G) > k"/>.</p>
      <p>In this guide, we will walk you through each step of the algorithm, providing clear explanations and engaging tasks to help you gain a deeper understanding of how it works. We hope you have a fun leaning experience! 😊</p>
      <hr/>
      <Link to="/treedecomposition" className='button'>Start<ion-icon name="arrow-forward-outline"></ion-icon></Link>
      </div></div>
    <div className='content'>
    <div className='intro-img'/>npm start
    {/* <Sandbox/> */}
    </div>
    </AnimatedPage>

    </>
  );
}




export default Home;