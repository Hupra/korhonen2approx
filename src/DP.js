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
    let dec = extract(cccx);
    let c1 = idx_2_value(decode_set(dec[0]), B);
    let c2 = idx_2_value(decode_set(dec[1]), B);
    let c3 = idx_2_value(decode_set(dec[2]), B);
    let X  = idx_2_value(decode_set(dec[3]), B);
    // console.log("-----------------------------");

    let s1 = "{"+c1.toString()+"}";
    let s2 = "{"+c2.toString()+"}";
    let s3 = "{"+c3.toString()+"}";
    let s4 = "{"+X.toString()+"}";
    console.log("C1"+" ".repeat(s1.length-1)+"C2"+" ".repeat(s2.length-1)+"C3"+" ".repeat(s3.length-1)+"X");
    console.log(s1,s2,s3,s4);
}

// takes nice tree decomposition
export function init_U(nice) {
    let n = 0;
    let h = 0;
    for (const node of nice.nodes) {
        n = Math.max(n, node.id);
        h = Math.max(h, node.bag.length);
    }

    const handler = {
        get(target, property) {
            if (!(property in target)) {
                target[property] = 42069;
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

// export function get_c1(cccx, w) {
//     let mask = (1 << w) - 1;
//     return cccx & mask;
// }
// export function get_c2(cccx, w) {
//     let mask = (1 << w) - 1;
//     return (cccx >> w) & mask;
// }
// export function get_c3(cccx, w) {
//     let mask = (1 << w) - 1;
//     return (cccx >> (w * 2)) & mask;
// }
// export function get_x(cccx, w) {
//     let mask = (1 << w) - 1;
//     return (cccx >> (w * 3)) & mask;
// }
// export function combine(c1,c2,c3,x,w) {
//     return c1 | (c2<<w) | (c3<<w*2) | (x<<w*3);
// }

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
export function combine(c1,c2,c3,x) {
    return c1.toString() + "," + c2.toString() + "," + c3.toString() + "," + x.toString();
}
export function extract(cccx) {
    return cccx.split(",").map(c => parseInt(c));
}


export function get_bin_size(x) {
    let count = 0;
    while(x) {
        count += x & 1;
        x >>= 1;
    }
    return count;
}

export function valid_split(cccx, w, h) {
    let [c1,c2,c3,X] = extract(cccx);
    return (get_bin_size(c1)+h < w) && (get_bin_size(c2)+h < w) && (get_bin_size(get_c3(c3))+h < w)
}

export function make_nice(input) {
    let tree = JSON.parse(JSON.stringify(input));

    let rootNode = {id: 0, bag: [], name: 'r', x: 45, y: 85, stuck: true};
    tree.nodes.push(rootNode);
    tree.edges.push({ "source": 0, "target": tree.nodes[0].id})

    let nextNodeId = tree.nodes.reduce((pre, cur) => Math.max(pre, cur.id), 0);
  
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
            console.log(cur)
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

export function nice_color(tree) {
    for (const node of tree.nodes) {
        let children = tree.edges.filter(edge => edge.source === node.id).map(edge => edge.target);
        switch (children.length) {
            case 1:
                let child = tree.nodes.find(node => node.id === children[0]);
                if(node.bag.length>child.bag.length) node.color = "skyblue"; // intro
                else node.color = "chartreuse"; // forget
                break;
            case 2: // join 
                node.color = "orange";
                break;
            default: // leaf
                node.color = "#D56EFF";
                break;
        }
    }
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

// the // takes graph and nice tree decomposition
export function helper_structures(g, nice) {
    let t = nice;

    // get graph in leaves order so we can fill U bottom up
    let sorted_nodes = [];
    for (const node of t.nodes) {
        let counter = 0;
        let parent = get_node(t, get_parent(t, node.id));
        while(parent){
            counter++;
            parent = get_node(t, get_parent(t, parent.id));
        }
        sorted_nodes.push([node.id, counter]);
    }
    sorted_nodes.sort((a, b) => b[1] - a[1]);
    sorted_nodes = sorted_nodes.map(x=>x[0]);

    // create matrix for graph edge lookup, undirected
    let gn = g.nodes.reduce((pre, cur) => Math.max(pre, cur.id), 0)+1;
    let has_edge = Array.from({ length: gn}, () => Array(gn).fill(0));
    for (const e of g.edges) {
        has_edge[e.source][e.target] = 1;
        has_edge[e.target][e.source] = 1;
    }

    // create adj for graph
    let adj = Array.from({ length: gn }, () => []);
    for (const e of g.edges) {
        adj[e.source].push(e.target);
        adj[e.target].push(e.source);
    }

    // find bag
    let tn = t.nodes.reduce((pre, cur) => Math.max(pre, cur.id), 0)+1;
    let find_bag = Array.from({ length: tn }, () => []);
    for (const node of t.nodes) {
        find_bag[node.id] = node.bag;
    }

    // find children
    let find_children = Array.from({ length: tn }, () => []);
    for (const edge of t.edges) {
        find_children[edge.source].push(edge.target);
    }

    return {sorted_nodes, has_edge, adj, find_bag, find_children};
}
















export function try_h(U, target_bag, h, g, nice) {
    const {sorted_nodes, has_edge, adj, find_bag, find_children} = helper_structures(g, nice);

    let newcounter = 0;
    let repcounter = 0;

    function rec(i,h,cccx){
        // out of bounds
        if(h<0) return Infinity;

        // return value if res has been computed before;
        if (U[i][h][cccx] !== 42069) ++repcounter;
        if (U[i][h][cccx] !== 42069) return U[i][h][cccx];
        ++newcounter;

        // let Bi = get_bag(nice_td,i);
        let Bi = find_bag[i];
        // let children = get_children(nice_td,i);
        let children = find_children[i];


        if (children.length === 0)
        {
            if(h>0) return Infinity;
            return 0;
        }
        else if (children.length === 2)
        {
            let j = children[0];
            let k = children[1];

            let Bi_X  = extract(cccx)[3];
            let Bi_X_size = get_bin_size(Bi_X);
            let zum = h + Bi_X_size;

            let best = Infinity;
            
            // supper slow sadly :!
            for (let h1 = Bi_X_size; h1 <= h; h1++) {
                let h2 = zum-h1;
                best = Math.min(best, rec(j,h1,cccx)+rec(k,h2,cccx))
            }

            U[i][h][cccx] = best;
        }
        else if (children.length === 1)
        {
            let j = children[0];
            // let Bj = get_bag(nice_td, j);
            let Bj = find_bag[j];

            // current parti
            let [Bi_c1, Bi_c2, Bi_c3, Bi_X] = extract(cccx);

            if(Bi.length > Bj.length){
                // Bi > Bj
                // introduce
                
                // check if C1∩Bi, C2∩Bi, C3∩Bi are connected
                let arr1 = idx_2_value(decode_set(Bi_c1), Bi);
                let arr2 = idx_2_value(decode_set(Bi_c2), Bi);
                let arr3 = idx_2_value(decode_set(Bi_c3), Bi);

                for (const u of arr1) {
                    for (const v of arr2) { // C1 <-> C2
                        if(has_edge[u][v]){
                            U[i][h][cccx] = Infinity;
                            return Infinity;
                    }}                        
                    for (const v of arr3) { // C1 <-> C3
                        if(has_edge[u][v]){
                            U[i][h][cccx] = Infinity;
                            return Infinity;
                }}};
                for (const u of arr2) {
                    for (const v of arr3) { // C2 <-> C3
                        if(has_edge[u][v]){
                            U[i][h][cccx] = Infinity;
                            return Infinity;
                }}};

                let v = find_bag_diff(Bi,Bj);
                
                // |{v} ∩ X|             [h − |{v} ∩ X|] <---- this is how we determine an X is used!
                let v_cap_X = Math.max((encode(v)&Bi_X)>0,0);
                
                // next part
                let Bj_c1 = remove_and_rshift_i(Bi_c1, v);
                let Bj_c2 = remove_and_rshift_i(Bi_c2, v);
                let Bj_c3 = remove_and_rshift_i(Bi_c3, v);
                let Bj_X  = remove_and_rshift_i(Bi_X,  v);
            
                // visual -> move v up, and push left part 1 to the right
                let cvcvcvxv = combine(Bj_c1, Bj_c2, Bj_c3, Bj_X);

                //|X ∩ Bj ∩ Bi -- since Bj <= Bi we can just check X cap Bj
                let X_cap_Bj_cap_Bi = get_bin_size(Bj_X)
                                                  // we wanna inc by, (h - what is also in this bag)
                U[i][h][cccx] = rec(j, h-v_cap_X, cvcvcvxv) + ((h-v_cap_X)-X_cap_Bj_cap_Bi);
                // + ((h-v_cap_X)-X_cap_Bj_cap_Bi);
            }
            else{
                // Bj > Bi
                // forget
                let v = find_bag_diff(Bj,Bi); // big,small

                // next part
                let Bj_c1 = add_ith_bit_f(Bi_c1, v);
                let Bj_c2 = add_ith_bit_f(Bi_c2, v);
                let Bj_c3 = add_ith_bit_f(Bi_c3, v);
                let Bj_X  = add_ith_bit_f(Bi_X,  v);

                let Bj_c1_v = add_ith_bit_t(Bi_c1, v);
                let Bj_c2_v = add_ith_bit_t(Bi_c2, v);
                let Bj_c3_v = add_ith_bit_t(Bi_c3, v);
                let Bj_X_v  = add_ith_bit_t(Bi_X,  v);

                // //|X ∩ Bj ∩ Bi -- since Bi <= Bj we can just check X cap Bi
                let X_cap_Bj_cap_Bi = get_bin_size(Bi_X);
                
                // speed up, to avoid doing the same cases multiple times, where the same cas is one where the lements in c3 could just be be elements in c2
                // if(Bj_c1===0 && Bj_c2===0 && Bj_c3===0) {
                //     let cvccx = combine(Bj_c1_v, Bj_c2,   Bj_c3,   Bj_X,   Bj.length);
                //     let cccxv = combine(Bj_c1,   Bj_c2,   Bj_c3,   Bj_X_v, Bj.length);

                //     U[i][h][cccx] = Math.min(
                //         rec(j,h,cvccx),
                //         rec(j,h,cccxv)
                //     ) + (h-X_cap_Bj_cap_Bi);
                // }else if(Bj_c2===0 && Bj_c3===0) {
                //     let cvccx = combine(Bj_c1_v, Bj_c2,   Bj_c3,   Bj_X,   Bj.length);
                //     let ccvcx = combine(Bj_c1,   Bj_c2_v, Bj_c3,   Bj_X,   Bj.length);
                //     let cccxv = combine(Bj_c1,   Bj_c2,   Bj_c3,   Bj_X_v, Bj.length);

                //     U[i][h][cccx] = Math.min(
                //         rec(j,h,cvccx),
                //         rec(j,h,ccvcx),
                //         rec(j,h,cccxv)
                //     ) + (h-X_cap_Bj_cap_Bi);
                // }else{
                //     let cvccx = combine(Bj_c1_v, Bj_c2,   Bj_c3,   Bj_X,   Bj.length);
                //     let ccvcx = combine(Bj_c1,   Bj_c2_v, Bj_c3,   Bj_X,   Bj.length);
                //     let cccvx = combine(Bj_c1,   Bj_c2,   Bj_c3_v, Bj_X,   Bj.length);
                //     let cccxv = combine(Bj_c1,   Bj_c2,   Bj_c3,   Bj_X_v, Bj.length);

                //     // if((h-X_cap_Bj_cap_Bi)<0) console.log("ERROR FOUND", h, X_cap_Bj_cap_Bi);
                //     // return 0;

                //     U[i][h][cccx] = Math.min(
                //         rec(j,h,cvccx),
                //         rec(j,h,ccvcx),
                //         rec(j,h,cccvx),
                //         rec(j,h,cccxv)
                //     ) + (h-X_cap_Bj_cap_Bi);
                //     // + (h-X_cap_Bj_cap_Bi)
                // }

                let cvccx = combine(Bj_c1_v, Bj_c2,   Bj_c3,   Bj_X);
                let ccvcx = combine(Bj_c1,   Bj_c2_v, Bj_c3,   Bj_X);
                let cccvx = combine(Bj_c1,   Bj_c2,   Bj_c3_v, Bj_X);
                let cccxv = combine(Bj_c1,   Bj_c2,   Bj_c3,   Bj_X_v);

                // //|X ∩ Bj ∩ Bi -- since Bi <= Bj we can just check X cap Bi
                // let X_cap_Bj_cap_Bi = get_bin_size(Bi_X);
                //                                   // we wanna inc by h - what is also in this bag

                U[i][h][cccx] = Math.min(
                    rec(j,h,cvccx),
                    rec(j,h,ccvcx),
                    rec(j,h,cccvx),
                    rec(j,h,cccxv)
                ) + (h-X_cap_Bj_cap_Bi);
            }
        } 
        return U[i][h][cccx];
    }


    function combi(c1,c2,c3,X,next,stop,f,i,h){
        if(next<stop){
            let mask = encode(next);
            combi(c1|mask,c2,c3,X,next+1,stop,f,i,h);
            combi(c1,c2|mask,c3,X,next+1,stop,f,i,h);
            combi(c1,c2,c3|mask,X,next+1,stop,f,i,h);
            combi(c1,c2,c3,X|mask,next+1,stop,f,i,h);
        }else{
            f(i,h,combine(c1,c2,c3,X,stop));
            // console.log(c1.toString(2),c2.toString(2),c3.toString(2),X.toString(2))
        }
    }
    
    // sped up version of combi, that reduces dublicate checks, and validates the split before attempting it.
    function combi2(c1,c2,c3,X,next,stop,f,i,h){
        if(next<stop){
            let mask = encode(next);
            if(c1===0 && c2===0 && c3===0){
                combi2(c1|mask,c2,c3,X,next+1,stop,f,i,h);
                combi2(c1,c2,c3,X|mask,next+1,stop,f,i,h);
            } else if (c2 === 0 && c3 === 0) {
                combi2(c1|mask,c2,c3,X,next+1,stop,f,i,h);
                combi2(c1,c2|mask,c3,X,next+1,stop,f,i,h);
                combi2(c1,c2,c3,X|mask,next+1,stop,f,i,h);
            } else {
                combi2(c1|mask,c2,c3,X,next+1,stop,f,i,h);
                combi2(c1,c2|mask,c3,X,next+1,stop,f,i,h);
                combi2(c1,c2,c3|mask,X,next+1,stop,f,i,h);
                combi2(c1,c2,c3,X|mask,next+1,stop,f,i,h);
            }
        }else{
            let c1_size = get_bin_size(c1);
            let c2_size = get_bin_size(c2);
            let c3_size = get_bin_size(c3);
            let  X_size = get_bin_size(X);

            // f(i,h,combine(c1,c2,c3,X,stop));

            
            // check |(Ci cap W) cup X| < W
            // check |(Ci cap W)| <= W/2
            // check |(Ci cap X)| <= h
            if( (Math.max(c1_size, c2_size, c3_size)+h < stop) &&
                (Math.max(c1_size, c2_size, c3_size) <= stop/2) &&
                (X_size <= h) ){

                f(i,h,combine(c1,c2,c3,X,stop));
            }
            // f(i,h,combine(c1,c2,c3,X,stop));
        }
    }

    combi2(0,0,0,0,0,find_bag[target_bag].length,rec,target_bag,h);
}







export function res_h(U, target_bag, h) {
    return Object.entries(U[target_bag][h]).filter((arr) => arr[1] !== Infinity);
}







export function find_res(U, target_bag, h, g, nice, cccx) {

    const {sorted_nodes, has_edge, adj, find_bag, find_children} = helper_structures(g, nice);
    
    let X = new Set();
    let r_C1 = new Set();
    let r_C2 = new Set();
    let r_C3 = new Set();
    
    function dfs_X(i,h,cccx)
    {
        // console.log("dfs", i);
        let Bi = find_bag[i];
        let children = find_children[i];

        // current parti
        let [Bi_c1, Bi_c2, Bi_c3, Bi_X] = extract(cccx);

        // save this x in X
        let this_X = idx_2_value(decode_set(Bi_X), Bi);
        let this_C1 = idx_2_value(decode_set(Bi_c1), Bi);
        let this_C2 = idx_2_value(decode_set(Bi_c2), Bi);
        let this_C3 = idx_2_value(decode_set(Bi_c3), Bi);
        for (const x of this_X) X.add(x);
        for (const x of this_C1) r_C1.add(x);
        for (const x of this_C2) r_C2.add(x);
        for (const x of this_C3) r_C3.add(x);

        if (children.length === 1) {

            let j = children[0];
            let Bj = find_bag[j];


            if(Bi.length > Bj.length){

                let v = find_bag_diff(Bi,Bj);
                
                // |{v} ∩ X|             [h − |{v} ∩ X|] <---- this is how we determine an X is used!
                let v_cap_X = Math.max((encode(v)&Bi_X)>0,0);
                
                // next part
                let Bj_c1 = remove_and_rshift_i(Bi_c1, v);
                let Bj_c2 = remove_and_rshift_i(Bi_c2, v);
                let Bj_c3 = remove_and_rshift_i(Bi_c3, v);
                let Bj_X  = remove_and_rshift_i(Bi_X,  v);
                // visual -> move v up, and push left part 1 to the right
            
                let cvcvcvxv = combine(Bj_c1, Bj_c2, Bj_c3, Bj_X);

                dfs_X(j, h-v_cap_X, cvcvcvxv);

            } else {

                // Bj > Bi
                // forget
                let v = find_bag_diff(Bj,Bi); // big,small

                // next part
                let Bj_c1 = add_ith_bit_f(Bi_c1, v);
                let Bj_c2 = add_ith_bit_f(Bi_c2, v);
                let Bj_c3 = add_ith_bit_f(Bi_c3, v);
                let Bj_X  = add_ith_bit_f(Bi_X,  v);

                let Bj_c1_v = add_ith_bit_t(Bi_c1, v);
                let Bj_c2_v = add_ith_bit_t(Bi_c2, v);
                let Bj_c3_v = add_ith_bit_t(Bi_c3, v);
                let Bj_X_v  = add_ith_bit_t(Bi_X,  v);

                let cvccx = combine(Bj_c1_v, Bj_c2,   Bj_c3,   Bj_X);
                let ccvcx = combine(Bj_c1,   Bj_c2_v, Bj_c3,   Bj_X);
                let cccvx = combine(Bj_c1,   Bj_c2,   Bj_c3_v, Bj_X);
                let cccxv = combine(Bj_c1,   Bj_c2,   Bj_c3,   Bj_X_v);

                // when i swap to min instead of max, i have to take care to avoid -1
                // done by chaning default value to 42069 instead of -1
                let cases = [cvccx, ccvcx, cccvx, cccxv];
                let best_case = 0;

                // console.log("all 4", U[j][h][cases[0]], U[j][h][cases[1]], U[j][h][cases[2]], U[j][h][cases[3]]);

                for (let cid = 1; cid < 4; cid++) {
                    if (U[j][h][cases[cid]] < U[j][h][cases[best_case]]) {
                        best_case = cid;
                    }
                }
                dfs_X(j, h, cases[best_case]);
            }
        } else if (children.length === 2) {

            let j = children[0];
            let k = children[1];

            let Bi_X_size = get_bin_size(Bi_X);
            let zum = h + Bi_X_size;

            let best_h1  = Bi_X_size;
            let best_val = Infinity;
            
            // supper slow sadly :!
            for (let h1 = Bi_X_size; h1 <= h; h1++) {
                let h2 = zum-h1;
                if((U[j][h1][cccx] + U[k][h2][cccx]) <= best_val){
                    best_val = U[j][h1][cccx] + U[k][h2][cccx];
                    best_h1 = h1;
                }
            }

            let best_h2 = zum-best_h1;

            dfs_X(j, best_h1, cccx);
            dfs_X(k, best_h2, cccx);
        }
    }

    dfs_X(target_bag, h, cccx);
    return {
        C1: Array.from(r_C1),
        C2: Array.from(r_C2),
        C3: Array.from(r_C3),
        X: Array.from(X)
    }
}
