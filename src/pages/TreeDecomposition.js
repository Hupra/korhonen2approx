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


function TreeDecomposition() {
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

    <div className='sidebar'><div className='sidebar_bubble'>
        <h2>Tree Decomposition</h2>
        <div>
            For a graph <InlineMath math={'G=(V,E)'}/> a tree decomposition <InlineMath math={'T'}/> is a tree of <InlineMath math={'n'}/> nodes and <InlineMath math={'n'}/> bags, with each node pointing to exactly one bag. Additionally the following must be satisfied:
            <div>
            <ol>
                <li>
                For the bags <InlineMath math="B_1,...,B_n"/>, it must hold that <InlineMath math="B_i\subseteq V"/> and <InlineMath math="\bigcup\limits_{i=1}^{n} B_{i} = V"/>.
                </li>
                <li>
                For every edge <InlineMath math="(u,v)"/> in <InlineMath math="E"/> there must exist a bag such that <InlineMath math="\{u,v\} \subseteq B_i"/>.
                </li>
                <li>
                For every vertex <InlineMath math="v"/> contained in both bags <InlineMath math="B_i"/> and <InlineMath math="B_j"/>, the path in <InlineMath math="T"/> going from <InlineMath math="B_i"/> to <InlineMath math="B_j"/> must be of only bags containing <InlineMath math="v"/>.
                </li>
            </ol>
            </div>
        </div>
        An example of a such graph with a corresponsing tree decomposition can be seen on the right side.
        <h3>Tree width</h3>
        <p>The width of a tree decomposition is defined as <InlineMath math="|largest"/> <InlineMath math="bag| − 1"/>, and the treewidth of a graph <InlineMath math="tw(G)"/> is the minimum width among all its valid tree decompositions.</p>
        <p>In our example on the right, <InlineMath math="tw(G)=2"/> as the largest bag contains <InlineMath math="3"/> vertices.</p>



        <h3>Learn more</h3>
        <div>For more information about tree decomposition check out <a href='https://frederikjorgensen.github.io/graph-width/'>https://frederikjorgensen.github.io/graph-width/</a></div>
        <br/><hr/>
        <Link to="/separators" className='button'>Continue<ion-icon name="arrow-forward-outline"></ion-icon></Link>        
        <br/><i>Next: Separators</i>
    </div></div>
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




export default TreeDecomposition;