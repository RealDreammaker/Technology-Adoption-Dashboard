// requirement: data from 3 sources
// input: country name and year
// var selectedCountries = ["Australia","Germany","Japan", "Russia","China"];
// var selectedYear = "2019"; 
// var selectedDataSet = mobiData
// chosenYLabel

// KELVIN TO CHANGE TO URL BEFORE APP DEPLOYMENT

const fillOpacity = 0.8
const url ="https://raw.githubusercontent.com/RealDreammaker/Project_2/main/technology/static/data/countries.geojson"
// const url = "/api/geojson"

// create a function to convert hsl color type to hex
function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}


function updateMap(selectedCountries,selectedYear,filteredData,chosenYLabel){

  // clear existing map area this is to response to screen size changed
  var mapArea = d3.selectAll("#map");
  mapArea.remove()

  // add div for leaflet map again
  d3.select("#mapContainer")
    .append("div")
    .attr("id","map")

  // Read in country boundaries
  // d3.json("../static/data/countries.geojson").then(function(countriesData){
  d3.json(url).then(function(countriesData){
    console.log(countriesData)

    // create tile layer
    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 10,
      id: "outdoors-v11",
      accessToken: API_KEY
    });
    
    // create map object
    var myMap = L.map("map", {
      center: [21.6418, -30.0684],
      zoom: 1.5,
      layers: [outdoors, ]
    });
    
    // variable for console log TO BE REMOVED
    var minSubscription = 1000;
    var maxSubscription = 0;
    
    console.log(filteredData)

    // loop through countriesdata, find a matching data in selected dataset and add value to it.
    countriesData.features.forEach((boundary,index) => {

      // for each country boundary, loop through the technology data and find matching country name and selected year
      filteredData.forEach(tech => {
        if (tech.code == boundary.properties.iso_a3  && tech.year == selectedYear){
          var subscription = parseInt(tech[chosenYLabel]);
          // store new data to country boundaries
          countriesData.features[index].properties.value = subscription;

          // update min and max subscription
          if (minSubscription > subscription) {
            minSubscription = subscription;
          };
          if (maxSubscription < subscription) {
            maxSubscription = subscription;
          };
        }
      });
    });

    // to generate color based on data value
    var colorLinearScale = d3.scaleLinear()
      .domain([0, 350])
      .range([90,40]);
    
    // color with be adjusted according to number of subscription
    function chooseColor(subscription){
      return hslToHex(233, 90, Math.round(colorLinearScale(subscription),0));
    };

    console.log(colorLinearScale(100))
    console.log("max:" + maxSubscription)
    console.log("min:" + minSubscription)

    var otherCountriesBoundaries = []
    var selectedCountriesBoundaries = []
    
    // functions to modify listeners 
    // function highlightFeature(e) {
    //   var layer = e.target;
    //   info.update(layer.feature.properties);
    // }
    // function resetHighlight(e) {
    //   info.update();
    // }
  
    L.geoJson(countriesData, {
      // Style each feature (in this case a country)
      style: function(feature) {
        // set default boundary color to white
        var boundaryColor= "white";
        var lineWeight = 1
        var countryName = feature.properties.name

        if (selectedCountries.includes(countryName)){
          boundaryColor= lightColor[selectedCountries.indexOf(countryName)];
          // feature.openPopup()
          lineWeight = 2
          console.log(feature)
        };

        console.log(countryName + feature.properties.value + "L:" + colorLinearScale(feature.properties.value) + boundaryColor);

        return {
          color: boundaryColor,
          // Call the chooseColor function to decide which color to color our country (color based on country)
          fillColor: 	chooseColor(feature.properties.value),
          fillOpacity: fillOpacity,
          weight: lineWeight
        };
      },
      // Called on each feature
      onEachFeature: function(feature, layer) {
        var countryName = feature.properties.name

        // filter countries to highlighted one if selected
        if (selectedCountries.includes(countryName)){
          selectedCountriesBoundaries.push(layer);
          layer.bringToFront()
        } else {
          otherCountriesBoundaries.push(layer);
        };

        // Set mouse events to change map styling
        layer.on({
          // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
          mouseover: function(event) {
            layer = event.target;
            // highlightFeature(event);
            // this.openPopup()
            layer.setStyle({
              fillOpacity: 0.9
            });
          },
          // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
          mouseout: function(event) {
            // resetHighlight(event);
            layer = event.target;
            // this.closePopup()

            layer.setStyle({
              fillOpacity: fillOpacity
            });
          },
          // When a feature (country) is clicked, it is enlarged to fit the screen
          click: function(event) {
            myMap.fitBounds(event.target.getBounds());
          }
        });
        // Giving each feature a pop-up with information pertinent to it
        var popUpDetails = feature.properties.value;
        if (typeof feature.properties.value == "undefined"){
          popUpDetails = "Unknown"
        }
        else {
          popUpDetails += " per 100 people"
        };

        layer.bindPopup(`<b> ${feature.properties.name} </b><hr>
          Subscription: ${popUpDetails} `
        );
       
      }

    });

    // ********************************************
    // ********** INITIALIZE MAP LEGEND **********
    // ********************************************
    // configure legend location 
    var legend = L.control({position: 'bottomright'});
  
    legend.onAdd = function (){
    
        var div = L.DomUtil.create('div', 'info legend'),
            subscriptionRange = [0, 50, 100, 150, 200, 250];
            // subscriptionRange = [0, 10, 20, 30, 40, 50, 70, 90, 110, 350];

        // for countries without data, give black color
        div.innerHTML = '<i style="background:#000000"></i> No Data<br>';
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < subscriptionRange.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(subscriptionRange[i] ) + '" id ="legend' + i + '"></i> ' +
                subscriptionRange[i] + (subscriptionRange[i + 1] ? '&ndash;' + subscriptionRange[i + 1] + '<br>' : '+');
        }
        return div;
    };

    // create event listener for legend box when user hover over it
    var subscriptionRange = [0, 50, 100, 150, 200, 250];
    for (var i = 0; i < subscriptionRange.length; i++) {
      var Legend = d3.selectAll("#" + "legend" + i)
      console.log("#" + "legend" + i);
      Legend.on("mouseover", function(d) {
        console.log("hello")
      }); 

      Legend.on("mouseout", function(d) {
        console.log("bye")
      });    
    };

    legend.addTo(myMap);

    var selectedCountriesBoundariesLayer = L.layerGroup(selectedCountriesBoundaries).addTo(myMap);
    var otherCountriesBoundariesLayer = L.layerGroup(otherCountriesBoundaries).addTo(myMap);
    
    var overlayMaps = {
      "Selected countries": selectedCountriesBoundariesLayer ,
      "Other countries": otherCountriesBoundariesLayer
    }

    L.control.layers({"Outdoor" : outdoors}, overlayMaps, {collapsed: false}).addTo(myMap);

    // add custom information control
    // var info = L.control();

    // info.onAdd = function (map) {
    //     this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    //     this.update();
    //     return this._div;
    // };

    // // method that we will use to update the control based on feature properties passed
    // info.update = function (props) {
    //     this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
    //         '<b>' +feature.properties.name + '</b><br />' + feature.properties.value + ' per 100 people'
    //         : 'Hover over a country');
    // };

    // info.addTo(map);

    console.log(selectedCountriesBoundariesLayer)
    
  });
};