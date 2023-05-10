import React, { useEffect, useRef, useState } from 'react';
// import graph from '../graphs/intro-treedecomposition-graph.json'
import graph from '../graphs/graph1.json'
import p1tree from '../graphs/homebag1.json'
import p1treex from '../graphs/homebag1x.json'
import p1treeux from '../graphs/homebag1ux.json'
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


function HomeBag() {
    // general
    const tabsref = useRef();
    const tabref = useRef();
    const [part, set_part] = useState(1);


    //part 1
    const collapsibleRef = useRef(null);
    const p1tree_container = useRef();
    const p1tree_containerx = useRef();
    const p1tree_containerux = useRef();


    //part 2
    const tree_container = useRef();
    const tree_containerx = useRef();
    const tree_containerux = useRef();
    const [components, setComponents] = useState([]);
    const [separator, setSeparator] = useState([]);
    const [page_state, set_page_state] = useState(0);
    const [t,     set_t] = useState(0);
    const [tx,   set_tx] = useState(0);
    const [tux, set_tux] = useState(0);
    



    useEffect(() => {
        let X = [8,11];
        // let C = [[5, 6, 7, 8], [1, 2], [4]];
        let C = [[],[],[]];

        // const tree_decomposition = T_2_TD(tree, C, X);
        // console.log("treed", tree_decomposition, C, X);

        const t   = new Tree(p1tree, d3.select(p1tree_container.current));
        const tx  = new Tree(p1treex, d3.select(p1tree_containerx.current));
        const tux = new Tree(p1treeux, d3.select(p1tree_containerux.current));
    
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
        t.svg_set_node_and_edge_if_name("xclude", ["X"]);
        tx.svg_set_node_and_edge_if_name("xclude", ["X"]);
        tux.svg_set_node_and_edge_if_name("xclude", ["X"]);
        t.svg_set_node_class("error", ["F", "B"]);

    }, [part]);






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
        t.svg_set_node_and_edge_if_name("xclude", ["X"]);
        tx.svg_set_node_and_edge_if_name("xclude", ["X"]);
        


        // state handler
        // Add an event listener to the nodes to handle the click event
        let page_state_loc = page_state;
        t.svg_nodes.on("click", function(e,node) {
            if(page_state_loc === 0 && node.name==="B"){
                t.svg_set_node_class("error", ["B"]);
                page_state_loc+=1;
                set_page_state(page_state_loc);
                correcto(e.clientX, e.clientY, 'Correcto!');
            }
            if(page_state_loc === 2 && node.name==="G"){
                t.svg_set_node_class("error", ["B","G"]);
                page_state_loc+=1;
                set_page_state(page_state_loc);
                correcto(e.clientX, e.clientY, 'Correcto!');
            }
            if(page_state_loc === 4 && node.name==="H"){
                t.svg_set_node_class("error", ["B","G","H"]);
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
    }, [part]);

    function change_subpage(num){
        set_page_state(0);
        set_part(num);
    }

    // handle tab menu
    useEffect(() => {

        const tabs = Array.from(tabsref.current.children).filter(child =>
            child.classList.contains('tab')
        );
        
        switch (part) {
            case 2:
                setTimeout(() => {
                    tabref.current.style.left = (tabs[0].offsetWidth+7).toString() + "px";
                    tabref.current.style.width = (tabs[1].offsetWidth-8).toString() + "px";
                }, 2);
                break;
            default:
                setTimeout(() => {
                    tabref.current.style.left = (0).toString() + "px";
                    tabref.current.style.width = (tabs[0].offsetWidth-8).toString() + "px";
                }, 2);
                M.Collapsible.init(collapsibleRef.current);
                break;
          }
    }, [part]);

    const set_active_tab = (index) => {
        const collapsibleInstance = M.Collapsible.getInstance(collapsibleRef.current);
        collapsibleInstance.open(index);
        set_page_state(index);
    };



    function mi(x) {
        if(x === "T") p1tree_container.current.parentNode.classList.add('reftar');
        if(x === "TX") p1tree_containerx.current.parentNode.classList.add('reftar');
        if(x === "TTX") p1tree_containerux.current.parentNode.classList.add('reftar');
        if(x === "T2") tree_container.current.parentNode.classList.add('reftar');
        if(x === "TX2") tree_containerx.current.parentNode.classList.add('reftar');
        if(x === "TTX2") tree_containerux.current.parentNode.classList.add('reftar');
    }
    function mo() {
        p1tree_container.current.parentNode.classList.remove('reftar');
        p1tree_containerx.current.parentNode.classList.remove('reftar');
        p1tree_containerux.current.parentNode.classList.remove('reftar');
        tree_container.current.parentNode.classList.remove('reftar');
        tree_containerx.current.parentNode.classList.remove('reftar');
        tree_containerux.current.parentNode.classList.remove('reftar');
    }
    return(
    <>
    <AnimatedPage>
        <div className='sidebar'><div className='sidebar_bubble'><SB style={{ height: '100vh', width: '100vw' }}>
            <h2>Home Bag</h2>
            <p>
                <i>
                An extra bag, denoted by <InlineMath math="X"/>, is added to the top of the trees to the right. 
                This bag is displayed here solely to demonstrate that it will serve as the connecting point 
                for <InlineMath math="T^1"/>, <InlineMath math="T^2"/> and <InlineMath math="T^3"/> when constructing <InlineMath math="T'"/>.
                </i>
            </p>

            <hr/>

            <ul className="mytabs auto" ref={tabsref}>
                <div className={part===1?"tab active":"tab"} onClick={() => change_subpage(1)}>Explanation</div>
                <div className={part===2?"tab active":"tab"} onClick={() => change_subpage(2)}>Exercises</div>
                <div id="tab-selector" ref={tabref}/>
            </ul>





        {part===1 && <>
            
            {/* <p>We view <InlineMath math="T"/> as a rooted tree, in the root bag <InlineMath math="W"/>. The reason we
think about <InlineMath math="T"/> as a rooted subtree is to better describe what it means that a
bag is above or below another bag.</p> */}


<ul className="collapsible" ref={collapsibleRef}>
    <li className="active">

        <div className="collapsible-header chtop" onClick={() => set_page_state(0)}>
            <h5><span className={page_state === 0 ? "active":""}>Figure 1.</span><InlineMath math="\quad T"/></h5></div>
        <div className="collapsible-body">
<p>The home bag of vertex <InlineMath math="x"/> is the bag containing <InlineMath math="x"/> that is closest to the root
bag <InlineMath math="W"/>. We define the function <InlineMath math="hb(x)"/> to be the function
that maps a vertex to its home bag in <InlineMath math="T"/>.
The following are the home bags for the vertices of <InlineMath math="X"/> in <InlineMath math="T"/>:</p>
<ul>
    <li><InlineMath math="hb(8) = F"/></li>
    <li><InlineMath math="hb(11) = B"/></li>
</ul>
<p>They are highlighted with white in <InlineMath math="T"/>.</p>
<button onClick={()=> set_active_tab(1)} className='mb0'>Next</button>
        </div>
    </li>
    <li>
        <div className="collapsible-header chmid" onClick={() => set_page_state(1)}>
            <h5><span className={page_state === 1 ? "active":""}>Figure 2.</span><InlineMath math="\quad T^X"/></h5></div>
        <div className="collapsible-body">
        <p>When <InlineMath math="T'"/> is constructed, we know that the bags that will replace <InlineMath math="W"/> 
        will be connected to a new bag <InlineMath math="X"/>. We can observe 
        in <span className='ref' onMouseOver={() => mi("T")} onMouseOut={mo}><InlineMath math="T"/></span> that 
        when vertices of <InlineMath math="X"/> are not in <InlineMath math="W"/>, the bags containing the vertices 
        of <InlineMath math="X"/> do not form a connected subtree, which will still be the case for their replacement bags 
        in <InlineMath math="T'"/>. 
        To address this issue, every vertex <InlineMath math="x ∈ X"/> is added to all bags in the path from 
        the home bag <InlineMath math="hb(x)"/> to the root bag <InlineMath math="W"/>. 
        We define the set of vertices added during this process to a given bag <InlineMath math="B"/> as <InlineMath math="B^X"/>.
        </p>
        <p>To better illustrate which vertices need to be added 
        to <span className='ref' onMouseOver={() => mi("T")} onMouseOut={() => mo("T")}><InlineMath math="T"/></span>, we create a new 
        tree <span className='ref' onMouseOver={() => mi("TX")} onMouseOut={mo}><InlineMath math="T^X"/></span> that 
        demonstrates which vertices of <InlineMath math="X"/> must be added to each bag.</p>


<button onClick={()=> set_active_tab(2)} className='mb0'>Next</button>

        </div>
    </li>
    <li>
        <div className={page_state === 2 ? "collapsible-header chmid" : "collapsible-header chbot"} onClick={() => set_page_state(2)}>
            <h5><span className={page_state === 2 ? "active":""}>Figure 3.</span><InlineMath math="\quad T \cup T^X"/></h5></div>
        <div className={page_state === 2 ? "collapsible-body soft" : "collapsible-body"}>
    <p>If we combine <span className='ref' onMouseOver={() => mi("T")} onMouseOut={() => mo("T")}><InlineMath math="T"/></span> and <span className='ref' 
    onMouseOver={() => mi("TX")} onMouseOut={mo}><InlineMath math="T^X"/></span> by taking the union of each bag, we obtain the 
    tree <span className='ref' onMouseOver={() => mi("TTX")} onMouseOut={mo}><InlineMath math="T \cup T^X"/></span> .
    This tree has vertices added from the home 
    bag of every vertex in <InlineMath math="X"/> up to <InlineMath math="W"/>.</p>

    <p>By using this tree decomposition as a substitute for <InlineMath math="T"/> when we create <InlineMath math="T'"/>, we can 
        effectively stop the issue of lacking continuity in <InlineMath math="T'"/> from happening.</p>

        </div>
    </li>
</ul>

            {page_state%3===2 ?
            <><button onClick={() => change_subpage(2)} className='button'>Continue<ion-icon name="arrow-forward-outline"></ion-icon></button><br/><i>Next: Home Bag Exercises</i></>
            :
            <><button onClick={() => change_subpage(2)} className='button disable'>Skip<ion-icon name="arrow-forward-outline"></ion-icon></button><br/><i>Next: Home Bag Exercises</i></>
            }
        </>}

















        {part === 2 && <>

            <h2 className='mt0'> Exercises</h2>
            <div className='exercise'>
            <h4>Description</h4>
            <p>In these exercises you will need to apply the knowledge of home bags to add the extra vertices 
                to <span className='ref' onMouseOver={() => mi("TX2")} onMouseOut={mo}><InlineMath math="T^X"/></span> such 
                that <InlineMath math="T'"/> does not break any 
                rules for a tree decomposition. First you will need to 
                find the home bag for a specific vertex 
                in <span className='ref' onMouseOver={() => mi("T2")} onMouseOut={mo}><InlineMath math="T"/></span> and 
                then add the vertex to all necessary bags 
                in <span className='ref' onMouseOver={() => mi("TX2")} onMouseOut={mo}><InlineMath math="T^X"/></span>. 
                In the end the two figures will be combined 
                into <span className='ref' onMouseOver={() => mi("TTX2")} onMouseOut={mo}><InlineMath math="T \cup T^X"/></span> which 
                can then be used as a substitute for <InlineMath math="T"/> when constructing <InlineMath math="T'"/>.</p>
            <h4>Tasks</h4>
            <div className='task'>
                <div>
                    Click on <InlineMath math="hb(11)"/> in <span className='ref' onMouseOver={() => mi("T2")} onMouseOut={mo}><InlineMath math="T"/></span>
                </div>
                <div>
                    <ion-icon name={page_state>0 ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
                </div>
            </div>

            {page_state>0 ?
            <div className='task'>
                <div>
                Click on the bags where vertex <InlineMath math="11"/> should be inserted 
                in <span className='ref' onMouseOver={() => mi("TX2")} onMouseOut={mo}><InlineMath math="T^X"/></span>
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
                    Click on <InlineMath math="hb(13)"/> in <span className='ref' onMouseOver={() => mi("T2")} onMouseOut={mo}><InlineMath math="T"/></span>
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
                Click on the bags where vertex <InlineMath math="13"/> should be inserted in <span className='ref' onMouseOver={() => mi("TX2")} onMouseOut={mo}><InlineMath math="T^X"/></span>
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
                    Click on <InlineMath math="hb(15)"/> in <span className='ref' onMouseOver={() => mi("T2")} onMouseOut={mo}><InlineMath math="T"/></span>
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
                    Click on the bags where vertex <InlineMath math="15"/> should be inserted in <span className='ref' onMouseOver={() => mi("TX2")} onMouseOut={mo}><InlineMath math="T^X"/></span>
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
                    <div>Combine <InlineMath>T</InlineMath> and <InlineMath>T^X</InlineMath> in <span className='ref' onMouseOver={() => mi("TTX2")} onMouseOut={mo}><InlineMath math="T \cup T^X"/></span></div></div>
                </div>
            :
            <div className='task locked'>
                <div><ion-icon name="lock-closed-outline" checkmark-circle></ion-icon></div>
            </div>
            }

            {/* <button onClick={() => set_page_state(page_state+1)}>dev cheat</button> */}
            </div>
            <hr/>
            {page_state>=7 ?
            <><Link to="/min-split" className='button'>Continue<ion-icon name="arrow-forward-outline"></ion-icon></Link><br/><i>Next: Minimum Split</i></>
            :
            <><Link to="/min-split" className='button disable'>Skip<ion-icon name="arrow-forward-outline"></ion-icon></Link><br/><i>Next: Minimum Split</i></>
            }
    </>}

        </SB></div></div>

        <div className={part===1 ? 'content' : 'content hidden' }>
            <div className='svg_container'>
                <svg ref={p1tree_container} className="cy tree" width="100%" height="100%"></svg>
                <div className='svg_label'><InlineMath math="1."/> Tree Decomposition - <InlineMath math="T"/></div>
            </div>
        <div className={ page_state > 1 ? 'wall' : 'wall opa-0'}>+</div>

            <div className={ page_state > 0 ? 'svg_container' : 'svg_container opa-0'}>
                <svg ref={p1tree_containerx} className="cy tree" width="100%" height="100%"></svg>
                <div className='svg_label'><InlineMath math="2."/> Tree - <InlineMath math="T^X"/></div>
            </div>
        <div className={ page_state > 1 ? 'wall' : 'wall opa-0'}>=</div>

            <div className={ page_state > 1 ? 'svg_container' : 'svg_container opa-0'}>
                <svg ref={p1tree_containerux} className="cy tree" width="100%" height="100%"></svg>
                <div className='svg_label'><InlineMath math="3."/> Tree Decomposition - <InlineMath math="T \cup T^X"/></div>
            </div>
        </div>












        <div className={part===2 ? 'content' : 'content hidden' }>
            <div className={'svg_container' + ((page_state%2===0 && page_state<=4) ? " focus-svg " : " ") + ((page_state%2===0 && page_state<=4) ? " interactive" : "")}>
                <svg ref={tree_container} className="cy tree" width="100%" height="100%"></svg>
                <div className='svg_label'><InlineMath math="1."/> Tree Decomposition - <span className='reftar'><InlineMath math="T"/></span></div>
            </div>
            <div className={'svg_container' + ((page_state%2===1 && page_state<=5)? " focus-svg " : " ") + ((page_state%2===1 && page_state<=5) ? " interactive" : "")}>
                <svg ref={tree_containerx} className="cy tree" width="100%" height="100%"></svg>
                <div className='svg_label'><InlineMath math="2."/> Tree - <InlineMath math="T^X"/></div>
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
                <div className='svg_label'><InlineMath math="3."/> Tree Decomposition - <InlineMath math="T \cup T^X"/></div>
            </div>
        </div>



    </AnimatedPage>
    </>);
}
    
export default HomeBag;