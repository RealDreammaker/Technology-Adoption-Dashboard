// default selected countries
var selectedCountries = ["Australia","Germany","Japan", "Russia","China","Canada", "Brazil", "Mexico"];
var selectedYear = "2019"; 

d3.json('/api/countries').then(function(data){
    console.log(data);
    d3.select("#selectDataset")
    .selectAll("option")
    .data(data)
    .enter()
    .append("option")
    .text(function(d){return d})
    .attr("value", function (d) {return d})
    .attr("selected", d => {
        if (selectedCountries.includes(d)){
            return "selected"
        }})
});

var sliderLabel = d3.select(".slidecontainer>label")
var slider = d3.selectAll('#customRange2');
var button = d3.selectAll('button');
var values


button.on("click",function(){
    selectedCountries = $('#selectDataset').val()
    makeResponsive(selectedCountries,selectedYear);
});

slider.on("click",function(){
    selectedYear= $('#customRange2').val()
    sliderLabel.text(selectedYear)
    makeResponsive(selectedCountries,selectedYear);
});