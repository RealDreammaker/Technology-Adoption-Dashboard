// requirement: data from 3 sources
// input: country name and year
// var selectedCountries = ["Australia","Germany","Japan", "Russia","China"];
// var selectedYear = "2019"; 
// var selectedDataSet = mobiData
// chosenYLabel

// create a function to convert hsl color type to hex

const fillOpacity = 0.8

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



function chooseColor(subscription, colorScale){
  // return rgb(255, subscription, 153);
  console.log(Math.round(colorScale(subscription)));
  return hslToHex(233, 90, Math.round(colorScale(subscription),0));
};


function updateMap(selectedCountries,selectedYear,filteredData,chosenYLabel){

  // clear existing map area if there was one
  var mapArea = d3.selectAll("#map");
  if (!mapArea.empty()){

      mapArea.remove()
  };

  d3.select("#mapContainer")
    .append("div")
    .attr("id","map")

  // Read in country boundaries
  d3.json("../static/data/countries.geojson").then(function(countriesData){
  
    // create tile layer
    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 10,
      id: "outdoors-v11",
      accessToken: API_KEY
    });
    
      // create map object
      var myMap = L.map("map", {
        center: [ 20.6418, -68.0684],
        zoom: 1.5,
        layers: [outdoors]
      });
      
      // loop through countriesdata, find a matching data in selected dataset and add value to it.
      var minSubscription = 1000;
      var maxSubscription = 0;
      console.log(filteredData)
      countriesData.features.forEach((boundary,index) => {
        // for each country boundary, loop through the technology data and find matching country name and selected year
        filteredData.forEach(tech => {
          if (tech.Code == boundary.properties.iso_a3  && tech.Year == selectedYear){
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
            // console.log("index" + index + tech.Entity + countriesData.features[index].properties.value  );
          }
        });
      });
      // });

      // to generate color based on data value
      var colorLinearScale = d3.scaleLinear()
        .domain([minSubscription, maxSubscription])
        .range([90,40]);
      
      console.log(countriesData)
      console.log("max:" + maxSubscription)
      console.log("min:" + minSubscription)

      L.geoJson(countriesData, {
        // Style each feature (in this case a country)
        style: function(feature) {
          
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
            fillColor: 	chooseColor(feature.properties.value,colorLinearScale),
            fillOpacity: fillOpacity,
            weight: lineWeight
          };
        },
        // Called on each feature
        onEachFeature: function(feature, layer) {
          // Set mouse events to change map styling
          layer.on({
            // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
            mouseover: function(event) {
              layer = event.target;
              // this.openPopup()
              layer.setStyle({
                fillOpacity: 0.9
              });
            },
            // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
            mouseout: function(event) {
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

      }).addTo(myMap);
  
  });
};