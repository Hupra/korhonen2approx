export function encode(x){
    return (1<<x);
}
export function decode(x) {
    return Math.floor(Math.log2(x));
}
export function encode_set(arr) {
    let result = 0;
    for (let x of arr) {
        result |= (1 << x);
    }
    return result;
}
export function decode_set(x){
    let arr = [];
    let mask = 1;
    let n = Math.floor(Math.log2(x)) + 1;
    for (let i = 0; i < n; i++) {
        if (x&mask) arr.push(i);
        mask <<= 1;
    }
    return arr;
}
export function cap(x,y) {
    return x & y;
}
export function cup(x, y) {
    return x | y;
}
export function diff(x, y) { // x \ y
    return x & ~y; // flip y, so we everything in x and not in y
}
export function remove_and_rshift_i(x, i) { // x = 1110, i = 2
    // remove i'th bit || x = 1010
    x &= ~(1 << i);
    // get bits right of i, -1 to go from 0100 to 0011 || lp = 0010
    let lp = x & ((1 << i) - 1);
    // get i and bits left of i, 1010^0010 = 1000
    let up = x ^ lp;
    // shift up once to the right ie. 1000 -> 0100, 0100|0010 = 0110
    return (up >> 1) | lp;
    // used on introduce nodes
    // Bi = [5,6,7,8,9]
    // Bj = [5,6,8,9]
    // can be called on Bi, with i=2 here to transform Bi into Bj
    // essentially, keep [5,6], delete [7], move [8,9] one to the left
}

export function add_ith_bit_f(x, i) {
    let lp = x & ((1 << i) - 1); // get everything to the right of i
    let up = x ^ lp; // get i and everything left of i
    up <<= 1; // insert empty space on ith position
    return up | lp;
    // used in forget nodes to NOT add v to bj
}
export function add_ith_bit_t(x, i) {
    let lp = x & ((1 << i) - 1); // get everything to the right of i
    let up = x ^ lp; // get i and everything left of i
    up <<= 1; // insert empty space on ith position
    return (up | lp) | (1 << i);
    // used in forget nodes to add v to bj
}
// Bi = [5,6,8,9]
// Bj = [5,6,7,8,9]
// x  = 1001, i=2, res=10101

// a>b
export function find_bag_diff(big,small){
    for (let i = 0; i < small.length; i++) {
        if(big[i]!==small[i]) return i;
    }
    return small.length;
}

export function idx_2_value(indices, B){
    return indices.map(idx => B[idx]);
}

export function print_state(cccx, B){
    let c1 = idx_2_value(decode_set(get_c1(cccx, B.length)), B);
    let c2 = idx_2_value(decode_set(get_c2(cccx, B.length)), B);
    let c3 = idx_2_value(decode_set(get_c3(cccx, B.length)), B);
    let X  = idx_2_value(decode_set(get_x( cccx, B.length)), B);
    // console.log("-----------------------------");

    let s1 = "{"+c1.toString()+"}";
    let s2 = "{"+c2.toString()+"}";
    let s3 = "{"+c3.toString()+"}";
    let s4 = "{"+X.toString()+"}";
    console.log("C1"+" ".repeat(s1.length-1)+"C2"+" ".repeat(s2.length-1)+"C3"+" ".repeat(s3.length-1)+"X");
    console.log(s1,s2,s3,s4);
}


export function init_U(n, h) {
    const handler = {
        get(target, property) {
            if (!(property in target)) {
                target[property] = -1;
            }
            return target[property];
        }
    };

    const U = new Array(n+1);
    for (let i = 0; i < n+1; i++) {
        U[i] = new Array(h+1);
        for (let j = 0; j < h+1; j++) {
            U[i][j] = new Proxy({}, handler);                    
        }
    }

    return U;
}

// options to allow for W>12
// * combine using strings
// * use bigint
// * stop computing on such big bags!

export function get_c1(cccx, w) {
    let mask = (1 << w) - 1;
    return cccx & mask;
}

export function get_c2(cccx, w) {
    let mask = (1 << w) - 1;
    return (cccx >> w) & mask;
}

export function get_c3(cccx, w) {
    let mask = (1 << w) - 1;
    return (cccx >> (w * 2)) & mask;
}

export function get_x(cccx, w) {
    let mask = (1 << w) - 1;
    return (cccx >> (w * 3)) & mask;
}

export function combine(c1,c2,c3,x,w) {
    return c1 | (c2<<w) | (c3<<w*2) | (x<<w*3);
}
export function get_bin_size(x) {
    let count = 0;
    while(x) {
        count += x & 1;
        x >>= 1;
    }
    return count;
}

