var treeData = [{
      "name": "Parent Level",
      "parent": "null",
      "children": [{
        "name": "Level 2: A",
        "parent": "Top Level",
        "children": [{
          "name": "Son of A",
          "parent": "Level 2: A"
        }, {
          "name": "Son of A",
          "parent": "Level 2: A"
        }]
      }, {
        "name": "Level 2: B",
        "parent": "Top Level",
        "children": [{
          "name": "Son of B",
          "parent": "Level 2: B"
        }, {
          "name": "Son of B",
          "parent": "Level 2: B"
        }, ]
      }]
    }];
	
function drawTree (drawingName, selectString) {
		
	var realWidth = 400; //window.innerWidth;
	var realHeight = 300; //window.innerHeight;
	
	var margin = {
		top: 20,
		right: 120,
		bottom: 20,
		left: 120
		},
		width = realWidth - margin.right - margin.left,
		height = realHeight - margin.top - margin.bottom;
	
		var i = 0,
		duration = 750,
		root;
	
		var tree = d3.layout.tree()
		.size([height, width]);
	
		var diagonal = d3.svg.diagonal()
		.projection(function(d) {
			return [d.x, d.y];
		});
	
		var svg = d3.select(selectString).append("svg")
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + margin.top + margin.bottom)
	
		.append("g")
		.attr("class","drawarea")
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
		root = treeData[0];
		root.x0 = height / 2;
		root.y0 = 0;
	
		update(root);
	
		function update(source) {
	
			var nodes = tree.nodes(root).reverse(),
			links = tree.links(nodes);
	
		nodes.forEach(function(d) {
			d.y = d.depth * 45;
		});
	
		var node = svg.selectAll("g.node")
			.data(nodes, function(d) {
			return d.id || (d.id = ++i);
			});
	
		var nodeEnter = node.enter().append("g")
			.attr("class", "node")
			.attr("transform", function(d) {
			return "translate(" + source.y0 + "," + source.x0 + ")";
			})
			.on("click", click);
	
		nodeEnter.append("circle")
	.attr("r", function(d) { return d.value; })
	.style("stroke", function(d) { return d.type; })
	.style("fill", function(d) { return d.level; });
	
		nodeEnter.append("text")
			.attr("y", function(d) {
			return d.children || d._children ? -13 : 13;
			})
			.attr("dy", ".35em")
			.attr("text-anchor", function(d) {
			return d.children || d._children ? "end" : "start";
			})
			.text(function(d) {
			return d.name;
			})
			.style("fill-opacity", 1e-6);
	
		var nodeUpdate = node.transition()
			.duration(duration)
			.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")";
			});
	
		nodeUpdate.select("circle")
			.attr("r", 5)
			.style("fill", function(d) {
			return d._children ? "red" : "#fff";
			});
	
		nodeUpdate.select("text")
			.style("fill-opacity", 5);
	
		var nodeExit = node.exit().transition()
			.duration(duration)
			.attr("transform", function(d) {
			return "translate(" + source.y + "," + source.x + ")";
			})
			.remove();
	
		nodeExit.select("circle")
			.attr("r", 1e-6);
	
		nodeExit.select("text")
			.style("fill-opacity", 1e-6);
	
		var link = svg.selectAll("path.link")
			.data(links, function(d) {
			return d.target.id;
			});
	
		link.enter().insert("path", "g")
			.attr("class", "link")
			.attr("d", function(d) {
			var o = {
				x: source.x0,
				y: source.y0
			};
			return diagonal({
				source: o,
				target: o
			});
			});
	
		link.transition()
			.duration(duration)
			.attr("d", diagonal);
	
		link.exit().transition()
			.duration(duration)
			.attr("d", function(d) {
			var o = {
				x: source.x,
				y: source.y
			};
			return diagonal({
				source: o,
				target: o
			});
			})
			.remove();
		nodes.forEach(function(d) {
			d.x0 = d.x;
			d.y0 = d.y;
		});
		d3.select("svg")
			.call(d3.behavior.zoom()
				.scaleExtent([0.5, 5])
				.on("zoom", zoom));
	
		}
	
		function click(d) {
		if (d.children) {
			d._children = d.children;
			d.children = null;
		} else {
			d.children = d._children;
			d._children = null;
		}
		update(d);
		} 
		
		function zoom() {
		var scale = d3.event.scale,
			translation = d3.event.translate,
			tbound = -height * scale,
			bbound = height * scale,
			lbound = (-width + margin.right) * scale,
			rbound = (width - margin.left) * scale;
		// limit translation to thresholds
		translation = [
			Math.max(Math.min(translation[0], rbound), lbound),
			Math.max(Math.min(translation[1], bbound), tbound)
		];
		d3.select(".drawarea")
			.attr("transform", "translate(" + translation + ")" +
				" scale(" + scale + ")");
		}
}