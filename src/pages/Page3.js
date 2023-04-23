import React, { useEffect, useRef, useState } from 'react';
// import graph from '../graphs/intro-treedecomposition-graph.json'
import graph from '../graphs/graph1.json'
import tree from '../graphs/homebag2.json'
import treex from '../graphs/homebag2x.json'
import treeux from '../graphs/homebag2ux.json'
import { BlockMath, InlineMath } from 'react-katex';
import { Routes, Route, Link } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import * as d3 from 'd3';
import {Graph, Tree} from "../classes.js"
import {split, cup, cap, list_is_same, T_2_TD, correcto} from "../functions.js"
import AnimatedPage from './components/AnimatedPage';
import SB from './components/SB';
import M from 'materialize-css';


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
        const tux = new Tree(treeux, d3.select(tree_containerux.current));
        set_t(t);
        set_tx(tx);
        set_tux(tux);
    
        t.charge   = -450;
        tx.charge  = -450;
        tux.charge = -450;
        t.X = X;
        tx.X = X;
        tux.X = X;
        t.render();
        tx.render();
        // t.svg_set_node_class("homebag", ["F", "B"]);
        t.svg_set_node_and_edge_if_name("xclude", ["X"]);
        tx.svg_set_node_and_edge_if_name("xclude", ["X"]);
        


        // state handler
        // Add an event listener to the nodes to handle the click event
        let page_state_loc = page_state;
        t.svg_nodes.on("click", function(e,node) {
            if(page_state_loc === 0 && node.name==="B"){
                t.svg_set_node_class("homebag", ["B"]);
                page_state_loc+=1;
                set_page_state(page_state_loc);
                correcto(e.clientX, e.clientY, 'Correcto!');
            }
            if(page_state_loc === 2 && node.name==="G"){
                t.svg_set_node_class("homebag", ["B","G"]);
                page_state_loc+=1;
                set_page_state(page_state_loc);
                correcto(e.clientX, e.clientY, 'Correcto!');
            }
            if(page_state_loc === 4 && node.name==="H"){
                t.svg_set_node_class("homebag", ["B","G","H"]);
                page_state_loc+=1;
                set_page_state(page_state_loc);
                correcto(e.clientX, e.clientY, 'Correcto!');
            }
        });

        function update_tx(tx) {
            tx.svg_nodes.filter(node=>node.name!== "X").on("click", function(e,node) {
                if(page_state_loc === 1)
                {
                    if(node.bag.includes(11)) node.bag = node.bag.filter(x => x !== 11);
                    else node.bag.push(11);

                    tx.render();
                    tx.svg_set_node_and_edge_if_name("xclude", ["X"]);
                    update_tx(tx); // most cursed recursion ever seen 😈

                    if(tx.nodes.flatMap(node => node.bag).filter(x => x === 11).length === 3 &&
                    tx.nodes.find(node => node.name ==="W").bag.includes(11) &&
                    tx.nodes.find(node => node.name ==="A").bag.includes(11)){
                        page_state_loc+=1;
                        set_page_state(page_state_loc);
                        correcto(e.clientX, e.clientY, 'Correcto!');
                    }
                }
                else if(page_state_loc === 3){
                    if(node.bag.includes(13)){
                        node.bag = node.bag.filter(x => x !== 13);
                    }else{
                        node.bag.push(13);
                    }
                    tx.render();
                    tx.svg_set_node_and_edge_if_name("xclude", ["X"]);
                    update_tx(tx); // most cursed recursion ever seen 😈

                    if(tx.nodes.flatMap(node => node.bag).filter(x => x === 13).length === 4 &&
                    tx.nodes.find(node => node.name ==="W").bag.includes(13) &&
                    tx.nodes.find(node => node.name ==="A").bag.includes(13) &&
                    tx.nodes.find(node => node.name ==="F").bag.includes(13)){
                        page_state_loc+=1;
                        set_page_state(page_state_loc);
                        correcto(e.clientX, e.clientY, 'Correcto!');
                    }
                }
                else if(page_state_loc === 5){
                    if(node.bag.includes(15)){
                        node.bag = node.bag.filter(x => x !== 15);
                    }else{
                        node.bag.push(15);
                    }
                    tx.render();
                    tx.svg_set_node_and_edge_if_name("xclude", ["X"]);
                    update_tx(tx); // most cursed recursion ever seen 😈

                    if(tx.nodes.flatMap(node => node.bag).filter(x => x === 15).length === 2 &&
                    tx.nodes.find(node => node.name ==="W").bag.includes(15)){
                        page_state_loc+=1;
                        set_page_state(page_state_loc);
                        correcto(e.clientX, e.clientY, 'Correcto!');
                    }
                }
            });


        }
        update_tx(tx);
        tx.svg_set_node_and_edge_if_name("xclude", ["X"]);

        // tasks done
        // tux.render();
    }, []);

    
    return(
    <>
    <AnimatedPage>
        <div className='sidebar'><div className='sidebar_bubble'><SB style={{ height: '100vh', width: '100vw' }}>
            <h2>Home Bag Part 2</h2>
            <hr/>
            <h2>Exercises</h2>
            <h4>Description</h4>
            <p>In these exercises you will need to apply the knowledge of home bags learned on the 
                previous page to add the extra vertices to T^X such that T’ does not break any 
                rules for a tree decomposition. First you will need to 
                find the home bag for a specific vertex in 
                figure 1 and then add the vertex to all necessary 
                bags in figure 2. In the end the two figures will be combined into 
                figure 3 which can then be used as a substitute for T to make T’.</p>
            <h4>Tasks</h4>
            <div className='task'>
                <div>
                    Click on <InlineMath math="hb(11)"/> in figure <InlineMath math="1"/>
                </div>
                <div>
                    <ion-icon name={page_state>0 ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
                </div>
            </div>

            {page_state>0 ?
            <div className='task'>
                <div>
                Click on bags where vertex <InlineMath math="11"/> is missing in <InlineMath math="figure"/> <InlineMath math="2"/>.
                </div>
                <div>
                    <ion-icon name={page_state>1 ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
                </div>
            </div>
            :
            <div className='task locked'>
                <div><ion-icon name="lock-closed-outline" checkmark-circle></ion-icon></div>
            </div>
            }

            {page_state>1 ?
            <div className='task'>
                <div>
                    Click on <InlineMath math="hb(13)"/> in <InlineMath math="figure"/> <InlineMath math="1"/>
                </div>
                <div>
                    <ion-icon name={page_state>2 ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
                </div>
            </div>
            :
            <div className='task locked'>
                <div><ion-icon name="lock-closed-outline" checkmark-circle></ion-icon></div>
            </div>
            }

            {page_state>2 ?
            <div className='task'>
                <div>
                Click on bags where vertex <InlineMath math="13"/> is missing in <InlineMath math="figure"/> <InlineMath math="2"/>.
                </div>
                <div>
                    <ion-icon name={page_state>3 ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
                </div>
            </div>
            :
            <div className='task locked'>
                <div><ion-icon name="lock-closed-outline" checkmark-circle></ion-icon></div>
            </div>
            }

            {page_state>3 ?
            <div className='task'>
                <div>
                    Click on <InlineMath math="hb(15)"/> in <InlineMath math="figure"/> <InlineMath math="1"/>
                </div>
                <div>
                    <ion-icon name={page_state>4 ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
                </div>
            </div>
            :
            <div className='task locked'>
                <div><ion-icon name="lock-closed-outline" checkmark-circle></ion-icon></div>
            </div>
            }

            {page_state>4 ?
            <div className='task'>
                <div>
                    Click on bags where vertex <InlineMath math="15"/> is missing in <InlineMath math="figure"/> <InlineMath math="2"/>.
                </div>
                <div>
                    <ion-icon name={page_state>5 ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
                </div>
            </div>
            :
            <div className='task locked'>
                <div><ion-icon name="lock-closed-outline" checkmark-circle></ion-icon></div>
            </div>
            }

            {page_state>5 ?
            <div className='task'>
                <div>
                    <ion-icon name={page_state>6 ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
                    <div>Combine <InlineMath>T</InlineMath> and <InlineMath>T^X</InlineMath> on the right.</div></div>
                </div>
            :
            <div className='task locked'>
                <div><ion-icon name="lock-closed-outline" checkmark-circle></ion-icon></div>
            </div>
            }

            <button onClick={() => set_page_state(page_state+1)}>dev cheat</button>
            <hr/>
            {page_state>=7 ?
            <><Link to="/splitting-tree" className='button'>Continue<ion-icon name="arrow-forward-outline"></ion-icon></Link><br/><i>Next: Splitting <InlineMath math="T \cup T^X"/></i></>
            :
            <><Link to="/splitting-tree" className='button disable'>Skip<ion-icon name="arrow-forward-outline"></ion-icon></Link><br/><i>Next: Splitting <InlineMath math="T \cup T^X"/></i></>
            }


        </SB></div></div>
        <div className='content'>
            <div className={'svg_container' + ((page_state%2===0 && page_state<=4) ? " focus-svg " : " ") + ((page_state%2===0 && page_state<=4) ? " interactive" : "")}>
                <svg ref={tree_container} className="cy tree" width="100%" height="100%"></svg>
                <div className='svg_label'><InlineMath math="1."/> Tree Decomposition - <InlineMath math="T+X"/></div>
            </div>
            <div className={'svg_container' + ((page_state%2===1 && page_state<=5)? " focus-svg " : " ") + ((page_state%2===1 && page_state<=5) ? " interactive" : "")}>
                <svg ref={tree_containerx} className="cy tree" width="100%" height="100%"></svg>
                <div className='svg_label'><InlineMath math="2."/> Tree - <InlineMath math="T^X + X"/></div>
            </div>
            <div className={'svg_container' + (page_state===6 ? " interactive" : "")}>
                {page_state===6 &&
                <button className='combine-btn focus'
                onClick={(e) => {
                        tux.render();
                        tux.svg_set_node_and_edge_if_name("xclude", ["X"]);
                        set_page_state(7);
                        correcto(e.clientX, e.clientY, 'Correcto!');}
                    }>
                    <div>Combine <InlineMath math="T"/> and <InlineMath math="T^X"/>
                    </div>
                </button>}
                <svg ref={tree_containerux} className="cy tree" width="100%" height="100%"></svg>
                <div className='svg_label'><InlineMath math="3."/> Tree Decomposition - <InlineMath math="(T \cup T^X) + X"/></div>
            </div>
        </div>
    </AnimatedPage>
    </>);
}
    
export default Page3;