import React, { Fragment, useEffect, useRef, useState } from 'react';
// import graph from '../graphs/intro-treedecomposition-graph.json'
// import tree from '../graphs/intro-treedecomposition-tree.json'
import XX_graph from '../graphs/graph1.json'
import XX_tree from '../graphs/graph1-tree.json'
import hourglass_graph from '../graphs/graphBS2.json'
import hourglass_tree from '../graphs/graphBS2-tree.json'
import baby_graph from '../graphs/baby-graph.json'
import baby_tree from '../graphs/baby-graph-tree.json'
// import tree from '../graphs/graphBS2-tree-TEST.json'
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import * as d3 from 'd3';
import {Graph, Tree} from "../classes.js"
import AnimatedPage from './components/AnimatedPage';
import { Link } from 'react-router-dom';
import SB from './components/SB';
import {correcto, svg_graph_to_file, svg_tree_to_file, set_graph_direction} from "../functions.js";
import * as DP from '../DP.js';
import {cap, T_2_TD, split2} from "../functions";


// temp to make it easy to code
// graph.edges.push({ "source": 3, "target": 6});
// tree.nodes[0].bag.push(6);
// tree.nodes[3].bag.push(6);


function fix_T(t, num, s=false) {
    if(!s) s = t.nodes.find(node => node.bag.includes(num));
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
    const [reset, set_reset] = useState(0);
    const [page_state, set_page_state] = useState(1);
    const [components, set_components] = useState([]);
    const [separator, set_separator] = useState([]);
    const tabsref = useRef();
    const tabref = useRef();
    const [show_nice, set_show_nice] = useState(false);
    const [loading, set_loading] = useState(false);
    const [done, set_done] = useState(false);

    const find_min_split = useRef();
    const start_pruning = useRef();
    const find_subtrees = useRef();
    const separate_subtrees = useRef();
    const connect_subtrees = useRef();
    const continue_result = useRef();
    const split_t = useRef();
    const progress_bar = useRef();
    const quickload1 = useRef();
    const quickload2 = useRef();
    const quickload3 = useRef();
    const max_length = 10;
    
    
    useEffect(() => {
        let g = new Graph(XX_graph, d3.select(graph_container.current));
        let t = new Tree(XX_tree, d3.select(tree_container.current));
        
        // init run to set W and bag names. 
        t.render();
        t = new Tree(set_graph_direction(svg_tree_to_file(t)), d3.select(tree_container.current));
        g.W = t.nodes[0].bag;
        //

        // reused vars between states
        let blobs;
        let split_nodes;
        let split_edges;

        const vertexLock = new Lock();

        let counter  = Math.max(...XX_graph.nodes.map(node => node.id));
        let tcounter = Math.max(...XX_tree.nodes.map(node => node.id));

        // find and highlight min split if any exist!
        find_min_split.current.addEventListener('click', async function(){

            set_loading(true);
            
            setTimeout(async () => {
            
            await vertexLock.lock();
            set_done(false);
            
            // setting correct edge direction!!
            let newt = set_graph_direction(svg_tree_to_file(t));
            newt = DP.make_nice(newt);

            // render nice
            DP.nice_color(newt);
            let t2 = new Tree(newt, d3.select(tree_container2.current));
            t2.charge = -500
            t2.render();

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

            // worst res
            // res.sort((a,b) => b[1]-a[1]);
            
            // best res
            // res.sort((a,b) => a[1]-b[1]);
            
            function compare_res(a,b){

                // compare dist - less is better
                if(a[1]!==b[1]) return a[1]-b[1];

                // compare size of biggest comp - smaller is better
                let set_a = a[0].split(",").slice(0,3).map(DP.decode_set).map(x=>x.length);
                let set_b = b[0].split(",").slice(0,3).map(DP.decode_set).map(x=>x.length);

                set_a.sort((aa,bb) => aa-bb);
                set_b.sort((aa,bb) => aa-bb);

                if(set_a[2] !== set_b[2]) return set_a[2]-set_b[2];
                if(set_a[1] !== set_b[1]) return set_a[1]-set_b[1];
                return set_a[0]-set_b[0];
            }
            
            res.sort(compare_res);

            for (const r of res) {

                // console.log(DP.find_res(U,W.id,best_h,newg,newt,r[0]))
                DP.print_state(r[0], W.bag);
                
            }

            if(res.length>0){

                console.log(res[0]);

                let enc = res[0][0];
                let dis = res[0][1];
                
                // DP.print_state(enc, DP.get_bag(newt, W.id));
                console.log("W", W)
                let winner = DP.find_res(U,W.id,best_h,newg,newt,enc);

                console.log("winner", winner)
         
                // DELETE THESE TWO LINES, used to test X padding
                // winner["X"].push(10);
                // winner["C1"] = winner["C1"].filter(ele => ele !== 10); 
                g.render();
                g.X = winner["X"];
                g.C = [winner["C1"], winner["C2"], winner["C3"]];
                g.svg_set_component_color();
                g.svg.on("click", async function(event) {});
                t.X = winner["X"];
                t.C = [winner["C1"], winner["C2"], winner["C3"]];
                t.render();
                set_components([winner["C1"], winner["C2"], winner["C3"]]);
                set_separator([winner["X"]]);
                set_page_state(2);
            }else{
                set_done(true);
            }

            set_loading(false);
            vertexLock.unlock();
        }, 2);
            
        });

        // start pruning operation on min split
        start_pruning.current.addEventListener('click', async function(){
            
            set_page_state(3);
            await vertexLock.lock();
            t.svg = d3.select(tree_container3.current);
            t.render();
            vertexLock.unlock();

        });

        find_subtrees.current.addEventListener('click', async function(){
            
            set_page_state(4);
            await vertexLock.lock();

            let blob_counter = 1;
            blobs = [{ "bags": [], "class": "stroke-black", "text": "Editable subtree" }];

            function dfs_edit(node){
                blobs[0].bags.push(node.name);

                let children = t.links.filter(edge => edge.source.id === node.id).map(edge => edge.target);

                for (const child of children) {
                    let c1v = cap(child.bag, t.C[0]).length>0;
                    let c2v = cap(child.bag, t.C[1]).length>0;
                    let c3v = cap(child.bag, t.C[2]).length>0;
                    let is_edit = [c1v, c2v, c3v].filter(Boolean).length >= 2;
                    if(is_edit) dfs_edit(child);
                    else {
                        if(c1v) dfs_noedit(child, blob_counter++, 1, node.name);
                        if(c2v) dfs_noedit(child, blob_counter++, 2, node.name);
                        if(c3v) dfs_noedit(child, blob_counter++, 3, node.name);
                    }
                }
            };

            function dfs_noedit(node, blob_id, component=false, root=false){
                if(root) blobs.push({"bags": [], "class": "stroke-C" + component.toString(), "text": "Non-editable subtree", "parent": root, "root": node.id,  "c": component});

                blobs[blob_id].bags.push(node.name);
                
                let children = t.links.filter(edge => edge.source.id === node.id).map(edge => edge.target);
                
                for (const child of children) dfs_noedit(child, blob_id);
            };

            let W = t.nodes[0];

            dfs_edit(W);
            t.charge = -3337;
            t.blobs = blobs;
            t.render();
            t.svg_set_node_and_edge_if_name("xclude", blobs.slice(1).flatMap(blob => blob.bags));

            vertexLock.unlock();

        });

        separate_subtrees.current.addEventListener('click', async function(){

            set_page_state(5);
            await vertexLock.lock();

            
            // disconnect subtrees
            let non_edit_roots = blobs.slice(1).map(blob=>blob.root);
            t.links = t.links.filter(edge => !non_edit_roots.includes(edge.target.id));


            t.render();

            t.svg_set_node_and_edge_if_name("xclude", blobs.slice(1).flatMap(blob => blob.bags));


            vertexLock.unlock();

        });

        split_t.current.addEventListener('click', async function(){


            set_page_state(6);
            await vertexLock.lock();
            let w_node = t.nodes.find(node => node.name === "W");


            // split nodes and edges into two groups: edit grp, non-edit grp
            // so we can just split the edit grp and append non-edit grp after
            let nodes = t.nodes.map(node => {return {id: node.id, name: node.name, bag: node.bag}});
            split_nodes = split2(nodes, node => blobs[0].bags.includes(node.name));
            
            console.log("split nodes", split_nodes);

            split_edges = split2(t.links, edge => blobs[0].bags.includes(edge.source.name) && blobs[0].bags.includes(edge.target.name));
            split_edges.T = split_edges.T.map(edge => {return {source: edge.source.id, target: edge.target.id}});
            split_edges.F = split_edges.F.map(edge => {return {source: edge.source.id, target: edge.target.id}});
            
            console.log("split edges", split_edges);

            t.render();

            //used to generate IDS for T1,T2,T3 bags
            let max_id = t.nodes.reduce((z, node) => Math.max(z, node.id), 0);


            // build T1,T2,T3
            let treed = T_2_TD({nodes: split_nodes.T, edges: split_edges.T}, t.C, t.X, max_id);

            // append non edit-able bags
            treed.nodes = treed.nodes.concat(split_nodes.F);
            treed.edges = treed.edges.concat(split_edges.F);
            

            let X = t.X;
            let C = t.C;
            t = new Tree(treed, d3.select(tree_container3.current));
            t.charge = -1337
            t.X = X;
            t.C = C;
            t.blobs = blobs;

            let x_node = t.nodes.find(node => node.name === "X");
            // x_node.stuck = true;
            x_node.x = w_node.x;
            x_node.y = w_node.y;

            t.render();

            t.svg_set_node_and_edge_if_name("xclude", blobs.slice(1).flatMap(blob => blob.bags));


            vertexLock.unlock();

        });
        
        connect_subtrees.current.addEventListener('click', async function(){

            set_page_state(7);
            await vertexLock.lock();

            let edges = [];

            for (const blob of blobs.slice(1)) {
                let parent = t.nodes.find(node => node.name === blob.parent && node.sup === blob.c.toString()).id;
                let child  = t.nodes.find(node => node.name === blob.bags[0]).id;
                edges.push({source: parent, target: child});
            }
            t.blobs = blobs;
            t.links = t.links.concat(edges);
            t.render();


            let node_x = t.nodes.find(node => node.name === "x")
            for (const x of t.X) fix_T(t, x, node_x);
            t.render();

            t.svg_set_node_and_edge_if_name("xclude", blobs.slice(1).flatMap(blob => blob.bags));


            vertexLock.unlock();

        });

        continue_result.current.addEventListener('click', async function(){

            // restart the page loop :)
            set_page_state(1);
            await vertexLock.lock();


            t.render();
            t = new Tree(set_graph_direction(svg_tree_to_file(t)), d3.select(tree_container.current));
            console.log(t);
            t.charge = -1337;
            g.W = t.nodes[0].bag;
            g.X = [];
            g.C = [[],[],[]];
            
            blobs = null;
            // counter  = Math.max(...graph.nodes.map(node => node.id)); // should be the same as the graph has not changed.
            tcounter = Math.max(...t.nodes.map(node => node.id));

            g.render();
            t.render();
    
            add_functionality();


            vertexLock.unlock();

        });
        
        async function init_graph(graphz, treez){

            set_done(false);
            set_page_state(1);
            
            await vertexLock.lock();

            let graph = JSON.parse(JSON.stringify(graphz));
            let tree = JSON.parse(JSON.stringify(treez));

            g = new Graph(graph, d3.select(graph_container.current));
            t = new Tree(tree, d3.select(tree_container.current));
            
            // init run to set W and bag names. 
            t.render();
            t = new Tree(set_graph_direction(svg_tree_to_file(t)), d3.select(tree_container.current));
            g.W = t.nodes[0].bag;
            //

            t.charge = -1337;
            g.W = t.nodes[0].bag;
            g.X = [];
            g.C = [[],[],[]];
            
            blobs = null;
            counter  = Math.max(...graph.nodes.map(node => node.id)); // should be the same as the graph has not changed.
            tcounter = Math.max(...t.nodes.map(node => node.id));



            g.render();
            t.render();
    
            add_functionality();


            vertexLock.unlock();
        }

        quickload1.current.addEventListener('click', async function(){
            await init_graph(baby_graph, baby_tree);
        });

        quickload2.current.addEventListener('click', async function(){
            await init_graph(hourglass_graph, hourglass_tree);
        });

        quickload3.current.addEventListener('click', async function(){
            await init_graph(XX_graph, XX_tree);
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
                
                vertexLock.unlock();
                set_done(false);
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
                        set_done(false);


                    }
                    vertexLock.unlock();
                }
            ));
        }
    
        function add_vertex(vertex){
            console.log(g.nodes);
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

        }

        
        g.render();
        t.render();


        add_functionality();

    }, [reset]);


    function mi(x) {
        if(x === "G") graph_container.current.parentNode.classList.add('reftar');
        if(x === "T") tree_container.current.parentNode.classList.add('reftar');
        if(x === "TB") tree_container3.current.parentNode.classList.add('reftar');
    }
    function mo() {
        graph_container.current.parentNode.classList.remove('reftar');
        tree_container.current.parentNode.classList.remove('reftar');
        tree_container3.current.parentNode.classList.remove('reftar');
    }

    useEffect(() => {
        // animate progress bar
        let prev = Math.max(((page_state-2)/6)*100, 0);
        let next = ((page_state-1)/6)*100;
        progress_bar.current.style.width = prev.toString() + "%";
        setTimeout(() => {progress_bar.current.style.width = next.toString() + "%";}, 2);
    },[page_state]);


  return (
    <>
    <AnimatedPage>

    <div className='sidebar'>
        <div className='sidebar_bubble'>
    <SB style={{ height: '100vh', width: '100vw' }}>

        <h2>Sandbox</h2>
        <p><i>The following page lets you modify and build a graph 
            with a corresponding initial far-from-perfect 
            tree decomposition. This 
            tree decomposition will then be improved by 
            iteratively running the algorithm.</i></p>
        <hr/>


         <p style={{margin: 0}}><i>Use the below <span className='adjust-ion'><ion-icon name="play-forward-outline"></ion-icon></span> button to iterate through the algorithm.</i></p>

        <div className='flex'>
            <div  className={loading===true?"button-loading":"hidden"}>
                <div class="preloader-wrapper active">
                    <div class="spinner-layer">
                    <div class="circle-clipper left">
                        <div class="circle"></div>
                    </div><div class="gap-patch">
                        <div class="circle"></div>
                    </div><div class="circle-clipper right">
                        <div class="circle"></div>
                    </div>
                    </div>
                </div>
            </div>
            <div  className={done===true?"button-loading done":"hidden"}><ion-icon name="checkmark-outline"></ion-icon></div>
            <button className={(page_state===1 && loading===false && done === false)?"focus":"hidden"} ref={find_min_split}><ion-icon name="play-forward-outline"></ion-icon></button>
            <button className={page_state===2?"focus":"hidden"} ref={start_pruning}><ion-icon name="play-forward-outline"></ion-icon></button>
            <button className={page_state===3?"focus":"hidden"} ref={find_subtrees}><ion-icon name="play-forward-outline"></ion-icon></button>
            <button className={page_state===4?"focus":"hidden"} ref={separate_subtrees}><ion-icon name="play-forward-outline"></ion-icon></button>
            <button className={page_state===5?"focus":"hidden"} ref={split_t}><ion-icon name="play-forward-outline"></ion-icon></button>
            <button className={page_state===6?"focus":"hidden"} ref={connect_subtrees}><ion-icon name="play-forward-outline"></ion-icon></button>
            <button className={page_state===7?"focus":"hidden"} ref={continue_result}><ion-icon name="play-forward-outline"></ion-icon></button>
            
            <div className="progress">
                <div className="determinate" ref={progress_bar} style={{borderRight: (page_state>1 && page_state<6)? "2px solid black" : "none"}}></div>
            </div>
        </div>

        <hr></hr>
        <div className={page_state !== 1 ? "hidden" : ""}>


        <h2 style={{marginTop: "10px"}}>{done ?"Algorithm Complete":"Modify The Graph"}</h2>
        <div className='exercise'>

            {done && <>
                <p>
                The tree 
                decomposition  <span className='ref' onMouseOver={() => mi("T")} onMouseOut={mo}><InlineMath math="T"/></span> has reached the minimal form 
                guaranteed by the algorithm, as no further minimum 
                splits can be found. This brings us to the end of our 
                exploration of the algorithm. We hope that this 
                walkthrough has been educational for you.
                </p>

                <hr/><br/>

                <p>Add vertices to <span className='ref' onMouseOver={() => mi("G")} onMouseOut={mo}><InlineMath math="G"/></span> by 
            clicking somewhere in the canvas, or edges by dragging the mouse from one vertex to another.</p>


            </>}

            {!done && <>
            <p>Add vertices to <span className='ref' onMouseOver={() => mi("G")} onMouseOut={mo}><InlineMath math="G"/></span> by 
            clicking somewhere in the canvas, or edges by dragging the mouse from one vertex to another.</p>

            <p>The current tree decomposition <span className='ref' onMouseOver={() => mi("T")} onMouseOut={mo}><InlineMath math="T"/></span> will
            automatically be adjusted as vertices and edges are added. Furhermore, 
            once an iteration of the algorithm has been run 
            the new improved tree decomposition will be shown 
            in <span className='ref' onMouseOver={() => mi("T")} onMouseOut={mo}><InlineMath math="T"/></span>.</p>
            </>}
            <div>
                <h3>Quickload</h3>
                <p style={{margin: 0}}>Insert a prebuild graph and tree decomposition 
                into <span className='ref' onMouseOver={() => mi("G")} onMouseOut={mo}><InlineMath math="G"/></span> & <span className='ref' onMouseOver={() => mi("T")} onMouseOut={mo}><InlineMath math="T"/></span></p>
                <button ref={quickload1}>Simple</button>
                <button ref={quickload2}>Hourglass</button>
                <button ref={quickload3}>Square</button>
            </div>

        </div>

        <p><i>Click the <span className='adjust-ion'><ion-icon name="play-forward-outline"></ion-icon></span> button 
        to find a minimum split of <InlineMath math="W"/>.</i></p>
            
        

        
        </div>



        <div className={page_state !== 2 ? "hidden" : ""}>

        <h2 style={{marginTop: "10px"}}>Minimum Split</h2>
        <div className='exercise'>

        <p style={{margin: 0}}><i>Optionally check the nice tree decomposition used to find this minimum split:</i></p>
        <button onClick={() => set_show_nice(!show_nice)}>{show_nice ? "Hide nice tree decomposition" : "Show nice tree decomposition"}</button>

            
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
        <br></br>
            <p>A minimum split of <InlineMath math="W"/> was found and is shown 
            in <span className='ref' onMouseOver={() => mi("G")} onMouseOut={mo}><InlineMath math="G"/></span>.</p>
        <p>Using this minimum split we will improve the tree decomposition by reducing the size of <InlineMath math="W"/>.</p>

        
        </div>
        
        <p><i>Click the <span className='adjust-ion'><ion-icon name="play-forward-outline"></ion-icon></span> button 
        to start the pruning process of <span className='ref' onMouseOver={() => mi("T")} onMouseOut={mo}><InlineMath math="T"/></span>.</i></p>
        
        </div>
        
        <div className={page_state !== 3 ? "hidden" : ""}>


        <h2 style={{marginTop: "10px"}}>Pruning</h2>
        <div className='exercise'>

        <p>Now that a minimum split is found, we will initialize the pruning process 
            by finding <span className='ref' onMouseOver={() => mi("TB")} onMouseOut={mo}><InlineMath math="T"/></span>'s different 
            editable and non-editable subtrees.</p>
        </div>

        <p><i>Click the <span className='adjust-ion'><ion-icon name="play-forward-outline"></ion-icon></span> button 
        to continue the pruning process of <span className='ref' onMouseOver={() => mi("TB")} onMouseOut={mo}><InlineMath math="T"/></span>.</i></p>
        
        </div>
        

        <div className={page_state !== 4 ? "hidden" : ""}>

        <h2 style={{marginTop: "10px"}}>Subtrees</h2>
        <div className='exercise'>

        <p>The different editable and non-editable subtrees are now highlighted 
            in <span className='ref' onMouseOver={() => mi("TB")} onMouseOut={mo}><InlineMath math="T"/></span>.</p>
            
            <p>Next, we disconnect the editable subtree 
                from the non-editable subtrees by eliminating the 
                connecting edges.
            </p>
        </div>

        <p><i>Click the <span className='adjust-ion'><ion-icon name="play-forward-outline"></ion-icon></span> button 
        to continue the pruning process of <span className='ref' onMouseOver={() => mi("T")} onMouseOut={mo}><InlineMath math="T"/></span>.</i></p>
        

        </div> 

        <div className={page_state !== 5 ? "hidden" : ""}>

        <h2 style={{marginTop: "10px"}}>Splittng <InlineMath math="T"/></h2>
        <div className='exercise'>
            <p>Next we split the editable 
                subtree into <InlineMath>T^1, T^2, T^3</InlineMath>. These trees 
                are then connected using a newly 
                created node with a bag that contains the separator <InlineMath>X</InlineMath>.
            </p>
        </div>

        <p><i>Click the <span className='adjust-ion'><ion-icon name="play-forward-outline"></ion-icon></span> button 
        to continue the pruning process of <span className='ref' onMouseOver={() => mi("T")} onMouseOut={mo}><InlineMath math="T"/></span>.</i></p>
        

        </div> 


        <div className={page_state !== 6 ? "hidden" : ""}>


        <h2 style={{marginTop: "10px"}}>Combining subtrees</h2>
        <div className='exercise'>
            
            <p>Now that the editable subtree has been split, the 
        only thing left to do is reattach the non-editable 
        subtrees to the editable subtree. We do this 
        by making an edge from the root of 
        the non-editable subtree to the 
        version of its original parent node 
        that intersects the same component.   
            </p>
        </div>

        <p><i>Click the <span className='adjust-ion'><ion-icon name="play-forward-outline"></ion-icon></span> button 
        to continue the pruning process of <span className='ref' onMouseOver={() => mi("T")} onMouseOut={mo}><InlineMath math="T"/></span>.</i></p>

        </div>


        <div className={page_state !== 7 ? "hidden" : ""}>

        <h2 style={{marginTop: "10px"}}>Iteration Done</h2>
        <div className='exercise'>
            
            <p>A full iteration has now been completed, reducing the width of the largest bag 
                in <span className='ref' onMouseOver={() => mi("T")} onMouseOut={mo}><InlineMath math="T"/></span>.</p>
            <p>We will continue to implement this procedure until we 
                reach a point where the size of the largest bag can no longer be reduced.</p>
        </div>

        <p><i>Click the <span className='adjust-ion'><ion-icon name="play-forward-outline"></ion-icon></span> button 
        to start a new iteration.</i></p>
        
        </div>



    </SB>
    </div>
    </div>
    <div className='content'>
        <div className={(page_state === 1 ? 'svg_container interactive plus focus-svg' : 'svg_container') + (page_state>=3 ? " hidden": "")}>
            <div className='svg_label'>Graph - <InlineMath math="G"/></div>
            <div className='svg_restart' onClick={()=>{set_reset(reset+1);set_done(false);set_page_state(1);}}><ion-icon name="refresh-outline"></ion-icon></div>
            <svg ref={graph_container} className="cy" width="100%" height="100%"></svg>
        </div>
        <div className={('svg_container') + (page_state>=3 ? " hidden": "")}>
            <div className={'svg_label'}>Tree Decomposition - <InlineMath math="T"/></div>
            <svg ref={tree_container} className="cy" width="100%" height="100%"></svg>
        </div>
        <div className={('svg_container') + (page_state>=3 ? "": " hidden")}>
            <div className={'svg_label'}>Tree Decomposition - <InlineMath math="T"/></div>
            <div className='svg_restart' onClick={()=>{set_reset(reset+1);set_page_state(1);}}><ion-icon name="refresh-outline"></ion-icon></div>
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