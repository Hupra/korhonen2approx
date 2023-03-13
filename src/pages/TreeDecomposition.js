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

    <div className='sidebar'>
        <h2>Formel Description</h2>
        <div>
            For a graph <InlineMath math={'G=(V,E)'}/> a tree decomposition <InlineMath math={'T'}/> is a tree of <InlineMath math={'n'}/> nodes and <InlineMath math={'n'}/> bags, with each node pointing to exactly one bag. Additionally the following must hold:
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
        <h3>Simple Description</h3>
        <div><p>...</p>For more about tree decompositions check out <a href='https://frederikjorgensen.github.io/graph-width/'>https://frederikjorgensen.github.io/graph-width/</a></div>
        <div className='nav2'>
            {[1,2,3,4,5,6,7,8].map((item, idx) => {
            const klass = (item === 3) ? "box active" : "box" 
            return (
            <React.Fragment key={idx}>
                <div className={klass}></div>
            </React.Fragment>
        )})}
        </div>
    </div>
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