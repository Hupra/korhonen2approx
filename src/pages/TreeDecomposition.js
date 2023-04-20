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
import M from 'materialize-css';


function TreeDecomposition() {
    const graph_container = useRef();
    const tree_container = useRef();

    useEffect(() => {
        const g = new Graph(graph, d3.select(graph_container.current));
        const t = new Tree(tree, d3.select(tree_container.current));
        g.render();
        t.render();

        g.svg_nodes.on("mouseover", function(event, d) {
            t.svg_set_node_class_if_contains("error", d.id);
        })
        .on("mouseout", function(event, d) {
            t.svg_set_node_class_if_contains("error", -1);
        });

        g.svg_links.on("mouseover", function(event, d) {
            console.log(d);
            t.svg_set_node_class_if_contains_pair("error", d.source.id, d.target.id);
        })
        .on("mouseout", function(event, d) {
            t.svg_set_node_class_if_contains("error", -1);
        });
    }, []);

    useEffect(() => {
        const tabs = document.querySelector('#tabs');
        M.Tabs.init(tabs);
    }, []);

  return (
    <>
    <AnimatedPage>

    <div className='sidebar'>
        <div className='sidebar_bubble'>
    <SB style={{ height: '100vh', width: '100vw' }}>
        <h2>Tree Decomposition</h2>

        <ul id="tabs" className="tabs">
            <li className="tab col s3">
                <a className="active" href="#test-swipe-1">Formel</a>
            </li>
            <li className="tab col s3">
                <a href="#test-swipe-2">Informel</a>
            </li>
        </ul>
        <div id="test-swipe-1" className="col s12 tab-content">
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
        </div>
        <div id="test-swipe-2" className="col s12 tab-content">
        Test 2
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
    </SB>
    </div>
    </div>
    <div className='content'>
        <div className='svg_container interactive'>
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