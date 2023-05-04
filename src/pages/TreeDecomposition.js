import React, { useEffect, useRef, useState } from 'react';
import graph from '../graphs/intro-treedecomposition-graph.json'
import tree from '../graphs/intro-treedecomposition-tree.json'
// import graph from '../graphs/graph-X.json'
// import tree from '../graphs/graph-X-tree.json'
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import * as d3 from 'd3';
import {Graph, Tree} from "../classes.js"
import AnimatedPage from './components/AnimatedPage';
import { Link } from 'react-router-dom';
import SB from './components/SB';
import {correcto} from "../functions.js"


function fix_T(t, num) {
    let s = t.nodes.find(node => node.bag.includes(num));
    let visited = new Array(t.nodes.reduce((max, node) => Math.max(max, node.id), 0)+1).fill(false);
    function dig(node){
        visited[node.id] = true;

        let children = t.links
            .filter(edge => edge.source.id === node.id||edge.target.id === node.id)
            .map(edge => edge.source.id === node.id ? edge.target : edge.source)
            .filter(node => !visited[node.id]);

        let add = false;
        for (const child of children) {
            add += dig(child);
        }

        if(add && !node.bag.includes(num)) {
            node.bag.push(num);
        }

        return node.bag.includes(num);                    
    }
    dig(s);
}

class Lock {
    constructor() {
        this._locked = false;
        this._queue = [];
    }

    async lock() {
        if (this._locked) {
            await new Promise((resolve) => this._queue.push(resolve));
        }
        this._locked = true;
    }

