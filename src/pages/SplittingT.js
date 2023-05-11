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



function SplittingT() {



    const graph_container = useRef();
    const graph_container2 = useRef();
    const tree_container = useRef();
    const tree_container2 = useRef();
    const [components, setComponents] = useState([]);
    const [separator, setSeparator] = useState([]);
    // const [show, set_show] = useState(["W", "B"]);
    const [show, set_show] = useState([]);
    const [tprime, set_tprime] = useState(null);
    const [page_ready, set_page_ready] = useState(false);
    const [page_state, set_page_state] = useState(0);
    const w = tree.nodes.find(node => node.name === "W");
    const node_name = tree.nodes.map(x => x.name);
    const node_bag = tree.nodes.map(x => x.bag);
    
    function mi(x) {
        if(x === "T") tree_container.current.parentNode.classList.add('reftar');
        if(x === "T'") tree_container2.current.parentNode.classList.add('reftar');
    }
    function mo() {
        tree_container.current.parentNode.classList.remove('reftar');
        tree_container2.current.parentNode.classList.remove('reftar');
    }

    useEffect(() => {
        let removed_nodes = [];
        let removed_links = [];
        let nodes1 = graph.nodes.map(node => w.bag.some(x => x === node.id) ? {...node, color: w.color} : node);
       
        let graph1 = {nodes: nodes1, edges: graph.edges}

        const g  = new Graph(graph1, d3.select(graph_container.current));
        const g2 = new Graph(graph1, d3.select(graph_container2.current));
        const t  = new Tree(tree, d3.select(tree_container.current));

        g.W = w.bag;
        g2.W = w.bag;
  
        g2.render();

        // let X = removed_nodes.map(node => parseInt(node.id.slice(0, -1))).sort((a, b) => a - b);
        let X = [3,7,9];
        for (const x of X) {
            const removed  = g2.remove_node(x);
            removed_nodes.push(...removed.nodes);
            removed_links.push(...removed.links);
        }
        let C = g2.find_components();

        t.X = X;
        t.C = C;
        g.X = X;
        g.C = C;
        g2.X = X;
        g2.C = C;
        g.render();
        t.render();
        g2.render();
        g.svg_set_component_color();
        g2.svg_set_component_color();

        setSeparator(X);
        setComponents(C);

        const Tp = T_2_TD(tree, C, X);
        const t2 = new Tree(Tp, d3.select(tree_container2.current));
        t2.X = X;
        t2.C = C;

        t2.render();
        t2.svg_hide_stuff(show);
        set_tprime(t2);
        set_page_ready(true);

    }, []);

    const Puzzle = (props) => {
        const i = props.i;
        const B = node_name[i];
        const bag = node_bag[i];

        const [ic1, set_ic1] = useState('');
        const [ic2, set_ic2] = useState('');
        const [ic3, set_ic3] = useState('');
        const input1_ref = useRef();
        const input2_ref = useRef();
        const input3_ref = useRef();
        const button_ref = useRef();
        
        useEffect(()=>{
            tprime.render();
            tprime.svg_hide_stuff(node_name.slice(0,i));
            set_ic1("");
            set_ic2("");
            set_ic3("");
            if(input1_ref.current) {
                setTimeout(() => input1_ref.current.focus(), 0);
            }
        },[i])
        
        const check_input = (input, C) => {
            if (input.length === 0) return false;
            if (input.slice(-1) === ",") input = input.slice(0,-1);
            let input_answer = input.split(",").map(x => parseInt(x));
            let correct = cap(cup(C, separator), bag);
            return list_is_same(input_answer, correct);
        }

        const beauty = (ci, C) => {
            if(ci===0 && input2_ref.current) input2_ref.current.focus();
            if(ci===1 && input3_ref.current) input3_ref.current.focus();
            if(ci===2 && button_ref.current) button_ref.current.focus();
            let correct = cap(cup(C, separator), bag);
            tprime.svg_show_stuff(B, ci+1);
            return (
                correct.map((v, i) => {
                    return C.includes(v) 
                    ? <span className="bigbig"><span className={"C"+(ci+1).toString()}>{v.toString()}</span>{i < correct.length - 1 && ","}</span>
                    : <span className="bigbig"><span className="X">{v.toString()}</span>{i < correct.length - 1 && ","}</span>
                })
            );
        }

        const handleInputChange = (event, set) => {
            const regex = /^([0-9]+[,]?)*$/;
            const inputValue = event.target.value;        
            if (regex.test(inputValue)) set(inputValue);
          };

        

        return (
            <div className='build-a-bag'>
                <h4>Description</h4>
                {/* <div>Fill out the correct inputs in the formulas below for each of the three newly created bags derived from the original bag {B}</div> */}
                {/* <div>A simple approach is to look at the current bag in <InlineMath math="T"/> and look at the different colors. Each of these new bags will be the union of orange and one of the other colors.</div> */}
                <p>For each bag in <span className='ref' onMouseOver={() => mi("T")} onMouseOut={mo}><InlineMath math="T"/></span>, it is 
                necessary to determine the appropriate contents for the three bags that will 
                replace it in <span className='ref' onMouseOver={() => mi("T'")} onMouseOut={mo}><InlineMath math="T'"/></span>. This can be 
                achieved by including the vertices from the original 
                bag in <span className='ref' onMouseOver={() => mi("T")} onMouseOut={mo}><InlineMath math="T"/></span> that 
                are associated with one of the specific 
                components <span className='color-reverse'>{"("}<span className='C1'><InlineMath math="C_1"/></span>, <span className='C2'><InlineMath math="C_2"/></span>, <span className='C3'><InlineMath math="C_3"/></span>{")"}</span> , and then adding the vertices from the original bag that are also present in <span className='color-reverse'>{"("}<span className='X'><InlineMath math="X"/></span>{")"}</span>.</p>
                <h4>Tasks</h4>
                <p>In the tasks below, please enter the vertices that belong to each bag, separated by commas, e.g., {"{"}4,8,3,7{"}"}</p>
                <div className='task minh'>
                    <div className="big" style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%"}}>
                            
                        <InlineMath math={B+"^1 = "+B+" \\cap ("}/>
                        <span className='C1'><InlineMath math="C_1 "/></span><span> </span> 
                        <InlineMath math={"\\cup"}/><span> </span>
                        <span className='X'><InlineMath math="X"/></span>
                        <InlineMath math={")=\\{"}/>
                        {!check_input(ic1, components[0]) ?
                        <input ref={input1_ref} value={ic1} onChange={e => handleInputChange(e, set_ic1)}></input>
                        :
                        <span>{beauty(0, components[0])}</span>}
                        <InlineMath math={"\\}"}/>
                    </div>
                    <div>
                        <ion-icon name={check_input(ic1, components[0]) ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
                    </div>
                </div>
                <div className='task minh'>
                    <div className="big" style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%"}}>
                            
                        <InlineMath math={B+"^2 = "+B+" \\cap ("}/>
                        <span className='C2'><InlineMath math="C_2 "/></span><span> </span> 
                        <InlineMath math={"\\cup"}/><span> </span>
                        <span className='X'><InlineMath math="X"/></span>
                        <InlineMath math={")=\\{"}/>

                        {!check_input(ic2, components[1]) ?
                        <input ref={input2_ref} value={ic2} onChange={e => handleInputChange(e, set_ic2)}></input>
                        :
                        <span>{beauty(1, components[1])}</span>}
                        <InlineMath math={"\\}"}/>
                    </div>
                    <div>
                        <ion-icon name={check_input(ic2, components[1]) ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
                    </div>
                </div>
                <div className='task minh'>
                    <div className="big" style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%"}}>

                        <InlineMath math={B+"^3 = "+B+" \\cap ("}/>
                        <span className='C3'><InlineMath math="C_3 "/></span><span> </span> 
                        <InlineMath math={"\\cup"}/><span> </span>
                        <span className='X'><InlineMath math="X"/></span>
                        <InlineMath math={")=\\{"}/>
                        {!check_input(ic3, components[2]) ?
                        <input ref={input3_ref} value={ic3} onChange={e => handleInputChange(e, set_ic3)}></input>
                        :
                        <span>{beauty(2, components[2])}</span>}
                        <InlineMath math={"\\}"}/>
                    </div>
                    <div>
                        <ion-icon name={check_input(ic3, components[2]) ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
                    </div>
                </div>
                
                {
                    check_input(ic1, components[0]) && 
                    check_input(ic2, components[1]) && 
                    check_input(ic3, components[2]) 
                    ? <button ref={button_ref} onClick={() => set_page_state(page_state+1)}>Next Exercise</button>
                    : <button ref={button_ref} onClick={() => set_page_state(page_state+1)} className='disable'>Skip Exercise</button>
                }

            </div>)
    }

    const PuzzleSeparator = (props) => {
        const i = props.i;
        useEffect(()=>{
            tprime.render();
            tprime.svg_hide_stuff(node_name.slice(0,i));
        },[i])
        return<>
            <h4>Description</h4>
            <p>We have now generated three new bags for every bag in the original tree decomposition <InlineMath math="T"/>. These new bags constitute three distinct tree decompositions, which we refer to as <InlineMath math="T^1, T^2, T^3"/>. To merge these, we introduce a new bag, <InlineMath math="X"/>, that contains the vetices of the separator.</p>
            <h4>Tasks</h4>
            
            <div className='task minh'>
                <div>
                    <ion-icon name={page_state>3 ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
                    <div>Add <InlineMath>X</InlineMath> to <InlineMath>T'</InlineMath> on the right.</div>
                </div>
            </div>
        </>
    }

    const PuzzleDone = (props) => {
        const i = props.i;
        useEffect(()=>{
            tprime.render();
            tprime.svg_hide_stuff(node_name.concat("X"));
        },[i])
        return<>
            <h2>Attention</h2>
            <p>An improved tree decomposition <span className='ref' onMouseOver={() => mi("T'")} onMouseOut={mo}><InlineMath math="T'"/></span> has been made, but there can still exists a problem with it, which will be explained in the next section.</p>
        </>
    }
    
        

  return (
    <>
    <AnimatedPage>

    <div className='sidebar'><div className='sidebar_bubble'><SB style={{ height: '100vh', width: '100vw' }}>
        <h2>Splitting <InlineMath math="T"/></h2>
        <p>After identifying a balanced separator and combining components to obtain a split <InlineMath math={"(C_1, C_2, C_3, X)"}/> of <InlineMath math={"W"}/>, we can construct a new, improved tree decomposition <InlineMath math={"T'"}/> by dividing each bag in <InlineMath math={"T"}/> according to the components of our split.</p> 
        <p>To accomplish this, we iterate through each bag and replace it with 
            three new bags (or two if <InlineMath math={"C_3"}/> is empty), each 
            containing the vertices from the original bag's intersection with a 
            specific component and the separator. For each bag <InlineMath math="B" />, this 
            results in three new bags consisting of the following 
            sets:
        </p>
            <ul style={{marginTop: "10px", marginLeft: "15px"}}>
                <li><InlineMath math=" B^1 = B \cap (C_1 \cup X)"/></li>
                <li><InlineMath math=" B^2 = B \cap (C_2 \cup X)"/></li>
                <li><InlineMath math=" B^3 = B \cap (C_3 \cup X)"/></li>
            </ul>
            
            
        <hr/>
        <h2>Exercises</h2>
        <div className='exercise'>
        <i>In the tree decomposition <span className='ref' onMouseOver={() => mi("T")} onMouseOut={mo}><InlineMath math="T"/></span>, vertices 
        within each bag are assigned distict colors based on their corresponding component affiliation.</i>

            { page_ready && page_state === 0 && <Puzzle i={page_state}/>}
            { page_ready && page_state === 1 && <Puzzle i={page_state}/>}
            { page_ready && page_state === 2 && <Puzzle i={page_state}/>}
            { page_ready && page_state === 3 && <PuzzleSeparator i={page_state}/>}
            { page_ready && page_state === 4 && <PuzzleDone i={page_state}/>}
        
        </div>
        <br/><hr/>

        {(page_state > 3) ?
        <><Link to="/continuity" className='button'>Continue<ion-icon name="arrow-forward-outline"></ion-icon></Link><br/><i>Next: Continuity Issue</i></>
        :
        <><Link to="/continuity" className='button disable'>Skip<ion-icon name="arrow-forward-outline"></ion-icon></Link><br/><i>Next: Continuity Issue</i></>
        }
        

           
    </SB></div></div>
    <div className='content'>
        <div className='horizontal-split w1-3'>
            <div className='svg_container'>
                <svg id="nolo" ref={graph_container} className="cy graph" width="100%" height="100%"></svg>
                <div className='svg_label'>Graph - <InlineMath math="G"/></div>
            </div>

            <div className='svg_container hidden'>
                <svg id="yolo" ref={graph_container2} className="cy graph" width="100%" height="100%"></svg>
                <div className='svg_label'>Components - <InlineMath math="C_1, ..., C_h"/></div>
            </div>
            <div className='svg_container'>
                <div className='svg_label'>Tree Decomposition - <InlineMath math="T"/></div>
                <svg ref={tree_container} className="cy tree" width="100%" height="100%"></svg>
            </div>
        </div>
        <div className='wall'><ion-icon name="arrow-forward-outline"></ion-icon></div>

        <div className='svg_container w2-3'>
        {page_state===3 &&
                <button className='combine-btn focus'
                onClick={(e) => {
                        set_page_state(page_state+1);
                        // correcto(e.clientX, e.clientY, 'Correcto!');}
                    }}>
                    <div>Add <InlineMath math="X"/> to <InlineMath math="T'"/>
                </div>
                </button>}

            <div className='svg_label'>Tree Decomposition - <InlineMath math="T'"/></div>
            <svg ref={tree_container2} className="cy tree" width="100%" height="100%"></svg>
        </div>
 
    </div>
    </AnimatedPage>

    </>
  );
}
export default SplittingT;