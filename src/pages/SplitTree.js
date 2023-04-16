import React, { useEffect, useRef, useState } from 'react';
// import graph from '../graphs/intro-treedecomposition-graph.json'
import graph from '../graphs/graph1.json'
import tree from '../graphs/graph1-tree.json'
// import graph from '../graphs/graph-X.json'
// import tree from '../graphs/graph-X-tree.json'
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import * as d3 from 'd3';
import {Graph, Tree} from "../classes.js"
import {split, T_2_TD} from "../functions.js"
import AnimatedPage from './components/AnimatedPage';
import { Link } from 'react-router-dom';
import { max, setWith } from 'lodash';



function SplitTree() {
    const graph_container = useRef();
    const graph_container2 = useRef();
    const tree_container = useRef();
    const tree_container2 = useRef();
    const tree_container3 = useRef();
    const [components, setComponents] = useState([]);
    const [separator, setSeparator] = useState([]);
    const [width, setWidth] = useState(0);
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
        g.W = w.bag;
        g2.W = w.bag;
  
        g2.render();

        let X = removed_nodes.map(node => node.id).sort((a, b) => a - b);
        let C = g2.find_components();

        while(C.length>3){
            let li = C.length-1;
            let comb = [...C[li - 1], ...C[li]];
            C.splice(li - 1, 2, comb);
        }

        t.X = X;
        t.C = C;
        g.X = X;
        g.C = C;
        g2.X = X;
        g2.C = C;
        g.render();
        t.render();
        g.svg_set_component_color();
        g2.svg_set_component_color();

        setSeparator(X);
        setComponents(C);

        // Add an event listener to the nodes to handle the click event
        g.svg_nodes.on("click", function() {

            const node = d3.select(this);
            const node_id = parseInt(node.attr("idx"));

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


            X = removed_nodes.map(node => node.id).sort((a, b) => a - b);
            C = g2.find_components(true);
            
            t.X = X;
            t.C = C;
            g.X = X;
            g.C = C;
            g2.X = X;
            g2.C = C;
            t.render();
            g.svg_set_component_color();
            g2.svg_set_component_color();


            const treex = t.find_TX();

            // union T U TX
            const treeux = {nodes: [], edges: tree.edges}
            tree.nodes.forEach(node => {
                const nodex = treex.nodes.find(nodex => nodex.name === node.name);
                const nodeux = {"id": node.id, "name": node.name, "bag": node.bag.concat(nodex.bag)}
                treeux.nodes.push(nodeux);
            });

            // swap treeux for treex if desired
            const tx = new Tree(treeux, d3.select(tree_container3.current));
            tx.X = X;
            tx.C = C;
            const treexn    = treex.nodes.find(node => node.name === "W");
            treexn.y_div    = 3.1;
            treexn.y_offset = -1;
            tx.render();



            const Tp = T_2_TD(treeux, C, X);
            const t2  = new Tree(Tp, d3.select(tree_container2.current));
            t2.X = X;
            t2.C = C;
            t2.render();

            




            // update elements
            
            setWidth(Tp.nodes.reduce((acc, node) => Math.max(acc, node.bag.length-1), 0))
            setSeparator(X);
            setComponents(C);
        });


    }, []);

  return (
    <>
    <AnimatedPage>

    <div className='sidebar'><div className='sidebar_bubble'>
        <h2>Splitting <InlineMath math="T \cup T^X"/></h2>
        <p>By applying the updated method to guarantee that <InlineMath math="T'"/> will 
        satisfy the criteria for being a tree decompositions, we can 
        now observe a valid <InlineMath math="T'"/> of a 
        chosen split of the graph <InlineMath math="G"/>.</p>
        <hr/>
            <h2>Exercises</h2>
            <h4>Description</h4>
            <p>Try selecting different separators in graph <InlineMath math="G"/> and observe the resulting tree decompositions of <InlineMath math="T'"/> being made to the right. 
                Find a split of G that gives a tree decomposition <InlineMath math="T'"/> with width=4. (Width of a tree decomposition is the size of the largest bag minus 1)</p>
            <h4>Tasks</h4>
            <div className='task'>
                <span>Find width of <InlineMath math={"T'=4"}/></span>
                <span><InlineMath math={width.toString() + "=4"}/></span>
                <ion-icon name={width===4? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
            </div>
            <h4>Variables</h4>
        <div className='items'><div>
            <InlineMath math={"X  = \\{"}/>
            <div className={"X"}><InlineMath math={separator.toString()} /></div>
            <InlineMath math={"\\}"}/>
        </div></div>
        {components.map((item, idx) => {
            return (
                <React.Fragment key={idx}>
                    <div className='items'><div>
                    <InlineMath math={"C_"+(idx+1).toString()+" = \\{"} />
                    <div className={"C"+(idx+1).toString()}><InlineMath math={item.toString()} /></div>
                    <InlineMath math={"\\}"} />
                    </div></div>
                </React.Fragment>
            )})}
        {/* <br/> */}
        {/* {components.map((item, idx) => {
            const CW = item.filter(e => w.bag.includes(e));
            const s = "C_"+(idx+1).toString()+"\\cap W = \\{";
            const m = CW.toString();
            const e = "\\}";
            return (
            <React.Fragment key={idx}>
                <div className='items'><div>
                <InlineMath math={s} />
                <div className={"C"+(idx+1).toString()}><InlineMath math={m} /></div>
                <InlineMath math={e} />
                </div></div>
            </React.Fragment>
        )})} */}
        <br/><hr/>
        {(width === 4) ?
        <><Link to="/min-split" className='button'>Continue<ion-icon name="arrow-forward-outline"></ion-icon></Link><br/><i>Next: Minimum Split</i></>
        :
        <><Link to="/min-split" className='button disable'>Skip<ion-icon name="arrow-forward-outline"></ion-icon></Link><br/><i>Next: Minimum Split</i></>
        }
    </div></div>
    <div className='content'>
        <div className='horizontal-split w1-3'>
            <div className='svg_container interactive active'>
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
            <div className='svg_container'>
                <div className='svg_label'>Tree Decomposition - <InlineMath math="T \cup T^X"/></div>
                <svg ref={tree_container3} className="cy tree" width="100%" height="100%"></svg>
            </div>
        </div>
        <div className='wall'><ion-icon name="arrow-forward-outline"></ion-icon></div>

        <div className='svg_container w2-3'>
            <div className='svg_label'>Tree Decomposition - <InlineMath math="T'"/></div>
            <div className={'svg_counter  ' + (width===4 ? "valid" : "invalid")}>
                <InlineMath math={"Width="+width.toString()}/>
                </div>
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
export default SplitTree;