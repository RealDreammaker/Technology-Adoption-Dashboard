

// Read in country boundaries
d3.json("../data/countries.geojson").then(function(countriesData){

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
      zoom: 2.5,
      layers: [outdoors]
    });

    // L.geoJSON(countriesData , {
    //   style: function(feature){
    //     return {
    //       color: "red",
    //       fillColor: "none",
    //       weight: 0.5
    //     };
    //   },
    //   // Called on each feature
    //   onEachFeature: function(feature, layer) {
    //     layer.on({
    //       mouseover: function(event) {
    //         layer = event.target;
    //         layer.setStyle({
    //           fillOpacity: 0.9
    //         });
    //       },
    //       mouseout: function(event) {
    //         layer = event.target;
    //         layer.setStyle({
    //           fillOpacity: 0.5
    //         });
    //       },
    //       click: function(event){
    //         console.log(event)
    //         myMap.fitBounds(event.target.getBounds());
    //       }
    //     })
    //     layer.bindPopup("<h1>" + feature.properties.name + "</h1>");
    //   }
    // }).addTo(myMap);

    L.geoJson(countriesData, {
      // Style each feature (in this case a country)
      style: function(feature) {
        return {
          color: "white",
          // Call the chooseColor function to decide which color to color our country (color based on country)
          fillColor: "pink",
          fillOpacity: 0.5,
          weight: 1.5
        };
      },
      // Called on each feature
      onEachFeature: function(feature, layer) {
        // Set mouse events to change map styling
        layer.on({
          // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
          mouseover: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.9
            });
          },
          // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
          mouseout: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.5
            });
          },
          // When a feature (country) is clicked, it is enlarged to fit the screen
          click: function(event) {
            myMap.fitBounds(event.target.getBounds());
          }
        });
        // Giving each feature a pop-up with information pertinent to it
        layer.bindPopup("<h1>" + feature.properties.name + "</h1>");
  
      }
    }).addTo(myMap);

});