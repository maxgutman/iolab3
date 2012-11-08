var radiusMax = 74,
    radiusMin = 20,
    rangeFrom = 138,
    rangeTo = 527,
    padding = 10;

var color = d3.scale.ordinal().range(["#2B6EE0", "#CB1D1F", "#CCC"]);

var pie = d3.layout.pie()
    .value(function(d) {
        return d.votes;
    });

d3.csv("static/data/elections_data.csv", function(error, data) {
    color.domain(d3.keys(data[0]).filter(function(key) { return key=="Democratic" || key=="Republican" || key=="Others" ; }));

    data.forEach(function(d) {
        d.votes = color.domain().map(function(name) {
            return {name: name, votes: +d[name], TotalVotes: parseInt(d['TotalVotes'])};
        });
    });

    var arc = d3.svg.arc()
        .outerRadius(function(d) {
            return scale(d.data.TotalVotes);
        })
        .innerRadius(function(d) {
            return scale(d.data.TotalVotes) - (scale(d.data.TotalVotes) * 0.5);
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
            if(d == "Republican"){ return "static/images/elephant.png"; }
            else if(d == "Democratic"){ return "static/images/donkey.png"; }
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
        .attr("width", 165)
        .attr("height", 165)
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
        .attr("transform", function(d){ return "translate(" + radiusMax + "," + radiusMax + ")"});

    svg.selectAll(".arc")
        .data(function(d) { return pie(d.votes); })
        .enter()
        .append("path")
        .style("fill", "white")
        .attr("class", "arc")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.name); });

    svg.append("text")
        .attr("dy", ".35em")
        .attr('class', 'year')
        .style("text-anchor", "middle")
        .text(function(d) { return d.Year; });

    var democrat = svg.append('foreignObject')
        .attr('x', 80)
        .attr('y', -20)
        .attr('width', 150)
        .attr('height', 100)
        .append("xhtml:body")
        .attr('class', function(d) {
            var sClass = 'candidate democrat'
            if(parseInt(d.Democratic) > parseInt(d.Republican)) {
                return sClass + ' bold';
            }
            return sClass;
        })
        .html(function(d) { return d.DemocraticLastName + '<span class="term">' + d.DemocraticTerm + '</span>'; });

    var republican = svg.append('foreignObject')
        .attr('x', -230)
        .attr('y', -20)
        .attr('width', 150)
        .attr('height', 100)
        .append("xhtml:body")
        .attr('class', function(d) {
            var sClass = 'candidate republican'
            if(parseInt(d.Republican) > parseInt(d.Democratic)) {
                return sClass + ' bold';
            }
            return sClass;
        })
        .html(function(d) { return d.RepublicanLastName + '<span class="term">' + d.RepublicanTerm + '</span>'; });


});

/* SCALE MATH
OUTER::
MAX = 74
MIN = 20
RANGE_FROM = 138
RANGE_TO = 527
F(X) = (MAX-MIN)*(X-RANGE_FROM)/(RANGE_TO-RANGE_FROM)+MIN
*/
function scale(votes) {
    return (radiusMax-radiusMin)*(votes-rangeFrom)/(rangeTo-rangeFrom)+radiusMin;
}