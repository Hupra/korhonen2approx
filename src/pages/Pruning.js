import React, { useEffect, useRef } from 'react';
import tree from '../graphs/ptree.json'
// import graph from '../graphs/graph-X.json'
// import tree from '../graphs/graph-X-tree.json'
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import * as d3 from 'd3';
import {Graph, Tree} from "../classes.js"
import AnimatedPage from './components/AnimatedPage';
import { Link } from 'react-router-dom';
import SB from './components/SB';
import { T_2_TD } from '../functions';

function Pruning() {
    const tree_container = useRef();

    function state1() {
        let C = [[1,2,3,11,20,21,22],[4,5,6,17,12,13,15,16,19,23],[7,8,9,14,18]]
        let X = [10];
        let W = tree.nodes.find(node => node.name === "W");
        const t = new Tree(tree, d3.select(tree_container.current));
        delete W.y_div;
        delete W.y_offset;
        // const t = new Tree(T_2_TD(tree, C, X), d3.select(tree_container.current));
        
        
        t.C = C;
        t.X = [10];
        t.charge = -3500;
        t.render();
        t.svg_set_node_and_edge_if_name("xclude", ["D", "E", "F", "G", "Z", "H", "I", "J", "L"]);
    }
        useEffect(() => {
            state1();

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
            <div className='svg_label'>Tree Decomposition - <InlineMath math="T"/></div>
            <svg ref={tree_container} className="cy" width="100%" height="100%"></svg>
        </div>
    </div>
    </AnimatedPage>

    </>
  );
}




export default Pruning;