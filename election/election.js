var radius = 74,
    padding = 10;

var color = d3.scale.ordinal()
    .range(["#2260AB", "#F58583", "#CCC"]);

var arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(radius - 35);

var arcOver = d3.svg.arc()
    .outerRadius(radius + 20)
    .innerRadius(radius + 20 - 35);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) {
        return d.votes;
    });


d3.csv("data.csv", function(error, data) {
    color.domain(d3.keys(data[0]).filter(function(key) { return key=="Democratic" || key=="Republican" || key=="Others" ; }));

    data.forEach(function(d) {
        d.votes = color.domain().map(function(name) {
            return {name: name, votes: +d[name]};
        });
    });

    var legend = d3.select("#leftFrame")
        .append("svg")
        .attr("class", "legend")
        .attr("width", 200)
        .attr("height", 200)
        .selectAll("g")
        .data(color.domain().slice())
        .enter()
        .append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 60 + ")"; });

    legend.append("rect")
        .attr("x", "8px")
        .attr("y", "8px")
        .attr("width", 32)
        .attr("height", 32)
        .style("fill", color);

    legend.append("svg:image")
        .attr("x", "44px")
        .attr("y", "0")
        .attr("width", "48px")
        .attr("height", "48px")
        .attr("xlink:href", function(d) {
            if(d == "Republican"){ return "elephant.png"; }
            else if(d == "Democratic"){ return "donkey.png"; }
        });
    /*
    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function(d) { return d; });
    */

    var svg = d3.select("#mainFrame").selectAll(".pie")
        .data(data)
        .enter()
        .append("svg")
        .attr("class", "pie")
        .attr("width", radius * 2.2)
        .attr("height", radius * 2.2)
        .append("g")
        /*
        .on("mouseover", function(d) {
          var currPie = d3.select(this);
              currPie.attr("transform", "translate(" + radius* 2 + "," + radius * 2 + ")");
          d3.select(this)
            .transition()
            .duration(300)
            .attr("d", arcOver);
        })
        */
        .attr("transform", "translate(" + radius + "," + radius + ")");

    svg.selectAll(".arc")
        .data(function(d) { return pie(d.votes); })
        .enter()
        .append("path")
        .style("fill", "white")
        .style("stroke", "#eee")
        .attr("class", "arc")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.name); });

    svg.append("text")
        .attr("dy", ".35em")
        .attr('class', 'year')
        .style("text-anchor", "middle")
        .text(function(d) { return d.Year; });

    var democrat = svg.append('foreignObject')
        .attr('x', radius + 5)
        .attr('y', -20)
        .attr('width', 150)
        .attr('height', 50)
        .append("xhtml:body")
        .attr('class', function(d) {
            var sClass = 'candidate democrat'
            if(parseInt(d.Democratic) > parseInt(d.Republican)) {
                return sClass + ' bold';
            }
            return sClass;
        })
        .text(function(d) { return d.DemocraticPresident; });

    var republican = svg.append('foreignObject')
        .attr('x', -230)
        .attr('y', -20)
        .attr('width', 150)
        .attr('height', 50)
        .append("xhtml:body")
        .attr('class', function(d) {
            var sClass = 'candidate republican'
            if(parseInt(d.Republican) > parseInt(d.Democratic)) {
                return sClass + ' bold';
            }
            return sClass;
        })
        .text(function(d) { return d.RepublicanPresident; });

});
