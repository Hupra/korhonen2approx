import React, { useEffect, useState } from 'react';
import graph1 from '../graphs/graph1.json'
import { create_flownetwork_simple, flownetwork_to_cyto, graph_to_cyto, create_flownetwork } from '../functions';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
cytoscape.use( cola ); // register extension


function generateFlowVisualization(graph,A,B){
  
  const cygraph = flownetwork_to_cyto(create_flownetwork(graph, A, B));
  
  const tcy = cytoscape({
    container: document.getElementById('cy'),
    elements: cygraph,
    layout: { 
      name: 'cola',
      animate: true,
      avoidOverlap: true,
      fit: true,
      infinite: true,
      nodeSpacing: 0,
    },
    style: [
      {
        selector: 'node',
        style: {
          'text-opacity': 1,
          'text-valign': 'center',
          'text-halign': 'center',
          'font-size': 12,
          'text-outline-width': 1,
          'color': 'white',
          'text-outline-color': 'black',
          'text-wrap': 'wrap',
          'text-max-width': 80,
          'content': 'data(content)',
          'width': 60,
          'shape': 'square',
          'background-color': '#606060',
        }
      },
      {
          selector: 'edge',
          style: {
            // 'curve-style': 'segments',
            'curve-style': 'straight',
            'line-color': 'green',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': 'green',
            'width': 1
          }
      }
    ]
  });
}





function generateSplits(arr) {
  let res = [];

  // combi
  for (let i = 1; i < (2<<(arr.length-1))-1; i++) {
    let l = []
    let r = []
    for (let j = 0; j < arr.length; j++) {
      let bit = 1<<j; // the number for a true value on the j'th bit
      console.log(i,j,bit)
      if (i&bit){
        l.push(arr[j])
      }else{
        r.push(arr[j])
      }
    }
    res.push([l,r])
  }
  return res
}

function Flow() {

  function SplitLine(props) {
    Array.prototype.toString = function() {
      return this.join(', ');
    };
    
    const handleClick = () => {
      generateFlowVisualization(graph1, arr[0], arr[1]);
    };

    const { arr } = props;
    console.log(arr)
    return (
      <div className='splitline'  onClick={handleClick}>
        <div>A: [{arr[0].toString()}]</div>
        <div>B: [{arr[1].toString()}]</div>
        {/* <div>Target: &#123; {arr[1].toString()} &#125;</div> */}
      </div>
    )
  }

  let splits = generateSplits([1,2,3,4,5,6,7,8]);

  

  const [cy, setCy] = useState();
  
    useEffect(() => {

      
    
  }, []);



  return (
    <>
      <div className='sidebar'>
      {splits.map((item, index) => (
        <SplitLine key={index} arr={item} />
      ))}
      </div>
      <div className='content'>
      <div id="cy" className="cy"></div>
      </div>
    </>
  );
}




export default Flow;