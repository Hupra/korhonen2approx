import React, { useEffect, useRef } from 'react';
import graph from '../../graphs/graph-X.json'
import * as d3 from 'd3';
import {Graph, Tree} from "../../classes.js"


function Sandbox() {
  const svgRef = useRef();


  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const g = new Graph(graph, svg);
    g.render();

  }, []);

  return (
    <svg ref={svgRef} className="cy" width="100%" height="500"></svg>
  );
}

export default Sandbox;