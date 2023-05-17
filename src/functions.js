import M from 'materialize-css';

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


//   export function graph_to_cyto(input) {
//     const nodes = input.nodes.map(node => {
//       return { data: { id: node.id, label: node.label, content: node.content } };
//     });
    
//     const edges = input.edges.map(edge => {
//       return { data: { source: edge.source, target: edge.target } };
//     });
    
//     return { nodes, edges };
//   }


// export function flownetwork_to_cyto(input, zeroes=false) {
//     const nodes = input.nodes.map(node => {
//         return { data: { id: node.id, label: node.label, content: node.content }, style: { "background-color": node.color} };
//       });

//     const edges = input.edges.filter(edge => edge.capacity !== 0).map(edge => {
//         return { data: { source: edge.source, target: edge.target } };
//     });

//     return { nodes, edges };
// }

export function correcto(x, y, text) {
  M.toast({ html: text, displayLength: 2000});
  const tc = document.getElementById('toast-container');
  tc.style.left = `${x}px`;
  tc.style.top = `${y-70}px`;
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


export function split2(list, f) {
  return list.reduce((acc, x) => {
      if (f(x)){
          acc.T.push(x);
      } else {
          acc.F.push(x);
      }
      return acc;
  }, { T: [], F: []});
}

export function cap(a,b){
  return a.filter(x => b.includes(x));
}
export function cup(a,b){
  return [...new Set([...a, ...b])]
}
export function list_is_same(a,b){
  let x = [...a];
  let y = [...b];
  x.sort((a,b)=>a-b);
  y.sort((a,b)=>a-b);
  return (JSON.stringify(x) === JSON.stringify(y))
}

export function T_2_TD(tree, C, X, max_id=false){

  console.log(tree);

  if(!max_id) max_id = tree.nodes.length;

  const Tp = {
    "nodes" : [{ "id": 0, "bag": X, "name": "X"}],
    "edges" : []
  };
  for (let i = 0; i < C.length; i++) {
    if(C[i].length === 0) continue; // skip component if empty
    for (let j = 0; j < tree.nodes.length; j++) {
      const tree_node = {...tree.nodes[j]};
      tree_node.sup = (i+1).toString();
      tree_node.id = tree_node.id + (i*max_id);
      tree_node.group = i+1;
      const Ci_union_X = Array.from(new Set([...C[i], ...X]));
      const CiX_intersect_bag = Ci_union_X.filter(x => tree_node.bag.includes(x));
      tree_node.bag = CiX_intersect_bag;
      Tp.nodes.push(tree_node);
      if(tree_node.name.startsWith("W")){
          Tp.edges.push({"source": 0, "target": tree_node.id});
      }
    }
    for (let j = 0; j < tree.edges.length; j++) {
      const tree_edge = {...tree.edges[j]};
      tree_edge.source = tree_edge.source + (i*max_id);
      tree_edge.target = tree_edge.target + (i*max_id);
      Tp.edges.push(tree_edge);
    }
  }
  return Tp;
}

export function int_to_alphabet(i, alphabet="ABZDEFGHIJKLMNOPQRSUV") {
  if(i<=0) return ""
  if(i===1) return "W"
  let A = alphabet.split('');
  const AL = A.length
  function f(i)
  {
    if(i<AL) return alphabet[i%AL];
    return f(Math.floor(i/AL)-1) + alphabet[i%AL]
  }
  return f(i-2);
}



export function svg_tree_to_file(t){

  let counter = 1;

  // convert edges
  let edges = t.links.map(edge => {
      return {
          old_source: edge.source.id,
          old_target: edge.target.id
      }
  });

  // convert nodes
  let nodes = t.nodes.map(node => {
      return {
          id: node.id,
          bag: [...node.bag],
      }
  });

  nodes.sort((a,b) => b.bag.length - a.bag.length);

  nodes = nodes.map(node => {
      for (let i = 0; i < edges.length; i++)
      {
          if (edges[i].old_source === node.id) edges[i].source = counter;
          if (edges[i].old_target === node.id) edges[i].target = counter;
      }
      return {
          name: int_to_alphabet(counter),
          id: counter++,
          bag: [...node.bag],
      }
  });

  edges = edges.map(edge => {return {source: edge.source, target: edge.target}})


  return {nodes, edges};
}

export function svg_graph_to_file(g){

  // convert edges
  let edges = g.links.map(edge => {
      return {
          source: edge.source.id,
          target: edge.target.id
      }
  });

  // convert nodes
  let nodes = g.nodes.map(node => {
      return {id: node.id};
  });

  return {nodes, edges};
}

export function set_graph_direction(graph) {
  const nodes = graph.nodes;
  let edges = graph.edges;
  let new_edges = [];

  let visited = new Array(nodes.reduce((max, node) => Math.max(max, node.id), 0)+1).fill(false);
  let used = new Array(edges.length).fill(false);

  function dfs(parent)
  {
      visited[parent] = true;

      for (let i = 0; i < edges.length; i++)
      {
          const edge = edges[i];
          if(!used[i] && (edge.source === parent||edge.target === parent))
          {
              used[i] = true;
              // add new correct edge
              const child = edge.source===parent ? edge.target : edge.source;
              new_edges.push({source: parent, target: child});
              // visit child
              if(!visited[child]) dfs(child);
          }
      }
  }
  dfs(nodes[0].id);

  return {nodes, edges: new_edges}
}


