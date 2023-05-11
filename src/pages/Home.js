import React, { useEffect, useRef } from 'react';
import AnimatedPage from './components/AnimatedPage';
import { Link } from 'react-router-dom';

function Home() {

  const image = useRef();

  const create_ripple = (e) => 
  {
    const rect = image.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement("div");
    ripple.classList.add("ripple");
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    image.current.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 1000);

  };

  useEffect(() => {
    image.current.addEventListener("mousemove", create_ripple);
  }, []);
  

  return (
    <AnimatedPage>
    <div className='content frontpage'>
    <div className='intro-img' ref={image}>
      <div className='intro-content'>
      <h1>Treewidth 2 Approximation</h1>
      <h3>Welcome to an interactive learning experience for<br/> Korhonen's 2-approximation algorithm for treewidth!</h3>
      <Link to="/treedecomposition" className='button focus'>Start<ion-icon name="arrow-forward-outline"></ion-icon></Link>
      </div>
      <p className='credit'>Image generated using Midjourney AI</p>
    </div>
    </div>
    </AnimatedPage>
  );
}




export default Home;