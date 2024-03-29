import React, { useEffect, useRef, useState } from 'react';
import tree from '../graphs/ptree.json'
// import graph from '../graphs/graph-X.json'
// import tree from '../graphs/graph-X-tree.json'
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import * as d3 from 'd3';
import {Graph, Tree} from "../classes.js"
import AnimatedPage from './components/AnimatedPage';
import { Link } from 'react-router-dom';
import SB from './components/SB';
import { T_2_TD, split } from '../functions';


function Pruning() {
    const [page_state, set_page_state] = useState(1);
    const tree_container = useRef();
    const tab = useRef();
    const p1_svg = useRef();

    function state1(tree) {
        // "y_div": 5, "y_offset": -10
        tree = JSON.parse(JSON.stringify(tree));
        let C = [[1,2,3,11,20,21,22],[4,5,6,17,12,13,15,16,19,23],[7,8,9,14,18]]
        let X = [10];
        let W = tree.nodes.find(node => node.name === "W");
        const t = new Tree(tree, d3.select(tree_container.current));

        // delete W.y_div;
        // delete W.y_offset;
        // const t = new Tree(T_2_TD(tree, C, X), d3.select(tree_container.current));
        
        t.C = C;
        t.X = [10];
        t.charge = -3500;
        t.render();
        t.svg_set_node_and_edge_if_name("xclude", ["D", "E", "F", "G", "Z", "H", "I", "J", "L", "K", "M"]);
    }
    function state2(tree) {
        tree = JSON.parse(JSON.stringify(tree));
        let C = [[1,2,3,11,20,21,22],[4,5,6,17,12,13,15,16,19,23],[7,8,9,14,18]]
        const t = new Tree(tree, d3.select(tree_container.current));
        t.blobs = [
            { "bags": ["Z"], "class": "stroke-black", "text": "Non-editable subtree" },
            { "bags": ["L", "K", "M"], "class": "stroke-black", "text": "Non-editable subtree" },
            { "bags": ["D", "E", "F", "G"], "class": "stroke-black", "text": "Non-editable subtree" },
            { "bags": ["H", "J", "I"], "class": "stroke-black", "text": "Non-editable subtree" },
        ];

        t.C = C;
        t.X = [10];
        t.charge = -3500;
        t.render();
        t.svg_set_node_and_edge_if_name("xclude", ["D", "E", "F", "G", "Z", "H", "I", "J", "L", "K", "M"]);
    }
    function state3(tree) {
        // sterialize
        tree = JSON.parse(JSON.stringify(tree));
        let C = [[1,2,3,11,21,22,23],[4,5,6,17,12,13,14,15,16],[7,8,9,18,19,20]]
        const t = new Tree(tree, d3.select(tree_container.current));
        t.blobs = [
            { "bags": ["Z"], "class": "stroke-C1", "text": "Non-editable subtree" },
            { "bags": ["L", "K", "M"], "class": "stroke-C1", "text": "Non-editable subtree" },
            { "bags": ["D", "E", "F", "G"], "class": "stroke-C2", "text": "Non-editable subtree" },
            { "bags": ["H", "J", "I"], "class": "stroke-C3", "text": "Non-editable subtree" },
        ];

        // delete W.y_div;
        // delete W.y_offset;
        // const t = new Tree(T_2_TD(tree, C, X), d3.select(tree_container.current));
        
        t.C = C;
        t.X = [10];
        t.charge = -3500;
        t.render();
        t.svg_set_node_and_edge_if_name("xclude", ["D", "E", "F", "G", "Z", "H", "I", "J", "L", "K", "M"]);
    }
    function state4(tree) {
        tree = JSON.parse(JSON.stringify(tree));
        
        const to_remove = [
            { "source": 2, "target": 4},
            { "source": 2, "target": 5},
            { "source": 3, "target": 9},
            { "source": 3, "target": 12}
          ];

          tree.edges = tree.edges.filter(edge => {
            return !to_remove.some(obj => {
              return obj.source === edge.source && obj.target === edge.target;
            });
          });
          

        let C = [[1,2,3,11,21,22,23],[4,5,6,17,12,13,14,15,16],[7,8,9,18,19,20]]
        const t = new Tree(tree, d3.select(tree_container.current));
        t.blobs = [
            { "bags": ["Z"], "class": "stroke-C1", "text": "Non-editable subtree" },
            { "bags": ["L", "K", "M"], "class": "stroke-C1", "text": "Non-editable subtree" },
            { "bags": ["D", "E", "F", "G"], "class": "stroke-C2", "text": "Non-editable subtree" },
            { "bags": ["H", "J", "I"], "class": "stroke-C3", "text": "Non-editable subtree" },
            { "bags": ["W", "A", "B"], "class": "stroke-white", "text": "Editable subtree" },

        ];

        t.C = C;
        t.X = [10];
        t.charge = -1500;
        t.render();
        t.svg_set_node_and_edge_if_name("xclude", ["D", "E", "F", "G", "Z", "H", "I", "J", "L", "K", "M"]);
    }
    function state5(tree) {
        tree = JSON.parse(JSON.stringify(tree));

        const to_remove = [
            { "source": 2, "target": 4},
            { "source": 2, "target": 5},
            { "source": 3, "target": 9},
            { "source": 3, "target": 12}
          ];

        tree.edges = tree.edges.filter(edge => {
            return !to_remove.some(obj => {
                return obj.source === edge.source && obj.target === edge.target;
            });
        });

        let split_nodes = split(tree.nodes, node => ["A","B","W"].includes(node.name));
        let tree_ids = split_nodes.remove.map(node => node.id);
        let split_edges = split(tree.edges, edge => tree_ids.includes(edge.source) && tree_ids.includes(edge.target));

        tree.nodes = split_nodes.remove.map(node => {node.stuck=false; return node});
        tree.edges = split_edges.remove;
          
        let C = [[1,2,3,11,21,22,23],[4,5,6,17,12,13,14,15,16],[7,8,9,18,19,20]]
        let X = [10];

        let treed = T_2_TD(tree, C, X);
        // for (const node of treed.nodes) {
        //     delete node.x;
        //     delete node.y;
        // }

        treed.nodes = treed.nodes.concat(split_nodes.keep.map(node => {node.id = node.id+20; return node}));
        treed.edges = treed.edges.concat(split_edges.keep.map(edge => {edge.source = edge.source + 20; edge.target = edge.target + 20; return edge}));
        
        
        console.log(treed);

        const t = new Tree(treed, d3.select(tree_container.current));

        t.blobs = [
            { "bags": ["Z"], "class": "stroke-C1", "text": "Non-editable subtree" },
            { "bags": ["L", "K", "M"], "class": "stroke-C1", "text": "Non-editable subtree" },
            { "bags": ["D", "E", "F", "G"], "class": "stroke-C2", "text": "Non-editable subtree" },
            { "bags": ["H", "J", "I"], "class": "stroke-C3", "text": "Non-editable subtree" },
            { "bags": ["W", "A", "B"], "class": "stroke-white", "text": "Editable subtree" },

        ];

        let x_node = t.nodes.find(node => node.name === "X");
        // x_node.stuck = true;
        // x_node.x = 632;
        // x_node.y = 100;

        t.C = C;
        t.X = [10];
        t.charge = -1200;
        t.render();
        t.svg_set_node_and_edge_if_name("xclude", ["D", "E", "F", "G", "Z", "H", "I", "J", "L", "K", "M"]);

    }
    function state6(tree) {
        tree = JSON.parse(JSON.stringify(tree));

        const to_remove = [
            { "source": 2, "target": 4},
            { "source": 2, "target": 5},
            { "source": 3, "target": 9},
            { "source": 3, "target": 12}
          ];

        tree.edges = tree.edges.filter(edge => {
            return !to_remove.some(obj => {
                return obj.source === edge.source && obj.target === edge.target;
            });
        });

        let split_nodes = split(tree.nodes, node => ["A","B","W"].includes(node.name));
        let tree_ids = split_nodes.remove.map(node => node.id);
        let split_edges = split(tree.edges, edge => tree_ids.includes(edge.source) && tree_ids.includes(edge.target));

        tree.nodes = split_nodes.remove.map(node => {node.stuck=false; return node});
        tree.edges = split_edges.remove;
          
        let C = [[1,2,3,11,21,22,23],[4,5,6,17,12,13,14,15,16],[7,8,9,18,19,20]]
        let X = [10];

        let treed = T_2_TD(tree, C, X);
        for (const node of treed.nodes) {
            delete node.x;
            delete node.y;
        }

        treed.nodes = treed.nodes.concat(split_nodes.keep.map(node => {node.id = node.id+20; return node}));
        treed.edges = treed.edges.concat(split_edges.keep.map(edge => {edge.source = edge.source + 20; edge.target = edge.target + 20; return edge}));
        

        let B1 = treed.nodes.find(node => node.name === "B" && node.sup === "1");
        let K  = treed.nodes.find(node => node.name === "K");
        treed.edges.push({source: B1.id, target: K.id});

        let A2 = treed.nodes.find(node => node.name === "A" && node.sup === "2");
        let D  = treed.nodes.find(node => node.name === "D");
        treed.edges.push({source: A2.id, target: D.id});

        let A1 = treed.nodes.find(node => node.name === "A" && node.sup === "1");
        let Z  = treed.nodes.find(node => node.name === "Z");
        treed.edges.push({source: A1.id, target: Z.id});

        let B3 = treed.nodes.find(node => node.name === "B" && node.sup === "3");
        let H  = treed.nodes.find(node => node.name === "H");
        treed.edges.push({source: B3.id, target: H.id});

        const t = new Tree(treed, d3.select(tree_container.current));

        t.blobs = [
            { "bags": ["Z"], "class": "stroke-C1", "text": "Non-editable subtree" },
            { "bags": ["L", "K", "M"], "class": "stroke-C1", "text": "Non-editable subtree" },
            { "bags": ["D", "E", "F", "G"], "class": "stroke-C2", "text": "Non-editable subtree" },
            { "bags": ["H", "J", "I"], "class": "stroke-C3", "text": "Non-editable subtree" },
            { "bags": ["W", "A", "B"], "class": "stroke-white", "text": "Editable subtree" },
        ];
        t.blobs = [
            { "bags": ["Z"], "class": "stroke-C1" },
            { "bags": ["L", "K", "M"], "class": "stroke-C1" },
            { "bags": ["D", "E", "F", "G"], "class": "stroke-C2" },
            { "bags": ["H", "J", "I"], "class": "stroke-C3" },
            { "bags": ["W", "A", "B"], "class": "stroke-white" },
        ];


        t.C = C;
        t.X = [10];
        t.charge = -900;
        t.render();
        t.svg_set_node_and_edge_if_name("xclude", ["D", "E", "F", "G", "Z", "H", "I", "J", "L", "K", "M"]);
        return t;
    }
    function state7(tree) {
        tree = JSON.parse(JSON.stringify(tree));

        const to_remove = [
            { "source": 2, "target": 4},
            { "source": 2, "target": 5},
            { "source": 3, "target": 9},
            { "source": 3, "target": 12}
          ];

        tree.edges = tree.edges.filter(edge => {
            return !to_remove.some(obj => {
                return obj.source === edge.source && obj.target === edge.target;
            });
        });

        let split_nodes = split(tree.nodes, node => ["A","B","W"].includes(node.name));
        let tree_ids = split_nodes.remove.map(node => node.id);
        let split_edges = split(tree.edges, edge => tree_ids.includes(edge.source) && tree_ids.includes(edge.target));

        tree.nodes = split_nodes.remove.map(node => {node.stuck=false; return node});
        tree.edges = split_edges.remove;
          
        let C = [[1,2,3,11,21,22,23],[4,5,6,17,12,13,14,15,16],[7,8,9,18,19,20]]
        let X = [10];
        
        let treed = T_2_TD(tree, C, X);
        for (const node of treed.nodes) {
            delete node.x;
            delete node.y;
        }
        // treed.nodes.find(node => node.name === "X").x = 680;
        // treed.nodes.find(node => node.name === "X").y = 200;

        console.log(treed);

        treed.nodes = treed.nodes.concat(split_nodes.keep.map(node => {node.id = node.id+20; return node}));
        treed.edges = treed.edges.concat(split_edges.keep.map(edge => {edge.source = edge.source + 20; edge.target = edge.target + 20; return edge}));
        

        let B1 = treed.nodes.find(node => node.name === "B" && node.sup === "1");
        let K  = treed.nodes.find(node => node.name === "K");
        treed.edges.push({source: B1.id, target: K.id});

        let A2 = treed.nodes.find(node => node.name === "A" && node.sup === "2");
        let D  = treed.nodes.find(node => node.name === "D");
        treed.edges.push({source: A2.id, target: D.id});

        let A1 = treed.nodes.find(node => node.name === "A" && node.sup === "1");
        let Z  = treed.nodes.find(node => node.name === "Z");
        treed.edges.push({source: A1.id, target: Z.id});

        let B3 = treed.nodes.find(node => node.name === "B" && node.sup === "3");
        let H  = treed.nodes.find(node => node.name === "H");
        treed.edges.push({source: B3.id, target: H.id});


        for (const name of ["Z", "L", "K", "M"]) {
            treed.nodes.find(node => node.name === name).group = 1;
        }
        for (const name of ["D", "E", "F", "G"]) {
            treed.nodes.find(node => node.name === name).group = 2;
        }
        for (const name of ["H", "J", "I"]) {
            treed.nodes.find(node => node.name === name).group = 3;
        }

        const t = new Tree(treed, d3.select(tree_container.current));


        t.C = C;
        t.X = [10];
        t.charge = -900;
        t.render();
    }


    useEffect(() => {
        switch (page_state) {
            case 1:
                state1(tree);
                state1_text(tree);
                break;
            case 2:
                state2(tree);
                break;
            case 3:
                state3(tree);
                break;
            case 4:
                state4(tree);
                break;
            case 5:
                state5(tree);
                break;
            case 6:
                state6(tree);
                break;
            case 7:
                state7(tree);
                break;
            default:
                state1(tree);
                break;
          }
        setTimeout(() => {tab.current.style.left = (37*page_state-37).toString() + "px"}, 2);





    }, [page_state]);

    function state1_text(tree){
        function place_id(id, x, y, tree) {
            let node = tree.nodes.find(node => node.id === id);
            node.stuck = true;
            node.x = x;
            node.y = y;
        }
    
        let test = {
            nodes: [
                {id: 1, bag: [1,2,4], name: "editable"},
                {id: 2, bag: [1, 11], name: "non-editable"},
            ], 
            edges: [
                
            ]}
        let wp = 50;
        let hp = 50;
        let w = p1_svg.current.clientWidth-(wp*2.5);
        let h = p1_svg.current.clientHeight-(hp*2);
        
        place_id(1,  wp+(w*(1/5)), 5+hp+(h*(1/2)), test);
        place_id(2,  wp+(w*(4/5)), 5+hp+(h*(1/2)), test);
    
        const p1g = new Tree(test, d3.select(p1_svg.current));
        p1g.C = [[1,2,11],[4],[]];
        p1g.X = [];
        p1g.render();
        p1g.svg_set_node_and_edge_if_name("xclude", ["non-editable"]);

    }

    function mi(x) {
        if(x === "T") tree_container.current.parentNode.classList.add('reftar');
    }
    function mo() {
        tree_container.current.parentNode.classList.remove('reftar');
    }

  return (
    <>
    <AnimatedPage>

    <div className='sidebar'><div className='sidebar_bubble'><SB style={{ height: '100vh', width: '100vw' }}>
        <h2>Pruning</h2>
        <i>On this page, we will walk you through the various stages of the 
            pruning process. Please follow the explanations provided and 
            observe the step-by-step progress in <span className='ref' onMouseOver={() => mi("T")} onMouseOut={() => mo("T")}><InlineMath math="T"/></span></i>
        <hr/>
        <ul className="mytabs">
            <div className={page_state===1?"tab active":"tab"} onClick={() => set_page_state(1)}>1</div>
            <div className={page_state===2?"tab active":"tab"} onClick={() => set_page_state(2)}>2</div>
            <div className={page_state===3?"tab active":"tab"} onClick={() => set_page_state(3)}>3</div>
            <div className={page_state===4?"tab active":"tab"} onClick={() => set_page_state(4)}>4</div>
            <div className={page_state===5?"tab active":"tab"} onClick={() => set_page_state(5)}>5</div>
            <div className={page_state===6?"tab active":"tab"} onClick={() => set_page_state(6)}>6</div>
            <div className={page_state===7?"tab active":"tab"} onClick={() => set_page_state(7)}>7</div>
            <div id="tab-selector" ref={tab}/>
        </ul>

        {page_state===1 && <>
        <h3 className='mt0'>Editable bags</h3>
        <div className='exercise'>
            <p>In a tree decomposition with a given split <span className='color-reverse'>{"("} <span className='C1'><InlineMath math="C_1"/></span>, <span className='C2'><InlineMath math="C_2"/></span>, <span className='C3'><InlineMath math="C_3"/></span>, <span className='X'><InlineMath math="X"/></span>{")"}</span> rooted in the bag <InlineMath math="W"/>, a bag is editable if it meets the following criteria:</p>
            <ol>
                <li>The bag intersects a minimum of two distinct components.</li>
                <li>All bags in the path from the current bag to the root bag <InlineMath math="W"/> are also editable.</li>
            </ol>
            <p>If a bag does not fulfill these requirements, it is non-editable.</p>
            <hr></hr><br></br>
            <p><i>Example of editable and non-editable bags</i>.</p>
            <div className='small-svg' style={{height: "100px"}}>
            <svg ref={p1_svg} className="cy" width="100%" height="100%"></svg>
            </div>
        </div>
        </>}



        {page_state===2 && <>
        <h3 className='mt0'>Non-editable subtrees</h3>
        <div className='exercise'>
        <p>In the tree decomposition, non-editable bags generate a set of 
        rooted subtrees, known as non-editable subtrees. By definition, any 
        bag below a non-editable bag must also be non-editable. These non-editable 
        subtrees are visually represented with a black blob surrounding them.</p>

        <p><i>Notice how the color of vertex 14 changes in 
            bags E and G when going to the next page.</i></p>
        </div>
        </>}



        {page_state===3 && <>
        <h3 className='mt0'>Color Non-editable subtrees</h3>
        <div className='exercise'>
        <p>In T, the root <InlineMath math="(D,H,K,Z)"/> of a non-editable 
        subtree intersects only 
        one component, <InlineMath math="C_i"/>, and separates its children from 
        other vertices in <InlineMath math="G"/>. Consequently, if a bag below this 
        root contains vertices from 
        components (<InlineMath math="C_j"/> or <InlineMath math="C_k"/>), we 
        are free to change their association to <InlineMath math="C_i"/> as
        they do not influence the editable bags.</p>

        <p><i>Feel free to click back to see the last 
            page before the colors were changed in T.</i></p>
        </div>
        </>}




        {page_state===4 && <>
        <h3 className='mt0'>Detaching the Non-editable subtrees</h3>
        <div className='exercise'>
            <ol>
                <li>We detach the Non-editable subtrees 
                    from <InlineMath math="T"/>.</li>
                <li>We outline the the subtree formed by the editable bags.</li>
            </ol>

            <p>For now, we will just focus on the editable subtree. Later we will reattach the 
                non-editable subtrees at the end.</p>
            </div>
        </>}

        {page_state===5 && <>
        <h3 className='mt0'>Splitting the editable subtree</h3>
        <div className='exercise'>
            <p>We now split the editable subtree using 
            the concepts we have seen on the previous pages, i.e., we 
            split it into <InlineMath math="T^1, T^2, T^3"/> and 
            combine the trees in <InlineMath math="X"/>.</p>
        </div>
        </>}

        {page_state===6 && <>
            <h3 className='mt0'>Attaching the Non-editable subtrees</h3>
            <div className='exercise'>
            <p>The non-editable subtrees are now reconnected 
            to the rest of the tree decomposition. 
            Specifically, if a non-editable subtree 
            intersects with <InlineMath math="C_i"/>, it 
            will be reattached to <InlineMath math="T^i"/>.</p>
            </div>
        </>}


        {page_state===7 && <>
            <h3 className='mt0'><InlineMath math="T''"/> complete</h3>
            <div className='exercise'>
            <p>This concludes the pruning operation; we now have created an improved 
                tree decomposition without changing too many unnecessary bags. 
                We denote the tree decomposition made this way as <InlineMath math="T''"/>.</p>
            </div>
        </>}


        <button className={page_state===1 && 'disable'} onClick={() => set_page_state(Math.max(1, page_state-1))}>Back</button>
        <button className={page_state===7 && 'disable'} onClick={() => set_page_state(Math.min(7, page_state+1))}>Next</button>

        {page_state===7 && <>
        <br/><hr/>
        <p><i>With this pruning operation we have now seen every concept of the algorithm, 
            next we will explore how one goes about actually finding a minimum split. To do this we first must learn 
            about nice tree decompositions.</i></p>
        <Link to="/nice-treedecomposition" className='button'>Continue<ion-icon name="arrow-forward-outline"></ion-icon></Link>        
        <br/><i>Next: Nice Tree Decomposition</i>
        </>}


    </SB></div></div>
    <div className='content'>
    <div className='svg_container'>
            <div className='svg_label'>Tree Decomposition - <InlineMath math={page_state===7 ? "T''" : "T"}/></div>
            <svg ref={tree_container} className="cy" width="100%" height="100%"></svg>
        </div>
        
    </div>
    </AnimatedPage>

    </>
  );
}




export default Pruning;