import React, { useEffect, useRef, useState } from 'react';
// import graph from '../graphs/intro-treedecomposition-graph.json'
import graph from '../graphs/graph-X.json'
import tree from '../graphs/graph-X-tree.json'
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import * as d3 from 'd3';
import forceBoundary from 'd3-force-boundary';
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
    const [page_ready, set_page_ready] = useState(false);
    const [show_G, set_show_G] = useState(false);
    const W = tree.nodes.find(node => node.name === "W");
    const [container_size, set_container_size] = useState([W.bag.length-1,0,0]);
    
    
    useEffect(() => {
        let removed_nodes = [];
        let removed_links = [];
        const g  = new Graph(graph,  d3.select(graph_container.current));
        const g2 = new Graph(graph, d3.select(graph_container2.current));
        g.parent = graph_container.current.parentNode;
        g2.parent = graph_container2.current.parentNode;
        
        g2.render();



        // let X = removed_nodes.map(node => parseInt(node.id)).sort((a, b) => a - b);
        let X = [1];
        for (const x of X) {
            const removed  = g2.remove_node(x);
            removed_nodes.push(...removed.nodes);
            removed_links.push(...removed.links);
        }
        let C = g2.find_components();
        g.render();
        g.X = X;
        g.W = W.bag;
        g.C = C;
        g.svg_set_component_color();

        const copy_g2_state = () => {
            const copy_nodes = g2.nodes.map(node => {return {"id":node.id}});
            const copy_edges = g2.links.map(link => {return {"source": link.source.id, "target": link.target.id}});
            const gc1 = new Graph({"nodes": copy_nodes, "edges": copy_edges}, d3.select(graph_container_c1.current));
            const gc2 = new Graph({"nodes": copy_nodes, "edges": copy_edges}, d3.select(graph_container_c2.current));
            const gc3 = new Graph({"nodes": copy_nodes, "edges": copy_edges}, d3.select(graph_container_c3.current));
            gc1.parent = graph_container_c1.current.parentNode;
            gc2.parent = graph_container_c2.current.parentNode;
            gc3.parent = graph_container_c3.current.parentNode;
            gc1.w_left = 0.0000;
            gc1.w_right = 0.6666;
            gc2.w_left = 0.3333;
            gc2.w_right = 0.3333;
            gc3.w_left = 0.6666;
            gc3.w_right = 0.0000;
            let gcx = [gc1,gc2,gc3];
            let gca = [[...copy_nodes.map(node => node.id)], [], []]

            // color popup graph
            g.C = gca;
            g.svg_set_component_color();

            for (let i = 0; i < gcx.length; i++) {
                gcx[i].charge = -75;
                gcx[i].W = W.bag;
                gcx[i].node_class = "C"+(i+1).toString();
                gcx[i].render();    
                gcx[i].svg_show_only(gca[i]);
                gcx[i].svg_nodes.call(d3.drag()
                .on('start', (e,d) => {
                    gcx[i].simulation.force("boundary", null);
                    gcx[i].simulation.force('charge', null);
                    gcx[i].simulation.force('center', null);
                    
                    // if (!e.active) gcx[i].simulation.alphaTarget(0.3).restart();
                    // d.fx = d.x;
                    // d.fy = d.y;
                    for (let i = 0; i < gcx.length; i++) {
                        if (!e.active) gcx[i].simulation.alphaTarget(0.3).restart();
                        const node = gcx[i].nodes.filter(node => node.id === d.id)[0];
                        node.fx = e.x;
                        node.fy = e.y;
                    }
                })
                .on('drag', (e,d) => {
                    for (let i = 0; i < gcx.length; i++) {
                        const node = gcx[i].nodes.filter(node => node.id === d.id)[0];
                        node.fx = e.x;
                        node.fy = e.y;
                    }
                    // d.fx = e.x;
                    // d.fy = e.y;
                })
                .on('end', (e,d) => {
                    const w = gcx[i].svg.node().getBoundingClientRect().width;
                    const h = gcx[i].svg.node().getBoundingClientRect().height;

                    // if (!e.active) gcx[i].simulation.alphaTarget(0);
                    // d.fx = null;
                    // d.fy = null;


                    for (let i = 0; i < gcx.length; i++) {
                        if (!e.active) gcx[i].simulation.alphaTarget(0);
                        const node = gcx[i].nodes.filter(node => node.id === d.id)[0];
                        node.fx = null;
                        node.fy = null;
                    }

                    // gcx[i].simulation = gcx[i].create_svg_simulation();
                    gcx[i].simulation.force("boundary", 
                        forceBoundary(
                        20+(gcx[i].w_left*w),
                        60+(gcx[i].h_top*h),
                        w-20-(gcx[i].w_right*w),
                        h-35-(gcx[i].h_bot*h)));
                    gcx[i].simulation.force('charge', d3.forceManyBody().strength(gcx[i].charge));
                    gcx[i].simulation.force('center', d3.forceCenter(
                        (w/2)+(gcx[i].w_left*w/2)-(gcx[i].w_right*w/2),
                        (h/2)+(gcx[i].h_top*h/2)-(gcx[i].h_bot*h/2)));


                    // find what box item is dragged into
                    const box_width = graph_container_c1.current.parentNode.getBoundingClientRect().width;
                    let container_id = 0;
                    if(e.x>=box_width*2) container_id = 2;
                    else if(e.x>=box_width*1) container_id = 1;

                    // find component we are dragging
                    let Ci = 0;
                    for (let i = 0; i < C.length; i++) {
                        if(C[i].includes(d.id)){
                            Ci = i;
                            break;
                        }
                    }

                    // remove dragged component elements from array
                    for (let i = 0; i < gca.length; i++) gca[i] = gca[i].filter(x => !C[Ci].includes(x));

                    // add dragged component to container
                    gca[container_id] = gca[container_id].concat(C[Ci]);

                    // hide nodes
                    for (let i = 0; i < gcx.length; i++) gcx[i].svg_show_only(gca[i]);

                    // set state for container size
                    let new_container_size = [0,0,0];
                    for (let i = 0; i < gca.length; i++){
                        new_container_size[i] = gca[i].filter(x => W.bag.includes(x)).length;
                    }

                    // recolor popup graph
                    g.C = gca;
                    g.svg_set_component_color();

                    // for (let i = 0; i < gcx.length; i++) gcx[i].simulation.restart();
                    set_container_size(new_container_size);
                }));
            }
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
        });

        set_page_ready(true);


    }, []);

  return (
    <>
    <div className='sidebar'>
        <h2>Connected Components</h2>
        Given a balanced split where every component is leq W/2. It is always possible to reduce our number of components to at most 3, by combining some of them.
        This can be done, by for instance always combining the two smallets components.

        <h4>Tasks</h4>
        Find a balanced separator and combine the many components into just 3, and make sure that these new combined componentt do not reach a size of more than W/2
        <div className='task'>
            <span><InlineMath math={"|C_1 \\cap W| \\leq |W|/2"} /></span>
            <span><InlineMath math={container_size[0].toString() + "\\leq" + (W.bag.length/2).toString()}/></span>
            <ion-icon name={container_size[0]<=W.bag.length/2? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
        </div>
        <div className='task'>
            <span><InlineMath math={"|C_2 \\cap W| \\leq |W|/2"} /></span>
            <span><InlineMath math={container_size[1].toString() + "\\leq" + (W.bag.length/2).toString()}/></span>
            <ion-icon name={container_size[1]<=W.bag.length/2? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
        </div>
        <div className='task'>
            <span><InlineMath math={"|C_3 \\cap W| \\leq |W|/2"} /></span>
            <span><InlineMath math={container_size[2].toString() + "\\leq" + (W.bag.length/2).toString()}/></span>
            <ion-icon name={container_size[2]<=W.bag.length/2? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
        </div>
        <br/>
        <div>
            <button onClick={() => set_show_G(!show_G)}>{show_G ? "Hide Graph" : "Show Graph"}</button>
        </div>  
    </div>
    <div className='content'>
            <div className={'svg_popup'  + (show_G?"":" to_the_depths")}>
                <div className='svg_container'>
                    <div className='svg_label'>Graph - <InlineMath math="G"/></div>
                    <svg id="nolo" ref={graph_container} className="cy graph" width="100%" height="100%"></svg>
                </div>
            </div>
            <div className='svg_container hidden'>
                <div className='svg_label'>Components - <InlineMath math="C_1, ..., C_h"/></div>
                <svg id="yolo" ref={graph_container2} className="cy graph"></svg>
            </div>
            <div className={'svg_container full top interactive' + (show_G ? " blur" : "")}>
                <div className='svg_label'>Component - <InlineMath math="C_1"/></div>
                <div className={'svg_counter ' + ((container_size[0]<=W.bag.length/2) ? "valid" : "invalid")}>
                    <InlineMath math={container_size[0].toString() + "\\leq" + (W.bag.length/2).toString()}/>
                </div>
                <svg ref={graph_container_c1} className="cy graph"></svg>                
            </div>
            <div className={'svg_container full mid interactive' + (show_G ? " blur" : "")}>
                <div className='svg_label'>Component - <InlineMath math="C_2"/></div>
                <div className={'svg_counter ' + ((container_size[1]<=W.bag.length/2) ? "valid" : "invalid")}>
                    <InlineMath math={container_size[1].toString() + "\\leq" + (W.bag.length/2).toString()}/>
                </div>
                <svg ref={graph_container_c2} className="cy graph"></svg>                
            </div>
            <div className={'svg_container full bot interactive' + (show_G ? " blur" : "")}>
                <div className='svg_label'>Component - <InlineMath math="C_3"/></div>
                <div className={'svg_counter ' + ((container_size[2]<=W.bag.length/2) ? "valid" : "invalid")}>
                    <InlineMath math={container_size[2].toString() + "\\leq" + (W.bag.length/2).toString()}/>
                </div>
                <svg ref={graph_container_c3} className="cy graph"></svg>                
            </div>
        
    </div>
    </>
  );
}


export default ConnectComponents;