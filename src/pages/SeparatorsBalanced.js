import React, { useEffect, useRef, useState } from 'react';

import graph1 from '../graphs/graph1.json'
import graph2 from '../graphs/graphBS2.json'
import graph3 from '../graphs/graphBS3.json'

import graph1s from '../graphs/graph1.json'
import graph2s from '../graphs/graphBS2small.json'
import graph3s from '../graphs/graphBS3.json'

import tree1 from '../graphs/graph1-tree.json'
import tree2 from '../graphs/graphBS2-tree.json'
import tree3 from '../graphs/graphBS3-tree.json'


import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import * as d3 from 'd3';
import {Graph, Tree} from "../classes.js"
import {split, correcto} from "../functions.js"
import AnimatedPage from './components/AnimatedPage';
import { Link } from 'react-router-dom';
import SB from './components/SB';
import M from 'materialize-css';



function SeparatorsBalanced() {
    const graph_container = useRef();
    const graph_container2 = useRef();
    const tree_container = useRef();
    const info_svg = useRef();
    const [isFocus, setIsFocus] = useState(true);
    const [reset, set_reset] = useState(0);
    const [components, setComponents] = useState([]);
    const [separator, setSeparator] = useState([]);
    const [page_state, set_page_state] = useState(0);
    const [state_W, set_state_W] = useState([]);
    const tab = useRef();
    const max_length = 10;


    function init_exercise(graph, graphs, tree) {


        tree = JSON.parse(JSON.stringify(tree));
        let node = tree.nodes.find(node => node.name === "W");
        node.stuck = true;
        node.x = tree_container.current.clientWidth/2;
        node.y = tree_container.current.clientHeight*(2/5);
        


        // mini info svg:
        let blobs2 = []
        blobs2.push({ 
            "bags": [1],
            "class": "",
            "text": "Vertex in W",
            "offset": 10 });
        blobs2.push({ 
            "bags": [9],
            "class": "",
            "text": "Vertex not in W",
            "offset": 10 });

        let w = info_svg.current.clientWidth;
        let h = info_svg.current.clientHeight;
        
        let test = {
            nodes: [
                {id: 1, x: (w*(2/7)), y: 10+(h*(1/2)), stuck: true},
                {id: 9, x: (w*(5/7)), y: 10+(h*(1/2)), stuck: true}
            ], 
            edges: []}
    
        const info = new Graph(test, d3.select(info_svg.current));
        info.blobs = blobs2;
        info.C = [[1,9],[],[]];
        info.X = [];
        info.W = [1];
        info.render();
        ///////////////////////////////////

        





        const W = tree.nodes.find(node => node.name === "W");
        set_state_W(W.bag);

        let removed_nodes = [];
        let removed_links = [];
        let nodes1 = graph.nodes.map(node => W.bag.some(x => x === node.id) ? {...node, color: W.color} : node);       
        let graph1 = {nodes: nodes1, edges: graph.edges}

        const g  = new Graph(graph1, d3.select(graph_container.current));
        const g2 = new Graph(graphs, d3.select(graph_container2.current));
        const t  = new Tree(tree, d3.select(tree_container.current));
        g.W = W.bag;
        g2.W = W.bag;
        
        g2.render();

        let X = removed_nodes.map(node => node.id).sort((a, b) => a - b);
        let C = g2.find_components();

        t.X = X;
        t.C = C;
        g.X = X;
        g.C = C;
        g2.X = X;
        g2.C = C;


        let blobs = []
        for (let i = 0; i < C.length; i++) {
            blobs.push({ "bags": C[i], "class": "outline-C" + (i+1).toString(), "text": "C" + (i+1).toString(), "offset": 50 });
        }
        g2.blobs = blobs;

        g.render();
        t.render();
        g.svg_set_component_color();
        g2.svg_set_component_color();

        setSeparator(X);
        setComponents(C);
        

        // Add an event listener to the nodes to handle the click event
        g.svg_nodes.on("click", function(event, d) {
            setIsFocus(false);

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
            t.X = X;
            t.C = C;
            g.X = X;
            g.C = C;
            g2.X = X;
            g2.C = C;
            t.render();
            g.svg_set_component_color();
            g2.svg_set_component_color();

            let blobs = []
            for (let i = 0; i < C.length; i++) {
                blobs.push({ "bags": C[i], "class": "outline-C" + (i+1).toString(), "text": "C" + (i+1).toString(), "offset": 50 });
            }
            g2.blobs = blobs;

            setSeparator(X);
            setComponents(C);
            if(C.reduce((acc, x)=> Math.max(acc, x.filter(y => W.bag.includes(y)).length), 0)<=W.bag.length/2) correcto(event.clientX, event.clientY, "Perfect!")
        });
    }

    useEffect(() => {
        switch (page_state) {
            case 1:
                init_exercise(graph1, graph1s, tree1);
                break;
            case 2:
                init_exercise(graph2, graph2s, tree2);
                break;
            case 3:
                init_exercise(graph3, graph3s, tree3);
                break;
            default:
                set_page_state(1);
                break;
          }

        setTimeout(() => {tab.current.style.left = (37*page_state-37).toString() + "px"}, 2);
    }, [page_state, reset]);


    function mi(x) {
        if(x === "G") graph_container.current.parentNode.classList.add('reftar');
        if(x === "T") tree_container.current.parentNode.classList.add('reftar');
    }
    function mo() {
        graph_container.current.parentNode.classList.remove('reftar');
        tree_container.current.parentNode.classList.remove('reftar');
    }
          
  return (
    <>
    <AnimatedPage>
    <div className='sidebar'><div className='sidebar_bubble'><SB style={{ height: '100vh', width: '100vw' }}>
        <h2>Balanced Separators</h2>
        <p>A <InlineMath math="{balanced}"/> separator <InlineMath math="X"/> of the bag <InlineMath math="W"/> in <InlineMath math="T"/> is 
        a separator that, when removed from <InlineMath math="G"/>, splits the vertices of <InlineMath math="G"/> into 
        components so that no more than half of the vertices of <InlineMath math="W"/> are placed in a single component.
        <br/>More precisely <InlineMath math="\forall i: |W \cap C_i| \leq |W|/2"/>.</p>
        <hr/><br></br>
        <p><i>Vertices are marked with a <InlineMath math="W"/> if they are 
        in the bag <InlineMath math="W"/> in <span className='ref' onMouseOver={() => mi("T")} onMouseOut={() => mo("T")}><InlineMath math="T"/></span>.</i></p>
        
        <div className='small-svg' style={{height: "100px"}}>
        <svg ref={info_svg} className="cy" width="100%" height="100%"></svg>
        </div>
        <h2 style={{marginTop: "10px"}}>Exercises</h2>

        <ul className="mytabs">
            <div className={page_state===1?"tab active":"tab"} onClick={() => set_page_state(1)}>1</div>
            <div className={page_state===2?"tab active":"tab"} onClick={() => set_page_state(2)}>2</div>
            <div className={page_state===3?"tab active":"tab"} onClick={() => set_page_state(3)}>3</div>
            <div id="tab-selector" ref={tab}/>
        </ul>



    { page_state===1 && <div className='exercise'>

       {/* <p>A bag <InlineMath math="W"/> is consider <i>spittable</i> if <InlineMath math="|(C_i \cap W) \cup X| < |W|"/> for all</p> */}
        <h4>Description</h4>
        <p>Click on the vertices in <span className='ref' onMouseOver={() => mi("G")} onMouseOut={() => mo("G")}><InlineMath math="G"/></span> to toggle their 
        inclusion in the balanced separator <InlineMath math="X"/> of <InlineMath math="W"/>.</p>
        <h4>Tasks</h4>
        <div className='task'>
            <span>Split into at least 2 components.</span>
            <ion-icon name={components.length>=2? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
        </div>
        <div className='task'>
            <span><InlineMath math="\forall i: |W \cap C_i| \leq |W|/2"/>.</span>
            <ion-icon name={components.length>=2 && components.reduce((acc, x)=> Math.max(acc, x.filter(y => state_W.includes(y)).length), 0)
            <=state_W.length/2 ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
        </div>

    <h4>Variables</h4>
    <div className='items'><div>
        <span className="X" style={{marginRight: "4px"}}><InlineMath math={"X"}/></span><InlineMath math={"  = \\{"}/>
        {separator.length<=max_length 
        ? <div className={"X"}><InlineMath math={separator.toString()} /></div>
        : <div className={"X"}><InlineMath math={separator.slice(0,max_length).toString() + ", ..."} /></div>
        }
        <InlineMath math={"\\}"}/>
    </div>

    <InlineMath math={"|W|/2  = " + (state_W.length/2).toString()}/>
    </div>

        {components.map((item, idx) => {
            const CW = item.filter(e => state_W.includes(e));
            const m = CW.length<=max_length ? CW.toString() : CW.slice(0,max_length).toString() + ", ...";
            const e = "\\}";
            return (
            <React.Fragment key={idx}>
                <div className='items'>
                    <div>
                        <span className={"C"+(idx+1).toString()} style={{marginRight: "3px"}}><InlineMath math={"C_"+(idx+1).toString()}/></span>
                        <span style={{marginRight: "4px"}}><InlineMath math={"\\cap"}/></span> <span><InlineMath math={"W = \\{"} /></span>
                        <div className={"C"+(idx+1).toString()}><InlineMath math={m} /></div>
                        <InlineMath math={e} />
                    </div>
                    <div>
                        <InlineMath math={"|"}/><span className={"C"+(idx+1).toString()} style={{marginRight: "3px"}}><InlineMath math={"C_"+(idx+1).toString()}/></span>
                        <span style={{marginRight: "4px"}}><InlineMath math={"\\cap"}/></span> <span><InlineMath math={"W| = " + CW.length.toString()} /></span>
                        
                    </div>
                </div>
            </React.Fragment>
        )})}
        <br/>

        {components && components.reduce((acc, x)=> Math.max(acc, x.filter(y => state_W.includes(y)).length), 0)<= (state_W.length)/2 ?
        <><button className='button focus' onClick={() => {set_page_state(2)}}>Continue<ion-icon name="arrow-forward-outline"></ion-icon></button><br/><i>Next: Exercise 2</i></>
        :
        <><button className='button disable'  onClick={() => {set_page_state(2)}}>Skip<ion-icon name="arrow-forward-outline"></ion-icon></button><br/><i>Next: Exercise 2</i></>
        }

    </div>}








    { page_state===2 && <div className='exercise'>

        {/* <p>A bag <InlineMath math="W"/> is consider <i>spittable</i> if <InlineMath math="|(C_i \cap W) \cup X| < |W|"/> for all</p> */}
        <h4>Description</h4>
        <p>Click on the vertices in <span className='ref' onMouseOver={() => mi("G")} onMouseOut={() => mo("G")}><InlineMath math="G"/></span> to toggle their 
        inclusion in the balanced separator <InlineMath math="X"/> of <InlineMath math="W"/>.</p>
        <h4>Tasks</h4>
        <div className='task'>
            <span>Split into at least 2 components.</span>
            <ion-icon name={components.length>=2? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
        </div>
        <div className='task'>
            <span><InlineMath math="\forall i: |W \cap C_i| \leq |W|/2"/>.</span>
            <ion-icon name={components.length>=2 && components.reduce((acc, x)=> Math.max(acc, x.filter(y => state_W.includes(y)).length), 0)
            <=state_W.length/2 ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
        </div>

        <h4>Variables</h4>
        <div className='items'><div>
        <span className="X" style={{marginRight: "4px"}}><InlineMath math={"X"}/></span><InlineMath math={"  = \\{"}/>
        {separator.length<=max_length 
        ? <div className={"X"}><InlineMath math={separator.toString()} /></div>
        : <div className={"X"}><InlineMath math={separator.slice(0,max_length).toString() + ", ..."} /></div>
        }
        <InlineMath math={"\\}"}/>
        </div>

        <InlineMath math={"|W|/2  = " + ((state_W.length)/2).toString()}/>
        </div>

        {components.map((item, idx) => {
            const CW = item.filter(e => state_W.includes(e));
            const m = CW.length<=max_length ? CW.toString() : CW.slice(0,max_length).toString() + ", ...";
            const e = "\\}";
            return (
            <React.Fragment key={idx}>
                <div className='items'>
                    <div>
                        <span className={"C"+(idx+1).toString()} style={{marginRight: "3px"}}><InlineMath math={"C_"+(idx+1).toString()}/></span>
                        <span style={{marginRight: "4px"}}><InlineMath math={"\\cap"}/></span> <span><InlineMath math={"W = \\{"} /></span>
                        <div className={"C"+(idx+1).toString()}><InlineMath math={m} /></div>
                        <InlineMath math={e} />
                    </div>
                    <div>
                        <InlineMath math={"|"}/><span className={"C"+(idx+1).toString()} style={{marginRight: "3px"}}><InlineMath math={"C_"+(idx+1).toString()}/></span>
                        <span style={{marginRight: "4px"}}><InlineMath math={"\\cap"}/></span> <span><InlineMath math={"W| = " + CW.length.toString()} /></span>
                        
                    </div>
                </div>
            </React.Fragment>
        )})}

        <br/>
        {components && components.reduce((acc, x)=> Math.max(acc, x.filter(y => state_W.includes(y)).length), 0)<= (state_W.length)/2 ?
        <><button className='button focus' onClick={() => {set_page_state(3)}}>Continue<ion-icon name="arrow-forward-outline"></ion-icon></button><br/><i>Next: Exercise 3</i></>
        :
        <><button className='button disable'  onClick={() => {set_page_state(3)}}>Skip<ion-icon name="arrow-forward-outline"></ion-icon></button><br/><i>Next: Exercise 3</i></>
        }
    </div>}





    { page_state===3 && <div className='exercise'>

    {/* <p>A bag <InlineMath math="W"/> is consider <i>spittable</i> if <InlineMath math="|(C_i \cap W) \cup X| < |W|"/> for all</p> */}
    <h4>Description</h4>
    <p>Click on the vertices in <span className='ref' onMouseOver={() => mi("G")} onMouseOut={() => mo("G")}><InlineMath math="G"/></span> to toggle their 
    inclusion in the balanced separator <InlineMath math="X"/> of <InlineMath math="W"/>.</p>
    <h4>Tasks</h4>
    <div className='task'>
        <span>Split into at least 2 components.</span>
        <ion-icon name={components.length>=2? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
    </div>
    <div className='task'>
        <span><InlineMath math="\forall i: |W \cap C_i| \leq |W|/2"/>.</span>
        <ion-icon name={components.length>=2 && components.reduce((acc, x)=> Math.max(acc, x.filter(y => state_W.includes(y)).length), 0)
        <=state_W.length/2 ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
    </div>

    <h4>Variables</h4>
    <div className='items'><div>
    <span className="X" style={{marginRight: "4px"}}><InlineMath math={"X"}/></span><InlineMath math={"  = \\{"}/>
    {separator.length<=max_length 
        ? <div className={"X"}><InlineMath math={separator.toString()} /></div>
        : <div className={"X"}><InlineMath math={separator.slice(0,max_length).toString() + ", ..."} /></div>
    }
    <InlineMath math={"\\}"}/>
    </div>

    <InlineMath math={"|W|/2  = " + ((state_W.length)/2).toString()}/>
    </div>

    {components.map((item, idx) => {
            const CW = item.filter(e => state_W.includes(e));
            const m = CW.length<=max_length ? CW.toString() : CW.slice(0,max_length).toString() + ", ...";
            const e = "\\}";
            return (
            <React.Fragment key={idx}>
                <div className='items'>
                    <div>
                        <span className={"C"+(idx+1).toString()} style={{marginRight: "3px"}}><InlineMath math={"C_"+(idx+1).toString()}/></span>
                        <span style={{marginRight: "4px"}}><InlineMath math={"\\cap"}/></span> <span><InlineMath math={"W = \\{"} /></span>
                        <div className={"C"+(idx+1).toString()}><InlineMath math={m} /></div>
                        <InlineMath math={e} />
                    </div>
                    <div>
                        <InlineMath math={"|"}/><span className={"C"+(idx+1).toString()} style={{marginRight: "3px"}}><InlineMath math={"C_"+(idx+1).toString()}/></span>
                        <span style={{marginRight: "4px"}}><InlineMath math={"\\cap"}/></span> <span><InlineMath math={"W| = " + CW.length.toString()} /></span>
                        
                    </div>
                </div>
            </React.Fragment>
        )})}

    </div>}

{
    page_state===3 ? <>
        <br/><hr/>
        <p>
            <i>
            Now that you know how to find a balanced separator, 
            the next page will teach you to combine the resulting components to create a split of W.
            </i>
        </p>
        {components && components.reduce((acc, x)=> Math.max(acc, x.filter(y => state_W.includes(y)).length), 0)<=((state_W.length)/2) ?
        <><Link to="/connect-components" className='button'>Continue<ion-icon name="arrow-forward-outline"></ion-icon></Link><br/><i>Next: Combining Components</i></>
        :
        <><Link to="/connect-components" className='button disable'>Skip<ion-icon name="arrow-forward-outline"></ion-icon></Link><br/><i>Next: Combining Components</i></>
        }
    </> : ""
}




    </SB></div></div>
    <div className='content'>
        <div className={isFocus ? "svg_container interactive active focus-svg":'svg_container interactive active'}>
            <svg id="nolo" ref={graph_container} className="cy graph" width="100%" height="100%"></svg>
            <div className='svg_reset' onClick={()=>set_reset(reset+1)}><ion-icon name="refresh-outline"></ion-icon></div>
            <div className='svg_label'>Graph - <InlineMath math="G"/></div>
        </div>
        <div className='wall'><ion-icon name="arrow-forward-outline"></ion-icon></div>

        <div className='horizontal-split'>
            <div className='svg_container'>
                <svg id="yolo" ref={graph_container2} className="cy graph"></svg>
                <div className='svg_label'>Components - <InlineMath math="C_1, ..., C_h"/></div>
            </div>
            <div className='svg_container'>
                <svg ref={tree_container} className="cy tree"></svg>
                <div className='svg_label'>Tree Decomposition - <InlineMath math="T"/></div>
            </div>
        </div>

        
    </div>
    </AnimatedPage>
    </>
    
  );
}

export default SeparatorsBalanced;