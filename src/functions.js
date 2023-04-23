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

export function T_2_TD(tree, C, X){
  const Tp = {
    "nodes" : [{ "id": 0, "bag": X, "name": "X"}],
    "edges" : []
  };
  for (let i = 0; i < C.length; i++) {
    for (let j = 0; j < tree.nodes.length; j++) {
      const tree_node = {...tree.nodes[j]};
      tree_node.sup = (i+1).toString();
      tree_node.id = tree_node.id + (i*tree.nodes.length);
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
      console.log(tree_edge);
      tree_edge.source = tree_edge.source + (i*tree.nodes.length);
      tree_edge.target = tree_edge.target + (i*tree.nodes.length);
      Tp.edges.push(tree_edge);
    }
  }
  return Tp;
}