export function make_nice(input) {
    let tree = JSON.parse(JSON.stringify(input));

    let rootNode = {id: 0, bag: [], name: 'r'};
    tree.nodes.push(rootNode);
    tree.edges.push({ "source": 0, "target": tree.nodes[0].id})

    let nextNodeId = tree.nodes.reduce((pre, cur) => Math.max(pre, cur.id), 0);
    console.log("root", rootNode);
  
    // bag_i cap bag_j
    function getIntersection(bag_i, bag_j) {
        return bag_i.filter(v => bag_j.includes(v));
    }
    // bag_i \ baj_j
    function getDifference(bag_i, bag_j) {
        return bag_i.filter(v => !bag_j.includes(v));
    }
  
    //create new node between parent and child
    function createNewNode(bag, parentNode, childNode) {
        let newNode = {
            id: ++nextNodeId,
            bag: bag,
            name: nextNodeId.toString()
        };
        tree.nodes.push(newNode);

        // parent -> new_node 
        let parentEdge = tree.edges.find(edge => edge.source === parentNode.id && edge.target === childNode.id);
        parentEdge.target = newNode.id;

        // new_node -> child 
        let newEdge = { source: newNode.id, target: childNode.id };
        tree.edges.push(newEdge);

        return newNode;
    }

    function replaceNode(i,j) {
        // from j -> ? to i -> i
        for (let edge of tree.edges) {
            if (edge.source === j.id) edge.source = i.id;
        }
        // remove i->j edge
        tree.edges = tree.edges.filter(edge => !(edge.source === i.id && edge.target === j.id));
        // remove j node
        tree.nodes = tree.nodes.filter(node => node.id !== j.id);
    }

    function processNode(node) {
        // find children
        let children = tree.edges.filter(edge => edge.source === node.id).map(edge => edge.target);

        // leafify the leaf
        if (children.length===0 && node.bag.length>0){

            let cur = node;
            for (let i = 1; i < node.bag.length+1; i++) { // +1 to length gives the empty bags that we need for the DP
                const next = {
                    id: ++nextNodeId,
                    bag: cur.bag.slice(0, -1),
                    name: nextNodeId.toString()
                };
                tree.nodes.push(next);
                tree.edges.push({source: cur.id, target: next.id});
                cur = next;
            };
        }

        if (children.length === 1){
            let i = node;
            let j = tree.nodes.find(n => n.id === children[0]);
            let cap = getIntersection(i.bag, j.bag);

            // copy 
            if(cap.length === i.bag.length && cap.length === j.bag.length){
                replaceNode(i,j);
                processNode(i);
            }

            //intro,forget
            else if(cap.length === Math.min(i.bag.length, j.bag.length) &&
                    Math.abs(i.bag.length-j.bag.length) === 1) processNode(j);

            // i is too big. -> shrink i to make it compatable with j
            else if(cap.length < i.bag.length) {
                let dif = getDifference(i.bag, j.bag);
                let new_node = createNewNode(i.bag.filter(v => v !== dif[0]), i, j);
                processNode(new_node);
            }
            // build up i to connect to j
            else if(cap.length < j.bag.length){
                let dif = getDifference(j.bag, i.bag);
                let new_node = createNewNode([...i.bag, dif[0]], i, j);
                processNode(new_node);
            }          
        }

        if (children.length === 2){
            let i = node;
            let j1 = tree.nodes.find(n => n.id === children[0]);
            let j2 = tree.nodes.find(n => n.id === children[1]);
            let new_node1 = createNewNode([...i.bag], i, j1);
            let new_node2 = createNewNode([...i.bag], i, j2);
            processNode(new_node1);
            processNode(new_node2);
        }

        if (children.length > 2){
            let i = node;
            let nn1 = createNewNode([...i.bag], i, tree.nodes.find(n => n.id === children[0]))
            
            let nn2 = {
                id: ++nextNodeId,
                bag: [...i.bag],
                name: nextNodeId.toString()
            };
            tree.nodes.push(nn2);

            // iherit edges from i -> j to now be i' -> j
            for (let x = 1; x < children.length; x++) {
                const j_id = children[x];
                let edge = tree.edges.find(edge => edge.source === i.id && edge.target === j_id);
                edge.source = nn2.id;
            }

            // i -> i' 
            let newEdge = { source: i.id, target: nn2.id };
            tree.edges.push(newEdge);

            processNode(nn1);
            processNode(nn2);
        }
    }
  
    processNode(rootNode);
    return tree;
}


export function get_bag(t, i){
    return t.nodes.find(n => n.id === i).bag;
}
export function get_node(t, i){
    return t.nodes.find(n => n.id === i);
}
export function get_children(t,i){
    return t.edges.filter(edge => edge.source === i).map(edge => edge.target);
}
export function get_parent(t,i){
    let parent = t.edges.find(edge => edge.target === i);
    if(parent !== undefined) return parent.source;
    return -1;
}

