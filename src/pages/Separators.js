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
    const [isFocus, setIsFocus] = useState(true);
    const [components, setComponents] = useState([]);
    const [separator, setSeparator] = useState([]);
    const [page_state, set_page_state] = useState(0);
    const [tabs, set_tabs] = useState(null);
    
    function init_exercise(graph) {
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
                tabs.select("sep-swipe1")
                init_exercise(graph1);
                break;
            case 2:
                tabs.select("sep-swipe2")
                init_exercise(graph2);
                break;
            case 3:
                tabs.select("sep-swipe3");
                init_exercise(graph3);
                break;
            default:
                set_tabs(M.Tabs.init(document.querySelector('#sep-tabs')));
                set_page_state(1);
                break;
          }
    }, [page_state, tabs]);


    
    
    
            
    

  return (
    <>
    <AnimatedPage>
    <div className='sidebar'><div className='sidebar_bubble'><SB style={{ height: '100vh', width: '100vw' }}>
        <h2>Separators</h2>
        
        <p>A separator is a set of vertices <InlineMath math="X \subseteq V(G)"/>, where removing <InlineMath math="X"/> from 
        <InlineMath math="G"/> results in the connected components <InlineMath math="C_1,...,C_h"/> in the graph <InlineMath math="G[V \setminus X]"/>
        </p><hr></hr>
        <h2>Exercises</h2>

        <ul id="sep-tabs" className="tabs">
            <li className="tab col s3">
                <a className="active" href="#sep-swipe1" onClick={() => set_page_state(1)}>1</a>
            </li>
            <li className="tab col s3">
                <a href="#sep-swipe2" onClick={() => set_page_state(2)}>2</a>
            </li>
            <li className="tab col s3">
                <a href="#sep-swipe3" onClick={() => set_page_state(3)}>3</a>
            </li>
        </ul>


        <div id="sep-swipe1" className="col s12 tab-content">
        <h4>Description</h4>
        
        <p>Click on the vertices in <span className='ref'><InlineMath math="G"/></span> to toggle their inclusion in the separator <InlineMath math="X"/>.</p>

        
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
            <InlineMath math={"X  = \\{"}/>
            <div className={"X"}><InlineMath math={separator.toString()} /></div>
            <InlineMath math={"\\}"}/>
        </div></div>
        {/* <br/> */}
        {/* {components.map((item, idx) => {
            const line = "C_"+(idx+1).toString()+" = \\{" + item.toString() + "\\}";
            return (
            <React.Fragment key={idx}>
                <div className='items'>
                    <InlineMath math={line} />
                </div>
            </React.Fragment>
        )})} */}
        {/* <br/> */}
        {components.map((item, idx) => {
            const e = "\\}";
            return (
            <React.Fragment key={idx}>
                <div className='items'><div>
                <InlineMath math={"C_"+(idx+1).toString()+"=\\{"} />
                <div className={"C"+(idx+1).toString()}><InlineMath math={item.toString()} /></div>
                <InlineMath math={e} />
                </div></div>
            </React.Fragment>
        )})}
        <br/>
        {components.length>=4 ?
        <><button className='button focus' onClick={() => {set_page_state(2)}}>Continue<ion-icon name="arrow-forward-outline"></ion-icon></button><br/><i>Next: Exercise 2</i></>
        :
        <><button className='button disable'  onClick={() => {set_page_state(2)}}>Skip<ion-icon name="arrow-forward-outline"></ion-icon></button><br/><i>Next: Exercise 2</i></>
        }
        </div>
        <div id="sep-swipe2" className="col s12 tab-content">
        <h4>Description</h4>
        
        <p>Click on the vertices in <span className='ref'><InlineMath math="G"/></span> to toggle their inclusion in the separator <InlineMath math="X"/>.</p>

        
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
            <InlineMath math={"X  = \\{"}/>
            <div className={"X"}><InlineMath math={separator.toString()} /></div>
            <InlineMath math={"\\}"}/>
        </div></div>
        {/* <br/> */}
        {/* {components.map((item, idx) => {
            const line = "C_"+(idx+1).toString()+" = \\{" + item.toString() + "\\}";
            return (
            <React.Fragment key={idx}>
                <div className='items'>
                    <InlineMath math={line} />
                </div>
            </React.Fragment>
        )})} */}
        {/* <br/> */}
        {components.map((item, idx) => {
            const e = "\\}";
            return (
            <React.Fragment key={idx}>
                <div className='items'><div>
                <InlineMath math={"C_"+(idx+1).toString()+"=\\{"} />
                <div className={"C"+(idx+1).toString()}><InlineMath math={item.toString()} /></div>
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

        </div>





        <div id="sep-swipe3" className="col s12 tab-content">
        <h4>Description</h4>
        
        <p>Click on the vertices in <span className='ref'><InlineMath math="G"/></span> to toggle their inclusion in the separator <InlineMath math="X"/>.</p>
        
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
            <InlineMath math={"X  = \\{"}/>
            <div className={"X"}><InlineMath math={separator.toString()} /></div>
            <InlineMath math={"\\}"}/>
        </div></div>
        {/* <br/> */}
        {/* {components.map((item, idx) => {
            const line = "C_"+(idx+1).toString()+" = \\{" + item.toString() + "\\}";
            return (
            <React.Fragment key={idx}>
                <div className='items'>
                    <InlineMath math={line} />
                </div>
            </React.Fragment>
        )})} */}
        {/* <br/> */}
        {components.map((item, idx) => {
            const e = "\\}";
            return (
            <React.Fragment key={idx}>
                <div className='items'><div>
                <InlineMath math={"C_"+(idx+1).toString()+"=\\{"} />
                <div className={"C"+(idx+1).toString()}><InlineMath math={item.toString()} /></div>
                <InlineMath math={e} />
                </div></div>
            </React.Fragment>
        )})}

        </div>

        {page_state === 3 ? <>
            <br/>
        <hr/>
        {components.length>=4 ?
        <><Link to="/balanced-separators" className='button'>Continue<ion-icon name="arrow-forward-outline"></ion-icon></Link><br/><i>Next: Balanced Separators</i></>
        :
        <><Link to="/balanced-separators" className='button disable'>Skip<ion-icon name="arrow-forward-outline"></ion-icon></Link><br/><i>Next: Balanced Separators</i></>
        }</> : ""}

    </SB></div></div>
    <div className='content'>
        <div className={isFocus ? "svg_container interactive active focus-svg":'svg_container interactive active'}>
            <svg id="nolo" ref={graph_container} className="cy" width="100%" height="100%"></svg>
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