import React, { useEffect, useState } from 'react';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import Sandbox from './components/Sandbox3';
import Sandbox2 from './components/Sandbox2';
cytoscape.use( cola ); // register extension


function Home() {
  return (
    <>
    <div className='sidebar'>sebbe</div>
    <div className='content'>
    <Sandbox/>
    <Sandbox2/>
    </div>
    </>
  );
}




export default Home;