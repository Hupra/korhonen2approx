import * as d3 from 'd3';
import forceBoundary from 'd3-force-boundary';
import {split, cap} from "./functions.js"

// const forceBoundary = d3fb.forceBoundary;


class Edge {
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }
}

export class FindHomebags {
    constructor() {
        this.n = 50;
        this.nodes = [];
        this.adj = Array.from({ length: this.n }, () => []);
        this.v = [];
                
        // dist and homebag of vertex
        this.d  = Array(this.n).fill(this.n+1); // d[tree_id] -> dist to root
        this.hb = Array(this.n).fill(-1); // hb[vertex_element] -> tree_id
        // dist of vertex element to root = d[hb[vertex_element]]

        this.tx_nodes = [];
        this.tx_edges = [];
    }
    add_node(node, root=false){
        if(root) this.root = node.id;
        this.nodes[node.id] = {name: node.name, bag: node.bag};
        this.tx_nodes.push({id: node.id, name: node.name, bag: [], sup: "X"});
    }
    add_edge(a, b, c = null) {
        const x = new Edge(a, b, c);
        const y = new Edge(b, a, c);
        this.adj[a].push(x);
        this.adj[b].push(y);
        this.tx_edges.push({source: a, target: b});
    }
    visited(vertex) {
        return this.v[vertex];
    }
    visit(vertex) {
        this.v[vertex] = true;
    }
    dfs() {
        this.v = Array(this.n).fill(false);
        const stack = [[this.root, 0]];
        while (stack.length) {
            const [node, distance] = stack.pop();
            if (this.visited(node)) continue;
            this.visit(node);

            //set node dist
            this.d[node] = distance;

            //set homebag for each vertex
            for (const vertex of this.nodes[node].bag) {
                if(this.hb[vertex] === -1) this.hb[vertex] = node;}

            // add children to stack
            this.adj[node].forEach(edge => {
                stack.push([edge.b, distance+1]);});
        }
    }
    build_TX(X){
        for (const x of X) {
            const stack = [this.hb[x]]; // no stack needed, change to just a variable, as there is only 1 way to go
            while(stack.length) {
                const node = stack.pop();
                this.adj[node].forEach(edge => {
                    let da = this.d[edge.a];
                    let db = this.d[edge.b];
                    if(db<da){ // check if distance is shorter, aka do we move up the tree or not
                        stack.push(edge.b);
                        this.tx_nodes.find(node => node.id === edge.b).bag.push(x);           
                    }
                });
            }
        }
    }
}

export class FindComponents{
    constructor(n, W=[]) {
        this.n          = n;
        this.v          = Array(n).fill(true);
        this.adj        = Array.from({ length: n }, () => []);
        this.components = []; 
      }

      add_edge(a, b, c = null) {
        const x = new Edge(a, b, c);
        const y = new Edge(b, a, c);
        this.adj[a].push(x);
        this.adj[b].push(y);
      }

      visited(vertex) {
        return this.v[vertex];
      }

      visit(vertex) {
        this.v[vertex] = true;
      }

      dfs(vertex) {
        const component = [];
        const stack     = [vertex];
      
        while (stack.length) {
          const v = stack.pop();
          if (this.visited(v)) continue;
          this.visit(v);
          component.push(v);
      
          this.adj[v].forEach(edge => {
              stack.push(edge.b);
          });
        }
        component.sort((a, b) => a - b);
        return component;
      }

      run(combine = false, W) {
        for (let i = 0; i < this.n; i++) {
          if (this.visited(i)) continue;
          this.components.push(this.dfs(i));
        }
        if(combine){
            while(this.components.length>3){
                this.components.sort((a, b) => cap(b, W).length - cap(a, W).length);
                let li = this.components.length-1;
                let comb = [...this.components[li - 1], ...this.components[li]];
                this.components.splice(li - 1, 2, comb);
                this.components.sort((a, b) => cap(b, W).length - cap(a, W).length);
            }
        }
        this.components.sort((a, b) => b.length - a.length);
        return this.components;
      }
}

export class Graph {
    constructor(graph, svg) {

        this.nodes = graph.nodes.map(node => {return {...node}});
        this.links = graph.edges.map(link => {return {...link}});
        this.svg   = svg;

        this.link_width  = 4;
        this.link_color  = "#ccc";
        this.node_radius = 16;
        this.node_color  = "white";
        this.node_class = "";
        this.w_ratio = 0;
        this.h_ratio = 0;
        this.h_top = 0;
        this.h_bot = 0;
        this.w_left = 0;
        this.w_right = 0;
        this.parent = null;
        this.charge = -400;

        this.C = [];
        this.X = [];
        this.W = [];
    }

