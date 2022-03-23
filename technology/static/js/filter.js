d3.json('/api/countries').then(function(data){
    console.log(data);
    d3.select("#selectDataset")
    .selectAll("option")
    .data(data)
    .enter()
    .append("option")
    .text(function(d){return d})
    .attr("value", function (d) {return d})
});


var button = d3.selectAll('button');
var form = d3.selectAll('form');
var values

button.on("click",function(){
    values = $('#selectDataset').val()
    console.log(values)
});