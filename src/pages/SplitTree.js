import React, { useEffect, useRef, useState } from 'react';
// import graph from '../graphs/intro-treedecomposition-graph.json'
import graph from '../graphs/graph1.json'
import tree from '../graphs/graph1-tree.json'
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import * as d3 from 'd3';
import {Graph, Tree} from "../classes.js"
import {split} from "../functions.js"


function SplitTree() {
    const graph_container = useRef();
    const graph_container2 = useRef();
    const tree_container = useRef();
    const tree_container2 = useRef();
    const [components, setComponents] = useState([]);
    const [separator, setSeparator] = useState([]);
    const w = tree.nodes.find(node => node.name === "W");

    useEffect(() => {
        let removed_nodes = [];
        let removed_links = [];
        let nodes1 = graph.nodes.map(node => w.bag.some(x => x === node.id) ? {...node, color: w.color} : node);
        let edges2 = graph.edges.map(edge => {return { source: edge.source.toString() + "'", target: edge.target.toString() + "'", color: edge.color }});
       
        let graph1 = {nodes: nodes1, edges: graph.edges}
        let graph2 = {nodes: nodes1.map(node => {return {...node, "id" : node.id + "'"}}), edges: edges2};

        const g  = new Graph(graph1, d3.select(graph_container.current));
        const g2 = new Graph(graph2, d3.select(graph_container2.current));
        const t  = new Tree(tree, d3.select(tree_container.current));
  
        g2.render();

        let X = removed_nodes.map(node => parseInt(node.id.slice(0, -1))).sort((a, b) => a - b);
        let C = g2.find_components(id => parseInt(id.slice(0, -1)));

        t.X = X;
        t.C = C;
        g.X = X;
        g.C = C;
        g2.X = X;
        g2.C = C;
        g.render();
        t.render();
        g.svg_set_component_color();
        g2.svg_set_component_color(id => parseInt(id.slice(0, -1)));

        setSeparator(X);
        setComponents(C);

        // Add an event listener to the nodes to handle the click event
        g.svg_nodes.on("click", function() {

            const node = d3.select(this);
            const node_id = node.attr("idx").toString()+"'";

            if(!node.classed("X")){
                // remove node from graph and save removed nodes+links in arrays here
                const removed  = g2.remove_node(node_id);
                removed_nodes.push(...removed.nodes);
                removed_links.push(...removed.links);
            }else{
                // add nodes+links back into graph
                // 1. find node in the array saving removed nodes
                // 2. find links in the array saving removed links,
                //    and make sure the node it's connected to is in the graph.
                const nodes = split(removed_nodes, node => node.id === node_id);
                const links = split(removed_links, link => {
                    return (link.source.id===node_id && !removed_nodes.some(node => node.id === link.target.id))
                    ||     (link.target.id===node_id && !removed_nodes.some(node => node.id === link.source.id))
                });
                removed_nodes = nodes.keep; //maybe use ref
                removed_links = links.keep;
                g2.add_links(links.remove);
                g2.add_nodes(nodes.remove);
            }
            //toggle highlight
            // node.classed("X", !node.classed("X"));
            g2.render();


            X = removed_nodes.map(node => parseInt(node.id.slice(0, -1))).sort((a, b) => a - b);
            C = g2.find_components(id => parseInt(id.slice(0, -1)));
            t.X = X;
            t.C = C;
            g.X = X;
            g.C = C;
            g2.X = X;
            g2.C = C;
            t.render();
            g.svg_set_component_color();
            g2.svg_set_component_color(id => parseInt(id.slice(0, -1)));

            const Tp = {
                "nodes" : [{ "id": 0, "bag": X, "name": "X"}],
                "edges" : []
            };
            console.log("tree",tree);
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
                    console.log(tree_edge);
                    tree_edge.source = tree_edge.source + (i*tree.nodes.length);
                    tree_edge.target = tree_edge.target + (i*tree.nodes.length);
                    Tp.edges.push(tree_edge);
                }
                // for (let j = 0; j < C[i].length; j++) {
                //     const t_nodes = C[i][j];
                //     console.log(t_nodes);                    
                // }
            }
            console.log(Tp);
            const t2  = new Tree(Tp, d3.select(tree_container2.current));
            t2.X = X;
            t2.C = C;
            t2.render();

            // update elements
            setSeparator(X);
            setComponents(C);
        });


    }, []);

  return (
    <>
    <div className='sidebar'>
        <h2>Splitting Tree Decomposition</h2>
        <p>A <InlineMath math="{balanced}"/> separator <InlineMath math="X"/> of <InlineMath math="W"/> is 
        a separator that splits the vertices 
        of <InlineMath math="G"/> in such a way that it also splits <InlineMath math="W"/> into 
        multiple parts <InlineMath math="W \cap C_1, ..., W \cap C_h"/>. Additionally, 
        it must hold that <InlineMath math="|W \cap C_i| \leq |W|/2"/> for every part of the split.</p>
        <h3>Exercise</h3>
        <p>Try clicking on nodes on the right to split the graph, for instance node 9 and 10.</p>
        <div className='svg_container interactive'>
            <div className='svg_label'>Graph - <InlineMath math="G"/></div>
            <svg id="nolo" ref={graph_container} className="cy graph" width="100%" height="100%"></svg>
        </div>
        <br/>
        <div className='items'>
            <InlineMath math={"X  = \\{"}/>
            <div className={"X"}><InlineMath math={separator.toString()} /></div>
            <InlineMath math={"\\}"}/>
        </div>
        {components.map((item, idx) => {
            return (
                <React.Fragment key={idx}>
                    <div className='items'>
                    <InlineMath math={"C_"+(idx+1).toString()+" = \\{"} />
                    <div className={"C"+(idx+1).toString()}><InlineMath math={item.toString()} /></div>
                    <InlineMath math={"\\}"} />
                    </div>
                </React.Fragment>
            )})}
        <br/>
        {components.map((item, idx) => {
            const CW = item.filter(e => w.bag.includes(e));
            const s = "C_"+(idx+1).toString()+"\\cap W = \\{";
            const m = CW.toString();
            const e = "\\}";
            return (
            <React.Fragment key={idx}>
                <div className='items'>
                <InlineMath math={s} />
                <div className={"C"+(idx+1).toString()}><InlineMath math={m} /></div>
                <InlineMath math={e} />
                </div>
            </React.Fragment>
        )})}

        <h4>Tasks</h4>
        <div className='task'>
            <span>Split into 2 components.</span>
            <ion-icon name={components.length>=2? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
        </div>
        <div className='task'>
            <span><InlineMath math="|W \cap C_i| \leq |W|/2"/>.</span>
            <ion-icon name={components.reduce((acc, x)=> Math.max(acc, x.filter(y => w.bag.includes(y)).length), 0)
            <=4 ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
        </div>
    </div>
    <div className='content'>
        <div className='horizontal-split w1-3'>
            
            <div className='svg_container'>
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
export default SplitTree;