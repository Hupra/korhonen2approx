import React, { useEffect, useState } from 'react';
import { graph_to_cyto } from '../../functions.js'
import graph1 from '../../graphs/graph1.json'
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
cytoscape.use( cola ); // register extension

function Sandbox() {
  const [cy, setCy] = useState();
  let counter = 4;
  // let cy = null;




  useEffect(() => {


    const cygraph = graph_to_cyto(graph1);


    const tcy = cytoscape({
      container: document.getElementById('cy'),
      elements: cygraph,
      layout: { 
        name: 'cola',
        animate: true,
        avoidOverlap: true,
        fit: true,
        infinite: true,
      },
      style: [
        {
          selector: 'node',
          style: {
            'text-opacity': 1,
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': 12,
            'text-outline-width': 2,
            'text-outline-color': '#ffffff',
            'text-wrap': 'wrap',
            'text-max-width': 80,
            'content': 'data(content)'
          }
        },
        {
          selector: 'node[label]',
          style: {
            // 'text-margin-x': '-5px',
            // 'text-margin-y': '-25px',
            // 'text-valign': 'top',
            // 'text-halign': 'center',
            // 'text-wrap': 'wrap',
            // 'text-max-width': 80,
            // // 'label': 'data(content)',
            // 'text-outline-width': 2,
            // 'text-outline-color': '#ffffff'
          }
        },
        {
            selector: 'edge',
            style: {
              'curve-style': 'bezier',
              'target-arrow-shape': 'triangle',
              'line-color': '#ccc',
              'target-arrow-color': '#ccc'
            }
        }
      ]
    });

    // tcy.on('free', () => {
    //     tcy.layout({
    //       name: 'cola',
    //       animate: true,
    //       avoidOverlap: true,
    //       fit: true,
    //     }).run();
    //   });

    setCy(tcy);


}, []);

    function handleAddNode() {
        //inc first
        const newNode = {
            data: { id: ++counter, label: 'New Node', content: "counter" },
            class: "green",
          };
        cy.add(newNode);
        console.log(counter)
        const newEdge = { data: { source: counter-2, target: counter }};
        const newEdge2 = { data: { source: counter-4, target: counter }};
        const newEdge3 = { data: { source: 1, target: counter }};
        

        cy.add(newEdge);
        cy.add(newEdge2);
        cy.add(newEdge3);

        // Animate the transition when adding a new node
        cy.layout({ 
            name: 'cola',
            animate: true,
            avoidOverlap: true,
            fit: true,
            infinite: true,
        }).run();
    }

  return (
    <>
      {/* <button onClick={handleAddNode} style={{width:300, height:100}}>Add Node</button> */}
      <div id="cy" className="cy"></div>
    </>
  );
}

export default Sandbox;