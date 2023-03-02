import React, { useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";

const App = () => {
  const [cy, setCy] = useState(null);
  const [graph, setGraph] = useState([
    { data: { id: 'node1', label: 'label1' } },
    { data: { id: 'node2', label: 'label2' } },
    {
      data: {
        id: 'edge1',
        source: 'node1',
        target: 'node2'
      }
    }
  ]);
  
  const addNodeAndEdge = () => {
   setGraph([
    { data: { id: 'node1', label: 'label1' } },
    { data: { id: 'node2', label: 'label2' } },
    { data: { id: 'node3', label: 'label3' } },
    {
      data: {
        id: 'edge1',
        source: 'node1',
        target: 'node2'
      }
    },
    {
      data: {
        id: 'edge2',
        source: 'node2',
        target: 'node3'
      }
    },
    {
      data: {
        id: 'edge3',
        source: 'node3',
        target: 'node1'
      }
    }
  ]);
    console.log(graph)
    if (cy) {
      cy.layout({
        name: 'cose',
        animate: true
      }).run();
    }
  };

  const [layout, setLayout] = useState({
    name: 'cose',
    randomize: true,
    animate: true
  });


  console.log(graph)

  return (
    <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "black" }}>
      <button onClick={addNodeAndEdge}>Add Node and Edge</button>
      <CytoscapeComponent
          style={{ width: "90vw", height: "90vh", background: "#343434" }}
          elements={graph}
          layout={layout}
          cy={(cy) => {
            setCy(cy);
          }}
      />
  </div>
  );
};

export default App;
