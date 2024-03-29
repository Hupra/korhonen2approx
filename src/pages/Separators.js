import React, { useEffect, useRef, useState } from 'react';
// import graph from '../graphs/intro-treedecomposition-graph.json'
import graph1 from '../graphs/graph1.json'
import graph2 from '../graphs/graphBS2.json'
import graph3 from '../graphs/graphBS3.json'
import tree from '../graphs/intro-treedecomposition-tree.json'
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import * as d3 from 'd3';
import {Graph, Tree} from "../classes.js"
import {split, correcto} from "../functions.js"
import AnimatedPage from './components/AnimatedPage';
import { Link } from 'react-router-dom';
import SB from './components/SB';
import M from 'materialize-css';


function Separators() {
    const graph_container = useRef();
    const graph_container2 = useRef();
    const info_svg = useRef();
    const [isFocus, setIsFocus] = useState(true);
    const [reset, set_reset] = useState(0);
    const [components, setComponents] = useState([]);
    const [separator, setSeparator] = useState([]);
    const [page_state, set_page_state] = useState(0);
    const tab = useRef();
    const max_length = 10;


    
    function init_exercise(graph) {


        // mini info svg:
        let blobs2 = []
        blobs2.push({ "bags": [1], "class": "","text": "Separator X", "offset": 10 });
        blobs2.push({ "bags": [2], "class": "","text": "Component 1", "offset": 10 });
        blobs2.push({ "bags": [3], "class": "","text": "Component 2", "offset": 10 });
        blobs2.push({ "bags": [4], "class": "","text": "Component 3", "offset": 10 });

        let w = info_svg.current.clientWidth;
        let h = info_svg.current.clientHeight;
        
        let test = {
            nodes: [
                {id: 1, x: (w*(.5/4)), y: 10+(h*(1/2)), stuck: true},
                {id: 2, x: (w*(1.5/4)), y: 10+(h*(1/2)), stuck: true},
                {id: 3, x: (w*(2.5/4)), y: 10+(h*(1/2)), stuck: true},
                {id: 4, x: (w*(3.5/4)), y: 10+(h*(1/2)), stuck: true}
            ], 
            edges: []}
    
        const info = new Graph(test, d3.select(info_svg.current));
        info.blobs = blobs2;
        info.C = [[2],[3],[4]];
        info.X = [1];
        info.render();
        info.svg_set_component_color();
        ///////////////////////////////////





        setSeparator([]);
        setComponents([]);

        let removed_nodes = [];
        let removed_links = [];
        const g  = new Graph(graph,  d3.select(graph_container.current));
        const g2 = new Graph(graph, d3.select(graph_container2.current));
        g.render();
        g2.render();

        let X = removed_nodes.map(node => node.id).sort((a, b) => a - b);
        let C = g2.find_components();

        // const fake_W = graph.nodes.map(node => node.id);
        // g.W = fake_W;
        g.X = X;
        g.C = C;
        g2.X = X;
        g2.C = C;

        
        let blobs = []
        for (let i = 0; i < C.length; i++) {
            blobs.push({ "bags": C[i], "class": "outline-C" + (i+1).toString(), "text": "C" + (i+1).toString(), "offset": 50 });
        }
        g2.blobs = blobs;

   
        
        g.render();
        g.svg_set_component_color();
        g2.svg_set_component_color();

        setSeparator(X);
        setComponents(C);

        // Add an event listener to the nodes to handle the click event
        g.svg_nodes.on("click", function(event, d) {
            setIsFocus(false);

            const node = d3.select(this);
            const node_id = parseInt(node.attr("idx"));

            if(!node.classed("X")){
                // remove node from graph and save removed nodes+links in arrays here
                const removed  = g2.remove_node(node_id);
                removed_nodes.push(...removed.nodes);
                removed_links.push(...removed.links);
            }else{
                // add nodes+links back into graph
                // 1. find node in the array saving removed nodes
                // 2. find links in the array saving removed links,
                //    and make sure the node it's connected to is in the graph.
                const nodes = split(removed_nodes, node => node.id === node_id);
                const links = split(removed_links, link => {
                    return (link.source.id===node_id && !removed_nodes.some(node => node.id === link.target.id))
                    ||     (link.target.id===node_id && !removed_nodes.some(node => node.id === link.source.id))
                });
                removed_nodes = nodes.keep; //maybe use ref
                removed_links = links.keep;
                g2.add_links(links.remove);
                g2.add_nodes(nodes.remove);
            }
            //toggle highlight
            // node.classed("highlight", !node.classed("highlight"));
            g2.render();

            X = removed_nodes.map(node => node.id).sort((a, b) => a - b);
            C = g2.find_components();
            
            let blobs = []
            for (let i = 0; i < C.length; i++) {
                blobs.push({ "bags": C[i], "class": "outline-C" + (i+1).toString(), "text": "C" + (i+1).toString(), "offset": 30 });
            }
            g2.blobs = blobs;

            g.X = X;
            g.C = C;
            g2.X = X;
            g2.C = C;
            g.svg_set_component_color();
            g2.svg_set_component_color();

            setSeparator(X);
            setComponents(C);
            if(C.length>=4) correcto(event.clientX, event.clientY, "Perfect!");
        });
    }

    useEffect(() => {
        switch (page_state) {
            case 1:
                init_exercise(graph1);
                break;
            case 2:
                init_exercise(graph2);
                break;
            case 3:
                init_exercise(graph3);
                break;
            default:
                set_page_state(1);
                break;
          }

          setTimeout(() => {tab.current.style.left = (37*page_state-37).toString() + "px"}, 2);
    }, [page_state, reset]);


    
    function mi(x) {
        if(x === "G") graph_container.current.parentNode.classList.add('reftar');
    }
    function mo() {
        graph_container.current.parentNode.classList.remove('reftar');
    }           
    

  return (
    <>
    <AnimatedPage>
    <div className='sidebar'><div className='sidebar_bubble'><SB style={{ height: '100vh', width: '100vw' }}>
        <h2>Separators</h2>
        
        <p>A separator is a set of vertices <InlineMath math="X \subseteq V(G)"/>, where removing <InlineMath math="X"/> from 
        <InlineMath math="G"/> results in the connected components <InlineMath math="C_1,...,C_h"/> in the graph <InlineMath math="G[V \setminus X]"/>
        </p><hr></hr><br></br>
        <p><i>In <span className='ref' onMouseOver={() => mi("G")} onMouseOut={() => mo("G")}><InlineMath math="G"/></span> , vertices are assigned 
        distinct colors according to their respective component affiliation</i></p>
        <div className='small-svg' style={{height: "100px"}}>
        <svg ref={info_svg} className="cy" width="100%" height="100%"></svg>
        </div>
        <h2 style={{marginTop: "10px"}}>Exercises</h2>

        <ul className="mytabs">
            <div className={page_state===1?"tab active":"tab"} onClick={() => set_page_state(1)}>1</div>
            <div className={page_state===2?"tab active":"tab"} onClick={() => set_page_state(2)}>2</div>
            <div className={page_state===3?"tab active":"tab"} onClick={() => set_page_state(3)}>3</div>
            <div id="tab-selector" ref={tab}/>
        </ul>


        {page_state===1 && <div className='exercise'>


        <h4>Description</h4>
        <i></i>
        
        <p>Click on the vertices in <span className='ref' onMouseOver={() => mi("G")} onMouseOut={() => mo("G")}><InlineMath math="G"/></span> to toggle their inclusion in the separator <InlineMath math="X"/>.</p>

        
        <h4>Tasks</h4>
        <div className='task'>
            <span>Split into at least 2 components.</span>
            <ion-icon name={components.length>=2? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
        </div>


        
        {components.length>=2 ?
            <div className='task'>
                <span>Split into at least 3 components.</span>
                <ion-icon name={components.length>=3? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
            </div>
            :
            <div className='task locked'>
                <div><ion-icon name="lock-closed-outline" checkmark-circle></ion-icon></div>
            </div>
        }
        
        {components.length>=3 ?
        <div className='task'>
            <span>Split into at least 4 components.</span>
            <ion-icon name={components.length>=4? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
        </div>
        :
        <div className='task locked'>
            <div><ion-icon name="lock-closed-outline" checkmark-circle></ion-icon></div>
        </div>
        }
        <h4>Variables</h4>
        <div className='items'><div>
            <span className="X" style={{marginRight: "4px"}}><InlineMath math={"X"}/></span><InlineMath math={"  = \\{"}/>
            {separator.length<=max_length 
                ? <div className={"X"}><InlineMath math={separator.toString()} /></div>
                : <div className={"X"}><InlineMath math={separator.slice(0,max_length).toString() + ", ..."} /></div>
            }
            <InlineMath math={"\\}"}/>
        </div></div>

        {components.map((item, idx) => {
            return (
            <React.Fragment key={idx}>
                <div className='items'><div>
                <span className={"C"+(idx+1).toString()}  style={{marginRight: "4px"}}>
                        <InlineMath math={"C_"+(idx+1).toString()}/></span>
                        <InlineMath math={" = \\{"} />
                {item.length<=max_length 
                ? <div className={"C"+(idx+1).toString()}><InlineMath math={item.toString()} /></div>
                : <div className={"C"+(idx+1).toString()}><InlineMath math={item.slice(0,max_length).toString() + ", ..."} /></div>
                }
                <InlineMath math={"\\}"} />
                </div></div>
            </React.Fragment>
        )})}
        <br/>
        {components.length>=4 ?
        <><button className='button focus' onClick={() => {set_page_state(2)}}>Continue<ion-icon name="arrow-forward-outline"></ion-icon></button><br/><i>Next: Exercise 2</i></>
        :
        <><button className='button disable'  onClick={() => {set_page_state(2)}}>Skip<ion-icon name="arrow-forward-outline"></ion-icon></button><br/><i>Next: Exercise 2</i></>
        }

        
        </div>}







        {page_state===2 && <div className='exercise'>
        <h4>Description</h4>
        
        <p>Click on the vertices in <span className='ref' onMouseOver={() => mi("G")} onMouseOut={() => mo("G")}><InlineMath math="G"/></span> to toggle their inclusion in the separator <InlineMath math="X"/>.</p>
        
        <h4>Tasks</h4>
        <div className='task'>
            <span>Split into at least 2 components.</span>
            <ion-icon name={components.length>=2? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
        </div>
        
        {components.length>=2 ?
            <div className='task'>
                <span>Split into at least 3 components.</span>
                <ion-icon name={components.length>=3? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
            </div>
            :
            <div className='task locked'>
                <div><ion-icon name="lock-closed-outline" checkmark-circle></ion-icon></div>
            </div>
        }
        
        {components.length>=3 ?
        <div className='task'>
            <span>Split into at least 4 components.</span>
            <ion-icon name={components.length>=4? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
        </div>
        :
        <div className='task locked'>
            <div><ion-icon name="lock-closed-outline" checkmark-circle></ion-icon></div>
        </div>
        }
        <h4>Variables</h4>
        <div className='items'><div>
            <span className="X" style={{marginRight: "4px"}}><InlineMath math={"X"}/></span><InlineMath math={"  = \\{"}/>
            {separator.length<=max_length 
                ? <div className={"X"}><InlineMath math={separator.toString()} /></div>
                : <div className={"X"}><InlineMath math={separator.slice(0,max_length).toString() + ", ..."} /></div>
            }
            <InlineMath math={"\\}"}/>
        </div></div>

        {components.map((item, idx) => {
            const e = "\\}";
            return (
            <React.Fragment key={idx}>
                <div className='items'><div>
                <span className={"C"+(idx+1).toString()}  style={{marginRight: "4px"}}>
                        <InlineMath math={"C_"+(idx+1).toString()}/></span>
                        <InlineMath math={" = \\{"} />
                {item.length<=max_length 
                ? <div className={"C"+(idx+1).toString()}><InlineMath math={item.toString()} /></div>
                : <div className={"C"+(idx+1).toString()}><InlineMath math={item.slice(0,max_length).toString() + ", ..."} /></div>
                }
                <InlineMath math={e} />
                </div></div>
            </React.Fragment>
        )})}

        <br/>
        {components.length>=4 ?
        <><button className='button focus' onClick={() => {set_page_state(3)}}>Continue<ion-icon name="arrow-forward-outline"></ion-icon></button><br/><i>Next: Exercise 3</i></>
        :
        <><button className='button disable'  onClick={() => {set_page_state(3)}}>Skip<ion-icon name="arrow-forward-outline"></ion-icon></button><br/><i>Next: Exercise 3</i></>
        }

        </div>}





        {page_state===3 && <div className='exercise'>
        <h4>Description</h4>
        
        <p>Click on the vertices in <span className='ref' onMouseOver={() => mi("G")} onMouseOut={() => mo("G")}><InlineMath math="G"/></span> to toggle their inclusion in the separator <InlineMath math="X"/>.</p>
        
        <h4>Tasks</h4>
        <div className='task'>
            <span>Split into at least 2 components.</span>
            <ion-icon name={components.length>=2? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
        </div>


        
        {components.length>=2 ?
            <div className='task'>
                <span>Split into at least 3 components.</span>
                <ion-icon name={components.length>=3? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
            </div>
            :
            <div className='task locked'>
                <div><ion-icon name="lock-closed-outline" checkmark-circle></ion-icon></div>
            </div>
        }
        
        {components.length>=3 ?
        <div className='task'>
            <span>Split into at least 4 components.</span>
            <ion-icon name={components.length>=4? "checkmark-circle" : "alert-circle-outline"} checkmark-circle></ion-icon>
        </div>
        :
        <div className='task locked'>
            <div><ion-icon name="lock-closed-outline" checkmark-circle></ion-icon></div>
        </div>
        }
        <h4>Variables</h4>
        <div className='items'><div>
            <span className="X" style={{marginRight: "4px"}}><InlineMath math={"X"}/></span><InlineMath math={"  = \\{"}/>
            {separator.length<=max_length 
                ? <div className={"X"}><InlineMath math={separator.toString()} /></div>
                : <div className={"X"}><InlineMath math={separator.slice(0,max_length).toString() + ", ..."} /></div>
            }
            
            <InlineMath math={"\\}"}/>
        </div></div>
 
        {components.map((item, idx) => {
            const e = "\\}";
            return (
            <React.Fragment key={idx}>
                <div className='items'><div>
                <span className={"C"+(idx+1).toString()}  style={{marginRight: "4px"}}>
                        <InlineMath math={"C_"+(idx+1).toString()}/></span>
                        <InlineMath math={" = \\{"} />
                {item.length<=max_length 
                ? <div className={"C"+(idx+1).toString()}><InlineMath math={item.toString()} /></div>
                : <div className={"C"+(idx+1).toString()}><InlineMath math={item.slice(0,max_length).toString() + ", ..."} /></div>
                }
                <InlineMath math={e} />
                </div></div>
            </React.Fragment>
        )})}

        </div>}






        {page_state === 3 ? <>
            <br/>
        <hr/>
        <p>
        The following page will introduce balanced separators, which have constraints that make them important for the algorithm.
        </p>
        {components.length>=4 ?
        <><Link to="/balanced-separators" className='button'>Continue<ion-icon name="arrow-forward-outline"></ion-icon></Link><br/><i>Next: Balanced Separators</i></>
        :
        <><Link to="/balanced-separators" className='button disable'>Skip<ion-icon name="arrow-forward-outline"></ion-icon></Link><br/><i>Next: Balanced Separators</i></>
        }</> : ""}

    </SB></div></div>
    <div className='content'>
        <div className={isFocus ? "svg_container interactive active focus-svg":'svg_container interactive active'}>
            <svg id="nolo" ref={graph_container} className="cy" width="100%" height="100%"></svg>
            <div className='svg_reset' onClick={()=>set_reset(reset+1)}><ion-icon name="refresh-outline"></ion-icon></div>
            <div className='svg_label'>Graph - <InlineMath math="G"/></div>
        </div>
        <div className='wall'><ion-icon name="arrow-forward-outline"></ion-icon></div>
        <div className='svg_container'>
            <svg id="yolo" ref={graph_container2} className="cy" width="100%" height="100%"></svg>
            <div className='svg_label'>Components - <InlineMath math="C_1, ..., C_h"/></div>
        </div>
    </div>
    </AnimatedPage>
    </>
  );
}




export default Separators;