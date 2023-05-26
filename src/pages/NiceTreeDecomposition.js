import React, { useEffect, useState, useRef } from 'react';
import AnimatedPage from './components/AnimatedPage';
import { InlineMath, BlockMath } from 'react-katex';
import SB from './components/SB';
import {Tree} from "../classes.js"
import * as d3 from 'd3';
import graph from '../graphs/graph1.json'
import treeee from '../graphs/graph1-tree.json'
import * as DP from '../DP.js'
import { Link } from 'react-router-dom';





function NiceTreeDeomposition() {
  const tree_container1 = useRef();
  const tree_container2 = useRef();
  const leaf = useRef();
  const [show_nice, set_show_nice] = useState(false);
  const [data, set_data] = useState([]);



    useEffect(() => {

        let tree = JSON.parse(JSON.stringify(treeee));

        let node = tree.nodes.find(node => node.name === "W");
        node.stuck = true;
        node.x = tree_container1.current.clientWidth/2;
        node.y = tree_container1.current.clientHeight*(5/11);

        const t1 = new Tree(tree, d3.select(tree_container1.current));
        t1.render();

        const nice_td = DP.make_nice(tree);

        function place(name, x, y, tree) {
          let node = tree.nodes.find(node => node.name === name);
          node.stuck = true;
          node.x = x;
          node.y = y;
        }
        function place_id(id, x, y, tree) {
          let node = tree.nodes.find(node => node.id === id);
          node.stuck = true;
          node.x = x;
          node.y = y;
        }

        let hp = 100;
        let wp = 40;
        let h = tree_container2.current.clientHeight-(hp*1.5);
        let w = tree_container2.current.clientWidth-(wp*2);

        place("r",  wp+(w*(0/20)), hp+(h*(0/12)), nice_td);
        place("4",  wp+(w*(1.5/20)), hp+(h*(0/12)), nice_td);
        place("5",  wp+(w*(3.5/20)), hp+(h*(0/12)), nice_td);
        place("6",  wp+(w*(6/20)), hp+(h*(0/12)), nice_td);
        place("7",  wp+(w*(8.7/20)), hp+(h*(0/12)), nice_td);
        place("8",  wp+(w*(11.5/20)), hp+(h*(0/12)), nice_td);
        place("9",  wp+(w*(14.5/20)), hp+(h*(0/12)), nice_td);
        place("10", wp+(w*(18.7/20)), hp+(h*(0.5/12)), nice_td);

        place("W",  wp+(w*(1/2)), hp+(h*(1/12)), nice_td);

        place("11",  wp+(w*(1/3)), hp+(h*(2/12)), nice_td);
        place("13",  wp+(w*(1/3)), hp+(h*(3/12)), nice_td);
        place("14",  wp+(w*(1/3)), hp+(h*(4/12)), nice_td);
        place("15",  wp+(w*(1/3)), hp+(h*(5/12)), nice_td);
        place("16",  wp+(w*(1/3)), hp+(h*(6/12)), nice_td);
        place("A",   wp+(w*(1/3)), hp+(h*(7/12)), nice_td);
        place("17",  wp+(w*(1/3)), hp+(h*(8/12)), nice_td);
        place("18",  wp+(w*(1/3)), hp+(h*(9/12)), nice_td);
        place("19",  wp+(w*(1/3)), hp+(h*(10/12)), nice_td);
        place("20",  wp+(w*(1/3)), hp+(h*(11/12)), nice_td);
        place("21",  wp+(w*(1/3)), hp+(h*(12/12)), nice_td);

        place("12",  wp+(w*(2/3)), hp+(h*(2/12)), nice_td);
        place("22",  wp+(w*(2/3)), hp+(h*(3/12)), nice_td);
        place("23",  wp+(w*(2/3)), hp+(h*(4/12)), nice_td);
        place("24",  wp+(w*(2/3)), hp+(h*(5/12)), nice_td);
        place("25",  wp+(w*(2/3)), hp+(h*(6/12)), nice_td);
        place("B",   wp+(w*(2/3)), hp+(h*(7/12)), nice_td);
        place("26",  wp+(w*(2/3)), hp+(h*(8/12)), nice_td);
        place("27",  wp+(w*(2/3)), hp+(h*(9/12)), nice_td);
        place("28",  wp+(w*(2/3)), hp+(h*(10/12)), nice_td);
        place("29",  wp+(w*(2/3)), hp+(h*(11/12)), nice_td);
        place("30",  wp+(w*(2/3)), hp+(h*(12/12)), nice_td);


        DP.nice_color(nice_td);

        const t2 = new Tree(nice_td, d3.select(tree_container2.current));
        t2.charge = -200;
        t2.render();

        let test = {nodes: [
          {id: 1, bag: [], name: "Leaf", color: "#D56EFF"},
          {id: 2, bag: [1,2,3], name: "Introduce", color: "skyblue"},
          {id: 3, bag: [1,3], name: ""},
          {id: 4, bag: [1,3], name: "Forget", color: "chartreuse"},
          {id: 5, bag: [1,2,3], name: ""},
          {id: 6, bag: [1,2,3], name: "Join", color: "orange"},
          {id: 7, bag: [1,2,3], name: ""},
          {id: 8, bag: [1,2,3], name: ""},
        ], edges: [
          {source: 2, target: 3},
          {source: 4, target: 5},
          {source: 6, target: 7},
          {source: 6, target: 8},
        ]}

        wp = 50;
        hp = 50;
        h = leaf.current.clientHeight-(hp*1.7);
        w = leaf.current.clientWidth-(wp*2);

        place_id(1,  wp+(w*(0/4)), hp+(h*(0/1)), test);
        place_id(2,  wp+(w*(1/4)), hp+(h*(0/1)), test);
        place_id(3,  wp+(w*(1/4)), hp+(h*(1/1)), test);
        place_id(4,  wp+(w*(2/4)), hp+(h*(0/1)), test);
        place_id(5,  wp+(w*(2/4)), hp+(h*(1/1)), test);
        place_id(6,  wp+(w*(3.5/4)), hp+(h*(0/1)), test);
        place_id(7,  wp+(w*(3/4)), hp+(h*(1/1)), test);
        place_id(8,  wp+(w*(4/4)), hp+(h*(1/1)), test);

        const t3 = new Tree(test, d3.select(leaf.current));
        t3.render();


    }, []);


    const forget = `
    f(h,i,p)  =  (h - |X \\cap B_i|) + \\min \\begin{cases} 
    f(h,j,(v \\cup (C_1\\cap B_i),\\phantom{\\mathstrut v \\cup\\,} (C_2\\cap B_i),\\phantom{\\mathstrut v \\cup\\,} (C_3\\cap B_i),\\phantom{\\mathstrut v \\cup\\,} (X\\cap B_i))), \\\\
    f(h,j,(\\phantom{\\mathstrut v \\cup\\,}(C_1\\cap B_i), v \\cup (C_2\\cap B_i),\\phantom{\\mathstrut v \\cup\\,} (C_3\\cap B_i),\\phantom{\\mathstrut v \\cup\\,} (X\\cap B_i))), \\\\
    f(h,j,(\\phantom{\\mathstrut v \\cup\\,}(C_1\\cap B_i),\\phantom{\\mathstrut v \\cup\\,} (C_2\\cap B_i), v \\cup (C_3\\cap B_i),\\phantom{\\mathstrut v \\cup\\,} (X\\cap B_i))), \\\\
    f(h,j,(\\phantom{\\mathstrut v \\cup\\,}(C_1\\cap B_i),\\phantom{\\mathstrut v \\cup\\,} (C_2\\cap B_i),\\phantom{\\mathstrut v \\cup\\,} (C_3\\cap B_i), v \\cup (X\\cap B_i))) 
    \\end{cases}
    `;
    const introduce = `
    f(h,i,p)  =  (h - |X \\cap B_i|) + f(h_v,j,((C_1 \\cap B_i)\\setminus v, (C_2 \\cap B_i)\\setminus v, (C_3 \\cap B_i)\\setminus v, (X \\cap B_i)\\setminus v))
    `;
    const introduce2 = `
    f(h,i,p)  = (h - |X \\cap B_i|) +  
    \\begin{cases} 
    f(h-1,j,((C_1 \\cap B_i)\\phantom{\\setminus v}, (C_2 \\cap B_i)\\phantom{\\setminus v}, (C_3 \\cap B_i)\\phantom{\\setminus v}, (X \\cap B_i)\\setminus v)) & \\text{if } v \\subseteq X, \\\\
    f(h\\phantom{-1},j,((C_1 \\cap B_i)\\setminus v, (C_2 \\cap B_i)\\phantom{\\setminus v}, (C_3 \\cap B_i)\\phantom{\\setminus v}, (X \\cap B_i)\\phantom{\\setminus v})) & \\text{if } v \\subseteq C_1, \\\\
    f(h\\phantom{-1},j,((C_1 \\cap B_i)\\phantom{\\setminus v}, (C_2 \\cap B_i)\\setminus v, (C_3 \\cap B_i)\\phantom{\\setminus v}, (X \\cap B_i)\\phantom{\\setminus v})) & \\text{if } v \\subseteq C_2, \\\\
    f(h\\phantom{-1},j,((C_1 \\cap B_i)\\phantom{\\setminus v}, (C_2 \\cap B_i)\\phantom{\\setminus v}, (C_3 \\cap B_i)\\setminus v, (X \\cap B_i)\\phantom{\\setminus v})) & \\text{if } v \\subseteq C_3 \\\\
\\end{cases}

    `;
    const leaftxt = `
            f(h,i,p) = 
            \\begin{cases} 
                \\infty & \\text{if } h \\neq 0, \\\\
                0 & \\text{otherwise}
            \\end{cases}
        `;

        const join = `f(h,i,p) = \\min_{h_1 + h_2 = h_{\\notin B_i}} \\, f(h_{\\in B_i} + h_1, j, p) + f(h_{\\in B_i} + h_2, k, p)
    `;

    function mi(x) {
      if(x === "T") tree_container1.current.parentNode.classList.add('reftar');
      if(x === "nice") tree_container2.current.parentNode.classList.add('reftar');
    }

    function mo() {
        tree_container1.current.parentNode.classList.remove('reftar');
        tree_container2.current.parentNode.classList.remove('reftar');
    }


  return (
    <>
    <AnimatedPage>

    <div className='sidebar'>
      <div className='sidebar_bubble'><SB style={{ height: '100vh', width: '100vw' }}>
        <h2>Nice Tree Decomposition</h2>
        <p>A rooted tree decomposition is considered <i>nice</i> if every 
        node belongs to one of the four following types:</p>
        <div className='small-svg'>
          <svg ref={leaf} className="cy" width="100%" height="100%"></svg>
        </div>
        <div>
        <h4>Leaf</h4>
        <p><InlineMath>{'\\text{No children with, } B_i=\\emptyset'}</InlineMath></p>
        <h4 style={{marginTop: 0}}>Introduce</h4>
        <p><InlineMath>{'\\text{One child } j \\text{ with } B_i=B_j \\cup \\{v\\} \\text{ for some vertex } v, B_i \\supset B_j'}</InlineMath></p>
        <h4 style={{marginTop: 0}}>Forget</h4>
        <p><InlineMath>{'\\text{One child } j \\text{ with } B_i=B_j \\setminus \\{v\\} \\text{ for some vertex } v, B_i \\subset B_j'}</InlineMath></p>
        <h4 style={{marginTop: 0}}>Join</h4>
        <p><InlineMath>{'\\text{Two children } j, k \\text{ with } B_i = B_j = B_k'}</InlineMath></p>
        <hr></hr>
        <h3 className={"mt0"}>Finding a minimum split of <InlineMath>W</InlineMath></h3>
        <p>To find a minimum split 
          of <InlineMath>W</InlineMath>, we 
          transform <span className='ref' onMouseOver={() => mi("T")} onMouseOut={mo}><InlineMath math="T"/></span> into a nice tree 
          decomposition <span className='ref' onMouseOver={() => mi("nice")} onMouseOut={mo}><InlineMath math="T_{nice}"/></span> by creating a 
          node <InlineMath>r</InlineMath> followed by a set 
          of forget nodes until we 
          reach <InlineMath>W</InlineMath>, at which point we 
          transform the rest 
          of <span className='ref' onMouseOver={() => mi("T")} onMouseOut={mo}><InlineMath math="T"/></span> into <span className='ref' onMouseOver={() => mi("nice")} onMouseOut={mo}><InlineMath math="T_{nice}"/></span> with 
          leaf, introduce, forget and join nodes.
          Once we have 
          created <span className='ref' onMouseOver={() => mi("nice")} onMouseOut={mo}><InlineMath math="T_{nice}"/></span>, we run a 
          dynamic programming algorithm over this tree decomposition to obtain a minimum split 
          of <InlineMath>W</InlineMath>.
            </p><p>
To see the dynamic programming algorithm, click the 'Show DP' button, but feel free to skip this if you are not interested at a technical level.</p>
        <button onClick={() => set_show_nice(!show_nice)}>{show_nice ? "Hide DP" : "Show DP"}</button>

        <hr/>

    <p><i>On the next and final page, you can create a 
      graph and run the entire algorithm, including 
      finding a minimum split, finding the different 
      subtrees, and splitting the editable subtree.</i></p>
      <Link to="/sandbox" className='button'>Continue<ion-icon name="arrow-forward-outline"></ion-icon></Link><br/><i>Next: Algorithm Sandbox</i>

        

       
    </div>
      </SB></div>
    </div>


    <div className='content'>
      <div className='svg_container w1-3'>
        <div className='svg_label'>Tree Decomposition - <InlineMath math="T"/></div>
        <svg ref={tree_container1} className="cy" width="100%" height="100%"></svg>
      </div>
      <div className='wall'><ion-icon name="arrow-forward-outline"></ion-icon></div>
      <div className='svg_container'>
        <div className='svg_label'>Nice Tree Decomposition - <InlineMath math="T_{nice}"/> <InlineMath math={"\\quad\\mid\\quad r=root"}/></div>
        <svg ref={tree_container2} className="cy" width="100%" height="100%"></svg>
      </div>
      <div className={'overlay' + (show_nice?"":" gone")} onClick={() => set_show_nice(false)}/>

      <div className={'svg_popup rev'  + (show_nice?"":" to_the_depths")}>
      <SB style={{ height: '100vh', width: '100vw' }}>
        <div>

          <h2>Dynamic Programming for finding a Minimum split</h2>
          <h4>Leaf</h4>
          <div className='exercise'>
          <p>explanation</p>
          <div className={"codeblock"}><InlineMath math={leaftxt} /></div>
          </div>

          <h4>Introduce</h4>
          <div className='exercise'>
          <p>explanation</p>
          <div className={"codeblock"}><InlineMath math={introduce2} /></div>
          </div>

          <h4>Forget</h4>
          <div className='exercise'>
          <p>explanation</p>
          <div className={"codeblock"}><InlineMath math={forget} /></div>
          </div>


          <h4>Join</h4>
          <div className='exercise'>
          <p>explanation</p>
          <div className={"codeblock"}><InlineMath math={join} /></div>
          </div>
          <div style={{height: "500px"}}></div>
        </div>
        </SB>
      </div>
    </div>
    </AnimatedPage>

    </>
  );
}




export default NiceTreeDeomposition;