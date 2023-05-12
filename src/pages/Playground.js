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
import {correcto, svg_graph_to_file, svg_tree_to_file, set_graph_direction} from "../functions.js"
import * as DP from '../DP.js'


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



function Playground() {
    const graph_container = useRef();
    const tree_container = useRef();
    const tree_container2 = useRef();
    const tree_container3 = useRef();
    const [tasks, set_tasks] = useState([0, 0]);
    const [reset, set_reset] = useState(0);
    const [page_state, set_page_state] = useState(1);
    const tabsref = useRef();
    const tabref = useRef();
    const [show_nice, set_show_nice] = useState(false);

    let treee = JSON.parse(JSON.stringify(tree));

    const find_min_split = useRef();
    const start_pruning = useRef();
    

    
    
    useEffect(() => {
        let g = new Graph(graph, d3.select(graph_container.current));
        let t = new Tree(treee, d3.select(tree_container.current));

        const vertexLock = new Lock();

        let counter = 6;
        let tcounter = 4;

        // find and highlight min split if any exist!
        find_min_split.current.addEventListener('click', async function(){

            await vertexLock.lock();

            let newt = set_graph_direction(svg_tree_to_file(t));
            newt = DP.make_nice(newt);

            let newg = svg_graph_to_file(g);
            let U = DP.init_U(newt);
            let W = newt.nodes.find(node => node.id === 1);
            let res;
            let best_h;
            for (let h = 0; h < W.bag.length; h++) {
                DP.try_h(U , W.id, h, newg, newt);
                res = DP.res_h(U, W.id, h);
                best_h = h;
                console.log("h", h, res);
                if(res.length>0) break;
            }    

            let winner_d = Infinity;
            let winner;
            for(const pair of DP.res_h(U,W.id,best_h)){
                let enc = pair[0];
                let dis = pair[1];
                console.log("------------------------");
                console.log("dist:", dis, "valid?", DP.valid_split(enc, W.bag.length, best_h));
                console.log(enc);
                DP.print_state(enc, DP.get_bag(newt, W.id));
                console.log(DP.find_res(U,W.id,best_h,newg,newt,enc));
                if(dis<winner_d){
                    winner = DP.find_res(U,W.id,best_h,newg,newt,enc);
                    winner_d = dis;
                }
            }

            if(winner){
                g.render();
                g.X = winner["X"];
                g.C = [winner["C1"], winner["C2"], winner["C3"]];
                g.svg_set_component_color();
                g.svg.on("click", async function(event) {});
                t.X = winner["X"];
                t.C = [winner["C1"], winner["C2"], winner["C3"]];
                t.render();
            }

            vertexLock.unlock();
            
        });

        // start pruning operation on min split
        start_pruning.current.addEventListener('click', async function(){
            

            set_page_state(3);

            await vertexLock.lock();

            t.simulation.stop();
            t.svg = d3.select(tree_container3.current);
            // t.nodes = t.nodes.map(n => {return {id: n.id, name: n.name, bag: n.bag, index: n.index}});
            t.render();

            console.log(12132)
            // let edges

            // t = new Tree(d3.select(tree_container2.current3));
            // t2.charge = -500
            // t2.render();

            vertexLock.unlock();

        });

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

                // render nice
                let newt = DP.make_nice(set_graph_direction(svg_tree_to_file(t)));
                DP.nice_color(newt);
                let t2 = new Tree(newt, d3.select(tree_container2.current));
                t2.charge = -500
                t2.render();
                
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

                    const target = g.nodes.find(n => Math.hypot(n.x - e.x, n.y - e.y) < 25);
                    await vertexLock.lock();

                    if(target && target.id !== g.start_node.id) {
                        const source = g.start_node;
                        let num = source.id;
                        let nam = target.id;
                        
                        
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


            // display W on tree and graph
            let newt = set_graph_direction(svg_tree_to_file(t));
            g.W = newt.nodes[0].bag;
            g.render();
            add_functionality();
            t = new Tree(newt, d3.select(tree_container.current));
            t.render();

            set_tasks([g.nodes.length-6, g.links.length-6]);

        }

        function add_edge(edge){

            let links = [...g.links];
            links.push(edge);
            g.links = links;

            // render nice
            let newt = set_graph_direction(svg_tree_to_file(t));
            g.W = newt.nodes[0].bag;
            g.render();
            add_functionality();
            
            t = new Tree(newt, d3.select(tree_container.current));
            t.render();
            
            newt = DP.make_nice(newt);
            DP.nice_color(newt);
            let t2 = new Tree(newt, d3.select(tree_container2.current));
            t2.charge = -500
            t2.render();
            



            // let newg = svg_graph_to_file(g);
            // let U = DP.init_U(newt);
            // let W = newt.nodes.find(node => node.id === 1);
            // let res;
            // let best_h;
            // for (let h = 0; h < W.bag.length; h++) {
            //     DP.try_h(U , W.id, h, newg, newt);
            //     res = DP.res_h(U, W.id, h);
            //     best_h = h;
            //     console.log("h", h, res);
            //     if(res.length>0) break;
            // }    

            // let winner_d = Infinity;
            // let winner;
            // for(const pair of DP.res_h(U,W.id,best_h)){
            //     let enc = pair[0];
            //     let dis = pair[1];
            //     console.log("------------------------");
            //     console.log("dist:", dis, "valid?", DP.valid_split(enc, W.bag.length, best_h));
            //     console.log(enc);
            //     DP.print_state(enc, DP.get_bag(newt, W.id));
            //     console.log(DP.find_res(U,W.id,best_h,newg,newt,enc));
            //     if(dis<winner_d){
            //         winner = DP.find_res(U,W.id,best_h,newg,newt,enc);
            //         winner_d = dis;
            //     }
            // }

            // if(winner){
            //     g.X = winner["X"];
            //     g.C = [winner["C1"], winner["C2"], winner["C3"]];
            //     g.svg_set_component_color();
            //     t.X = winner["X"];
            //     t.C = [winner["C1"], winner["C2"], winner["C3"]];
            //     t.render();
            // }

            set_tasks([g.nodes.length-6, g.links.length-6]);
        }

        
        g.render();
        t.render();

        add_functionality();

    }, [reset]);

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

    <div className='sidebar'>
        <div className='sidebar_bubble'>
    <SB style={{ height: '100vh', width: '100vw' }}>

        <h2>Playground</h2>
        <p><i>We briefly explain tree decomposition and treewidth, 
            as these concepts are essential for the algorithm.</i></p>
            <hr/>
            <ul className="mytabs auto" ref={tabsref}>
                <div className={page_state===1?"tab active":"tab"} onClick={() => set_page_state(1)}>Explanation</div>
                <div className={page_state===2?"tab active":"tab"} onClick={() => set_page_state(2)}>Exercises</div>
                <div id="tab-selector" ref={tabref}/>
            </ul>


        

        <button ref={find_min_split}>Min Split</button>
        
        <br></br>

        <button ref={start_pruning}>Pruning</button>
        
        <br></br>
        
        <button onClick={() => set_show_nice(!show_nice)}>{show_nice ? "Hide Nice" : "Show Nice"}</button>

        {page_state === 1 && <>
        Hej1
        
        {/* <button className='button' onClick={() => {set_page_state(2)}}>Exercises<ion-icon name="arrow-forward-outline"></ion-icon></button><br/><i>Go to exercises</i> */}
               
        </>}

        {page_state === 2 && <>
        Hej2
        </>}
    </SB>
    </div>
    </div>
    <div className='content'>
        <div className={(page_state === 2 ? 'svg_container interactive plus focus-svg' : 'svg_container interactive plus') + (page_state===3 ? " hidden": "")}>
            <div className='svg_label'>Graph - <InlineMath math="G"/></div>
            <div className='svg_reset' onClick={()=>set_reset(reset+1)}><ion-icon name="refresh-outline"></ion-icon></div>
            <svg ref={graph_container} className="cy" width="100%" height="100%"></svg>
        </div>
        <div className={('svg_container') + (page_state===3 ? " hidden": "")}>
            <div className={'svg_label'}>Tree Decomposition - <InlineMath math="T"/></div>
            <svg ref={tree_container} className="cy" width="100%" height="100%"></svg>
        </div>
        <div className={('svg_container') + (page_state===3 ? "": " hidden")}>
            <div className={'svg_label'}>Tree Decomposition - <InlineMath math="T"/></div>
            <svg ref={tree_container3} className="cy" width="100%" height="100%"></svg>
        </div>
        <div className={'overlay' + (show_nice?"":" gone")} onClick={() => set_show_nice(false)}/>
        <div className={'svg_popup'  + (show_nice?"":" to_the_depths")}>
            <div className='svg_container'>
                <div className='svg_label'>Nice - <InlineMath math="G"/></div>
                <svg id="nolo" ref={tree_container2} className="cy graph" width="100%" height="100%"></svg>
            </div>
        </div>
    </div>
    </AnimatedPage>

    </>
  );
}




export default Playground;