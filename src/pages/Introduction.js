import React, { useEffect, useRef } from 'react';
import AnimatedPage from './components/AnimatedPage';
import { Link } from 'react-router-dom';
import { InlineMath } from 'react-katex';
import SB from './components/SB';
import {Graph, Tree} from "../classes.js"
import * as d3 from 'd3';
import graph from '../graphs/graph1.json'
import treee from '../graphs/graph1-tree.json'
import treef from '../graphs/graph1-tree-fixed.json'



function Introduction() {
  const graph_container = useRef();
  const tree_container1 = useRef();
  const tree_container2 = useRef();

    useEffect(() => {

        let tree = JSON.parse(JSON.stringify(treee));

        let node = tree.nodes.find(node => node.name === "W");
        node.stuck = true;
        node.x = tree_container1.current.clientWidth/2;
        node.y = tree_container1.current.clientHeight*(5/11);

        node = treef.nodes.find(node => node.name === "X");
        node.stuck = true;
        node.x = tree_container2.current.clientWidth/2-5;
        node.y = tree_container2.current.clientHeight*(1/3);

        const t1 = new Tree(tree, d3.select(tree_container1.current));
        const t2 = new Tree(treef, d3.select(tree_container2.current));


        t1.render();
        t2.render();

        
        
        const g = new Graph(graph, d3.select(graph_container.current));

        g.render();

    }, []);

    const code = [
      '\\text{\\textbf{while} true \\textbf{do}}',
      '\\quad W \\gets \\text{ biggest bag of } T',
      '\\quad \\text{\\textbf{if} } |W| \\leq 2k + 2 \\text{ \\textbf{then}}',
      '\\quad \\quad \\text{\\textbf{return} } T',
      '\\quad \\text{\\textbf{else if}} \\text{ minimum split of } W \\text{ exist}' ,
      '\\quad \\quad T^1, T^2, T^3 \\gets split(T)',
      '\\quad \\quad T \\gets merge(T^1, T^2, T^3)',
      '\\quad \\text{\\textbf{else}}' ,
      '\\quad \\quad \\text{\\textbf{return} } tw(G) > k',


    ];

    function mi(x) {
      if(x === "T") {
        tree_container1.current.parentNode.classList.add('reftar');
      }
      if(x === "T'") {
        tree_container2.current.parentNode.classList.add('reftar');
      }
    }
    function mo() {
      tree_container1.current.parentNode.classList.remove('reftar');
      tree_container2.current.parentNode.classList.remove('reftar');
    }
  return (
    <>
    <AnimatedPage>

    <div className='sidebar'>
      <div className='sidebar_bubble'><SB style={{ height: '100vh', width: '100vw' }}>
      <h2>Introduction</h2>
      <p>The algorithm takes a graph <InlineMath math="G"/>, integer <InlineMath math="k"/>, and a 
      tree decomposition <InlineMath math="T"/> of <InlineMath math="G"/> with width at most <InlineMath math="4k+3"/>, 
      then iteratively attempts to construct a new tree decomposition with a smaller width by splitting the 
      largest bag <InlineMath math="W"/>. 
      The process continues until a tree decomposition with width <InlineMath math="\leq 2k + 1"/> is found
       or it returns that <InlineMath math="tw(G) > k"/>.</p>
      <hr/>
      <h4>Simplified Description</h4>
      <p>The following is very simplified pseudocode for the algorithm.</p>
      <code>
      {code.map((line, index) => (
      <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ marginRight: 8 }}>{index + 1}:</div>
        <div>
          <InlineMath math={line} />
        </div>
      </div>
      ))}
      </code><br/>
      <p>
        The primary objective of the algorithm is to iteratively attempt to reduce the size of 
        the largest bag <InlineMath math="W"/> in <InlineMath math="T"/>. To accomplish this, the algorithm identifies a 
        separator in the graph that effectively separates the 
        vertices of <InlineMath math="W"/> into two or more distinct groups. 
        Subsequently, a new tree decomposition is created for each vertex set 
        and combined to form a new and improved tree decomposition <InlineMath math="T'"/>.
        </p>
        <p>
          An example of how a tree decomposition would look before and after an iteration of the algorithm can be seen 
          in <span className='ref' onMouseOver={() => mi("T")} onMouseOut={mo}><InlineMath math="T"/></span> and <span className='ref' 
          onMouseOver={() => mi("T'")} onMouseOut={mo}><InlineMath math="T'"/></span>.
        </p>
        <hr/>
        <p>
          <i>
            The subsequent pages provide a clearer and more comprehensive 
          explanation of each concept, beginning with an introduction to separators.</i></p>
      <Link to="/separators" className='button'>Start<ion-icon name="arrow-forward-outline"></ion-icon></Link>
      <br/><i>Next: Separators</i>

      </SB></div></div>
    <div className='content'>
      <div className='horizontal-split hidden'>
      <div className='svg_container'>
              <div className='svg_label'>Graph - <InlineMath math="G"/></div>
              <svg ref={graph_container} className="cy" width="100%" height="100%"></svg>
        </div>
      </div>
        <div className='svg_container'>
              <div className='svg_label'>Tree Decomposition - <InlineMath math="T"/></div>
              <svg ref={tree_container1} className="cy" width="100%" height="100%"></svg>
          </div>
        <div className='wall'><ion-icon name="arrow-forward-outline"></ion-icon></div>
        <div className='svg_container'>
            <div className='svg_label'>Tree Decomposition - <InlineMath math="T'"/></div>
            <svg ref={tree_container2} className="cy" width="100%" height="100%"></svg>
        </div>
    </div>
    </AnimatedPage>

    </>
  );
}




export default Introduction;