    unlock() {
        if (this._queue.length > 0) {
            const resolve = this._queue.shift();
            resolve();
        } else {
            this._locked = false;
        }
    }
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function TreeDecomposition() {
    const graph_container = useRef();
    const tree_container = useRef();
    const [tasks, set_tasks] = useState([0, 0]);
    const [page_state, set_page_state] = useState(1);
    const tabsref = useRef();
    const tabref = useRef();

    let treee = JSON.parse(JSON.stringify(tree));


    
    
    useEffect(() => {
        let g = new Graph(graph, d3.select(graph_container.current));
        let t = new Tree(treee, d3.select(tree_container.current));

        const vertexLock = new Lock();

        let counter = 6;
        let tcounter = 4;

        function add_functionality(){
            g.svg_nodes.on("mouseover", function(event, d) {
                t.svg_set_node_class_if_contains("error", d.id);
            })
            .on("mouseout", function(event, d) {
                t.svg_set_node_class_if_contains("error", -1);
            });
            g.svg_links.on("mouseover", function(event, d) {
                t.svg_set_node_class_if_contains_pair("error", d.source.id, d.target.id);
            })
            .on("mouseout", function(event, d) {
                t.svg_set_node_class_if_contains("error", -1);
            });


            g.svg.on("click", async function(event) {
                await vertexLock.lock();

                const [x, y] = d3.pointer(event);
                add_vertex({id: ++counter, x, y});
                if((g.nodes.length-6===3 && g.links.length-6>=3)) correcto(event.clientX, event.clientY, "Perfect!");
                
                vertexLock.unlock();
            });

            g.svg_nodes.call(d3.drag()
                .on('start', (e,d) => 
                {
                    if (!e.active) g.simulation.alphaTarget(0.3).restart();
                    g.start_node = d;

                    const point = g.svg.node().createSVGPoint();
                    point.x = e.sourceEvent.clientX;
                    point.y = e.sourceEvent.clientY;
                    const {x, y} = point.matrixTransform(g.svg.node().getScreenCTM().inverse());
                    g.svg_temp_line.attr("x2", x).attr("y2", y);
                    g.svg_temp_line.attr("visibility", "visible");
                })
                .on('drag', (e,d) => 
                {
                    const point = g.svg.node().createSVGPoint();
                    point.x = e.sourceEvent.clientX;
                    point.y = e.sourceEvent.clientY;
                    const {x, y} = point.matrixTransform(g.svg.node().getScreenCTM().inverse());
                    g.svg_temp_line.attr("x2", x+2).attr("y2", y+5);
                })
                .on('end', async (e,d) => 
                {
                    if (!e.active) g.simulation.alphaTarget(0);
                    g.svg_temp_line.attr("visibility", "hidden");

                    const target = g.nodes.find(n => Math.hypot(n.x - e.x, n.y - e.y) < 20);
                    await vertexLock.lock();

                    if(target) {
                        const source = g.start_node;
                        let num = source.id;
                        let nam = target.id;
                        
                        console.log(num,nam);
                        console.log(t.nodes)
                        
                        // degree
                        let d_num = g.links.reduce((zum, edge) => (edge.source.id === num||edge.target.id===num) + zum, 0);
                        let d_nam = g.links.reduce((zum, edge) => (edge.source.id === nam||edge.target.id===nam) + zum, 0);

                        if(!d_num && !d_nam){
                            t.links = t.links.filter(edge => !(edge.source.bag.includes(num) || edge.target.bag.includes(num)));
                            t.nodes = t.nodes.filter(node => !node.bag.includes(num));
                            t.nodes.find(node => node.bag.includes(nam)).bag.push(num);
                        } else if(!d_num || !d_nam) {
                            if(d_nam<d_num){
                                let temp = num;
                                num = nam;
                                nam = temp;
                            }

                            t.links = t.links.filter(edge => !(edge.source.bag.includes(num) || edge.target.bag.includes(num)));
                            t.nodes = t.nodes.filter(node => !node.bag.includes(num));

                            let node = { "id": ++tcounter, "bag": [num,nam]};
                            let edge = { source: tcounter, target: t.nodes.find(n => n.bag.includes(nam)).id};

                            t.nodes.push(node);
                            let links = [...t.links];
                            links.push(edge);
                            t.links = links;

                        } else {
                            // instead of random, we should take the closest
                            let random_node = t.nodes.find(node => node.bag.includes(nam));
                            if(!random_node.bag.includes(num)) random_node.bag.push(num);
                            fix_T(t, num);
                        }

                        t.render();
                        add_edge({source: g.start_node.id, target: target.id});

                         if((g.nodes.length-6>=3 && g.links.length-6===3)) correcto(e.sourceEvent.clientX, e.sourceEvent.clientY, "Perfect!")
                    }
                    vertexLock.unlock();
                }
            ));
        }
    
        function add_vertex(vertex){
            g.nodes.push(vertex);
            g.render();
            add_functionality();
            // find smallest node
            let snode = t.nodes.reduce((best, cur) => (cur.bag.length<best.bag.length && cur.bag.length>1) ? cur : best, t.nodes[0]);

            t.nodes.push({id: ++tcounter, bag: [vertex.id]});

            let links = [...t.links];
            links.push({source: tcounter, target: snode.id});
            t.links = links;
            t.render();

            set_tasks([g.nodes.length-6, g.links.length-6]);
        }

        function add_edge(edge){
            let links = [...g.links];
            links.push(edge);
            g.links = links;
            g.render();
            add_functionality();

            set_tasks([g.nodes.length-6, g.links.length-6]);
        }
        
        
        g.render();
        t.render();

        add_functionality();

    }, []);

    useEffect(() => {

        const tabs = Array.from(tabsref.current.children).filter(child =>
            child.classList.contains('tab')
        );
        
        switch (page_state) {
            case 2:
                setTimeout(() => {
                    tabref.current.style.left = (tabs[0].offsetWidth+7).toString() + "px";
                    tabref.current.style.width = (tabs[1].offsetWidth-8).toString() + "px";
                }, 2);
                break;
            default:
                setTimeout(() => {
                    tabref.current.style.left = (0).toString() + "px";
                    tabref.current.style.width = (tabs[0].offsetWidth-8).toString() + "px";
                }, 2);
                break;
          }
    }, [page_state]);


  return (
    <>
    <AnimatedPage>

    <div className='sidebar'>
        <div className='sidebar_bubble'>
    <SB style={{ height: '100vh', width: '100vw' }}>

            <ul className="mytabs auto" ref={tabsref}>
                <div className={page_state===1?"tab active":"tab"} onClick={() => set_page_state(1)}>Explanation</div>
                <div className={page_state===2?"tab active":"tab"} onClick={() => set_page_state(2)}>Exercises</div>
            <div id="tab-selector" ref={tabref}/>
        </ul>

        {page_state === 1 && <>
        <h2 style={{marginTop: 0}}>Preface</h2>
        <p><i>We briefly explain tree decomposition and treewidth, 
            as these concepts are essential for the algorithm.</i></p>
        <h3>Tree Decomposition</h3>
        <div>
            For a graph <InlineMath math={'G=(V,E)'}/> a tree decomposition <InlineMath math={'T'}/> is a tree of <InlineMath math={'n'}/> nodes and <InlineMath math={'n'}/> bags, with each node pointing to exactly one bag. Additionally the following must be satisfied:
            <div>
            <ol>
                <li>
                For the bags <InlineMath math="B_1,...,B_n"/>, it must hold that <InlineMath math="B_i\subseteq V"/> and <InlineMath math="\bigcup\limits_{i=1}^{n} B_{i} = V"/>.
                </li>
                <li>
                For every edge <InlineMath math="(u,v)"/> in <InlineMath math="E"/> there must exist a bag such that <InlineMath math="\{u,v\} \subseteq B_i"/>.
                </li>
                <li>
                For every vertex <InlineMath math="v"/> contained in both bags <InlineMath math="B_i"/> and <InlineMath math="B_j"/>, the path in <InlineMath math="T"/> going from <InlineMath math="B_i"/> to <InlineMath math="B_j"/> must be of only bags containing <InlineMath math="v"/>.
                </li>
            </ol>
            </div>
        </div>

        
        An example of a such graph with a corresponding tree decomposition can be seen on the right side.
        <h3>Tree width</h3>
        <p>The width of a tree decomposition is defined as <InlineMath math="|largest"/> <InlineMath math="bag| − 1"/>, and the treewidth of a graph <InlineMath math="tw(G)"/> is the minimum width among all its valid tree decompositions.</p>
        <button className='button' onClick={() => {set_page_state(2)}}>Exercises<ion-icon name="arrow-forward-outline"></ion-icon></button><br/><i>Go to exercises</i>
               
        </>}

        {page_state === 2 && <>
            <h2 style={{marginTop: 0}}>Exercises</h2>
            <div className='exercise'>
                <i>
            <p>Play around with the graph "G" to the right and see 
                how the tree decomposition changes. You can interact 
                with the graph in the following ways:</p></i>
                <ol>
                    <li>
                        Position your cursor over the edges and vertices of 
                        the graph to view their impact on "T."
                    </li>
                    <li>
                        To introduce a new vertex to the graph "G," click 
                        on the desired location within the graph area.
                    </li>
                    <li>
                        To make an edge between two vertices, click on one vertex, 
                        hold the mouse button, and drag it to the other vertex, 
                        releasing the button.
                    </li>
                </ol>
                
            <h4>Description</h4>
            <p>Add at least 3 new vertices and edges to the graph.</p>
            <h4>Tasks</h4>
            <div className='task'>
                <span>Add 3 vertices.</span>
                <ion-icon name={tasks[0]>=3? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
            </div>
            <div className='task'>
                <span>Add 3 edges.</span>
                <ion-icon name={tasks[1]>=3? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
            </div>
            </div>

            <br/><hr/>
            {(tasks[0]>=3 && tasks[1]>=3) ?
            <><Link to="/introduction" className='button'>Continue<ion-icon name="arrow-forward-outline"></ion-icon></Link><br/><i>Next: Introduction to the algorithm</i></>
            :
            <><Link to="/introduction" className='button disable'>Skip<ion-icon name="arrow-forward-outline"></ion-icon></Link><br/><i>Next: Introduction to the algorithm</i></>}

        </>}
    </SB>
    </div>
    </div>
    <div className='content'>
        <div className={page_state === 2 ? 'svg_container interactive plus focus-svg' : 'svg_container'}>
            <div className='svg_label'>Graph - <InlineMath math="G"/></div>
            <svg ref={graph_container} className="cy" width="100%" height="100%"></svg>
        </div>
        <div className='svg_container'>
            <div className='svg_label'>Tree Decomposition - <InlineMath math="T"/></div>
            <svg ref={tree_container} className="cy" width="100%" height="100%"></svg>
        </div>
    </div>
    </AnimatedPage>

    </>
  );
}




export default TreeDecomposition;