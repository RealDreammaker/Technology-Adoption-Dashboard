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

function updateLineChart(selectedCountries,selectedYear,filteredData,chosenYLabel, lightColors){

  // clear existing svg area if there was one
  var svgArea = d3.select("#my_dataviz").selectAll("svg");
  if (!svgArea.empty()){
      svgArea.remove()
  };

  var svgWidth = document.getElementById('my_dataviz').offsetWidth 
  // var svgWidth = 500
  var svgHeight = svgWidth * .7;

  var margin = {top: 0, 
    right: 0, 
    bottom: 35, 
    left: 35},

    chartWidth = svgWidth - margin.left - margin.right,
    chartHeight = svgHeight - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz")
    .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)

      var chartGroup = svg.append("g")
          .attr("transform",`translate(${margin.left},${margin.top})`);
            

// var tech_source = ["../data/mobile-phone-subscriptions-vs-gdp-per-capita.csv", "../data/blahTech.csv"];

// var d3MobileTech = function(data) {
  
  // List of groups (here I have one group per column)

  // var selectedCountries = d3.map(filteredData, function(d){return(d.entity)}).keys()

  // add the options to the button
  d3.select("#selectCountryButton")
    .selectAll('myOptions')
     .data(selectedCountries)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

  // A color scale: one color for each group
  // var myColor = d3.scaleOrdinal()
  //   .domain(selectedCountries)
  //   .range(d3.schemeSet2);

  // var xdomain = d3.extent(data, function(d) { return d.year; });

  // Add X axis --> it is a date format
  var x = d3.scaleLinear()
    .domain([1987,2019])
    .range([ 0, chartWidth ]);

  chartGroup.append("g")
    .attr("transform", "translate(0," + chartHeight + ")")
    .call(d3.axisBottom(x).ticks(7));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(filteredData, function(d) { return +d[chosenYLabel]; })])
    .range([ chartHeight, 0 ]);
  chartGroup.append("g")
    .call(d3.axisLeft(y));

  // Initialize line with first group of the list 'lightColors
  for (i=0; i<selectedCountries.length; i++){
    var line = chartGroup
      .append('g')
      .append("path")
        .datum(filteredData.filter(function(d){
          if (d[chosenYLabel]>0 && d.entity==selectedCountries[i]){
            return d.entity;
          }
        }))
        .attr("d", d3.line()
          .x(function(d) { return x(d.year) })
          .y(function(d) { return y(+d[chosenYLabel] )})
        )
        .attr("stroke", lightColors[i])
        .style("stroke-width", 4)
        .style("fill", "none")
        .attr("opacity", 0.5)

    line.on("mouseover",function(d){
          d3.select(this)
            .attr("opacity", 1)
            .html(function(d) {return`<b>${selectedCountries[i]}</b>`})
        })
    line.on("mouseout",function(d){
          d3.select(this)
  
            .attr("opacity", 0.5)
        })
  };

  // A function that update the chart for selected country
  function update(selectedGroup) {

    // Create new data with the selection?
    var dataFilter = filteredData.filter(function(d){return d.entity==selectedGroup})
    console.log(circleOpacity)
    // Give these new data to update line
    line
        .datum(dataFilter)
        .transition()
        .duration(1000)
        .attr("d", d3.line()
          .x(function(d) { return x(d.year) })
          .y(function(d) { return y(+d[chosenYLabel]) })
        )            
        .attr("opacity", 0.5)
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

// var d3BlahTech = function() {
// };

// var tech_list = [d3MobileTech, d3BlahTech]

//Read the data
// d3.csv(tech_source[selectedTech], tech_list[selectedTech])
