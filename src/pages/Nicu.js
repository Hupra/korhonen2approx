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


        const nice_td = DP.make_nice(treed);
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
        // U[1][2][420] = 4;

        function rec(i,h,cccx){
            // return value if res has been computed before;
            if (U[i][h][cccx] !== -1) return U[i][h][cccx];
            console.log("rec",i,h,cccx);
            
            let bag = DP.get_bag(nice_td,i);
            let children = DP.get_children(nice_td,i);

            if (children.length === 0){
                return "leaf";
            }
            if (children.length === 2){
                return "join";
            }
            if (children.length === 1){
                if(bag.length > DP.get_bag(nice_td,children[0]).length){
                    return "introduce";
                }else{
                    /// if there are no edges between C1 ∩ Bi, C2 ∩ Bi , C3 ∩ Bi 541 , and otherwise to ⊥.
                    return "forget";
                }
            } 
            
        }

        //              i,n,cccx
        console.log(rec(0,2,0));
        console.log(U);
        


        
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