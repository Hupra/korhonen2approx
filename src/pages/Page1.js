import React, { useEffect, useRef, useState } from 'react';
// import graph from '../graphs/intro-treedecomposition-graph.json'
import graph from '../graphs/graph1.json'
import tree from '../graphs/graph1-tree.json'
import { BlockMath, InlineMath } from 'react-katex';
import { Routes, Route, Link } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import * as d3 from 'd3';
import {Graph, Tree} from "../classes.js"
import {split, cup, cap, list_is_same, T_2_TD} from "../functions.js"
import AnimatedPage from './components/AnimatedPage';


function Page1() {
    const tree_container = useRef();
    const [components, setComponents] = useState([]);
    const [separator, setSeparator] = useState([]);
    const w = tree.nodes.find(node => node.name === "W");

    useEffect(() => {
        let X = [3, 9, 10];
        let C = [[5, 6, 7, 8], [1, 2], [4]];

        const tree_decomposition = T_2_TD(tree, C, X);
        console.log("treed", tree_decomposition, C, X);
        const t = new Tree(tree_decomposition, d3.select(tree_container.current));
    
        t.X = X;
        t.C = C;
        t.render();
    }, []);
    
    return(
    <>
    <AnimatedPage>
        <div className='sidebar'>
            <h2>Splitting Tree Decomposition</h2>
            <p>When building the new tree decomposition T’ it must still follow the 3 rules for a tree decomposition. But if the separator X contains vertices that are outside of W, T’ can break rule 3 that says:</p>
            <p> For every vertex <InlineMath math="v"/> contained in both bags <InlineMath math="B_i"/> and <InlineMath math="B_j"/>, the path in <InlineMath math="T"/> going from <InlineMath math="B_i"/> to <InlineMath math="B_j"/> must be of only bags containing <InlineMath math="v"/>.
                </p>
        </div>
        <div className='content'>
            <div className='svg_container'>
                <svg ref={tree_container} className="cy tree" width="100%" height="100%"></svg>
                <div className='svg_label'>Graph - <InlineMath math="G"/></div>
            </div>
        </div>
    </AnimatedPage>
    </>);
}
    
export default Page1;