var radiusMax = 74,
    radiusMin = 20,
    rangeFrom = 138,
    rangeTo = 527,
    padding = 10;

// var color = d3.scale.ordinal().range(["#2B6EE0", "#CB1D1F", "#666"]);
var color = d3.scale.ordinal().range(["#4579ad", "#d53f37", "#CCC"]);

var pie = d3.layout.pie()
    .value(function(d) {
        return d.votes;
    });

d3.csv("static/data/elections_data.csv", function(error, data) {
    var dataSet = color.domain(d3.keys(data[0]).filter(function(key) { return key=="Democratic" || key=="Republican" || key=="Others" ; }));
    // color.domain(d3.keys(data[0]).filter(function(key) { return key=="DemocraticPopularVotes" || key=="RepublicanPopularVotes" || key=="OtherPopularVotes" ; }));

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

    var legend = d3.select("#smallMultiples")
        .append("svg")
        .attr("class", "legend")
        .attr("width", 188)
        .attr("height", 228);
        
    // legend.selectAll("g")
    //     .data(color.domain().slice())
    //     .enter()
    //     .append("g")
    //     .attr("transform", function(d, i) { return "translate(0," + i * 40 + ")"; });

    legend.append('text')
        .attr('x', 8)
        .attr('y', 20)
        .attr('class', 'header')
        .text('Key');

    legend.append("rect")
        .attr("x", "3px")
        .attr("y", "42px")
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", "#4579ad");

    legend.append('text')
        .attr('x', 32)
        .attr('y', 57)
        .text('Democratic Party');

    legend.append("rect")
        .attr("x", "3px")
        .attr("y", "80px")
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", "#d53f37");

    legend.append('text')
        .attr('x', 32)
        .attr('y', 95)
        .text('Republican Party');

    legend.append("rect")
        .attr("x", "3px")
        .attr("y", "118px")
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", "#CCC");

    legend.append('text')
        .attr('x', 32)
        .attr('y', 133)
        .text('Other');

    legend.append('circle')
        .attr('cx', 13)
        .attr('cy', 164)
        .attr('r', 10)
        .style('fill', '#666');

    legend.append('text')
        .attr('x', 32)
        .attr('y', 169)
        .text('Incumbent Won');
    
    legend.append('circle')
        .attr('cx', 13)
        .attr('cy', 197)
        .attr('r', 10)
        .style('fill', "rgba(255, 255, 255, .1)")
        .style('stroke', "#666")
        .style('stroke-width', 2);

    legend.append('text')
        .attr('x', 32)
        .attr('y', 202)
        .text('Incumbent Lost');

    // legend.append("svg:image")
    //     .attr("x", "44px")
    //     .attr("y", "0")
    //     .attr("width", "48px")
    //     .attr("height", "48px")
    //     .attr("xlink:href", function(d) {
    //         if(d == "Republican"){ return "static/images/elephant.png"; }
    //         else if(d == "Democratic"){ return "static/images/donkey.png"; }
    //     });

    /*
    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function(d) { return d; });
    */

    var svg = d3.select("#smallMultiples")
        .selectAll("pie")
        .data(data)
        .enter()
        .append("svg")
        .attr("class", "pie")
        .attr("width", 165)
        .attr("height", 185)
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


    // adds a tooltip using the Tipsy library
    $('svg g').tipsy({ 
        gravity: 'w', 
        html: true, 
        title: function() {
            var d = this.__data__;
            return "Democratic: " + d.Democratic + " Republican: " + d.Republican + " Other: " + d.Others;; 
        }
    });

    var year = svg.append("text")
        .attr("dy", ".35em")
        .attr('class', 'year')
        .style("text-anchor", "middle")
        .text(function(d) { return d.Year; });

    // set color of year depending on winning party
    year.style("fill", function(d) { 
        if(parseInt(d.Democratic) > parseInt(d.Republican) && parseInt(d.Democratic) > parseInt(d.Others)) {
            return "#4579ad";
        }
        else if(parseInt(d.Republican) > parseInt(d.Democratic) && parseInt(d.Republican) > parseInt(d.Others)) {
            return "#d53f37";
        }
        else{
            return "#666";
        }
    });

    // draw rectangular border around small multiples with color indicating winning party
    svg.append("rect")
        .attr("x", -100)
        .attr("y", -120)
        .attr("width", 200)
        .attr("height", 240)
        .attr("fill", "rgba(255, 255, 255, .1)")
        .attr("stroke-width", 2)
        .attr("stroke", function(d) { 
            if(parseInt(d.Democratic) > parseInt(d.Republican) && parseInt(d.Democratic) > parseInt(d.Others)) {
                return "#4579ad";
            }
            else if(parseInt(d.Republican) > parseInt(d.Democratic) && parseInt(d.Republican) > parseInt(d.Others)) {
                return "#d53f37";
            }
            else{
                return "#666";
            }
        });

    // Write name of elected president above donut diagram 
    var president = svg.append('svg:text')
        .attr('x', -90)
        .attr('y', -95)
        .attr('width', 180)
        .attr('height', 50)
        .style('fill', function(d) {
            if(d.WinnerParty == "Democratic") {
                return "#4579ad";
            }
            else if(d.WinnerParty == "Republican") {
                return "#d53f37";
            }
            else if(d.WinnerParty == "Other") {
                return "#666";
            }
        })
        .text(function(d) {
            return d.WinningCandidate;
        });

    // Add marker if incumbent runs and wins election
    svg.append('circle')
        .attr('cx', 80)
        .attr('cy', -100)
        .attr('r', 10)
        .style('fill', function(d) {
            // if(d.Repeat == "TRUE" && d.WinnerParty == "Democratic") {
            //     return "#4579ad";
            // }
            // else if(d.Repeat == "TRUE" && d.WinnerParty == "Republican") {
            //     return "#d53f37";
            // }
            // else if(d.Repeat == "TRUE" && d.WinnerParty == "Other") {
            //     return "#666";
            // }
            if (d.Repeat == "TRUE") {
                return "#666";
            }
            else {
                return "rgba(255, 255, 255, .1)";
            }
        });

    // Add marker if incumbent runs and loses election
    svg.append('circle')
        .attr('cx', 80)
        .attr('cy', 100)
        .attr('r', 10)
        .style('fill', "rgba(255, 255, 255, .1)")
        .style('stroke', function(d) {
            if(d.IncumbentLose == "TRUE") {
                return "#666";
            }
            else {
                return "rgba(255, 255, 255, .1)";
            }
        })
        .style('stroke-width', 2);

    // Write name of runner-up below donut diagram 
    var vp = svg.append('svg:text')
        .attr('x', -90)
        .attr('y', 105)
        .attr('width', 180)
        .attr('height', 50)
        .style('fill', function(d) {
            if(d.LoserParty == "Democratic") {
                return "#4579ad";
            }
            else if(d.LoserParty == "Republican") {
                return "#d53f37";
            }
            else if(d.LoserParty == "Other") {
                return "#666";
            }
        })
        .text(function(d) {
            return d.RunnerUp;
        });


    // var democrat = svg.append('foreignObject')
    //     .attr('x', 80)
    //     .attr('y', -20)
    //     .attr('width', 150)
    //     .attr('height', 100)
    //     .append("xhtml:body")
    //     .attr('class', function(d) {
    //         var sClass = 'candidate democrat'
    //         if(parseInt(d.Democratic) > parseInt(d.Republican)) {
    //             return sClass + ' bold';
    //         }
    //         return sClass;
    //     })
    //     .html(function(d) { return d.DemocraticLastName + '<span class="term">' + d.DemocraticTerm + '</span>'; });

    // var republican = svg.append('foreignObject')
    //     .attr('x', -230)
    //     .attr('y', -20)
    //     .attr('width', 150)
    //     .attr('height', 100)
    //     .append("xhtml:body")
    //     .attr('class', function(d) {
    //         var sClass = 'candidate republican'
    //         if(parseInt(d.Republican) > parseInt(d.Democratic)) {
    //             return sClass + ' bold';
    //         }
    //         return sClass;
    //     })
    //     .html(function(d) { return d.RepublicanLastName + '<span class="term">' + d.RepublicanTerm + '</span>'; });


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


// adds a shadow under nav bar on scroll
$(window).scroll(function() {
    var positionY = window.pageYOffset;
    if (positionY > 0) {
        $('nav').addClass('shadow');
    }
    else {
        $('nav').removeClass('shadow');
    }
});



