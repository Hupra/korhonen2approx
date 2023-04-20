import React, { useEffect, useRef, useState } from 'react';
// import graph from '../graphs/intro-treedecomposition-graph.json'
import graph from '../graphs/graph1.json'
import tree from '../graphs/intro-treedecomposition-tree.json'
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import * as d3 from 'd3';
import {Graph, Tree} from "../classes.js"
import {split} from "../functions.js"
import AnimatedPage from './components/AnimatedPage';
import { Link } from 'react-router-dom';
import SB from './components/SB';

function Separators() {
    const graph_container = useRef();
    const graph_container2 = useRef();
    const [components, setComponents] = useState([]);
    const [separator, setSeparator] = useState([]);
    const w = tree.nodes.find(node => node.name === "W");
    
    useEffect(() => {
        let removed_nodes = [];
        let removed_links = [];
        const g  = new Graph(graph,  d3.select(graph_container.current));
        const g2 = new Graph(graph, d3.select(graph_container2.current));
        g.render();
        g2.render();

        let X = removed_nodes.map(node => node.id).sort((a, b) => a - b);
        let C = g2.find_components();

        // const fake_W = graph.nodes.map(node => node.id);
        // g.W = fake_W;
        g.X = X;
        g.C = C;
        g2.X = X;
        g2.C = C;
        
        g.render();
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
            // node.classed("highlight", !node.classed("highlight"));
            g2.render();

            X = removed_nodes.map(node => node.id).sort((a, b) => a - b);
            C = g2.find_components();
            console.log(C);
            g.X = X;
            g.C = C;
            g2.X = X;
            g2.C = C;
            g.svg_set_component_color();
            g2.svg_set_component_color();

            setSeparator(X);
            setComponents(C);
        });


    }, []);

    
            
    

  return (
    <>
    <AnimatedPage>
    <div className='sidebar'><div className='sidebar_bubble'><SB style={{ height: '100vh', width: '100vw' }}>
        <h2>Separators</h2>
        
        <p>A separator is a set of vertices <InlineMath math="X"/> in <InlineMath math="G"/> that when removed, splits <InlineMath math="G"/> into multiple separated components. 
        We denote these components as <InlineMath math="C_1,...,C_h"/> where <InlineMath math="h"/> represents the number of components.
        </p><hr></hr>
        <h2>Exercises</h2>
        <h4>Description</h4>
        
        <p>Click on the vertices within graph <InlineMath math="G"/> to toggle their inclusion in the separator <InlineMath math="X"/></p>

        <h4>Tasks</h4>
        <div className='task'>
            <span>Split into 2 components.</span>
            <ion-icon name={components.length>=2? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
        </div>


        
        {components.length>=2 ?
            <div className='task'>
                <span>Split into 3 components.</span>
                <ion-icon name={components.length>=3? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
            </div>
            :
            <div className='task locked'>
                <div><ion-icon name="lock-closed-outline" checkmark-circle></ion-icon></div>
            </div>
        }
        
        {components.length>=3 ?
        <div className='task'>
            <span>Split into 4 components.</span>
            <ion-icon name={components.length>=4? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
        </div>
        :
        <div className='task locked'>
            <div><ion-icon name="lock-closed-outline" checkmark-circle></ion-icon></div>
        </div>
        }
        <h4>Variables</h4>
        <div className='items'><div>
            <InlineMath math={"X  = \\{"}/>
            <div className={"X"}><InlineMath math={separator.toString()} /></div>
            <InlineMath math={"\\}"}/>
        </div></div>
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
                <div className='items'><div>
                <InlineMath math={"C_"+(idx+1).toString()+"=\\{"} />
                <div className={"C"+(idx+1).toString()}><InlineMath math={item.toString()} /></div>
                <InlineMath math={e} />
                </div></div>
            </React.Fragment>
        )})}
        <br/>
        <hr/>
        {components.length>=4 ?
        <><Link to="/balanced-separators" className='button'>Continue<ion-icon name="arrow-forward-outline"></ion-icon></Link><br/><i>Next: Balanced Separators</i></>
        :
        <><Link to="/balanced-separators" className='button disable'>Skip<ion-icon name="arrow-forward-outline"></ion-icon></Link><br/><i>Next: Balanced Separators</i></>
        }

    </SB></div></div>
    <div className='content'>
        
        <div className='svg_container interactive active'>
            <svg id="nolo" ref={graph_container} className="cy" width="100%" height="100%"></svg>
            <div className='svg_label'>Graph - <InlineMath math="G"/></div>
        </div>
        <div className='wall'><ion-icon name="arrow-forward-outline"></ion-icon></div>
        <div className='svg_container'>
            <svg id="yolo" ref={graph_container2} className="cy" width="100%" height="100%"></svg>
            <div className='svg_label'>Components - <InlineMath math="C_1, ..., C_h"/></div>
        </div>
    </div>
    </AnimatedPage>
    </>
  );
}




export default Separators;