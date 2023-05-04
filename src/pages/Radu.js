import React, { useEffect, useState, useRef } from 'react';
import Sandbox from './components/Sandbox3';
import AnimatedPage from './components/AnimatedPage';
import { Link, useLocation } from 'react-router-dom';
import { InlineMath } from 'react-katex';
import SB from './components/SB';
import {Graph, Tree} from "../classes.js"
import * as d3 from 'd3';
import graph from '../graphs/graph1.json'



function Radu() {
  const graph_container1 = useRef();
  const graph_container2 = useRef();
  const graph_container3 = useRef();
  const graph_container4 = useRef();
  const graph_container5 = useRef();
  const graph_container6 = useRef();

    useEffect(() => {
        
        let n9;
        let n10;
      
        const C = [[1,2,3,4,5,9],[7,8],[]];
        const X = [6,10];
        const W = [1,2,3,4,5,6,7,8];

        
        const g1 = new Graph(graph, d3.select(graph_container1.current));
        
        g1.C = C;
        g1.X = X;
        g1.W = W;
        
        g1.render();
        g1.svg_set_component_color();


        const g2 = new Graph(graph, d3.select(graph_container2.current));
        g2.C = C;
        g2.X = X;
        g2.render();
        g2.svg_set_component_color();

        n9 = graph_container2.current.children[5].children[8];
        n10 = graph_container2.current.children[5].children[9];

        n9.style.opacity = 0.3;
        n10.style.opacity = 0.3;


        const g3 = new Graph(graph, d3.select(graph_container3.current));
        g3.C = C;
        g3.X = X;
        g3.render();
        g3.svg_set_component_color();

        n9 = graph_container3.current.children[5].children[8];
        n10 = graph_container3.current.children[5].children[9];

        n9.style.stroke = "white";
        n10.style.stroke = "white";


        const g4 = new Graph(graph, d3.select(graph_container4.current));
        g4.C = C;
        g4.X = X;
        g4.render();
        g4.svg_set_component_color();

        n9 = graph_container4.current.children[5].children[8];
        n10 = graph_container4.current.children[5].children[9];
        n9.style.r = 10;
        n10.style.r = 10;

        n9 = graph_container4.current.children[6].children[8];
        n10 = graph_container4.current.children[6].children[9];
        n9.style.fontSize = 12;
        n10.style.fontSize = 12;

        graph_container4.current.removeChild(graph_container4.current.children[4]);


        const g5 = new Graph(graph, d3.select(graph_container5.current));
        g5.C = C;
        g5.X = X;
        g5.render();
        g5.svg_set_component_color();

        n9 = graph_container5.current.children[5].children[8];
        n10 = graph_container5.current.children[5].children[9];

        graph_container5.current.removeChild(graph_container5.current.children[4]);

        n9.style.strokeDasharray = "5, 3";
        n10.style.strokeDasharray = "5, 3";
        n9.style.strokeWidth = "3px";
        n10.style.strokeWidth = "3px";




        const g6 = new Graph(graph, d3.select(graph_container6.current));
        g6.C = C;
        g6.X = X;
        g6.render();
        g6.svg_set_component_color();

        for (let i = 0; i < 8; i++) {
          let cir = graph_container6.current.children[5].children[i];
          // cir.style.strokeDasharray = "2,2";
          cir.style.strokeWidth = "5px";
          // cir.style.stroke = "red";
        }
        n9 = graph_container6.current.children[5].children[8];
        n10 = graph_container6.current.children[5].children[9];

        n9.style.stroke = "none";
        n10.style.stroke = "none";

        graph_container6.current.removeChild(graph_container6.current.children[4]);

        

    }, []);


  return (
    <>
    <AnimatedPage>

  
    <div className='content' style={{width: "100%"}}>
      <div className='horizontal-split'>
        <div className='svg_container'>
              <div className='svg_label'>Graph 1 - W</div>
              <svg ref={graph_container1} className="cy" width="100%" height="100%"></svg>
        </div>
        <div className='svg_container'>
              <div className='svg_label'>Graph 2 - Opacity</div>
              <svg ref={graph_container2} className="cy" width="100%" height="100%"></svg>
        </div>
      </div>
      <div className='horizontal-split'>
        <div className='svg_container'>
              <div className='svg_label'>Graph 3 - White Stroke</div>
              <svg ref={graph_container3} className="cy" width="100%" height="100%"></svg>
        </div>
        <div className='svg_container'>
              <div className='svg_label'>Graph 4 - Small Nodes</div>
              <svg ref={graph_container4} className="cy" width="100%" height="100%"></svg>
        </div>
      </div>
      <div className='horizontal-split'>
        <div className='svg_container'>
              <div className='svg_label'>Graph 5 - Dotted Stroke</div>
              <svg ref={graph_container5} className="cy" width="100%" height="100%"></svg>
        </div>
        <div className='svg_container'>
              <div className='svg_label'>Graph 6 - No Stroke</div>
              <svg ref={graph_container6} className="cy" width="100%" height="100%"></svg>
        </div>
      </div>
    </div>
    </AnimatedPage>

    </>
  );
}




export default Radu;