/* jshint undef: true, unused: true */
/* global d3, demo, flare_data */
var topLevelName = [];

function flare2treed(data) {
    if (topLevelName[toolIndex] == null)
        topLevelName[toolIndex] = data.name + "|" + data.myid + "|" + data.nodetype + "|" + data.description + "|" + data.preamble + "|" + data.conclusion + "|" + data.subargumentid;
    return {
        content: data.name + "|" + data.myid + "|" + data.nodetype + "|" + data.description + "|" + data.preamble + "|" + data.conclusion + "|" + data.subargumentid,
        children: data.children ? data.children.map(flare2treed) : [],
        collapsed: true
    }
}

var COLORS = {
    done: '#0f0',
    parent: 'lightsteelblue',
    subArgument: 'green',
    subArgumentLight: 'lightgreen',
    PremiseNoDetails: "yellow",
    PremiseNoDetailsLight: "lightyellow"
}

for(toolIndex = 0; toolIndex < toolData.length; toolIndex++){
    demo.run({
        data: flare2treed(toolData[toolIndex]),
        ctrlOptions: {
            noCollapseRoot: false
        },
        el: 'editme',
        noTitle: true
    }, initD3);
}

function initD3() {

    var margin = {
            top: 20,
            right: 120,
            bottom: 20,
            left: 120
        },
        width = 960 - margin.right - margin.left,
        height = 800 - margin.top - margin.bottom;

    var tree = d3.layout.tree()
        .children(function(d) {
            if (!d.hidesChildren && d.children && d.collapsed && d.children.length) {
                d.hidesChildren = true;
                d.done = true;
            }
            return d.collapsed ? null : d.children
        })
        .size([height, width]);

    var diagonal = d3.svg.diagonal()
        .projection(function(d) {
            return [d.y, d.x];
        });

    // $('#d3view'+toolIndex).html('');

    var svg;
    if(rootFlag == 1){
        svg = d3.select("#d3view"+toolIndex).append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    }else{
        svg = d3.select("#d3view"+toolIndex+" svg g");
    }


    // d3.select(self.frameElement).style("height", "800px");

    function setCollapsed(id, doCollapse) {
        ctrl.setCollapsed(id, doCollapse)
        view.startEditing(id)
    }

    var up = update.bind(null, tree, svg, setCollapsed, diagonal)

    var root = model.dumpData()
    root.x0 = height / 2;
    root.y0 = 0;
    up(root)

    ctrl.on('change', function() {
        var root = model.dumpData()
        root.x0 = height / 2;
        root.y0 = 0;
        up(root)
    })

    setTimeout(function() {
        ctrl.setCollapsed(view.root, false)
    }, 100);
}


