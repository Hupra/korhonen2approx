import React, { useEffect, useRef, useState } from 'react';
// import graph from '../graphs/intro-treedecomposition-graph.json'
import graph from '../graphs/graph1.json'
import tree from '../graphs/intro-treedecomposition-tree.json'
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import * as d3 from 'd3';
import {Graph, Tree} from "../classes.js"
import {split} from "../functions.js"


function ConnectComponents() {
    const graph_container = useRef();
    const graph_container2 = useRef();
    const graph_container_c1 = useRef();
    const graph_container_c2 = useRef();
    const graph_container_c3 = useRef();
    const [components, setComponents] = useState([]);
    const [separator, setSeparator] = useState([]);
    const w = tree.nodes.find(node => node.name === "W");
    
    useEffect(() => {
        let removed_nodes = [];
        let removed_links = [];
        const nodes  = graph.nodes.map(node => {return {...node, "id" : node.id + "'"}});
        const edges  = graph.edges.map(edge => {return { source: edge.source.toString() + "'", target: edge.target.toString() + "'", color: edge.color }});
        const graph2 = {nodes, edges}
        console.log(graph_container.current.parentNode)
        const g  = new Graph(graph,  d3.select(graph_container.current));
        const g2 = new Graph(graph, d3.select(graph_container2.current));
        g.parent = graph_container.current.parentNode;
        g2.parent = graph_container2.current.parentNode;
        
        g2.w_ratio = -0.5;
        g2.h_ratio = 0.5;
        
        g.render();
        g2.render();

        let X = removed_nodes.map(node => parseInt(node.id)).sort((a, b) => a - b);
        let C = g2.find_components();

        g.X = X;
        g.C = C;
        g2.X = X;
        g2.C = C;
        g.render();
        g.svg_set_component_color();
        g2.svg_set_component_color();

        setSeparator(X);
        setComponents(C);

        const copy_g2_state = () => {
            // copy g2 state into component graphs
            const copy_nodes = g2.nodes.map(node => {return {"id":node.id}});
            const copy_edges = g2.links.map(link => {return {"source": link.source.id, "target": link.target.id}});
            const gc1 = new Graph({"nodes": copy_nodes, "edges": copy_edges}, d3.select(graph_container_c1.current));
            const gc2 = new Graph({"nodes": copy_nodes, "edges": copy_edges}, d3.select(graph_container_c2.current));
            const gc3 = new Graph({"nodes": copy_nodes, "edges": copy_edges}, d3.select(graph_container_c3.current));
            gc1.parent = graph_container_c1.current.parentNode;
            gc2.parent = graph_container_c2.current.parentNode;
            gc3.parent = graph_container_c3.current.parentNode;
            gc1.render();gc2.render();gc3.render();
        }
        copy_g2_state();

        // Add an event listener to the nodes to handle the click event
        g.svg_nodes.on("click", function() {

            const node = d3.select(this);
            const node_id = parseInt(node.attr("idx").toString());

            if(!node.classed("X")){
                // remove node from graph and save removed nodes+links in arrays here
                const removed  = g2.remove_node(node_id);
                removed_nodes.push(...removed.nodes);
                removed_links.push(...removed.links);
            }else{
                console.log("test", removed_nodes, node_id);
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
            // node.classed("highlight", !node.classed("highlight"));
            g2.render();


            X = removed_nodes.map(node => parseInt(node.id)).sort((a, b) => a - b)
            C = g2.find_components();
            g.X = X;
            g.C = C;
            g2.X = X;
            g2.C = C;
            g.svg_set_component_color();
            g2.svg_set_component_color();

            copy_g2_state();


            setSeparator(X);
            setComponents(C);
        });


    }, []);

  return (
    <>
    <div className='sidebar'>
        <h2>Separators</h2>
        <p>A separator is a set of vertices <InlineMath math="X"/> in <InlineMath math="G"/> that splits <InlineMath math="G"/> into multiple connected components, i.e., all the vertices 
        within a component are connected, but the components are not connected to each other. 
        We refer to these components as <InlineMath math="C_1,...,C_h"/> with <InlineMath math="h"/> being the number of components.</p>
        <h3>Exercise</h3>
        <p>Try clicking on nodes on the right to split the graph, for instance node 9 and 10.</p>
        <div className='items'>
            <InlineMath math={"X  = \\{"}/>
            <div className={"X"}><InlineMath math={separator.toString()} /></div>
            <InlineMath math={"\\}"}/>
        </div>
        {/* <br/> */}
        {/* {components.map((item, idx) => {
            const line = "C_"+(idx+1).toString()+" = \\{" + item.toString() + "\\}";
            return (
            <React.Fragment key={idx}>
                <div className='items'>
                    <InlineMath math={line} />
                </div>
            </React.Fragment>
        )})} */}
        {/* <br/> */}
        {components.map((item, idx) => {
            const e = "\\}";
            return (
            <React.Fragment key={idx}>
                <div className='items'>
                <InlineMath math={"C_"+(idx+1).toString()+"=\\{"} />
                <div className={"C"+(idx+1).toString()}><InlineMath math={item.toString()} /></div>
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
            <span>Split into 3 components.</span>
            <ion-icon name={components.length>=3? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
        </div>
        <div className='task'>
            <span>Split into 4 components.</span>
            <ion-icon name={components.length>=4? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
        </div>        
    </div>
    <div className='content'>
        <div className='horizontal-split'>
            <div className='svg_container'>
                <div className='svg_label'>Graph - <InlineMath math="G"/></div>
                <svg id="nolo" ref={graph_container} className="cy graph" width="100%" height="100%"></svg>
            </div>
            <div className='svg_container full'>
                <div className='svg_label'>Components - <InlineMath math="C_1, ..., C_h"/></div>
                <svg id="yolo" ref={graph_container2} className="cy graph"></svg>
            </div>
        </div>
        <div className='horizontal-split'>
            <div className='svg_container'>
                <div className='svg_label'>Component - <InlineMath math="C_1"/></div>
                <svg ref={graph_container_c1} className="cy graph"></svg>                
            </div>
            <div className='svg_container'>
                <div className='svg_label'>Component - <InlineMath math="C_2"/></div>
                <svg ref={graph_container_c2} className="cy graph"></svg>                
            </div>
            <div className='svg_container'>
                <div className='svg_label'>Component - <InlineMath math="C_3"/></div>
                <svg ref={graph_container_c3} className="cy graph"></svg>                
            </div>
        </div>
        
    </div>
    </>
  );
}


export default ConnectComponents;