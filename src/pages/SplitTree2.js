import React, { useEffect, useRef, useState } from 'react';
// import graph from '../graphs/intro-treedecomposition-graph.json'
import graph from '../graphs/graph1.json'
import tree from '../graphs/graph1-tree.json'
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import * as d3 from 'd3';
import {Graph, Tree} from "../classes.js"
import {split} from "../functions.js"


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
    const w = tree.nodes.find(node => node.name === "W");

    useEffect(() => {
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

    }, []);

  return (
    <>
    <div className='sidebar'>
        <h2>Splitting Tree Decomposition</h2>
        <p>Once a split(X,c1,c2,c3) is found this split is then used to build a new tree decomposition T'
        For the following graph a split could be the following:</p>
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
            <div className='button-container'>
                <button onClick={() => {show.push("W");set_show(show);tprime.render();tprime.svg_hide_stuff(show)}}>W</button>
                <button onClick={() => {show.push("A");set_show(show);tprime.render();tprime.svg_hide_stuff(show)}}>A</button>
                <button onClick={() => {show.push("B");set_show(show);tprime.render();tprime.svg_hide_stuff(show)}}>B</button>
                <button onClick={() => {show.push("X");set_show(show);tprime.render();tprime.svg_hide_stuff(show)}}>X</button>
            </div>

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