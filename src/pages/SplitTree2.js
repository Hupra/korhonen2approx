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




function SplitTree2() {



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

    useEffect(() => {
        console.log("page render");
        let removed_nodes = [];
        let removed_links = [];
        let nodes1 = graph.nodes.map(node => w.bag.some(x => x === node.id) ? {...node, color: w.color} : node);
        let edges2 = graph.edges.map(edge => {return { source: edge.source.toString() + "'", target: edge.target.toString() + "'", color: edge.color }});
       
        let graph1 = {nodes: nodes1, edges: graph.edges}
        let graph2 = {nodes: nodes1.map(node => {return {...node, "id" : node.id + "'"}}), edges: edges2};

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

        useEffect(()=>{
            tprime.render();
            tprime.svg_hide_stuff(node_name.slice(0,i));
            set_ic1("");
            set_ic2("");
            set_ic3("");
        },[i])
        
        const check_input = (input, C) => {
            if (input.length === 0) return false;
            if (input.slice(-1) === ",") input = input.slice(0,-1);
            let input_answer = input.split(",").map(x => parseInt(x));
            let correct = cap(cup(C, separator), bag);
            // console.log(input_answer, correct);
            return list_is_same(input_answer, correct);
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
                <p>To determine the correct inputs for the formulas of the three newly created bags derived from the original
                     bag <InlineMath math={B}/>, follow this simple approach: Examine
                      the current bag in tree decomposition <InlineMath math="T"/> and identify the
                       distinct colors present. Each of these new bags will be the union of the orange
                        vertices <span className='color-reverse'>{"("}<span className='X'><InlineMath math="X"/></span>{")"}</span> and one of the other colors <span className='color-reverse'>{"("}<span className='C1'><InlineMath math="C_1"/></span>, <span className='C2'><InlineMath math="C_2"/></span>, <span className='C3'><InlineMath math="C_3"/></span>{")"}</span>.</p>
                <h4>Tasks</h4>
                <p>In the below tasks please enter the vertices that belongs to each bag separated by comma e.g., {"{"}4,8,3,7{"}"}</p>
                <div className='task'>
                    <div>
                        <InlineMath math={B+"^1 = "+B+" \\cap ("}/>
                        <span className='C1'><InlineMath math="C_1 "/></span><span> </span> 
                        <InlineMath math={"\\cup"}/><span> </span>
                        <span className='X'><InlineMath math="X"/></span>
                        <InlineMath math={")=\\{"}/>

                        <input value={ic1} onChange={e => handleInputChange(e, set_ic1)}></input>
                        <InlineMath math={"\\}"}/>
                    </div>
                    <div>
                        <ion-icon name={check_input(ic1, components[0]) ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
                    </div>
                </div>
                <div className='task'>
                    <div>
                        <InlineMath math={B+"^2 = "+B+" \\cap ("}/>
                        <span className='C2'><InlineMath math="C_2 "/></span><span> </span> 
                        <InlineMath math={"\\cup"}/><span> </span>
                        <span className='X'><InlineMath math="X"/></span>
                        <InlineMath math={")=\\{"}/>

                        <input value={ic2} onChange={e => handleInputChange(e, set_ic2)}></input>
                        <InlineMath math={"\\}"}/>
                    </div>
                    <div>
                        <ion-icon name={check_input(ic2, components[1]) ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
                    </div>
                </div>
                <div className='task'>
                    <div>
                        <InlineMath math={B+"^3 = "+B+" \\cap ("}/>
                        <span className='C3'><InlineMath math="C_3 "/></span><span> </span> 
                        <InlineMath math={"\\cup"}/><span> </span>
                        <span className='X'><InlineMath math="X"/></span>
                        <InlineMath math={")=\\{"}/>

                        <input value={ic3} onChange={e => handleInputChange(e, set_ic3)}></input>
                        <InlineMath math={"\\}"}/>
                    </div>
                    <div>
                        <ion-icon name={check_input(ic3, components[2]) ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
                    </div>
                </div>
                <button className={(
                    check_input(ic1, components[0]) && 
                    check_input(ic2, components[1]) && 
                    check_input(ic3, components[2])) ? "" : "disable"
                } onClick={() => set_page_state(page_state+1)}>Create bags <ion-icon name="bag-add-outline"></ion-icon></button>

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
            <button onClick={() => set_page_state(page_state+1)}>Add X to T'</button>
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
            <p>An improved tree decomposition <InlineMath math="T'"/> has been made, but there can still exists a problem with it, which will be explained in the next section.</p>
        </>
    }
    
        

  return (
    <>
    <AnimatedPage>

    <div className='sidebar'><div className='sidebar_bubble'>
        <h2>Splitting <InlineMath math="T"/></h2>
        <p>After finding a balanced separator and combining components to obtain a split <InlineMath math={"(C_1, C_2, C_3, X)"}/> of <InlineMath math={"W"}/>, we can create a new tree decomposition T' by spltting each bag in T based on the components in our split.</p>
        <p>We do this by iterating through each bag and generating three new bags, formed by determining the intersection between the original bag and the following sets, respectively: <InlineMath math="(C_1 \cup X)"/>, <InlineMath math="(C_2 \cup X)"/>, <InlineMath math="(C_3 \cup X)"/>
        </p>    
        <hr/>
        <h2>Exercises</h2>
        <i>In tree decomposition T, the vertices in each bag are assigned distinct colors according to their respective component affiliation.</i>

            { page_ready && page_state === 0 && <Puzzle i={page_state}/>}
            { page_ready && page_state === 1 && <Puzzle i={page_state}/>}
            { page_ready && page_state === 2 && <Puzzle i={page_state}/>}
            { page_ready && page_state === 3 && <PuzzleSeparator i={page_state}/>}
            { page_ready && page_state === 4 && <PuzzleDone i={page_state}/>}

        {/* <h4>Variables</h4>
        <div className='items flex'>
            <div>
                <InlineMath math={"X  = \\{"}/>
                <div className={"X"}><InlineMath math={separator.toString()} /></div>
                <InlineMath math={"\\}"}/>
            </div>
            <div>
            </div>
        </div>
        
        {components.map((item, idx) => {
            return (
                <React.Fragment key={idx}>
                    <div className='items flex'>
                        <div>
                            <InlineMath math={"C_"+(idx+1).toString()+" = \\{"} />
                            <div className={"C"+(idx+1).toString()}><InlineMath math={item.toString()} /></div>
                            <InlineMath math={"\\}"} />
                        </div>
                    </div>
                </React.Fragment>
            )})} */}

            <br/><hr/>

            {(page_state > 3) ?
            <><Link to="/page1" className='button'>Continue<ion-icon name="arrow-forward-outline"></ion-icon></Link><br/><i>Next: Continuity Issue</i></>
            :
            <><Link to="/page1" className='button disable'>Skip<ion-icon name="arrow-forward-outline"></ion-icon></Link><br/><i>Next: Continuity Issue</i></>
            }
            

            {/* <div className='button-container'>
                <button onClick={() => {show.push("W");set_show(show);tprime.render();tprime.svg_hide_stuff(show)}}>W</button>
                <button onClick={() => {show.push("A");set_show(show);tprime.render();tprime.svg_hide_stuff(show)}}>A</button>
                <button onClick={() => {show.push("B");set_show(show);tprime.render();tprime.svg_hide_stuff(show)}}>B</button>
                <button onClick={() => {show.push("X");set_show(show);tprime.render();tprime.svg_hide_stuff(show)}}>X</button>
            </div> */}
    </div></div>
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
            <div className='svg_label'>Tree Decomposition - <InlineMath math="T'"/></div>
            <svg ref={tree_container2} className="cy tree" width="100%" height="100%"></svg>
        </div>
        {/* <svg ref={tree_container} className="cy hidden" width="100%" height="100%"></svg> */}
        
        {/* <div className='horizontal-split'>
            <div className='svg_container'>
                <div className='svg_label'>Tree Decomposition - <InlineMath math="T"/></div>
                <svg ref={tree_container} className="cy" width="100%" height="100%"></svg>
            </div>
            <div className='svg_container'>
                <div className='svg_label'>Tree Decomposition - <InlineMath math="T'"/></div>
                <svg ref={tree_container2} className="cy" width="100%" height="100%"></svg>
            </div>
        </div> */}
    </div>
    </AnimatedPage>

    </>
  );
}
export default SplitTree2;