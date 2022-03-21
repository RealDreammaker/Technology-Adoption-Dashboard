<<<<<<< HEAD
// Link requirements data from 3 sources
// input country name & year

// var selectedCountries = ["Australia","Germany","Japan", "Russia","China","Canada", "Brazil", "Mexico"];
// var selectedYear = "2019"; 
// var lightColor = ["green","purple","yellow","pink","orange","cyan","magenta","red","blue","lime"];

// const teleData = "../data/fixed-landline-telephone-subscriptions-vs-GDP-per-capita.csv"
// const teleDataColHeading = "Fixed telephone subscriptions (per 100 people)";

// const mobiData = "../data/mobile-phone-subscriptions-vs-gdp-per-capita.csv"
// const mobiDataColHeading = "Mobile cellular subscriptions (per 100 people)";

// const roadData = "../data/road-vehicles-per-1000-inhabitants-vs-gdp-per-capita.csv"
// const roadDataColHeading = "Motor vehicles per 1000 people (NationMaster (2014))";
// var selectedDataSet = teleData

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
          
// var selectedTech = d3.select("#selectTechButton").node().value;
var selectedTech = 0;


var tech_source = ["../data/mobile-cellular-subscriptions-per-100-people.csv", "../data/blahTech.csv"];

var d3MobileTech = function(data) {
  var mobile_data = "Mobile cellular subscriptions (per 100 people)";
  // List of groups (here I have one group per column)
  var allGroup = d3.map(data, function(d){return(d.Entity)}).keys()

  // add the options to the button
  d3.select("#selectCountryButton")
    .selectAll('myOptions')
     .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

  // A color scale: one color for each group
  var myColor = d3.scaleOrdinal()
    .domain(allGroup)
    .range(d3.schemeSet2);
  var xdomain = d3.extent(data, function(d) { return d.Year; });
  // Add X axis --> it is a date format
  var x = d3.scaleLinear()
    .domain(xdomain)
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(7));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d[mobile_data]; })])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Initialize line with first group of the list
  var line = svg
    .append('g')
    .append("path")
      .datum(data.filter(function(d){return d.Entity==allGroup[0]}))
      .attr("d", d3.line()
        .x(function(d) { return x(d.Year) })
        .y(function(d) { return y(+d[mobile_data] )})
      )
      .attr("stroke", function(d){ return myColor("valueA") })
      .style("stroke-width", 4)
      .style("fill", "none")

  // A function that update the chart
  function update(selectedGroup) {

    // Create new data with the selection?
    var dataFilter = data.filter(function(d){return d.Entity==selectedGroup})

    // Give these new data to update line
    line
        .datum(dataFilter)
        .transition()
        .duration(1000)
        .attr("d", d3.line()
          .x(function(d) { return x(d.Year) })
          .y(function(d) { return y(+d[mobile_data]) })
        )
        .attr("stroke", function(d){ return myColor(selectedGroup) })
  }

  // When the button is changed, run the updateChart function
  d3.select("#selectCountryButton").on("change", function(d) {
      // recover the option that has been chosen
      var selectedOption = d3.select(this).property("value")
      // run the updateChart function with this selected option
      update(selectedOption)
  })

};

var d3BlahTech = function() {
};

var tech_list = [d3MobileTech, d3BlahTech]

//Read the data
d3.csv(tech_source[selectedTech], tech_list[selectedTech])
=======
function updateLineChart(selectedCountries,selectedYear, filteredData ,chosenYLabel){

};
>>>>>>> 3a1b6793c785c4906893c016ac181c400bdb0ca7
