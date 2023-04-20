import React, { useEffect, useRef } from 'react';
import graph from '../graphs/intro-treedecomposition-graph.json'
import tree from '../graphs/intro-treedecomposition-tree.json'
// import graph from '../graphs/graph-X.json'
// import tree from '../graphs/graph-X-tree.json'
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import * as d3 from 'd3';
import {Graph, Tree} from "../classes.js"
import AnimatedPage from './components/AnimatedPage';
import { Link } from 'react-router-dom';
import SB from './components/SB';

function MinSplit() {
    const graph_container = useRef();
    const tree_container = useRef();

    useEffect(() => {
        const g = new Graph(graph, d3.select(graph_container.current));
        const t = new Tree(tree, d3.select(tree_container.current));
        g.render();
        t.render();
    }, []);

  return (
    <>
    <AnimatedPage>

    <div className='sidebar'><div className='sidebar_bubble'><SB style={{ height: '100vh', width: '100vw' }}>
        <h2>Minimum Split</h2>
        <p>As seen on the previous page, not all splits produce tree decompositions of equal quality.</p>
        <p>The algorithm evaluates the quality of a split by 
            prioritizing two criteria: first, it minimizes the size of the balanced separator set <InlineMath math="X"/>; and 
            second, it minimizes the sum of distances, <InlineMath math="d(X)"/>, from the homebag of each vertex in <InlineMath math="X"/> to the 
            bag <InlineMath math="W"/> in <InlineMath math="T"/>.
        </p>
        <p>A split found this way is considered to be a minimum split.</p>
        <br/><hr/>
        <Link to="#" className='button'>Continue<ion-icon name="arrow-forward-outline"></ion-icon></Link>        
        <br/><i>Next: Done?</i>
    </SB></div></div>
    <div className='content'>
        <div className='svg_container'>
            <div className='svg_label'>Graph - <InlineMath math="G"/></div>
            <svg ref={graph_container} className="cy" width="100%" height="100%"></svg>
        </div>
        <div className='svg_container'>
            <div className='svg_label'>Tree Decomposition - <InlineMath math="T"/></div>
            <svg ref={tree_container} className="cy" width="100%" height="100%"></svg>
        </div>
    </div>
    </AnimatedPage>

    </>
  );
}




export default MinSplit;