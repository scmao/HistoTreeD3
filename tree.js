
var treeData = {
    name: "/",
    children: [
        {
            name: "Applications",
            children: [
                { name: "Mail.app" },
                { name: "iPhoto.app" },
                { name: "Keynote.app" },
                { name: "iTunes.app" },
                { name: "XCode.app" },
                { name: "Numbers.app" },
                { name: "Pages.app" }
            ]
        },
        {
            name: "System",
            children: []
        },
        {
            name: "Library",
            children: [
                {
                    name: "Application Support",
                    children: [
                        { name: "Adobe" },
                        { name: "Apple" },
                        { name: "Google" },
                        { name: "Microsoft" }
                    ]
                },
                {
                    name: "Languages",
                    children: [
                        { name: "Ruby" },
                        { name: "Python" },
                        { name: "Javascript" },
                        { name: "C#" }
                    ]
                },
                {
                    name: "Developer",
                    children: [
                        { name: "4.2" },
                        { name: "4.3" },
                        { name: "5.0" },
                        { name: "Documentation" }
                    ]
                }
            ]
        },
        {
            name: "opt",
            children: []
        },
        {
            name: "Users",
            children: [
                { name: "pavanpodila" },
                { name: "admin" },
                { name: "test-user" }
            ]
        }
    ]
};


var margin = {top: 20, right: 120, bottom: 20, left: 120},
        width = window.innerWidth - margin.right - margin.left-25,
        height = window.innerHeight - margin.top - margin.bottom-55;
        
var i = 0,
        duration = 750,
        root;

var tree = d3.layout.tree()
        .size([height, width]);

var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("body").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function buildTree(treeData) {
    root = treeData;
    root.x0 = height / 2;
    root.y0 = 0;

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    root.children.forEach(collapse);
    update(root);
}

buildTree(treeData);

d3.select(self.frameElement).style("height", "800px");

function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 180; });

    // Update the nodes…
    var node = svg.selectAll("g.node")
            .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
            ;

    nodeEnter.append("circle")
            .attr("r", 1e-6)
            .style("fill", function(d) { return d._children ? "#556B2F" : "#9ACD32"; })
            .on("click", click)      
            ;

    nodeEnter.append("text")
            .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
            .text(function(d) { return d.name; })
            .style("fill-opacity", 1e-6);

    nodeEnter
            .append("a")
                 .attr("xlink:href", function (d) { return d.name; })
            .append("rect")
                    .attr("class", "clickable")
                    .attr("y", -6)
                    .attr("x", function (d) { return d.children || d._children ? -60 : 10; })
                    .attr("width", 50) //2*4.5)
                    .attr("height", 12)
                    .style("fill", "lightsteelblue")
                    .style("fill-opacity", 0)        // set to 1e-6 to hide          
                    ;

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select("circle")
            .attr("r", 4.5)
            .style("fill", function(d) { return d._children ? "#556B2F" : "#9ACD32"; });

    nodeUpdate.select("text")
            .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
            .remove();

    nodeExit.select("circle")
            .attr("r", 1e-6);

    nodeExit.select("text")
            .style("fill-opacity", 1e-6);

    // Update the links…
    var link = svg.selectAll("path.link")
            .data(links, function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o});
            });

    // Transition links to their new position.
    link.transition()
            .duration(duration)
            .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {x: source.x, y: source.y};
                return diagonal({source: o, target: o});
            })
            .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

// Toggle children on click.
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