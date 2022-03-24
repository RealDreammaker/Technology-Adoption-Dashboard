// setting up functions to take in user data
function updateLineChart(selectedCountries,filteredData,chosenYLabel, lightColors){

  // clear existing svg area if there was one
  var svgArea = d3.select("#my_dataviz").selectAll("svg");
  if (!svgArea.empty()){
      svgArea.remove()
  };

  // setting up chart area
  var svgWidth = document.getElementById('my_dataviz').offsetWidth 
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

  
  // Add X axis 
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
          .y(function(d) { return y(+d[chosenYLabel])})
        )
        .attr("stroke", lightColors[i])
        .style("stroke-width", 4)
        .style("fill", "none")
        .attr("opacity", 0.5)
        
    // setting up event listener for each lines, 
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
};

