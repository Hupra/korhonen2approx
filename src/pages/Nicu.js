import React, { useEffect, useRef } from 'react';
import nicetreed from '../graphs/nicu.json'
import treed from '../graphs/graph1-tree.json'
import graph1 from '../graphs/graph1.json'
// import treed from '../graphs/graphBS3-tree.json'
// import graph1 from '../graphs/graphBS3.json'
import graph from '../graphs/graph-X.json'
import tree from '../graphs/graph-X-tree.json'
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


        let gg = graph1;
        const nice_td = DP.make_nice(treed);
        // const nice_td = DP.make_nice(td);
        
        // const t = new Tree(td, d3.select(tree_container.current));
        // // t.charge = -1200;
        // t.render();
        
        const t2 = new Tree(nice_td, d3.select(tree_container.current));
        t2.charge = -1200;
        t2.render();


        let U = DP.init_U(nice_td);

        const startTime = performance.now();
        let res;
        for (let h = 0; h <= 3; h++) {
            DP.try_h(U,1,h,gg,nice_td);
            res = [h, DP.res_h(U,1,h)];
            if(res[1].length) break;
        }
        console.log("yooo",res);

        const endTime = performance.now();
        const elapsedTimeInSeconds = (endTime - startTime) / 1000;
        console.log("time:", elapsedTimeInSeconds)

        let w = 8;
        let target_bag = 1;
        let h = 2;
        let highest = -420;
        let enc_set = null;
        

        // console.log("nam", Object.entries(U[rbag][h]).filter((arr) => arr[1] !== Infinity))
        for(const pair of DP.res_h(U,target_bag,h)){
            let enc = pair[0];
            let dis = pair[1];
            console.log("------------------------");
            console.log("dist:", dis, "valid?", DP.valid_split(enc,w,h));
            console.log(enc);
            DP.print_state(enc, DP.get_bag(nice_td, target_bag));
            DP.find_res(U,1,h,gg,nice_td,enc);
        }

        // const treed_prime = T_2_TD(treed, [Array.from(r_C1), Array.from(r_C2), Array.from(r_C3)], Array.from(X));
        const t3 = new Tree(nice_td, d3.select(tree_container.current));
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