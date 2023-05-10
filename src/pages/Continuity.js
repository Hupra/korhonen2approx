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
import SB from './components/SB';

function Continuity() {
    const tree_container = useRef();
    const [components, setComponents] = useState([]);
    const [separator, setSeparator] = useState([]);
    const [td, setTd] = useState(null);
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        let X = [3, 9, 10];
        let C = [[5, 6, 7, 8], [1, 2], [4]];

        const tree_decomposition = T_2_TD(tree, C, X);

        const t = new Tree(tree_decomposition, d3.select(tree_container.current));
        t.charge = -3000;
        t.X = X;
        t.C = C;
        t.render();
        setTd(t);

    }, []);

    const button_handler = (i) => {
        td.svg_set_node_class_if_contains("error", i);
        setSelected(i);
    }
    
    return(
    <>
    <AnimatedPage>
    {/* " : "alert-circle-outline" */}
        <div className='sidebar'><div className='sidebar_bubble'><SB style={{ height: '100vh', width: '100vw' }}>
            <h2>Continuity Issue</h2>
            <p>When building the new tree decomposition <InlineMath math="T'"/>, it must still follow the 3 rules for a tree 
            decomposition. But if the separator <InlineMath math="X"/> contains 
            vertices that are outside of <InlineMath math="W"/>, <InlineMath math="T'"/> can break rule 3 that says:</p>
            <p> For every vertex <InlineMath math="v"/> contained in both bags <InlineMath math="B_i"/> and <InlineMath math="B_j"/>, the 
            path in <InlineMath math="T"/> going from <InlineMath math="B_i"/> to <InlineMath math="B_j"/> must be of only bags containing <InlineMath math="v"/>.
            </p>
            <p>Below, you can click the different buttons to highlight the bags containing that vertex to see if they are connected.</p>

            <div className='button-box-5'>
                <button onClick={() => button_handler(1)} className={selected===1 ? "error" : ""}>1 <ion-icon name="checkmark-outline" /></button>
                <button onClick={() => button_handler(2)} className={selected===2 ? "error" : ""}>2 <ion-icon name="checkmark-outline" /></button>
                <button onClick={() => button_handler(3)} className={selected===3 ? "error" : ""}>3 <ion-icon name="checkmark-outline" /></button>
                <button onClick={() => button_handler(4)} className={selected===4 ? "error" : ""}>4 <ion-icon name="checkmark-outline" /></button>
                <button onClick={() => button_handler(5)} className={selected===5 ? "error" : ""}>5 <ion-icon name="checkmark-outline" /></button>
            </div>
            <div className='button-box-5'>
                <button onClick={() => button_handler(6)} className={selected===6 ? "error" : ""}>6 <ion-icon name="checkmark-outline" /></button>
                <button onClick={() => button_handler(7)} className={selected===7 ? "error" : ""}>7 <ion-icon name="checkmark-outline" /></button>
                <button onClick={() => button_handler(8)} className={selected===8 ? "error" : ""}>8 <ion-icon name="checkmark-outline" /></button>
                <button onClick={() => button_handler(9)} className={selected===9 ? "error disable" : "disable"}>9 <ion-icon name="close-outline" /></button>
                <button onClick={() => button_handler(10)} className={selected===10 ? "error disable" : "disable"}>10 <ion-icon name="close-outline" /></button>
            </div>
            
            <p style={{marginTop: "13px"}}>After clicking all the buttons, it should become evident that bags in <InlineMath math="T'"/> containing vertices 9 or 10 are not connected, thus violating rule 3 for tree decompositions. We will refer to this as the continuity issue, and the following pages will explore a method to resolve it, beginning with the introduction of home bags.</p>
            <hr/>
        <Link to="/homebag" className='button'>Continue <ion-icon name="arrow-forward-outline"></ion-icon></Link>
        <br/><i>Next: Home Bag</i>
        </SB></div></div>
        <div className='content'>
            <div className='svg_container'>
                <svg ref={tree_container} className="cy tree" width="100%" height="100%"></svg>
                <div className='svg_label'>Tree Decomposition - <InlineMath math="T'"/></div>
            </div>
        </div>
    </AnimatedPage>
    </>);
}
    
export default Continuity;