import React, { useEffect, useRef, useState } from 'react';
// import graph from '../graphs/intro-treedecomposition-graph.json'
import graph from '../graphs/graph1.json'
import tree from '../graphs/homebag1.json'
import treex from '../graphs/homebag1x.json'
import treeux from '../graphs/homebag1ux.json'
import { BlockMath, InlineMath } from 'react-katex';
import { Routes, Route, Link } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import * as d3 from 'd3';
import {Graph, Tree} from "../classes.js"
import {split, cup, cap, list_is_same, T_2_TD} from "../functions.js"
import AnimatedPage from './components/AnimatedPage';


function Page2() {
    const tree_container = useRef();
    const tree_containerx = useRef();
    const tree_containerux = useRef();
    const [components, setComponents] = useState([]);
    const [separator, setSeparator] = useState([]);
    const w = tree.nodes.find(node => node.name === "W");

    useEffect(() => {
        let X = [8,11];
        // let C = [[5, 6, 7, 8], [1, 2], [4]];
        let C = [[],[],[]];

        // const tree_decomposition = T_2_TD(tree, C, X);
        // console.log("treed", tree_decomposition, C, X);

        const t   = new Tree(tree, d3.select(tree_container.current));
        const tx  = new Tree(treex, d3.select(tree_containerx.current));
        const tux = new Tree(treeux, d3.select(tree_containerux.current));
    
        t.X   = X;
        t.C   = C;
        tx.X  = X;
        tux.X = X;
        t.charge   = -800;
        tx.charge  = -800;
        tux.charge = -800;
        t.render();
        tx.render();
        tux.render();
        t.svg_set_node_class("homebag", ["F", "B"]);

    }, []);
    
    return(
    <>
    <AnimatedPage>
        <div className='sidebar'><div className='sidebar_bubble'>
            <h2>Homebag Page 2</h2>
            <p>When building the new tree decomposition T’ it must still follow the 3 rules for a tree decomposition. But if the separator X contains vertices that are outside of W, T’ can break rule 3 that says:</p>
            <p>For every vertex <InlineMath math="v"/> contained in both bags <InlineMath math="B_i"/> and <InlineMath math="B_j"/>, the path in <InlineMath math="T"/> going from <InlineMath math="B_i"/> to <InlineMath math="B_j"/> must be of only bags containing <InlineMath math="v"/>.</p>
            <Link to="/page3" className='button'>Next</Link>
        </div></div>
        <div className='content'>
            <div className='svg_container'>
                <svg ref={tree_container} className="cy tree" width="100%" height="100%"></svg>
                <div className='svg_label'><InlineMath math="1."/> Tree Decomposition - <InlineMath math="T+X"/></div>
            </div>
            <div className='svg_container'>
                <svg ref={tree_containerx} className="cy tree" width="100%" height="100%"></svg>
                <div className='svg_label'><InlineMath math="2."/> Tree - <InlineMath math="T^X + X"/></div>
            </div>
        <div className='wall'><ion-icon name="arrow-forward-outline"></ion-icon></div>

            <div className='svg_container'>
                <svg ref={tree_containerux} className="cy tree" width="100%" height="100%"></svg>
                <div className='svg_label'><InlineMath math="3."/> Tree Decomposition - <InlineMath math="(T \cup T^X) + X"/></div>
            </div>
        </div>
    </AnimatedPage>
    </>);
}
    
export default Page2;