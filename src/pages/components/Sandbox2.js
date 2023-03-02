import React, { useEffect, useState } from 'react';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
cytoscape.use( cola ); // register extension

function Sandbox2() {
//   const [cy, setCy] = useState(null);
  let counter = 11;
  let cy = null;

  useEffect(() => {
    
    const tcy = cytoscape({
      container: document.getElementById('cy2'),
      elements: {"nodes": [
        { "data": { "id": 1, "content": "1, 2, 3, 4, 5, 6, 7, 8"}, style: { 'width': Math.min("1, 2, 3, 4, 5, 6, 7, 8".length, 800)*5, "background-color": "orange"} },
        { "data": { "id": 2, "content": "1, 2, 5, 6, 9"}, style: { 'width': Math.min("1, 2, 5, 6, 9".length, 800)*5, "background-color": "lightblue"} },
        { "data": { "id": 3, "content": "3, 4, 7, 8, 10"}, style: { 'width': "3, 4, 7, 8, 10".length*8, "background-color": "lightgreen"}},
      ],
      "edges": [
        { "data": { "source": 1, "target": 2 } },
        { "data": { "source": 1, "target": 3 } },
      ]},
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
            'color': "white",
            'text-outline-width': 1,
            'text-outline-color': 'black',
            // 'text-wrap': 'wrap',
            'text-max-width': 80,
            'content': 'data(content)',
            'shape' : 'circle',
            'padding' : '5',
            'padding-left' : '10'
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
              // 'target-arrow-shape': 'triangle',
              'line-color': 'red',
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

    cy = tcy;


}, []);

    function handleAddNode() {
        //inc first
        const newNode = {
            data: { id: ++counter, label: 'New Node', content: counter*100000},
            class: "green",
            style: {
              'width': "ijuqweio".length*8
          }
        };
        cy.add(newNode);
        console.log(counter)
        const newEdge = { data: { source: counter-2, target: counter }};
        const newEdge2 = { data: { source: counter-4, target: counter }};
        const newEdge3 = { data: { source: 1, target: counter }};
        

        // cy.add(newEdge);
        // cy.add(newEdge2);
        // cy.add(newEdge3);

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
      <div id="cy2" className="cy"></div>
    </>
  );
}

export default Sandbox2;