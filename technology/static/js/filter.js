d3.json('/api/countries').then(function(data){
    console.log(data);
    d3.select("#selectDataset")
    .selectAll("option")
    .data(data)
    .enter()
    .append("option")
    .text(function(d){return d});
});








/*
var years = [
    '1987',
    '1988',
    '1989',
    '1990',
    '1991',
    '1992',
    '1993',
    '1994',
    '1995',
    '1996',
    '1997',
    '1998',
    '1999',
    '2000',
    '2001',
    '2002',
    '2003',
    '2004',
    '2005',
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012',
    '2013',
    '2014',
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
    '2021',
    '2015',
    ]

d3.select("#selectDataset")
.selectAll("option")
.data(years)
.enter()
.append("option")
.text(function(d){return d})
*/

