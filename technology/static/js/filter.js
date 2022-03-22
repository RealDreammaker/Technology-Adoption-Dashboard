d3.json('/api/countries').then(function(data){
    console.log(data);
    d3.select("#selectDataset")
    .selectAll("option")
    .data(data)
    .enter()
    .append("option")
    .text(function(d){return d})
});