function update(tree, svg, setCollapsed, diagonal, source) {
    // Compute the new tree layout.
    var nodes = tree.nodes(source).reverse(),
        links = tree.links(nodes);
    var i = 0,
        duration = 750

    var i = 0;

    // Normalize for fixed-depth.
    nodes.forEach(function(d) {
        d.y = d.depth * 180;
    });

    // Update the nodes…
    var node = svg.selectAll("g.node")
        .data(nodes, function(d) {
            return d.id || (d.id = ++i);
        });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            var _source = d.parent || source
            return "translate(" + _source.y + "," + _source.x + ")";
        })
        .attr("myid", function(d) {
            var nodeID = d.content.split('|')[1];
            return nodeID;
        })
        .attr("nodetype", function(d) {
            var nodetype = d.content.split('|')[2];
            return nodetype;
        })
        .attr("id",function(d){
            var nodeID = d.content.split('|')[1];
            var nodetype = d.content.split('|')[2];
            return "_"+nodetype+"-"+nodeID;
        })
        .on("click", click)
        .on("contextmenu",on_Contextmenu);

    nodeEnter.append("circle")
        .attr("r", 1e-6)
        .attr("class", "nodecircle")
        .attr("myid", function(d) {
            var nodeID = d.content.split('|')[1];
            return nodeID;
        })
        .style('stroke', function(d) {
            if (d.content.split('|')[2] == "Premise") {
                if (d.content.split('|')[6] != "0") {
                    return d.hidesChildren ? '' : (d.done ? COLORS.subArgument : '');
                } else {
                    return d.hidesChildren ? '' : (d.done ? COLORS.PremiseNoDetails : '');
                }
            } else {
                return d.hidesChildren ? '' : (d.done ? COLORS.done : '');
            }
        })
        .style("fill", function(d) {
            if (d.content.split('|')[2] == "Premise") {
                if (d.content.split('|')[6] != "0") {
                    return COLORS.subArgument
                } else {
                    return COLORS.PremiseNoDetails;
                }
            } else {
                if (d.done) return COLORS.done;
                return d.hidesChildren ? COLORS.parent : "#fff";
            }
        });

    nodeEnter.append("text")
        .attr("class", "nodetext")
        .attr("dy", ".35em")
        .attr("x", function(d) {
            return (d.hidesChildren && (!d.collapsed)) ? -10 : 10;
        })
        .attr("text-anchor", function(d) {
            return (d.hidesChildren && (!d.collapsed)) ? "end" : "start";
        })
        // MM Debug Try to get myID to show here
        //.attr("myid", function (d) {
        //    return d.thisid;
        //})
        .attr("myid", function(d) {
            var nodeID = d.content.split('|')[1];
            return nodeID;
        })
        .text(function(d) {
            var nodeName = d.content.split('|')[0];
            return nodeName;
        })
        .style("fill-opacity", 1e-6);

    //// MM DEbug Link info is here
    //var barHeight = 16;
    //var barWidth = 16;
    ////node.filter(function (d) { return d.url; }).append("a") // i should be able to see d.url
    //nodeEnter.append("a")
    //    .attr("xlink:href", function (d) {
    //        return d.content; // MM Debug why can't I use d.url ???
    //    })
    //    .append("rect")
    //        .attr("class", "clickable")
    //        .attr("y", -6)
    //        .attr("x", function (d) { return d.children || d._children ? -60 : 10; })
    //        .attr("width", 50) //2*4.5)
    //        .attr("height", 12)
    //        .style("fill", "lightsteelblue")
    //        .style("fill-opacity", .3)        // set to 1e-6 to hide          
    //;




    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
        });

    nodeUpdate.select("circle")
        .attr("r", 4.5)
        .style('stroke', function(d) {
            if (d.content.split('|')[2] == "Premise") {
                if (d.content.split('|')[6] != "0")
                    return COLORS.subArgument;
                else
                    return COLORS.PremiseNoDetails;
            } else
                return d.hidesChildren ? '' : (d.done ? COLORS.done : '')
        })
        .style("fill", function(d) {
            if (d.content.split('|')[2] == "Premise") {
                if (d.content.split('|')[6] != "0") {
                    if (d.done) return COLORS.subArgument
                    return d.hidesChildren ? COLORS.subArgumentLight : "#fff";
                } else {
                    if (d.done) return COLORS.PremiseNoDetails
                    return d.hidesChildren ? COLORS.PremiseNoDetailsLight : "#fff";
                }
            } else {
                if (d.done) return COLORS.parent
                return d.hidesChildren ? COLORS.parent : "#fff";
            }
        });

    nodeUpdate.select("text")
        .text(function(d) {
            var nodeName = d.content.split('|')[0];
            return nodeName;
        })
        .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + d.parent.y + "," + d.parent.x + ")";
        })
        .remove();

    nodeExit.select("circle")
        .attr("r", 1e-6);

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);

    // Update the links…
    var link = svg.selectAll("path.link")
        .data(links, function(d) {
            return d.target.id;
        });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("id",function(d){
            var nodeID = d.target.content.split('|')[1];
            var nodetype = d.target.content.split('|')[2];
            return "link_"+nodetype+"-"+nodeID;
        })
        .attr("d", function(d) {
            var source = d.source
            var o = {
                x: source.x,
                y: source.y
            };
            return diagonal({
                source: o,
                target: o
            });
        });

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
            var o = {
                x: d.source.x,
                y: d.source.y
            };
            return diagonal({
                source: o,
                target: o
            });
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });

    // Toggle children on click.
    function click(d) {
        setCollapsed(d.id, !d.collapsed)
    }

    function on_Contextmenu(d){
        selected_D = d;
    }
}