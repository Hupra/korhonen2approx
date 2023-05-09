import React, { useEffect, useState, useRef } from 'react';
import Sandbox from './components/Sandbox3';
import AnimatedPage from './components/AnimatedPage';
import { Link, useLocation } from 'react-router-dom';
import { InlineMath } from 'react-katex';
import SB from './components/SB';
import {Graph, Tree} from "../classes.js"
import * as d3 from 'd3';
import graph from '../graphs/graph1.json'
import tree from '../graphs/graph1-tree.json'
import treef from '../graphs/graph1-tree-fixed.json'



function Introduction() {
  const graph_container = useRef();
  const tree_container1 = useRef();
  const tree_container2 = useRef();

    useEffect(() => {
        let node = treef.nodes.find(node => node.name === "X");
        node.stuck = true;
        node.x = tree_container2.current.clientWidth/2-5;
        node.y = tree_container2.current.clientHeight*(1/3);

        const t1 = new Tree(tree, d3.select(tree_container1.current));
        const t2 = new Tree(treef, d3.select(tree_container2.current));


        t1.render();
        t2.render();

        
        
        const g = new Graph(graph, d3.select(graph_container.current));
        // g.charge = -900
        // g.blobs = [
        //   // { "bags": [1,5,9], "class": "outline-black", "text": "Separator: X", "offset": 50 },
        //   { "bags": [2,3,4], "class": "cut dotted", "text": "", "offset": 50 },
        //   { "bags": [6,7,8], "class": "cut dotted", "text": "", "offset": 50 },
        //   { "bags": [10,11,12], "class": "cut dotted", "text": "", "offset": 50 },
        //   { "bags": [1,2,3,4,5,6,7,8,9,10,11,12], "class": "outline-X", "text": "Bag: W", "offset": 50 },
        //   // { "bags": [1,2,3,4,5,6,7], "class": "outline-C1", "text": "Non-editable subtree", "offset": 40 },
        //   // { "bags": [1,7,8,9,10,11], "class": "outline-C2", "text": "Non-editable subtree", "offset": 20 },

          
        //   // { "bags": [1,2,3,4,5], "class": "outline-C1", "text": "Non-editable subtree", "offset": 27 },
        //   // { "bags": [5,6,7,8,9], "class": "outline-C2", "text": "Non-editable subtree", "offset": 27 },
        //   // { "bags": [1,9,10,11,12], "class": "outline-C3", "text": "Non-editable subtree", "offset": 27 },
        // ];
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

  return (
    <>
    <AnimatedPage>

    <div className='sidebar'>
      <div className='sidebar_bubble'><SB style={{ height: '100vh', width: '100vw' }}>
      <h2>Introduction</h2>
      <p>The algorithm takes a graph <InlineMath math="G"/>, integer <InlineMath math="k"/>, and a tree decomposition <InlineMath math="T"/> of <InlineMath math="G"/> with width at most <InlineMath math="4k+3"/>, then iteratively attempts to construct a new tree decomposition with a smaller width. 
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
        The primary objective of the algorithm is to iteratively 
        attempt to minimize the size of one of the largest bags 
        in <InlineMath math="T"/>. To accomplish this, the algorithm identifies a 
        separator in the graph that effectively separates the 
        vertices of the largest bag into two or more distinct groups. 
        Subsequently, a new tree decomposition is created for each vertex set 
        and combined to form a new and improved tree decomposition.
        </p>
        <hr/>
        <p>The subsequent pages provide a clearer and more comprehensive 
          explanation of each concept, beginning with an introduction to separators.</p>
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
    {/* <Sandbox/> */}
    </div>
    </AnimatedPage>

    </>
  );
}




export default Introduction;