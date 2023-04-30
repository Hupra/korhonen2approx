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

  return (
    <>
    <AnimatedPage>

    <div className='sidebar'><div className='sidebar_bubble'><SB style={{ height: '100vh', width: '100vw' }}>
        <h2>Pruning</h2>
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
        <button onClick={() => set_page_state(Math.max(1, page_state-1))}>Prev</button>
        <button onClick={() => set_page_state(Math.min(7, page_state+1))}>Next</button>
        <br/><hr/>
        <p><i>With this pruning operation we have now seen every concept of the algorithm, 
            next we will explore how one goes about actually finding a minimum split. To do this we first must learn 
            about nice tree decompositions.</i></p>
        <Link to="#" className='button'>Continue<ion-icon name="arrow-forward-outline"></ion-icon></Link>        
        <br/><i>Next: Nice Tree Decomposition?</i>
    </SB></div></div>
    <div className='content'>
    <div className='svg_container'>
            <div className='svg_label'>Tree Decomposition - <InlineMath math="T"/></div>
            <svg ref={tree_container} className="cy" width="100%" height="100%"></svg>
        </div>
        
    </div>
    </AnimatedPage>

    </>
  );
}




export default Pruning;