import React, { useEffect, useRef } from 'react';
import nicetreed from '../graphs/nicu.json'
import treed from '../graphs/graph1-tree.json'
// import graph from '../graphs/graph-X.json'
// import tree from '../graphs/graph-X-tree.json'
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import * as d3 from 'd3';
import {Graph, Tree} from "../classes.js"
import AnimatedPage from './components/AnimatedPage';
import * as DP from '../DP.js'

  

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

        // td = {
        //     nodes: [
        //         { "id": 1, "bag": [1,2,3], "name": "1"},
        //         { "id": 2, "bag": [1,2,3], "name": "2"},
        //         { "id": 3, "bag": [1,2,3], "name": "3"},
        //         { "id": 4, "bag": [1,2,3], "name": "4"},
        //         { "id": 5, "bag": [1,2,3], "name": "5"},
        //         { "id": 6, "bag": [1,2,3], "name": "6"},
        //     ],
        //     edges: [
        //         { "source": 1, "target": 2},
        //         { "source": 1, "target": 3},
        //         { "source": 1, "target": 4},
        //         { "source": 1, "target": 5},
        //         { "source": 1, "target": 6},
        //     ]
        // }

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


        const nice_td = DP.make_nice(td);
        console.log("res", nice_td);


        // const t = new Tree(td, d3.select(tree_container.current));
        // // t.charge = -1200;
        // t.render();
        
        const t2 = new Tree(nice_td, d3.select(tree_container.current));
        t2.charge = -1200;
        t2.render();


        {
            // let ii = DP.find_bag_diff([5,6,7,8,9], [5,6,8,9]);
            // let xx = 9; // 1001
            // let tmp = DP.add_ith_bit_t(xx,ii);
            // console.log((xx).toString(2), tmp.toString(2));
    
            // ii = DP.find_bag_diff([5,6,7,8,9], [5,6,8,9]);
            // xx = 21; // 10101
            // tmp = DP.remove_and_rshift_i(xx,ii);
            // console.log((xx).toString(2), tmp.toString(2));
        }

        let n = 0;
        let w = 0;
        for (const node of nice_td.nodes) {
            n = Math.max(n, node.id);
            w = Math.max(w, node.bag.length);
        }

        let U = DP.init_U(n,w);

        // create matrix for graph edge lookup, undirected
        let gn = gg.nodes.reduce((pre, cur) => Math.max(pre, cur.id), 0)+1;
        let M = Array.from({ length: gn}, () => Array(gn).fill(0));
        for (const e of gg.edges) {
            M[e.source][e.target] = 1;
            M[e.target][e.source] = 1;
        }
        console.log(M);

        let newcounter = 0;
        let repcounter = 0;

        function rec(i,h,cccx){

            // out of bounds
            if(h<0) return Infinity;
            if(h>w) return Infinity;

            // return value if res has been computed before;
            if (U[i][h][cccx] !== -1) ++repcounter;
            if (U[i][h][cccx] !== -1) return U[i][h][cccx];
            
            ++newcounter;

            let Bi = DP.get_bag(nice_td,i);
            let children = DP.get_children(nice_td,i);

            if (children.length === 0){
                // current though is that this is always 0
                // I think it is only when and x is added the cost increases
                // if(h === 0) return Infinity;
                return 0;


                // // console.log("-----------------------------");
                // // console.log("i:", i, "h:", h);
                // // DP.print_state(cccx, Bi);
                // U[i][h][cccx] = DP.get_x(cccx,  Bi.length);

                // // since a leaf is always width 1, the bitstring is 0000
                // // and therefor we just ned to check if
                // // cccx is = 8 -> 1000
                // U[i][h][cccx] = cccx===8 ? 1:0;
            }
            if (children.length === 2){
                return 2;
            }
            if (children.length === 1){
                let j = children[0];
                let Bj = DP.get_bag(nice_td, j);

                // current parti
                let Bi_c1 = DP.get_c1(cccx, Bi.length);
                let Bi_c2 = DP.get_c2(cccx, Bi.length);
                let Bi_c3 = DP.get_c3(cccx, Bi.length);
                let Bi_X  = DP.get_x(cccx,  Bi.length);

                if(Bi.length > Bj.length){
                    // introduce
 
                    // check if C1∩Bi, C2∩Bi, C3∩Bi are connected
                    let arr1 = DP.idx_2_value(DP.decode_set(Bi_c1), Bi);
                    let arr2 = DP.idx_2_value(DP.decode_set(Bi_c2), Bi);
                    let arr3 = DP.idx_2_value(DP.decode_set(Bi_c3), Bi);

                    for (const u of arr1) {
                        for (const v of arr2) { // C1 <-> C2
                            if(M[u][v]){
                                U[i][h][cccx] = Infinity;
                                return Infinity;
                        }}                        
                        for (const v of arr3) { // C1 <-> C3
                            if(M[u][v]){
                                U[i][h][cccx] = Infinity;
                                return Infinity;
                    }}};
                    for (const u of arr2) {
                        for (const v of arr3) { // C2 <-> C3
                            if(M[u][v]){
                                U[i][h][cccx] = Infinity;
                                return Infinity;
                    }}};
                    ////////////////////////////////////////////

                    let v = DP.find_bag_diff(Bi,Bj);
                    
                    // |{v} ∩ X|             [h − |{v} ∩ X|] <---- this is how we determine an X is used!
                    let v_cap_X = Math.max((DP.encode(v)&Bi_X)>0,0);
                    // console.log("------------------");
                    // console.log("i:",i,"h:",h);
                    // console.log(v_cap_X);
                    // DP.print_state(cccx, Bi);
                    
                    // next part
                    let Bj_c1 = DP.remove_and_rshift_i(Bi_c1, v);
                    let Bj_c2 = DP.remove_and_rshift_i(Bi_c2, v);
                    let Bj_c3 = DP.remove_and_rshift_i(Bi_c3, v);
                    let Bj_X  = DP.remove_and_rshift_i(Bi_X,  v);
                
                    // visual -> move v up, and push left part 1 to the right
                    let cvcvcvxv = DP.combine(Bj_c1, Bj_c2, Bj_c3, Bj_X, Bj.length);
                    U[i][h][cccx] = rec(j, h-v_cap_X, cvcvcvxv);
                    
                }else{
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

                    U[i][h][cccx] = Math.min(
                        rec(j,h,cvccx),
                        rec(j,h,ccvcx),
                        rec(j,h,cccvx),
                        rec(j,h,cccxv)
                        // rec(j,h+1,cccxv) // I think this is where you increment h, as we added v to X
                                         // might be a mistake in his DP
                    )
                    return U[i][h][cccx];
                }
            } 
            return U[i][h][cccx];
        }

        //              i,n,cccx
        
        for (let h = 0; h <= w; h++) {
            for (const node of nice_td.nodes) {
                rec(node.id,h,0);            
            }
        }
        // rec(0,0,0);
        // rec(0,1,0);
        console.log(U);
        console.log("new:", newcounter, "rep:", repcounter);
        let rbag = 1;
        let xD = 1;
        for (const key in U[rbag][xD]) {
            if(U[rbag][xD][key] !== Infinity){
                console.log("-------");
                console.log("res", U[rbag][xD][key]);
                DP.print_state(key, DP.get_bag(nice_td, rbag));
            }
        }   
        


        
    }, []);

  return (
    <>
    <AnimatedPage>

    {/* <div className='sidebar'><div className='sidebar_bubble'>
        <h2>Nicu</h2>
    </div></div> */}
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