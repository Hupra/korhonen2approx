
// notice if we wanna load in a file like this
// we must make a router for /graphs/FILE
// so we can actually "send" it
// instead use import JS keyword when possible
export async function loadJSON(file) {
    try {
      const response = await fetch(file);
      const data = await response.json();
      return data
    } catch (error) {
      console.error(error);
      return {"nope": 1}
    } 
  }


  export function graph_to_cyto(input) {
    const nodes = input.nodes.map(node => {
      return { data: { id: node.id, label: node.label, content: node.content } };
    });
    
    const edges = input.edges.map(edge => {
      return { data: { source: edge.source, target: edge.target } };
    });
    
    return { nodes, edges };
  }


export function flownetwork_to_cyto(input, zeroes=false) {
    const nodes = input.nodes.map(node => {
        return { data: { id: node.id, label: node.label, content: node.content }, style: { "background-color": node.color} };
      });

    const edges = input.edges.filter(edge => edge.capacity !== 0).map(edge => {
        return { data: { source: edge.source, target: edge.target } };
    });

    return { nodes, edges };
}


export function create_flownetwork(graph, A, B) {

    const inc = graph.nodes.length;

    const nodes = graph.nodes.flatMap(node => {
          const node_prime = { ...node };
          node_prime.id = node_prime.id + inc;
          node_prime.content = node_prime.id - inc + "'";
          return [node, node_prime];
    });

    const source = { id: 0, label: 'Source', content: 'Source' };
    const sink   = { id: (graph.nodes.length*2)+1, label: 'Sink', content: 'Sink' };
    nodes.push(source);
    nodes.push(sink);

    const self_edges = graph.nodes.flatMap(node => {
        const self_edge     = {source: node.id, target: node.id+inc, capacity: 1};
        const self_edge_r   = {source: node.id+inc, target: node.id, capacity: 0};
        return [self_edge, self_edge_r];
    });

    const norm_edges = graph.edges.flatMap(edge => {

        // edge A <-> B
        // ------------
        // edge A' -> B
        // edge B' -> A

        const A = edge.source;
        const B = edge.target;

        // edge A' -> B
        const Ap_B = {source: A+inc, target: B, capacity: 999};
        const B_Ap = {source: B, target: A+inc, capacity: 0};

        // edge B' -> A
        const Bp_A = {source: B+inc, target: A, capacity: 999};
        const A_Bp = {source: A, target: B+inc, capacity: 0};

        return [Ap_B, B_Ap, Bp_A, A_Bp]
    });

    const edges = norm_edges.concat(self_edges);

    A.forEach(a => {
        let edge = { "source": 0, "target": a };
        edges.push(edge);
    });

    B.forEach(b => {
        let edge = { "source": b, "target": (graph.nodes.length*2)+1 };
        edges.push(edge);
    });

    return {nodes, edges};
}


export function create_flownetwork_simple(graph, A, B) {

    const nodes = graph.nodes.map(node => {
        node.content = "id:" + node.id + ", w:" + 1;
        return node;
    });

    const source = { id: 0, label: 'Source', content: 'Source' };
    const sink   = { id: graph.nodes.length+1, label: 'Sink', content: 'Sink' };
    nodes.push(source);
    nodes.push(sink);


    const edges = graph.edges.flatMap(edge => {
        const new_edge = {...edge};
        new_edge.target = edge.source;
        new_edge.source = edge.target;
        return [edge, new_edge];
    });

    A.forEach(a => {
        let edge = { "source": 0, "target": a };
        edges.push(edge);
    });

    B.forEach(b => {
        let edge = { "source": b, "target": graph.nodes.length+1 };
        edges.push(edge);
    });

    return {nodes, edges};
}

export function split(list, remove) {
  return list.reduce((acc, x) => {
      if (remove(x)){
          acc.remove.push(x);
      } else {
          acc.keep.push(x);
      }
      return acc;
  }, { keep: [], remove: []});
}