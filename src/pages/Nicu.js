import React, { useEffect, useRef } from 'react';
import nicetreed from '../graphs/nicu.json'
import treed from '../graphs/graph1-tree.json'
import graph1 from '../graphs/graph1.json'
// import graph from '../graphs/graph-X.json'
// import tree from '../graphs/graph-X-tree.json'
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import * as d3 from 'd3';
import {Graph, Tree} from "../classes.js"
import AnimatedPage from './components/AnimatedPage';
import * as DP from '../DP.js'
import { nice } from 'd3';
import SB from './components/SB';
import { T_2_TD } from '../functions';
  


function Nicu() {
    const tree_container = useRef();
    // const tree_container2 = useRef();


    useEffect(() => {

        let td = {
            nodes: [
                { "id": 1, "bag": [1,2,3,4,5,6,7,8], "name": "1"},
                { "id": 2, "bag": [1,2,3,4,5,6,7,8], "name": "2"},
                { "id": 3, "bag": [1,2], "name": "3"}
            ],
            edges: [
                { "source": 1, "target": 2},
                { "source": 2, "target": 3}
            ]
        }
        td = {
            nodes: [
                { "id": 1, "bag": [1,2,3,4,5,6,7,8], "name": "W"}
            ],
            edges: [
            ]
        }
        td = {
            nodes: [
                { "id": 1, "bag": [1,2,3,4], "name": "1"},
                { "id": 2, "bag": [4], "name": "2"},
                { "id": 3, "bag": [4,5,6,7], "name": "3"},
                { "id": 4, "bag": [4,5,6,7], "name": "4"},
                { "id": 5, "bag": [4,5,6,7], "name": "5"},
                { "id": 6, "bag": [4,5,6,7], "name": "6"},
                { "id": 7, "bag": [6,7], "name": "7"}
            ],
            edges: [
                { "source": 1, "target": 2},
                { "source": 2, "target": 3},
                { "source": 3, "target": 4},
                { "source": 4, "target": 5},
                { "source": 5, "target": 6},
                { "source": 6, "target": 7},
            ]
        }
        td = {
            nodes: [
                { "id": 1, "bag": [1,2,3], "name": "1"},
                { "id": 2, "bag": [1,2,3], "name": "2"},
                { "id": 3, "bag": [1,2,3], "name": "3"},
                { "id": 4, "bag": [1,2,3], "name": "4"},
                { "id": 5, "bag": [1,2,3], "name": "5"},
                { "id": 6, "bag": [1,2,3], "name": "6"},
            ],
            edges: [
                { "source": 1, "target": 2},
                { "source": 1, "target": 3},
                { "source": 1, "target": 4},
                { "source": 1, "target": 5},
                { "source": 1, "target": 6},
            ]
        }
        
        td = {
            nodes: [
                { "id": 1, "bag": [1,2,3], "name": "1"},
                { "id": 2, "bag": [1,4], "name": "2"},
                { "id": 3, "bag": [2,5], "name": "3"},
                { "id": 4, "bag": [3,6], "name": "4"}
            ],
            edges: [
                { "source": 1, "target": 2},
                { "source": 1, "target": 3},
                { "source": 1, "target": 4},
            ]
        }


        let gg = {
            nodes: [
                { "id": 4},
                { "id": 5},
                { "id": 6}
            ],
            edges: [
                { "source": 4, "target": 5},
                { "source": 5, "target": 6}
            ]
        }

        td = {
            nodes: [
                { "id": 1, "bag": [4,5,6], "name": "W'"}
            ],
            edges: [
            ]
        }

        gg = graph1;
        const nice_td = DP.make_nice(treed);
        // const nice_td = DP.make_nice(td);
        
        // const t = new Tree(td, d3.select(tree_container.current));
        // // t.charge = -1200;
        // t.render();
        
        const t2 = new Tree(nice_td, d3.select(tree_container.current));
        t2.charge = -1200;
        t2.render();



        // get graph in leaves order so we can fill U bottom up
        let sorted_nodes = [];
        for (const node of nice_td.nodes) {
            let counter = 0;
            let parent = DP.get_node(nice_td, DP.get_parent(nice_td, node.id));
            while(parent){
                counter++;
                parent = DP.get_node(nice_td, DP.get_parent(nice_td, parent.id));
            }
            sorted_nodes.push([node.id, counter]);
        }
        sorted_nodes.sort((a, b) => b[1] - a[1]);
        sorted_nodes = sorted_nodes.map(x=>x[0]);
        
        // const nice_td = DP.make_nice(td);
        console.log("res", nice_td);

        let n = 0;
        let w = 0;
        for (const node of nice_td.nodes) {
            n = Math.max(n, node.id);
            w = Math.max(w, node.bag.length);
        }

        let U = DP.init_U(n,w);
        //

        // create matrix for graph edge lookup, undirected
        let gn = gg.nodes.reduce((pre, cur) => Math.max(pre, cur.id), 0)+1;
        let has_edge = Array.from({ length: gn}, () => Array(gn).fill(0));
        for (const e of gg.edges) {
            has_edge[e.source][e.target] = 1;
            has_edge[e.target][e.source] = 1;
        }

        // create adj for graph
        let adj = Array.from({ length: gn }, () => []);
        for (const e of gg.edges) {
            adj[e.source].push(e.target);
            adj[e.target].push(e.source);
        }

        // find bag
        let tn = nice_td.nodes.reduce((pre, cur) => Math.max(pre, cur.id), 0)+1;
        let find_bag = Array.from({ length: tn }, () => []);
        for (const node of nice_td.nodes) {
            find_bag[node.id] = node.bag;
        }

        // find children
        let find_children = Array.from({ length: tn }, () => []);
        for (const edge of nice_td.edges) {
            find_children[edge.source].push(edge.target);
        }

        let newcounter = 0;
        let repcounter = 0;

        function rec(i,h,cccx){
            // out of bounds
            if(h<0) return -Infinity;

            // return value if res has been computed before;
            if (U[i][h][cccx] !== 42069) ++repcounter;
            if (U[i][h][cccx] !== 42069) return U[i][h][cccx];
            ++newcounter;

            // let Bi = DP.get_bag(nice_td,i);
            let Bi = find_bag[i];
            // let children = DP.get_children(nice_td,i);
            let children = find_children[i];


            if (children.length === 0)
            {
                if(h>0) return -Infinity;
                return 0;
            }
            else if (children.length === 2)
            {
                let j = children[0];
                let k = children[1];

                let Bi_X  = DP.get_x(cccx,  Bi.length);
                let Bi_X_size = DP.get_bin_size(Bi_X);
                let zum = h + Bi_X_size;

                let best = -Infinity;
                
                // supper slow sadly :!
                for (let h1 = Bi_X_size; h1 <= h; h1++) {
                    let h2 = zum-h1;
                    best = Math.max(best, rec(j,h1,cccx)+rec(k,h2,cccx))
                }

                U[i][h][cccx] = best;
            }
            else if (children.length === 1)
            {
                let j = children[0];
                // let Bj = DP.get_bag(nice_td, j);
                let Bj = find_bag[j];

                // current parti
                let Bi_c1 = DP.get_c1(cccx, Bi.length);
                let Bi_c2 = DP.get_c2(cccx, Bi.length);
                let Bi_c3 = DP.get_c3(cccx, Bi.length);
                let Bi_X  = DP.get_x(cccx,  Bi.length);

                if(Bi.length > Bj.length){
                    // Bi > Bj
                    // introduce
                    
                    // check if C1∩Bi, C2∩Bi, C3∩Bi are connected
                    let arr1 = DP.idx_2_value(DP.decode_set(Bi_c1), Bi);
                    let arr2 = DP.idx_2_value(DP.decode_set(Bi_c2), Bi);
                    let arr3 = DP.idx_2_value(DP.decode_set(Bi_c3), Bi);

                    for (const u of arr1) {
                        for (const v of arr2) { // C1 <-> C2
                            if(has_edge[u][v]){
                                U[i][h][cccx] = -Infinity;
                                return -Infinity;
                        }}                        
                        for (const v of arr3) { // C1 <-> C3
                            if(has_edge[u][v]){
                                U[i][h][cccx] = -Infinity;
                                return -Infinity;
                    }}};
                    for (const u of arr2) {
                        for (const v of arr3) { // C2 <-> C3
                            if(has_edge[u][v]){
                                U[i][h][cccx] = -Infinity;
                                return -Infinity;
                    }}};

                    let v = DP.find_bag_diff(Bi,Bj);
                    
                    // |{v} ∩ X|             [h − |{v} ∩ X|] <---- this is how we determine an X is used!
                    let v_cap_X = Math.max((DP.encode(v)&Bi_X)>0,0);
                    
                    // next part
                    let Bj_c1 = DP.remove_and_rshift_i(Bi_c1, v);
                    let Bj_c2 = DP.remove_and_rshift_i(Bi_c2, v);
                    let Bj_c3 = DP.remove_and_rshift_i(Bi_c3, v);
                    let Bj_X  = DP.remove_and_rshift_i(Bi_X,  v);
                
                    // visual -> move v up, and push left part 1 to the right
                    let cvcvcvxv = DP.combine(Bj_c1, Bj_c2, Bj_c3, Bj_X, Bj.length);

                    //|X ∩ Bj ∩ Bi -- since Bj <= Bi we can just check X cap Bj
                    let X_cap_Bj_cap_Bi = DP.get_bin_size(Bj_X)
                                                      // we wanna inc by, (h - what is also in this bag)
                    U[i][h][cccx] = rec(j, h-v_cap_X, cvcvcvxv) + ((h-v_cap_X)-X_cap_Bj_cap_Bi);
                }
                else{
                    // Bj > Bi
                    // forget
                    let v = DP.find_bag_diff(Bj,Bi); // big,small

                    // next part
                    let Bj_c1 = DP.add_ith_bit_f(Bi_c1, v);
                    let Bj_c2 = DP.add_ith_bit_f(Bi_c2, v);
                    let Bj_c3 = DP.add_ith_bit_f(Bi_c3, v);
                    let Bj_X  = DP.add_ith_bit_f(Bi_X,  v);

                    let Bj_c1_v = DP.add_ith_bit_t(Bi_c1, v);
                    let Bj_c2_v = DP.add_ith_bit_t(Bi_c2, v);
                    let Bj_c3_v = DP.add_ith_bit_t(Bi_c3, v);
                    let Bj_X_v  = DP.add_ith_bit_t(Bi_X,  v);

                    // //|X ∩ Bj ∩ Bi -- since Bi <= Bj we can just check X cap Bi
                    let X_cap_Bj_cap_Bi = DP.get_bin_size(Bi_X);
                    
                    // speed up, to avoid doing the same cases multiple times, where the same cas is one where the lements in c3 could just be be elements in c2
                    if(Bj_c1===0 && Bj_c2===0 && Bj_c3===0) {
                        let cvccx = DP.combine(Bj_c1_v, Bj_c2,   Bj_c3,   Bj_X,   Bj.length);
                        let cccxv = DP.combine(Bj_c1,   Bj_c2,   Bj_c3,   Bj_X_v, Bj.length);
    
                        U[i][h][cccx] = Math.max(
                            rec(j,h,cvccx) + (h-X_cap_Bj_cap_Bi),
                            rec(j,h,cccxv) + (h-X_cap_Bj_cap_Bi)
                        );
                    }else if(Bj_c2===0 && Bj_c3===0) {
                        let cvccx = DP.combine(Bj_c1_v, Bj_c2,   Bj_c3,   Bj_X,   Bj.length);
                        let ccvcx = DP.combine(Bj_c1,   Bj_c2_v, Bj_c3,   Bj_X,   Bj.length);
                        let cccxv = DP.combine(Bj_c1,   Bj_c2,   Bj_c3,   Bj_X_v, Bj.length);
    
                        U[i][h][cccx] = Math.max(
                            rec(j,h,cvccx) + (h-X_cap_Bj_cap_Bi),
                            rec(j,h,ccvcx) + (h-X_cap_Bj_cap_Bi),
                            rec(j,h,cccxv) + (h-X_cap_Bj_cap_Bi)
                        );
                    }else{
                        let cvccx = DP.combine(Bj_c1_v, Bj_c2,   Bj_c3,   Bj_X,   Bj.length);
                        let ccvcx = DP.combine(Bj_c1,   Bj_c2_v, Bj_c3,   Bj_X,   Bj.length);
                        let cccvx = DP.combine(Bj_c1,   Bj_c2,   Bj_c3_v, Bj_X,   Bj.length);
                        let cccxv = DP.combine(Bj_c1,   Bj_c2,   Bj_c3,   Bj_X_v, Bj.length);

                        U[i][h][cccx] = Math.max(
                            rec(j,h,cvccx) + (h-X_cap_Bj_cap_Bi),
                            rec(j,h,ccvcx) + (h-X_cap_Bj_cap_Bi),
                            rec(j,h,cccvx) + (h-X_cap_Bj_cap_Bi),
                            rec(j,h,cccxv) + (h-X_cap_Bj_cap_Bi)
                        );
                    }

                    // let cvccx = DP.combine(Bj_c1_v, Bj_c2,   Bj_c3,   Bj_X,   Bj.length);
                    // let ccvcx = DP.combine(Bj_c1,   Bj_c2_v, Bj_c3,   Bj_X,   Bj.length);
                    // let cccvx = DP.combine(Bj_c1,   Bj_c2,   Bj_c3_v, Bj_X,   Bj.length);
                    // let cccxv = DP.combine(Bj_c1,   Bj_c2,   Bj_c3,   Bj_X_v, Bj.length);

                    // //|X ∩ Bj ∩ Bi -- since Bi <= Bj we can just check X cap Bi
                    // let X_cap_Bj_cap_Bi = DP.get_bin_size(Bi_X);
                    //                                   // we wanna inc by h - what is also in this bag

                    // U[i][h][cccx] = Math.max(
                    //     rec(j,h,cvccx) + (h-X_cap_Bj_cap_Bi),
                    //     rec(j,h,ccvcx) + (h-X_cap_Bj_cap_Bi),
                    //     rec(j,h,cccvx) + (h-X_cap_Bj_cap_Bi),
                    //     rec(j,h,cccxv) + (h-X_cap_Bj_cap_Bi)
                    // );

                }
            } 
            return U[i][h][cccx];
        }

        let X = new Set();
        let r_C1 = new Set();
        let r_C2 = new Set();
        let r_C3 = new Set();
        function dfs_X(i,h,cccx)
        {
            console.log("dfs", i);
            let Bi = find_bag[i];
            let children = find_children[i];

            // save this x in X
            let this_X = DP.idx_2_value(DP.decode_set(DP.get_x(cccx,  Bi.length)), Bi);
            let this_C1 = DP.idx_2_value(DP.decode_set(DP.get_c1(cccx,  Bi.length)), Bi);
            let this_C2 = DP.idx_2_value(DP.decode_set(DP.get_c2(cccx,  Bi.length)), Bi);
            let this_C3 = DP.idx_2_value(DP.decode_set(DP.get_c3(cccx,  Bi.length)), Bi);
            for (const x of this_X) X.add(x);
            for (const x of this_C1) r_C1.add(x);
            for (const x of this_C2) r_C2.add(x);
            for (const x of this_C3) r_C3.add(x);

            if (children.length === 1) {

                let j = children[0];
                let Bj = find_bag[j];

                // current parti
                let Bi_c1 = DP.get_c1(cccx, Bi.length);
                let Bi_c2 = DP.get_c2(cccx, Bi.length);
                let Bi_c3 = DP.get_c3(cccx, Bi.length);
                let Bi_X  = DP.get_x(cccx,  Bi.length);

                if(Bi.length > Bj.length){

                    let v = DP.find_bag_diff(Bi,Bj);
                    
                    // |{v} ∩ X|             [h − |{v} ∩ X|] <---- this is how we determine an X is used!
                    let v_cap_X = Math.max((DP.encode(v)&Bi_X)>0,0);
                    
                    // next part
                    let Bj_c1 = DP.remove_and_rshift_i(Bi_c1, v);
                    let Bj_c2 = DP.remove_and_rshift_i(Bi_c2, v);
                    let Bj_c3 = DP.remove_and_rshift_i(Bi_c3, v);
                    let Bj_X  = DP.remove_and_rshift_i(Bi_X,  v);
                
                    // visual -> move v up, and push left part 1 to the right
                    let cvcvcvxv = DP.combine(Bj_c1, Bj_c2, Bj_c3, Bj_X, Bj.length);

                    dfs_X(j, h-v_cap_X, cvcvcvxv);
  
                } else {

                    // Bj > Bi
                    // forget
                    let v = DP.find_bag_diff(Bj,Bi); // big,small

                    // next part
                    let Bj_c1 = DP.add_ith_bit_f(Bi_c1, v);
                    let Bj_c2 = DP.add_ith_bit_f(Bi_c2, v);
                    let Bj_c3 = DP.add_ith_bit_f(Bi_c3, v);
                    let Bj_X  = DP.add_ith_bit_f(Bi_X,  v);

                    let Bj_c1_v = DP.add_ith_bit_t(Bi_c1, v);
                    let Bj_c2_v = DP.add_ith_bit_t(Bi_c2, v);
                    let Bj_c3_v = DP.add_ith_bit_t(Bi_c3, v);
                    let Bj_X_v  = DP.add_ith_bit_t(Bi_X,  v);

                    let cvccx = DP.combine(Bj_c1_v, Bj_c2,   Bj_c3,   Bj_X,   Bj.length);
                    let ccvcx = DP.combine(Bj_c1,   Bj_c2_v, Bj_c3,   Bj_X,   Bj.length);
                    let cccvx = DP.combine(Bj_c1,   Bj_c2,   Bj_c3_v, Bj_X,   Bj.length);
                    let cccxv = DP.combine(Bj_c1,   Bj_c2,   Bj_c3,   Bj_X_v, Bj.length);

                    // when i swap to min instead of max, i have to take care to avoid -1
                    let cases = [cvccx, ccvcx, cccvx, cccxv];
                    let best_case = 0;

                    console.log("all 4", U[j][h][cases[0]], U[j][h][cases[1]], U[j][h][cases[2]], U[j][h][cases[3]]);

                    for (let cid = 1; cid < 4; cid++) {
                        if (U[j][h][cases[cid]] > U[j][h][cases[best_case]]) {
                            best_case = cid;
                        }
                    }
                    dfs_X(j, h, cases[best_case]);
                }
            } else if (children.length === 2) {

                let j = children[0];
                let k = children[1];

                let Bi_X  = DP.get_x(cccx,  Bi.length);
                let Bi_X_size = DP.get_bin_size(Bi_X);
                let zum = h + Bi_X_size;

                let best_h1  = 0;
                let best_val = -Infinity;
                
                // supper slow sadly :!
                for (let h1 = Bi_X_size; h1 <= h; h1++) {
                    let h2 = zum-h1;
                    if((U[j][h1][cccx] + U[k][h2][cccx]) > best_val){
                        best_h1 = h1;
                    }
                }

                let best_h2 = zum-best_h1;

                dfs_X(j, best_h1, cccx);
                dfs_X(k, best_h2, cccx);
            }
        }


        function combi(c1,c2,c3,X,next,stop,f,i,h){
            if(next<stop){
                let mask = DP.encode(next);
                combi(c1|mask,c2,c3,X,next+1,stop,f,i,h);
                combi(c1,c2|mask,c3,X,next+1,stop,f,i,h);
                combi(c1,c2,c3|mask,X,next+1,stop,f,i,h);
                combi(c1,c2,c3,X|mask,next+1,stop,f,i,h);
            }else{
                f(i,h,DP.combine(c1,c2,c3,X,stop));
                // console.log(c1.toString(2),c2.toString(2),c3.toString(2),X.toString(2))
            }
        }

        function combi2(c1,c2,c3,X,next,stop,f,i,h){
            if(next<stop){
                let mask = DP.encode(next);
                if(c1===0 && c2===0 && c3===0){
                    combi2(c1|mask,c2,c3,X,next+1,stop,f,i,h);
                    combi2(c1,c2,c3,X|mask,next+1,stop,f,i,h);
                } else if (c2 === 0 && c3 === 0) {
                    combi2(c1|mask,c2,c3,X,next+1,stop,f,i,h);
                    combi2(c1,c2|mask,c3,X,next+1,stop,f,i,h);
                    combi2(c1,c2,c3,X|mask,next+1,stop,f,i,h);
                } else {
                    combi2(c1|mask,c2,c3,X,next+1,stop,f,i,h);
                    combi2(c1,c2|mask,c3,X,next+1,stop,f,i,h);
                    combi2(c1,c2,c3|mask,X,next+1,stop,f,i,h);
                    combi2(c1,c2,c3,X|mask,next+1,stop,f,i,h);
                }
            }else{
                let c1_size = DP.get_bin_size(c1);
                let c2_size = DP.get_bin_size(c2);
                let c3_size = DP.get_bin_size(c3);
                let  X_size = DP.get_bin_size(X);
                
                // check |Ci cup X| < W
                if(Math.max(c1_size, c2_size, c3_size)+X_size < stop) {
                    f(i,h,DP.combine(c1,c2,c3,X,stop));
                }
            }
        }

        // combi(0,0,0,0,0,3,0,0);
        //              i,n,cccx


        // const startTime = performance.now();
        // for (const i of sorted_nodes){
        //     for (let h = 0; h <= w; h++) {
        //         let bag = DP.get_bag(nice_td,i);
        //         combi(0,0,0,0,0,bag.length,rec,i,h);
        //     }
        // }
        // const endTime = performance.now();
        // const elapsedTimeInSeconds = (endTime - startTime) / 1000;
        // console.log("time:", elapsedTimeInSeconds)

        const startTime = performance.now();
        for (let h = 0; h <= w; h++) {
            let bag = DP.get_bag(nice_td,1);
            combi2(0,0,0,0,0,bag.length,rec,1,h);
        }
        const endTime = performance.now();
        const elapsedTimeInSeconds = (endTime - startTime) / 1000;
        console.log("time:", elapsedTimeInSeconds)


        // const startTime = performance.now();
        // for (let h = 0; h <= w; h++) rec(0,h,0);
        // const endTime = performance.now();
        // console.log("time:", (endTime - startTime) / 1000)

        console.log(U);
        console.log("new:", newcounter, "rep:", repcounter);
        console.log("len", Object.keys(U[1][2]).length)
        // 32768
        // 11051
        let rbag = 1;
        let h = 2;
        let highest = -420;
        let enc_set = null;
        for (const key in U[rbag][h]) {
            let cur = U[rbag][h][key];
            if(cur > highest){
                highest = cur;
                enc_set = key;
            }
            // if(U[rbag][h][key] !== -Infinity){
            //     console.log("-------");
            //     console.log("res", U[rbag][h][key]);
            //     DP.print_state(key, DP.get_bag(nice_td, rbag));
            // }
        }   
        
        console.log("result", highest, enc_set);
        DP.print_state(enc_set, DP.get_bag(nice_td, rbag));
        dfs_X(rbag, h, enc_set);
        console.log(X, r_C1, r_C2, r_C3);


        const treed_prime = T_2_TD(treed, [Array.from(r_C1), Array.from(r_C2), Array.from(r_C3)], Array.from(X));
        const t3 = new Tree(treed_prime, d3.select(tree_container.current));
        t3.charge = -1200;
        t3.render();
        
    }, []);

  return (
    <>
    <AnimatedPage>

    <div className='sidebar'><div className='sidebar_bubble'><SB style={{ height: '100vh', width: '100vw' }}>
        <h2>Nicu</h2>
        <div className='happybox'>:D</div>
    </SB></div></div>
    <div className='content'>
        <div className='svg_container'>
            <div className='svg_label'>Nice Tree Decomposition - <InlineMath math="T"/></div>
            <svg ref={tree_container} className="cy" width="100%" height="100%"></svg>
        </div>
    </div>
    </AnimatedPage>

    </>
  );
}




export default Nicu;