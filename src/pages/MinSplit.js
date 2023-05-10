import React, { useEffect, useRef, useState } from 'react';
// import graph from '../graphs/graph1.json'
// import tree from '../graphs/graph1-tree.json'



import graph1 from '../graphs/graph1.json'
import graph2 from '../graphs/graphBS2small.json'
import graph3 from '../graphs/graphBS3.json'

import tree1 from '../graphs/graph1-tree.json'
import tree2 from '../graphs/graphBS2-tree.json'
import tree3 from '../graphs/graphBS3-tree.json'


// import graph from '../graphs/graph-X.json'
// import tree from '../graphs/graph-X-tree.json'
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import * as d3 from 'd3';
import {Graph, Tree} from "../classes.js"
import {split, T_2_TD, correcto} from "../functions.js"
import AnimatedPage from './components/AnimatedPage';
import { Link } from 'react-router-dom';
import { max, setWith } from 'lodash';
import SB from './components/SB';


function MinSplit() {
    
    const max_length = 10;
    const graph_container = useRef();
    const graph_container2 = useRef();
    const tree_container = useRef();
    const tree_container2 = useRef();
    const tree_container3 = useRef();
    const [isFocus, setIsFocus] = useState(true);
    const [components, setComponents] = useState([]);
    const [separator, setSeparator] = useState([]);
    const [tasks, set_tasks] = useState([false, false, false]);
    const [dX, set_dX] = useState(0);

    const [page_state, set_page_state] = useState(1);
    const [state_W, set_state_W] = useState([]);
    const tab = useRef();

    function init_exercise(graph, tree, min_x, min_dx) {
        const W = tree.nodes.find(node => node.name === "W");
        set_state_W(W.bag);

        let removed_nodes = [];
        let removed_links = [];
       
        const g  = new Graph(graph, d3.select(graph_container.current));
        const g2 = new Graph(graph, d3.select(graph_container2.current));
        const t  = new Tree(tree, d3.select(tree_container.current));
        g.W = W.bag;
        g2.W = W.bag;
  
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
        // set dX on graph
        g.dX = true;
        g.render();
        t.render();
        g.svg_set_component_color();
        g2.svg_set_component_color();

        let dX = X.reduce((zum, cur) => zum + graph.nodes.find(node => node.id === cur).dx, 0);
        setSeparator(X);
        set_dX(dX);
        setComponents(C);

        set_tasks([
            (C.length>=2 && C.reduce((acc, x)=> Math.max(acc, x.filter(y => W.bag.includes(y)).length), 0) <= (W.bag.length/2)),
            (separator.length<=3),
            (dX <= 0)
        ])

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
            t2.charge = - 2000;
            t2.render();


            // update elements
            let dX = X.reduce((zum, cur) => zum + graph.nodes.find(node => node.id === cur).dx, 0);
            setSeparator(X);
            set_dX(dX);
            setComponents(C);

            let task1 = (C.length>=2 && C.reduce((acc, x)=> Math.max(acc, x.filter(y => W.bag.includes(y)).length), 0) <= (W.bag.length/2));
            let task2 = (X.length<=min_x);
            let task3 = (dX <= min_dx);
            set_tasks([task1,task2,task3]);
            if(task1 && task2 && task3) correcto(event.clientX, event.clientY, "Perfect!");
        });
    }

    useEffect(() => {
        switch (page_state) {
            case 1:
                init_exercise(graph1, tree1, 3, 0);
                break;
            case 2:
                init_exercise(graph2, tree2, 3, 0);
                break;
            case 3:
                init_exercise(graph3, tree3, 2, 0);
                break;
            default:
                set_page_state(1);
                break;
          }
        setTimeout(() => {tab.current.style.left = (37*page_state-37).toString() + "px"}, 2);
    }, [page_state]);

  return (
    <>
    <AnimatedPage>

    <div className='sidebar'><div className='sidebar_bubble'><SB style={{ height: '100vh', width: '100vw' }}>
        <h2>Minimum Split</h2>
        <p>As seen on the previous page, not all splits produce tree decompositions of equal quality.</p>
        <p>The algorithm evaluates the quality of a split by 
            prioritizing two criteria: first, it minimizes the size of the balanced separator set <InlineMath math="X"/>; and 
            second, it minimizes the sum of distances, <InlineMath math="d(X)"/>, from the homebag of each vertex in <InlineMath math="X"/> to the 
            bag <InlineMath math="W"/> in <InlineMath math="T"/>.
        </p>
        <p>A split found this way is considered to be a minimum split.</p>
        <hr/>
            <h2>Exercises</h2>
            <ul className="mytabs">
                <div className={page_state===1?"tab active":"tab"} onClick={() => set_page_state(1)}>1</div>
                <div className={page_state===2?"tab active":"tab"} onClick={() => set_page_state(2)}>2</div>
                <div className={page_state===3?"tab active":"tab"} onClick={() => set_page_state(3)}>3</div>
                <div id="tab-selector" ref={tab}/>
            </ul>
            <div className='exercise'>
                <p><i>A number is placed at the bottom right 
                    of each vertex, indicating the distance 
                    from its home bag to <InlineMath math="W"/> in <InlineMath math="T"/>.
                    We want to minimize the summed distance of <InlineMath math="X"/> in task 3.</i></p>
                <h4>Description</h4>
                <p>Find a balanced separator that gives a minimum split.</p>
                <h4>Tasks</h4>
                <div className='task'>
                    <span>1.<InlineMath math="\quad \forall i: |W \cap C_i| \leq |W|/2"/>.</span>
                    <ion-icon name={tasks[0] ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
                </div>
                <div className='task'>
                    <span>2.<InlineMath math="\quad"/>Minimize <InlineMath math="|"/><span className='X'><InlineMath math="X"/></span><InlineMath math="|"/>.</span>
                    <ion-icon name={(tasks[0] && tasks[1]) ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
                </div>
                <div className='task'>
                    <span>3.<InlineMath math="\quad"/>Minimize <InlineMath math="d("/><span className='X'><InlineMath math="X"/></span><InlineMath math=")"/>.</span>
                    <ion-icon name={(tasks[0] && tasks[1] && tasks[2]) ? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
                </div>
                <h4>Variables</h4>
                <div className='items'>
                    <div><InlineMath math={"|W|/2 = " + (state_W.length/2).toString()}/></div>
                    <div><InlineMath math={"|"}/> <span className="X"><InlineMath math={"X"}/></span> <InlineMath math={"| = " + separator.length.toString()}/></div>
                    <div><InlineMath math={"d("}/> <span className="X"><InlineMath math={"X"}/></span> <InlineMath math={") = " + dX.toString()}/></div>
                   
                </div>
                <div className='items'>
                    <div>
                        <span className="X" style={{marginRight: "4px"}}><InlineMath math={"X"}/></span><InlineMath math={"  = \\{"}/>
                        {separator.length<=max_length 
                        ? <div className={"X"}><InlineMath math={separator.toString()} /></div>
                        : <div className={"X"}><InlineMath math={separator.slice(0,max_length).toString() + ", ..."} /></div>
                        }
                        <InlineMath math={"\\}"}/>
                    </div>
                </div>
            {components.map((item, idx) => {
                return (
                    <React.Fragment key={idx}>
                        <div className='items'><div>


                        <span className={"C"+(idx+1).toString()}  style={{marginRight: "4px"}}>
                        <InlineMath math={"C_"+(idx+1).toString()}/></span>
                        <InlineMath math={" = \\{"} />
                        {
                        item.length<=max_length 
                        ? <div className={"C"+(idx+1).toString()}><InlineMath math={item.toString()} /></div>
                        : <div className={"C"+(idx+1).toString()}><InlineMath math={item.slice(0,max_length).toString() + ", ..."} /></div>
                        }
                        <InlineMath math={"\\}"} />
                        </div></div>
                    </React.Fragment>
                )})}
            {page_state === 1 && <>
                {(tasks[0] && tasks[1] && tasks[2]) ?
                <><button className='button focus' onClick={() => {set_page_state(2)}}>Continue<ion-icon name="arrow-forward-outline"></ion-icon></button><br/><i>Next: Exercise 2</i></>
                :
                <><button className='button disable'  onClick={() => {set_page_state(2)}}>Skip<ion-icon name="arrow-forward-outline"></ion-icon></button><br/><i>Next: Exercise 2</i></>}
            </>}
            {page_state === 2 && <>
                {(tasks[0] && tasks[1] && tasks[2]) ?
                <><button className='button focus' onClick={() => {set_page_state(3)}}>Continue<ion-icon name="arrow-forward-outline"></ion-icon></button><br/><i>Next: Exercise 3</i></>
                :
                <><button className='button disable'  onClick={() => {set_page_state(3)}}>Skip<ion-icon name="arrow-forward-outline"></ion-icon></button><br/><i>Next: Exercise 3</i></>}
            </>}
        </div>
        
        {page_state === 3 && <>
            <br/><hr/>
            {(tasks[0] && tasks[1] && tasks[2]) ?
            <><Link to="/pruning" className='button'>Continue<ion-icon name="arrow-forward-outline"></ion-icon></Link><br/><i>Next: Pruning Operation</i></>
            :
            <><Link to="/pruning" className='button disable'>Skip<ion-icon name="arrow-forward-outline"></ion-icon></Link><br/><i>Next: Pruning Operation</i></>}
        </>}

    </SB></div></div>
    <div className='svg_container hidden'>
        <svg id="yolo" ref={graph_container2} className="cy graph" width="100%" height="100%"></svg>
        <div className='svg_label'>Components - <InlineMath math="C_1, ..., C_h"/></div>
    </div>
    <div className='content'>
        <div className='horizontal-split'>
            <div className={isFocus?'svg_container interactive active focus-svg':'svg_container interactive active'}>
                <svg id="nolo" ref={graph_container} className="cy graph"></svg>
                <div className='svg_label'>
                    Graph - <InlineMath math="G"/> 
                    <InlineMath math={"\\quad\\quad |X|="+separator.length}/>
                    <InlineMath math={"\\quad\\quad d(X)="+dX}/>
                </div>
            </div>
            <div className='vertical-split'>
                <div className='svg_container'>
                    <div className='svg_label'>Tree Decomposition - <InlineMath math="T"/></div>
                    <svg ref={tree_container} className="cy tree"></svg>
                </div>
                <div className='wall'><ion-icon name="arrow-forward-outline"></ion-icon></div>

                <div className='svg_container'>
                    <div className='svg_label'>Tree Decomposition - <InlineMath math="T \cup T^X"/></div>
                    <svg ref={tree_container3} className="cy tree" ></svg>
                </div>
            </div>
        </div>
        <div className='wall'><ion-icon name="arrow-forward-outline"></ion-icon></div>

        <div className='svg_container'>
            <div className='svg_label'>Tree Decomposition - <InlineMath math="T'"/></div>
   
            <svg ref={tree_container2} className="cy tree" width="100%" height="100%"></svg>
        </div>
    </div>
    </AnimatedPage>

    </>
  );
}
export default MinSplit;