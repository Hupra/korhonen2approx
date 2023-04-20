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
import M from 'materialize-css/dist/js/materialize.min.js';
import SB from './components/SB';

function Page2() {
    const collapsibleRef = useRef(null);
    const tree_container = useRef();
    const tree_containerx = useRef();
    const tree_containerux = useRef();
    const [components, setComponents] = useState([]);
    const [separator, setSeparator] = useState([]);
    const w = tree.nodes.find(node => node.name === "W");
    const [page_state, set_page_state] = useState(0);


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


    useEffect(() => {
        M.Collapsible.init(collapsibleRef.current);
      }, []);

    
    return(
    <>
    <AnimatedPage>
        <div className='sidebar'><div className='sidebar_bubble'><SB style={{ height: '100vh', width: '100vw' }}>
            <h2>Home Bag Part 1</h2>
            <p>
                <i>
                In all the trees to the right, an extra bag, denoted by <InlineMath math="X"/>, is added. This bag is displayed here solely to demonstrate that it serves as the connecting point for each of the three new tree decompositions after a split is executed.
                </i>
            </p>
            {/* <p>We view <InlineMath math="T"/> as a rooted tree, in the root bag <InlineMath math="W"/>. The reason we
think about <InlineMath math="T"/> as a rooted subtree is to better describe what it means that a
bag is above or below another bag.</p> */}


<ul class="collapsible" ref={collapsibleRef}>
    <li className="active">

        <div className="collapsible-header" onClick={() => set_page_state(0)}><h5>Figure 1. - <InlineMath math="T"/></h5></div>
        <div className="collapsible-body">
<p>The home bag of vertex <InlineMath math="x"/> is the bag containing <InlineMath math="x"/> that is closest to the root
bag <InlineMath math="W"/>. We define the function <InlineMath math="hb(x)"/> to be the function
that maps a vertex to its home bag in <InlineMath math="T"/>.
The following are the home bags for the vertices of <InlineMath math="X"/> in <InlineMath math="T"/>.</p>
<ul>
    <li><InlineMath math="hb(8) = F"/></li>
    <li><InlineMath math="hb(11) = B"/></li>
</ul>
<p>They are highlighted with green in <InlineMath math="T"/>.</p>
        </div>
    </li>
    <li>
        <div className="collapsible-header" onClick={() => set_page_state(1)}><h5>Figure 2. - <InlineMath math="T^X"/></h5></div>
        <div className="collapsible-body">
<p>Since we know that <InlineMath math="W"/> will be connected to <InlineMath math="X"/> when we create <InlineMath math="T'"/>, we can already see that the vertices of <InlineMath math="X"/> will not
    form a connected subtree in <InlineMath math="T'"/>, we know this as they already don't form a subtree in <InlineMath math="T"/> if we include the addition of <InlineMath math="X"/>.  This is fixed by for every <InlineMath math="x ∈ X"/>, <InlineMath math="x"/> is added into all bags in the path from the home 
    bag <InlineMath math="hb(x)"/> to the root bag <InlineMath math="W"/>. We define the set of vertices added to a given 
    bag <InlineMath math="B"/> as <InlineMath math="B^X"/>.
</p>
<p>To better illustrate what vertices needs to be added to <InlineMath math="T"/>, we create a 
tree <InlineMath math="T^X"/> that shows what vertices of <InlineMath math="X"/> must be added to each bag.
</p>
        </div>
    </li>
    <li>
        <div className="collapsible-header" onClick={() => set_page_state(2)}><h5>Figure 3. - <InlineMath math="T \cup T^X"/></h5></div>
        <div className="collapsible-body">
<p>Now, if we take the union of each bag 
    in <InlineMath math="T"/> and <InlineMath math="T^X"/>, we 
    obtain the tree <InlineMath math="T \cup T^X"/>, as 
    seen in <InlineMath math="Figure"/> <InlineMath math="3"/>. This 
    tree has vertices added from the home 
    bag of every vertex in <InlineMath math="X"/> up to <InlineMath math="W"/>.</p>

    <p>By using this tree decomposition as a substitute for <InlineMath math="T"/> when we create <InlineMath math="T'"/>, we can 
        effectively resolve the issue of lacking continuity in <InlineMath math="T'"/>.</p>

        </div>
    </li>
</ul>

{/* 
                In Figure 7 (b) bags containing the vertices of X do not form connected
subtrees in T. This is fixed by adding the missing vertices that would make it
a valid tree decomposition, in the following way:
For every x ∈ X, x is added into all bags in the path from the home bag
hb(x) to the root bag W. We define the set of vertices added to a given bag B
as BX</p> */}
            {page_state%3===2 ?
            <><Link to="/page3" className='button'>Continue<ion-icon name="arrow-forward-outline"></ion-icon></Link><br/><i>Next: Home bag Part 2</i></>
            :
            <><Link to="/page3" className='button disable'>Skip<ion-icon name="arrow-forward-outline"></ion-icon></Link><br/><i>Next: Home bag Part2</i></>
            }
        </SB></div></div>
        <div className='content'>
            <div className='svg_container'>
                <svg ref={tree_container} className="cy tree" width="100%" height="100%"></svg>
                <div className='svg_label'><InlineMath math="1."/> Tree Decomposition - <InlineMath math="T+X"/></div>
            </div>
        <div className={ page_state > 1 ? 'wall' : 'wall opa-0'}>+</div>

            <div className={ page_state > 0 ? 'svg_container' : 'svg_container opa-0'}>
                <svg ref={tree_containerx} className="cy tree" width="100%" height="100%"></svg>
                <div className='svg_label'><InlineMath math="2."/> Tree - <InlineMath math="T^X + X"/></div>
            </div>
        <div className={ page_state > 1 ? 'wall' : 'wall opa-0'}>=</div>

            <div className={ page_state > 1 ? 'svg_container' : 'svg_container opa-0'}>
                <svg ref={tree_containerux} className="cy tree" width="100%" height="100%"></svg>
                <div className='svg_label'><InlineMath math="3."/> Tree Decomposition - <InlineMath math="(T \cup T^X) + X"/></div>
            </div>
        </div>
    </AnimatedPage>
    </>);
}
    
export default Page2;