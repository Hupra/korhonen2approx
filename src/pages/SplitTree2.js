import React, { useEffect, useRef, useState } from 'react';
// import graph from '../graphs/intro-treedecomposition-graph.json'
import graph from '../graphs/graph1.json'
import tree from '../graphs/graph1-tree.json'
import { BlockMath, InlineMath } from 'react-katex';
import { Routes, Route, Link } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import * as d3 from 'd3';
import {Graph, Tree} from "../classes.js"
import {split, cup, cap, list_is_same} from "../functions.js"




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

        const Tp = {
            "nodes" : [{ "id": 0, "bag": X, "name": "X"}],
            "edges" : []
        };
        for (let i = 0; i < C.length; i++) {
            for (let j = 0; j < tree.nodes.length; j++) {
                const tree_node = {...tree.nodes[j]};
                tree_node.name = tree_node.name + (i+1).toString();
                tree_node.id = tree_node.id + (i*tree.nodes.length);
                const Ci_union_X = Array.from(new Set([...C[i], ...X]));
                const CiX_intersect_bag = Ci_union_X.filter(x => tree_node.bag.includes(x));
                tree_node.bag = CiX_intersect_bag;
                Tp.nodes.push(tree_node);
                
                if(tree_node.name.startsWith("W")){
                    Tp.edges.push({"source": 0, "target": tree_node.id});
                }
            }
            for (let j = 0; j < tree.edges.length; j++) {
                const tree_edge = {...tree.edges[j]};
                tree_edge.source = tree_edge.source + (i*tree.nodes.length);
                tree_edge.target = tree_edge.target + (i*tree.nodes.length);
                Tp.edges.push(tree_edge);
            }
        }
        const t2  = new Tree(Tp, d3.select(tree_container2.current));
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
                <h3>Tasks</h3>
                <div>Fill out the correct inputs in the formulas below for each of the three new bags created for the original bag {B}:</div>
                <br/>
                <div className='task'>
                    <div>
                        <InlineMath math={B+"^1 = "+B+" \\cap (C_1 \\cup X) = \\{"}/>
                        <input value={ic1} onChange={e => handleInputChange(e, set_ic1)} placeholder="4,8,3,7"></input>
                        <InlineMath math={"\\}"}/>
                    </div>
                    <div>
                        <ion-icon name={check_input(ic1, components[0]) ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
                    </div>
                </div>
                <div className='task'>
                    <div>
                        <InlineMath math={B+"^2 = "+B+" \\cap (C_2 \\cup X) = \\{"}/>
                        <input value={ic2} onChange={e => handleInputChange(e, set_ic2)}></input>
                        <InlineMath math={"\\}"}/>
                    </div>
                    <div>
                        <ion-icon name={check_input(ic2, components[1]) ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
                    </div>
                </div>
                <div className='task'>
                    <div>
                        <InlineMath math={B+"^3 = "+B+" \\cap (C_3 \\cup X) = \\{"}/>
                        <input value={ic3} onChange={e => handleInputChange(e, set_ic3)}></input>
                        <InlineMath math={"\\}"}/>
                    </div>
                    <div>
                        <ion-icon name={check_input(ic3, components[2]) ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
                    </div>
                </div>
                <Link to={"/splitting-tree2/"+(i+2).toString()}>Next</Link><h1>{i}</h1>
            </div>)
    }

    const PuzzleSeparator = (props) => {
        const i = props.i;
        useEffect(()=>{
            tprime.render();
            tprime.svg_hide_stuff(node_name.slice(0,i));
        },[i])
        return<>
            <p>Now that we have created three new bags for each bag -- see T'</p>
            <p>This gives us three new tree decompositions T1, T2 and T3. These are then connected to a new bag X that contains all the vertices that were chosen as the separator.</p>
            <Link to={"/splitting-tree2/"+(i+2).toString()}>Next</Link><h1>{i}</h1>
        </>
    }

    const PuzzleDone = (props) => {
        const i = props.i;
        useEffect(()=>{
            tprime.render();
            tprime.svg_hide_stuff(node_name.concat("X"));
        },[i])
        return<>
            <p>DONE - T'</p>
            <p>go to next section ...</p>
            <Link to={"/splitting-tree2/"}>Next</Link><h1>{i}</h1>
        </>
    }
    
        

  return (
    <>
    <div className='sidebar'>
        <h2>Splitting Tree Decomposition</h2>
        <p>After finding a balanced separator and combining components to find a split <InlineMath math={"(C_1, C_2, C_3, X)"}/> of <InlineMath math={"W"}/>, we can create a new tree decomposition T' by spltting each bag in T based on the components in our split.</p>
        <p>We do this by going through each bag and taking its intersection with <InlineMath math="C_1 \cup X"/>, <InlineMath math="C_2 \cup X"/>, <InlineMath math="C_3 \cup X"/> respectively.</p>
        <br/>
        <div className='items flex'>
            <div>
                <InlineMath math={"X  = \\{"}/>
                <div className={"X"}><InlineMath math={separator.toString()} /></div>
                <InlineMath math={"\\}"}/>
            </div>
            <div>
                {/* <InlineMath math={"W=\\{1,2,3,4,5,6,7,8\\}"}/> */}
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
                        <div>
                            <InlineMath math={"C_"+(idx+1).toString()+"\\cap W = \\{"} />
                            <div className={"C"+(idx+1).toString()}><InlineMath math={item.filter(e => w.bag.includes(e)).toString()} /></div>
                            <InlineMath math={"\\}"} />
                        </div>
                    </div>
                </React.Fragment>
            )})}
            <h2>Creating <InlineMath math={"T'"}/></h2>
            { page_ready ?
            (<Routes>
                    <Route path="/*" element={<Puzzle i={0}/>}/>
                    <Route path="/2" element={<Puzzle i={1}/>}/>
                    <Route path="/3" element={<Puzzle i={2}/>}/>
                    <Route path="/4" element={<PuzzleSeparator i={3}/>}/>
                    <Route path="/5" element={<PuzzleDone i={4}/>}/>
            </Routes>) : 
            (<div>loading...</div>) }
            

            {/* <div className='button-container'>
                <button onClick={() => {show.push("W");set_show(show);tprime.render();tprime.svg_hide_stuff(show)}}>W</button>
                <button onClick={() => {show.push("A");set_show(show);tprime.render();tprime.svg_hide_stuff(show)}}>A</button>
                <button onClick={() => {show.push("B");set_show(show);tprime.render();tprime.svg_hide_stuff(show)}}>B</button>
                <button onClick={() => {show.push("X");set_show(show);tprime.render();tprime.svg_hide_stuff(show)}}>X</button>
            </div> */}
    </div>
    <div className='content'>
        <div className='horizontal-split w1-3'>
            <div className='svg_container'>
                <div className='svg_label'>Graph - <InlineMath math="G"/></div>
                <svg id="nolo" ref={graph_container} className="cy graph" width="100%" height="100%"></svg>
            </div>
            <div className='svg_container hidden'>
                <div className='svg_label'>Components - <InlineMath math="C_1, ..., C_h"/></div>
                <svg id="yolo" ref={graph_container2} className="cy graph" width="100%" height="100%"></svg>
            </div>
            <div className='svg_container'>
                <div className='svg_label'>Tree Decomposition - <InlineMath math="T"/></div>
                <svg ref={tree_container} className="cy tree" width="100%" height="100%"></svg>
            </div>
        </div>
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
    </>
  );
}
export default SplitTree2;