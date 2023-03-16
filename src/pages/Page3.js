import React, { useEffect, useRef, useState } from 'react';
// import graph from '../graphs/intro-treedecomposition-graph.json'
import graph from '../graphs/graph1.json'
import tree from '../graphs/homebag2.json'
import treex from '../graphs/homebag2x.json'
import treeux from '../graphs/homebag1ux.json'
import { BlockMath, InlineMath } from 'react-katex';
import { Routes, Route, Link } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import * as d3 from 'd3';
import {Graph, Tree} from "../classes.js"
import {split, cup, cap, list_is_same, T_2_TD} from "../functions.js"
import AnimatedPage from './components/AnimatedPage';


function Page3() {
    const tree_container = useRef();
    const tree_containerx = useRef();
    const tree_containerux = useRef();
    const [components, setComponents] = useState([]);
    const [separator, setSeparator] = useState([]);
    const [page_state, set_page_state] = useState(0);
    const [t,     set_t] = useState(0);
    const [tx,   set_tx] = useState(0);
    const [tux, set_tux] = useState(0);

    const w = tree.nodes.find(node => node.name === "W");

    useEffect(() => {
        console.log(tree);
        let X = tree.nodes.find(node => node.name === "X").bag;
        // let C = [[5, 6, 7, 8], [1, 2], [4]];
        let C = [[],[],[]];

        // const tree_decomposition = T_2_TD(tree, C, X);
        // console.log("treed", tree_decomposition, C, X);
        const e_treex = {
            nodes: treex.nodes.map(node => {return {...node, bag: []}}),
            edges: treex.edges.map(edge => {return {...edge}})}
        e_treex.nodes.find(node => node.name === "X").bag = X;

        const t   = new Tree(tree, d3.select(tree_container.current));
        const tx  = new Tree(e_treex, d3.select(tree_containerx.current));
        // const tux = new Tree(treeux, d3.select(tree_containerux.current));
        set_t(t);
        set_tx(tx);
        // set_tux(tux);
    
        t.charge   = -450;
        tx.charge  = -450;
        // tux.charge = -800;
        t.X = X;
        tx.X = X;
        // tux.X = X;
        t.render();
        tx.render();
        // tux.render();
        // t.svg_set_node_class("homebag", ["F", "B"]);

    }, []);
    
    return(
    <>
    <AnimatedPage>
        <div className='sidebar'>
            <h2>Homebag Page 2</h2>
            <div className='task'>
                <div>
                    Click on the homebag for <InlineMath math="10"/> in figure <InlineMath math="1"/>
                </div>
                <div>
                    <ion-icon name={true ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
                </div>
            </div>
        </div>
        <div className='content'>
            <div className='svg_container'>
                <svg ref={tree_container} className="cy tree" width="100%" height="100%"></svg>
                <div className='svg_label'><InlineMath math="1."/> Tree Decomposition - <InlineMath math="T+X"/></div>
            </div>
            <div className='svg_container'>
                <svg ref={tree_containerx} className="cy tree" width="100%" height="100%"></svg>
                <div className='svg_label'><InlineMath math="2."/> Tree - <InlineMath math="T^X + X"/></div>
            </div>
            <div className='svg_container'>
                <svg ref={tree_containerux} className="cy tree" width="100%" height="100%"></svg>
                <div className='svg_label'><InlineMath math="3."/> Tree Decomposition - <InlineMath math="(T \cup T^X) + X"/></div>
            </div>
        </div>
    </AnimatedPage>
    </>);
}
    
export default Page3;