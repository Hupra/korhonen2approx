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
    const [td, setTd] = useState(null);

    useEffect(() => {
        let X = [3, 9, 10];
        let C = [[5, 6, 7, 8], [1, 2], [4]];

        const tree_decomposition = T_2_TD(tree, C, X);
        // const xn = tree_decomposition.nodes.find(node => node.name === "X");
        // xn.y_div = 3;
        // xn.y_offset = -1;
        const t = new Tree(tree_decomposition, d3.select(tree_container.current));
        t.charge = -3000;
        t.X = X;
        t.C = C;
        t.render();
        setTd(t);
        // t.svg_set_node_class("error", [["W", "1"], ["W", "2"]]);
        // t.svg_set_node_class_if_contains("error", 9);
// "y_div": 3, "y_offset": -120
    }, []);
    
    return(
    <>
    <AnimatedPage>
    {/* " : "alert-circle-outline" */}
        <div className='sidebar'><div className='sidebar_bubble'>
            <h2>Continuity Issue</h2>
            <h1>Working on this at the moment</h1>
            <p>When building the new tree decomposition T’ it must still follow the 3 rules for a tree decomposition. But if the separator X contains vertices that are outside of W, T’ can break rule 3 that says:</p>
            <p> For every vertex <InlineMath math="v"/> contained in both bags <InlineMath math="B_i"/> and <InlineMath math="B_j"/>, the path in <InlineMath math="T"/> going from <InlineMath math="B_i"/> to <InlineMath math="B_j"/> must be of only bags containing <InlineMath math="v"/>.
            </p>
            <p>Below you can click the different buttons to highlight the bags containing that vertex, to see if they are connected.</p>
            <div className='button-box-5'>
                <button onClick={() => td.svg_set_node_class_if_contains("error", 1)}>1 <ion-icon name="checkmark-outline" /></button>
                <button onClick={() => td.svg_set_node_class_if_contains("error", 2)}>2 <ion-icon name="checkmark-outline" /></button>
                <button onClick={() => td.svg_set_node_class_if_contains("error", 3)}>3 <ion-icon name="checkmark-outline" /></button>
                <button onClick={() => td.svg_set_node_class_if_contains("error", 4)}>4 <ion-icon name="checkmark-outline" /></button>
                <button onClick={() => td.svg_set_node_class_if_contains("error", 5)}>5 <ion-icon name="checkmark-outline" /></button>
            </div>
            <div className='button-box-5'>
                <button onClick={() => td.svg_set_node_class_if_contains("error", 6)}>6 <ion-icon name="checkmark-outline" /></button>
                <button onClick={() => td.svg_set_node_class_if_contains("error", 7)}>7 <ion-icon name="checkmark-outline" /></button>
                <button onClick={() => td.svg_set_node_class_if_contains("error", 8)}>8 <ion-icon name="checkmark-outline" /></button>
                <button className="disable" onClick={() => td.svg_set_node_class_if_contains("error", 9)}>9 <ion-icon name="close-outline" /></button>
                <button className="disable" onClick={() => td.svg_set_node_class_if_contains("error", 10)}>10 <ion-icon name="close-outline" /></button>
            </div>
            <hr/>
        <Link to="/page2" className='button'>Continue <ion-icon name="arrow-forward-outline"></ion-icon></Link>
        <br/><i>Next: Home Bag Part 1</i>
        </div></div>
        <div className='content'>
            <div className='svg_container'>
                <svg ref={tree_container} className="cy tree" width="100%" height="100%"></svg>
                <div className='svg_label'>Tree Decomposition - <InlineMath math="T'"/></div>
            </div>
        </div>
    </AnimatedPage>
    </>);
}
    
export default Page1;