    render(){
        this.svg.selectAll("*").remove();
        this.simulation      = this.create_svg_simulation();
        this.create_blobs();
        this.svg_links       = this.create_svg_links();
        this.svg_temp_line   = this.create_temp_line();
        this.svg_nodes       = this.create_svg_nodes();
        this.svg_node_labels = this.create_svg_node_labels();
        this.svg_node_W_label= this.create_svg_node_label_in_W();
        if(this.dX) this.svg_node_dX = this.create_svg_dx();
        this.create_svg_simulation_tick();
    }

    get_component(element){
        for (let i = 0; i < this.C.length; i++) {
            if(this.C[i].includes(parseInt(element))) return i+1;
        }
        return 0;
    }

    create_temp_line(){
        return this.svg.append("line")
        .attr('stroke', this.link_color)
        .attr('stroke-width', this.link_width)
        .attr("visibility", "hidden");
    }

    create_svg_links(){
        return this.svg
        .append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(this.links)
        .enter().append('line')
        .attr('stroke', edge => edge.color ? edge.color : this.link_color)
        .attr('stroke-width', this.link_width);
    }

    create_svg_nodes(){
        this.create_svg_nodes_bg() // bg nodes
        this.create_svg_nodes_W() // bg nodes

        return this.svg
        .append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(this.nodes)
        .enter().append('circle')
        .attr('r', this.node_radius)
        .attr('fill', node => node.color ? node.color : this.node_color)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('idx', node => node.id)
        // .classed("node_in_w2", d => this.W.includes(d.id))
        .call(d3.drag()
            .on('start', (e,d) => {
                if (!e.active) this.simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on('drag', (e,d) => {
                d.fx = e.x;
                d.fy = e.y;
            })
            .on('end', (e,d) => {
                if (!e.active) this.simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }
        ));
    }
    create_svg_nodes_bg(){
        this.node_bg = this.svg
        .append('g')
        .attr('class', 'nodes-bg')
        .selectAll('circle')
        .data(this.nodes)
        .enter().append('circle')
        .attr('r', this.node_radius)
        .attr('idx', node => node.id);
    }
    create_svg_nodes_W(){
        this.node_W = this.svg
        .append('g')
        .attr('class', 'nodes-W')
        .selectAll('circle')
        .data(this.nodes.filter(node => this.W.includes(node.id)))
        .enter().append('circle')
        .attr('r', this.node_radius+3)
        .attr('idx', node => node.id);
    }
    create_svg_node_labels(text_function = node => node.id){
        return this.svg
        .append("g")
        .attr("class", "node-labels")
        .selectAll("text")
        .data(this.nodes)
        .enter().append("text")
        .text(text_function)
        .classed("x", d => {
            return this.X.includes(d.id);
        })
        .attr("text-anchor", "middle")
        .attr('fill', "black")
    }

    create_svg_node_label_in_W(text_function = node => node.id){
        return this.svg
        .append("g")
        .attr("class", "node-labels")
        .selectAll("text")
        .data(this.nodes.filter(node => this.W.includes(text_function(node))))
        .enter().append("text")
        .text("W")
        .classed("node_w", true)
        .attr("text-anchor", "middle")
        .attr('fill', "white")
        .attr("stroke", "black") // add white stroke color
        .attr("stroke-width", "3px") // set stroke width to 1px
        .style("paint-order", "stroke")
    }

    create_svg_dx(){
        return this.svg
        .append("g")
        .attr("class", "node-dX")
        .selectAll("text")
        .data(this.nodes.filter(node => node.dx !== undefined))
        .enter().append("text")
        .text(node => node.dx.toString() )
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr('fill', "white")
        .attr("stroke", "black") // add white stroke color
        .attr("stroke-width", "3px") // set stroke width to 1px
        .style("paint-order", "stroke")
    }

    svg_set_component_color(f = id => id){
        // this.svg_nodes.attr('class', d => {
        //     if(this.X.includes(f(d.id))) return "X";
        //     return "C"+this.get_component(f(d.id)).toString();
        // });
        this.svg_nodes.attr('class', d => {
            if(this.X.includes(f(d.id))) return "X";
            // if(this.W.includes(f(d.id))) return "C"+this.get_component(f(d.id)).toString();
            return "C"+this.get_component(f(d.id)).toString();
            return "";
        });
        // this.svg_nodes.classed("node_in_w", d => this.W.includes(d.id));
        this.svg_node_labels.classed("X", d => {
            return this.X.includes(f(d.id));
        });
        
        this.svg_links.attr('class', d => {
            const ac = this.get_component(f(d.source.id));
            const bc = this.get_component(f(d.target.id));
            if(ac === bc) return "C"+ac.toString();
            return "";
        });

        this.svg_links.classed("opacity", d => {
            return this.X.includes(f(d.source.id)) || this.X.includes(f(d.target.id));
        });

        if(this.node_W) {
            this.node_W.classed("selected", d => {
                return this.X.includes(f(d.id));
            });
        }
    }

    // think this can be removed now
    svg_set_highlight(){
        this.svg_node_labels
        .classed("X", d => {
            return this.X.includes(d.id);
        });
    }

    catmullRomSpline(points, tension = 0.5, closed = true) {
        if (points.length < 2) return '';
    
        let lineGenerator;
        if (closed) {
            lineGenerator = d3.line().curve(d3.curveCatmullRomClosed.alpha(tension));
        } else {
            lineGenerator = d3.line().curve(d3.curveCatmullRom.alpha(tension));
        }
    
        const pathData = lineGenerator(points);
        return pathData;
    }

    create_blobs(){

        this.svg_blobs = this.svg
        .append('g')
        .attr('class', 'blobs')
        .selectAll('path');

        this.svg_blobs_title = this.svg
        .append('g')
        .attr('class', 'blobs-title')
        .selectAll('text');
    }

    update_blobs(){
        let counter = 1;

        let data = this.blobs.map(blob => {

            let nodes = blob["bags"].flatMap(id => this.nodes.filter(node => node.id === id));
            
            let points = nodes.flatMap(node => {
                const padding = blob["offset"]?blob["offset"]: 20;
                const padding_diag = padding*Math.sqrt(0.5);
                return [
                    [node.x+padding, node.y],
                    [node.x-padding, node.y],
                    [node.x, node.y+padding],
                    [node.x, node.y-padding],
                    [node.x+padding_diag, node.y+padding_diag],
                    [node.x-padding_diag, node.y-padding_diag],
                    [node.x+padding_diag, node.y-padding_diag],
                    [node.x-padding_diag, node.y+padding_diag],
                ];
            });

            return { "id": counter++, "class": blob["class"]? blob["class"]:"", "text": blob["text"]?blob["text"]:"", offset: blob["offset"]?blob["offset"]: 20, "polygon": d3.polygonHull(points)}
        });
        let scaleFactor = 1;
        
        this.svg_blobs = this.svg_blobs
        .data(data, data => data.id)
        .join('path')
        .attr("d", (d) => {
            if (d && d.polygon) {

                // Calculate the centroid of the polygon
                const centroid = d3.polygonCentroid(d.polygon);

                const scaledPolygon = d.polygon.map((point) => [
                    centroid[0] + (point[0] - centroid[0]) * scaleFactor,
                    centroid[1] + (point[1] - centroid[1]) * scaleFactor,
                ]);
                
                return this.catmullRomSpline(scaledPolygon, 0.5, true);
            } else {
                return null;
            }
        })
        // .attr('d', d => (d.polygon ? 'M' + d.polygon.join('L') + 'Z' : null))
        // .attr('fill', 'rgba(169, 169, 169, 0.1)') // Set the fill color with some transparency
        .attr("class", (d) => d.class) // assign a different color to each letter


        this.svg_blobs_title = this.svg_blobs_title
        .data(data, data => data.id)
        .join('text')
        .text((d) => d.text)
        .attr('x', (d) => {
            if (d && d.polygon) {
                const topPoint = d.polygon.reduce((minPoint, point) => point[1] < minPoint[1] ? point : minPoint);
                return topPoint[0]-(d.text.length)*3.8;
            } else {
                return null;
            }
        })
        .attr('y', (d) => {
            if (d && d.polygon) {
                const topPoint = d.polygon.reduce((minPoint, point) => point[1] < minPoint[1] ? point : minPoint);
                return topPoint[1] - 15;
            } else {
                return null;
            }
        })
        .attr('font-size', '14px') // Set the font-size for text
        .attr("class", (d) => d.class) // assign a different color to each letter
        .attr('stroke-width', 4) // Set the stroke width for group shapes
        .attr('opacity', 1) // Set the stroke width for group shapes
        .attr('fill', 'white');
    }

    
      

    create_svg_simulation(){

        this.nodes.forEach(node => {
            if(node.stuck){
                node.fx = node.x;
                node.fy = node.y;
            }
        })

        const w = this.svg.node().getBoundingClientRect().width;
        const h = this.svg.node().getBoundingClientRect().height;

        return d3.forceSimulation(this.nodes)
        .force("boundary", forceBoundary(20+(this.w_left*w),60+(this.h_top*h),w-20-(this.w_right*w),h-35-(this.h_bot*h)))
        .force('link',   d3.forceLink(this.links).id(d => d.id).distance(this.node_radius*2.5))
        .force('charge', d3.forceManyBody().strength(this.charge))
        .force('center', d3.forceCenter((w/2)+(this.w_left*w/2)-(this.w_right*w/2), (h/2)+(this.h_top*h/2)-(this.h_bot*h/2)))
        .force('collide', d3.forceCollide().radius(function(d) {
            return d.radius + 50; // where X is the minimum distance you want between nodes
        }))
        // .force("x", d3.forceX().strength(0.07).x(d => Math.max(this.node_radius, Math.min(h - this.node_radius, d.x))))
        // .force("y", d3.forceY().strength(0.07).y(d => Math.max(this.node_radius, Math.min(w - this.node_radius, d.y))));

    }

    

    create_svg_simulation_tick(){

        this.simulation
        .on('tick', () => {
            if(this.svg_links){
                try {
                    this.svg_links
                    .attr('x1', d => d.source.x)
                    .attr('y1', d => d.source.y)
                    .attr('x2', d => d.target.x)
                    .attr('y2', d => d.target.y);    
                } catch (error) {}
                
            }
            if(this.svg_nodes){
                this.svg_nodes
                .attr('cx', d => d.x) // use 'cx' and 'cy' attributes to set the circle center
                .attr('cy', d => d.y) // use 'cx' and 'cy' attributes to set the circle center        
            }
            if(this.svg_node_labels){
                this.svg_node_labels
                .attr("x", d => d.x)
                .attr("y", d => d.y + 5); // adjust the y-coordinate as needed to center the text vertically        
            }
            if(this.svg_node_W_label){
                this.svg_node_W_label
                .attr("x", d => d.x - 0)
                .attr("y", d => d.y -11); // adjust the y-coordinate as needed to center the text vertically        
            }
            if(this.svg_node_dX){
                this.svg_node_dX
                .attr("x", d => d.x + 20)
                .attr("y", d => d.y + 20); // adjust the y-coordinate as needed to center the text vertically        
            }
            if(this.node_bg){
                this.node_bg
                .attr('cx', d => d.x) // use 'cx' and 'cy' attributes to set the circle center
                .attr('cy', d => d.y) // use 'cx' and 'cy' attributes to set the circle center    
            }
            if(this.node_W){
                this.node_W
                .attr('cx', d => d.x) // use 'cx' and 'cy' attributes to set the circle center
                .attr('cy', d => d.y) // use 'cx' and 'cy' attributes to set the circle center    
            }
            if(this.svg_blobs){
                try {       
                    this.update_blobs();
                } catch (error) {
                    
                }
            }
            // update line start
            if(this.svg_temp_line && this.start_node) this.svg_temp_line.attr("x1", this.start_node.x).attr("y1", this.start_node.y);
            
        });
    }

    remove_node(id){
        this.simulation.stop();

        const nodes = split(this.nodes, node => node.id === id);
        const links = split(this.links, link => link.source.id===id || link.target.id===id);

        this.nodes = nodes.keep;
        this.links = links.keep;

        return {nodes: nodes.remove, links: links.remove};
    }

    add_nodes(nodes){
        this.simulation.stop();
        this.nodes = this.nodes.concat(nodes);
    }

    add_links(links){
        this.simulation.stop();
        this.links = this.links.concat(links);
    }

    svg_show_only(show){
        this.svg_nodes.classed("hidden", d => !show.includes(d.id));
        this.node_bg.classed("hidden", d => !show.includes(d.id));
        this.node_W.classed("hidden", d => !show.includes(d.id));
        this.svg_node_W_label.classed("hidden", d => !show.includes(d.id));
        this.svg_node_labels.classed("hidden", d => !show.includes(d.id));
        this.svg_links.classed("hidden", d => !show.includes(d.source.id) || !show.includes(d.target.id)); //show sebbe when this is hidden
        this.svg_links.classed(this.node_class, d => show.includes(d.source.id) && show.includes(d.target.id)); 
        this.svg_nodes.classed(this.node_class, true);
    }

    find_components(combine = false, f = id => parseInt(id)){
        const fc = new FindComponents(200); // hard coded WATCH OUT, fix add max N to the graph
        this.links.forEach(link => fc.add_edge(f(link.source.id), f(link.target.id)));
        this.nodes.forEach(node => fc.v[f(node.id)] = false);
        return fc.run(combine, this.W);
    }

    svg_set_node_class(clazz, indices){
        console.log(indices);
        // let indices = this.nodes.filter(node => names.includes(node.name)).map(node => node.id);
        this.svg_nodes.classed(clazz, node => indices.includes(node.id));
        this.svg_node_labels.classed(clazz, node => indices.includes(node.id));
    }
}

export class Tree {
    constructor(graph, svg) {
        this.nodes = graph.nodes.map(node => {return {...node}});
        this.links = graph.edges.map(link => {return {...link}});
        this.svg = svg;
        this.blobs = [];

        this.link_color = "#ccc";
        this.link_color = "white";
        this.link_color = "#757575";
        
        //   this.link_color = "black";
        this.link_width = 4;
        
        this.charge = -4_000;

        this.C = [];
        this.X = [];

        this.node_color  = "#454545";
    }

    render(){
        if(this.simulation) this.simulation.stop(); 
        this.svg.selectAll("*").remove();
        this.simulation      = this.create_svg_simulation();
        // this.svg_groups      = this.create_svg_groups();
        this.create_blobs();
        this.create_svg_groups();
        this.svg_links       = this.create_svg_links();
        this.svg_nodes       = this.create_svg_nodes();
        this.svg_node_labels = this.create_svg_node_labels(this.tree_labels);
        this.svg_node_names  = this.create_svg_node_names();
        this.create_svg_simulation_tick();
    }

    tree_labels(node){
        return node.bag.join(", ")
    }

    get_component(element){
        for (let i = 0; i < this.C.length; i++) {
            if(this.C[i].includes(parseInt(element))) return i+1;
        }
        return 99;
    }


    color_class(d,i){
        for (let i = 0; i < this.C.length; i++) {
            if(this.C[i].includes(parseInt(d))) return "C"+(i+1).toString();
        }
        if(this.X.includes(parseInt(d))) return "X";
        return "";
    }


    svg_hide_stuff(show){
        this.svg_nodes.classed("hidden", d => !show.includes(d.name[0]));
        this.svg_node_labels.classed("hidden", d => !show.includes(d.name[0]));
        this.svg_node_names.classed("hidden", d => !show.includes(d.name[0]));
        this.svg_links.classed("hidden", d => !show.includes(d.source.name[0]) || !show.includes(d.target.name[0]));
    }
    
    svg_show_stuff(name, i){
        this.svg_nodes.each(function(d) {
            if (d.name === name && d.group === i) d3.select(this).classed("hidden", false);
        });
        this.svg_node_labels.each(function(d) {
            if (d.name === name && d.group === i) d3.select(this).classed("hidden", false);
        });
        this.svg_node_names.each(function(d) {
            if (d.name === name && d.group === i) d3.select(this).classed("hidden", false);
        });
        // this.svg_links.each(function(d) {
        //     if ((d.source.name === name && d.source.group === i) || (d.target.name === name && d.target.group === i)) d3.select(this).classed("hidden", false);
        // });
    }

    svg_set_node_pos(id, x, y){
        const node = this.nodes.filter(node => node.id === id)[0];
        node.fx = x;
        node.fy = y;
    }

    

    create_svg_links(){
        return this.svg
        .append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(this.links)
        .enter().append('line')
        .attr('stroke', edge => edge.color ? edge.color : this.link_color)
        .attr('stroke-width', this.link_width);
    }

    catmullRomSpline(points, tension = 0.5, closed = true) {
        if (points.length < 2) return '';
    
        let lineGenerator;
        if (closed) {
            lineGenerator = d3.line().curve(d3.curveCatmullRomClosed.alpha(tension));
        } else {
            lineGenerator = d3.line().curve(d3.curveCatmullRom.alpha(tension));
        }
    
        const pathData = lineGenerator(points);
        return pathData;
    }


    create_svg_groups(){
        this.svg_groups = this.svg
        .append('g')
        .attr('class', 'group-shapes')
        .selectAll('path');

        this.svg_groups_title = this.svg
        .append('g')
        .attr('class', 'groups-title')
        .selectAll('text');
    }

    update_svg_groups(){

        const grouped_nodes = this.nodes.reduce((acc, node) => {
            if (!acc[node.group]) {
              acc[node.group] = [];
            }
            acc[node.group].push(node)
            return acc;
          }, {});
        delete grouped_nodes[undefined];

        const data = Object.values(grouped_nodes).map(group => {
            const points = group.flatMap(node => {
                const padding = 20;
                const move = (Math.max(24, node.bag.length*20)/2)+padding;
                return [
                    [node.x-move, node.y+12+padding], 
                    [node.x-move, node.y-12-padding-15], 
                    [node.x+move, node.y+12+padding],
                    [node.x+move, node.y-12-padding-15],
                ]
            })
            return {id: group[0].group, polygon: d3.polygonHull(points)}
        })

        const scaleFactor = 1;
        this.svg_groups = this.svg_groups
        .data(data, data => data.id)
        .join('path')
        .attr("d", (d) => {
            if (d && d.polygon) {
                // Calculate the centroid of the polygon
                const centroid = d3.polygonCentroid(d.polygon);

                const scaledPolygon = d.polygon.map((point) => [
                    centroid[0] + (point[0] - centroid[0]) * scaleFactor,
                    centroid[1] + (point[1] - centroid[1]) * scaleFactor,
                ]);
                
                return this.catmullRomSpline(scaledPolygon, 0.5, true);
                // return "M" + scaledPolygon.join("L") + "Z";
            } else {
                return null;
            }
        })
        // .attr('d', d => (d.polygon ? 'M' + d.polygon.join('L') + 'Z' : null))
        .attr('stroke', '#999') // Set the stroke color for group shapes
        .attr('stroke', 'black') // Set the stroke color for group shapes
        // .attr('fill', 'rgba(169, 169, 169, 0.1)') // Set the fill color with some transparency
        .attr("class", (d) => "C" + d.id.toString()) // assign a different color to each letter
        .attr('stroke-width', 2); // Set the stroke width for group shapes


        this.svg_groups_title = this.svg_groups_title
        .data(data, data => data.id)
        .join('text')
        .text(function (d) { return "T";})
        .attr('x', (d) => {
            if (d && d.polygon) {
                const midPoint = d.polygon.reduce((zum, point) => zum+point[0], 0)/d.polygon.length
                return midPoint;
                
                const topPoint = d.polygon.reduce((minPoint, point) => point[1] < minPoint[1] ? point : minPoint);
                return topPoint[0]-50;
            } else {
                return null;
            }
        })
        .attr('y', (d) => {
            if (d && d.polygon) {
                const topPoint = d.polygon.reduce((minPoint, point) => point[1] < minPoint[1] ? point : minPoint);
                return topPoint[1] - 15;
            } else {
                return null;
            }
        })
        .attr('font-size', '15px')
        .attr("class", (d) => d.class)
        .attr('stroke', 'black')
        .attr('stroke-width', 4)
        .attr('paint-order', 'stroke')
        .attr('opacity', 1)
        .attr('fill', 'white');

        this.svg_groups_title.each(function (d) {
            const text = d3.select(this);
            text.append("tspan")
                        .attr("baseline-shift", "super")
                        .attr("font-size", "80%")
                        .text(d.id.toString());
        });
    }

    create_blobs(){

        this.svg_blobs = this.svg
        .append('g')
        .attr('class', 'blobs')
        .selectAll('path');

        this.svg_blobs_title = this.svg
        .append('g')
        .attr('class', 'blobs-title')
        .selectAll('text');
    }

    update_blobs(){
        let counter = 1;

        let data = this.blobs.map(blob => {

            let nodes = blob["bags"].flatMap(bagname => this.nodes.filter(node => node.name === bagname));
            
            let points = nodes.flatMap(node => {
                const padding = 20;
                const move = (Math.max(24, node.bag.length*20)/2)+padding;
                return [
                    [node.x-move, node.y+12+padding], 
                    [node.x-move, node.y-12-padding-15], 
                    [node.x+move, node.y+12+padding],
                    [node.x+move, node.y-12-padding-15],
                ];
            });

            return { "id": counter++, "class": blob["class"], "polygon": d3.polygonHull(points), "text": blob["text"]?blob["text"]:""}
        });

        let scaleFactor = 1;
        
        this.svg_blobs = this.svg_blobs
        .data(data, data => data.id)
        .join('path')
        .attr("d", (d) => {
            if (d && d.polygon) {
                // Calculate the centroid of the polygon
                const centroid = d3.polygonCentroid(d.polygon);

                const scaledPolygon = d.polygon.map((point) => [
                    centroid[0] + (point[0] - centroid[0]) * scaleFactor,
                    centroid[1] + (point[1] - centroid[1]) * scaleFactor,
                ]);
                
                return this.catmullRomSpline(scaledPolygon, 0.5, true);
            } else {
                return null;
            }
        })
        .attr('stroke', 'black')
        .attr("class", (d) => d.class)
        .attr('stroke-width', 4)
        .attr('opacity', 1);


        this.svg_blobs_title = this.svg_blobs_title
        .data(data, data => data.id)
        .join('text')
        .text((d) => d.text)
        .attr('x', (d) => {
            if (d && d.polygon) {
                const midPoint = d.polygon.reduce((zum, point) => zum+point[0], 0)/d.polygon.length
                return midPoint-(d.text.length)*3;
                const topPoint = d.polygon.reduce((minPoint, point) => point[1] < minPoint[1] ? point : minPoint);
                return topPoint[0]-(d.text.length)*5;
            } else {
                return null;
            }
        })
        .attr('y', (d) => {
            if (d && d.polygon) {
                const topPoint = d.polygon.reduce((minPoint, point) => point[1] < minPoint[1] ? point : minPoint);
                return topPoint[1] - 25;
            } else {
                return null;
            }
        })
        .attr('font-size', '12px') // Set the font-size for text
        .attr("class", (d) => d.class) // assign a different color to each letter
        .attr('stroke-width', 4) // Set the stroke width for group shapes
        .attr('opacity', 1) // Set the stroke width for group shapes
        .attr('fill', 'white');


    }


    create_svg_nodes(){
        return this.svg
        .append('g')
        .attr('class', 'nodes')
        .selectAll('rect')
        .data(this.nodes)
        .enter().append('rect')
        .attr('width', node => Math.max(24, node.bag.length*20))
        .attr('height', 30)
        .attr('stroke', d => d.color ? d.color : this.node_color)
        .attr("class", node => (node.name==="W" && !node.color) ? "node_in_w" : "") // assign a different color to each letter
        // .attr('stroke', node => node.name === "W<<<" ? "pink" : "#454545")
        .attr('fill', '#101010')
        .attr('stroke-width', 2)
        .attr('rx', 2) // set the x radius of the corners to 10 pixels
        .attr('ry', 2) // set the y radius of the corners to 10 pixels   
        .call(d3.drag()
            .on('start', (e,d) => {
                d.stuck = false;
                if (!e.active) this.simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on('drag', (e,d) => {
                d.stuck = true;
                d.fx = e.x;
                d.fy = e.y;
            })
            .on('end', (e,d) => {
                if (!e.active) this.simulation.alphaTarget(0);
 
                if (!d.stuck) {
                    d.fx = null;
                    d.fy = null;
                }
            }
        ));
    }

create_svg_node_labels(text_function = node => node.id) {
  let label = this.svg
    .append("g")
    .attr("class", "node-labels")
    .selectAll("text")
    .data(this.nodes)
    .enter()
    .append("text")
    // .text(text_function)
    .attr("text-anchor", "middle")
    .attr('fill', "white")
    // .attr("stroke", "black")
    // .attr("stroke-width", "6px")
    // .attr("letter-spacing", "0.3em")
    // .style("paint-order", "stroke");

    label
    .selectAll("div")
    .data((d) => {
        d.bag.sort((a, b) => (this.get_component(a) === this.get_component(b) ? a-b : this.get_component(a) - this.get_component(b)));
        return d.bag.flatMap(x => [x, ","]).slice(0,-1)
    })
    .enter()
    .append("tspan")
    // .attr("dy", "1.2em")
    // .attr("fill", (d,i) => this.color_function(d,i) ) // assign a different color to each letter
    .attr("class", (d,i) => this.color_class(d,i) ) // assign a different color to each letter
    // .attr("stroke", (d,i) => d === " , " ? "transparent" : "black" ) // assign a different color to each letter
    .text(function(d) { return d; });
    return label;
}
    create_svg_node_names(text_function = node => node.name){
        return this.svg
        .append("g")
        .attr("class", "node-labels")
        .selectAll("text")
        .data(this.nodes)
        .enter().append("text")
        .attr("text-anchor", "middle")
        .attr('fill', "white")
        .attr("stroke", "black") // add white stroke color
        .attr("stroke-width", "4px") // set stroke width to 1px
        .style("paint-order", "stroke")
        .each(function (d) {
            const text = d3.select(this);
            text.append("tspan").text(text_function(d));
            if(d.sup) text.append("tspan")
                        .attr("baseline-shift", "super")
                        .attr("font-size", "80%")
                        .text(d.sup);
        });
    }

    create_svg_simulation(){
        const w = this.svg.node().getBoundingClientRect().width;
        const h = this.svg.node().getBoundingClientRect().height;

        this.nodes.forEach(node => {
            if(node.stuck){
                node.fx = node.x;
                node.fy = node.y;
            }
            else if(node.y_div && node.y_offset){
                // node.fx = w/2;
                node.fy = (h/node.y_div)+node.y_offset;
            }
            // else if(node.name === "W" && (!node.sup || node.sup === "X")){
            //     node.fx = w/2;
            //     node.fy = (h/2)-60;
            // } 
            // else if(node.name === "X" && (!node.sup || node.sup === "X")){
            //     node.fx = w/2;
            //     node.fy = (h/2)-10;
            // }    
            // DANIEL
        })
        
        return d3.forceSimulation(this.nodes)
        .force("boundary", forceBoundary(20,60,w-20,h-20))
        .force('link',   d3.forceLink(this.links).id(d => d.id))
        .force('charge', d3.forceManyBody().strength(this.charge))
        .force('center', d3.forceCenter(w/2, (h/2)+30));
    }

    create_svg_simulation_tick(){
        this.simulation
        .on('tick', () => {
            if(this.svg_links){
                this.svg_links
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
            }
            if(this.svg_nodes){
                this.svg_nodes
                .attr('x', d => d.x - Math.max(24, d.bag.length*20)/2) // use 'cx' and 'cy' attributes to set the circle center
                .attr('y', d => d.y-15) // use 'cx' and 'cy' attributes to set the circle center
            }
            if(this.svg_node_labels){
                this.svg_node_labels
                .attr("x", d => d.x)
                .attr("y", d => d.y+5); // adjust the y-coordinate as needed to center the text vertically        
            }
            if(this.svg_node_names){
                this.svg_node_names
                .attr("x", d => d.x)
                .attr("y", d => d.y - 20); // adjust the y-coordinate as needed to center the text vertically        
            }
            if(this.svg_groups){
                try {       
                    this.update_svg_groups();
                } catch (error) {
                    
                }
            }
            if(this.svg_blobs){
                try {       
                    this.update_blobs();
                } catch (error) {
                    
                }
            }
            
        });
        
    }
    svg_set_node_class(clazz, names){
        let indices = this.nodes.filter(node => names.includes(node.name)).map(node => node.id);
        this.svg_nodes.classed(clazz, node => indices.includes(node.id));
        this.svg_node_labels.classed(clazz, node => indices.includes(node.id));
    }
    svg_set_node_and_edge_if_name(clazz, names){
        let indices = this.nodes.filter(node => names.includes(node.name)).map(node => node.id);
        this.svg_nodes.classed(clazz, node => indices.includes(node.id));
        this.svg_node_labels.classed(clazz, node => indices.includes(node.id));
        this.svg_links.classed(clazz, link => indices.includes(link.source.id) || indices.includes(link.target.id));
    }
    svg_set_node_class_if_contains(clazz, vertex){
        this.svg_nodes.classed(clazz, node => node.bag.includes(vertex));
        this.svg_node_labels.classed(clazz, node => node.bag.includes(vertex));
        this.svg_links.classed(clazz, link => link.source.bag.includes(vertex) && link.target.bag.includes(vertex));
        // this.svg_links.classed(clazz, link => link.target.bag.includes(vertex));
    }
    svg_set_node_class_if_contains_pair(clazz, u, v){
        this.svg_nodes.classed(clazz, node => node.bag.includes(u) && node.bag.includes(v));
        this.svg_node_labels.classed(clazz, node => node.bag.includes(u) && node.bag.includes(v));
        this.svg_links.classed(clazz, link => link.source.bag.includes(u) && link.target.bag.includes(u) && link.source.bag.includes(v) && link.target.bag.includes(v));
        // this.svg_links.classed(clazz, link => link.target.bag.includes(vertex));
    }

    find_TX(){
        const fh = new FindHomebags();
        this.nodes.forEach(node => fh.add_node(node, node.name==="W"));
        this.links.forEach(link => fh.add_edge(link.source.id, link.target.id));
        fh.dfs();
        fh.build_TX(this.X);
        return {nodes: fh.tx_nodes, edges: fh.tx_edges};
    }
}