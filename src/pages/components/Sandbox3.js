import React, { useEffect, useRef } from 'react';
import graph1 from '../../graphs/graph1.json'
import * as d3 from 'd3';
import {Graph, Tree} from "../../classes.js"


function Sandbox() {
  const svgRef = useRef();


  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const g = new Graph(graph1, svg);
    g.render();

  }, []);

  return (
    <svg ref={svgRef} className="cy" width="100%" height="500"></svg>
  );
}

export default Sandbox;