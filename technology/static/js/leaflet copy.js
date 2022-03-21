// setting up parameter
const defaultMarkerOpacity = 0.75

// ********************************************
// ************ PREDEFINED FUNCTIONS **********
// ********************************************
// create a function to return corresponding color for given earthquake magnitute
function chooseColor(mangnitute){
  if (mangnitute < 1){
    return "#66ff66";
  }
  else if (mangnitute < 2){
    return "#ffff4d";
  }
  else if (mangnitute < 3){
    return "#ffd11a";
  }
  else if (mangnitute < 4){
    return "#ff9900";
  }
  else if (mangnitute < 5){
    return "#ff3300";
  }
  else {
    return "#ff0000";
  }
};

// function to calculate area of a polygon 
// https://gist.github.com/seyuf/ab9c980776e4c2cb350a2d1e70976517
function area(poly, shapeType, arrayIndex){
  var s = 0.0;
  var ring; 
  if (shapeType === "Polygon"){ 
    ring= poly.coordinates[0];
  }
  else {
    ring= poly.coordinates[0][0];
  };

  for(i= 0; i < (ring.length-1); i++){
    s += (ring[i][0] * ring[i+1][1] - ring[i+1][0] * ring[i][1]);
  }
  return 0.5 *s;
}

// function calculate central of a polygon 
// https://gist.github.com/seyuf/ab9c980776e4c2cb350a2d1e70976517
function centroid(poly, shapeType, arrayIndex){
  var c = [0,0];
  var ring; 
  if (shapeType === "Polygon"){ 
    ring= poly.coordinates[arrayIndex];
  }
  else {
    ring= poly.coordinates[arrayIndex][0];
  };


  for(i= 0; i < (ring.length-1); i++){
    c[0] += (ring[i][0] + ring[i+1][0]) * (ring[i][0]*ring[i+1][1] - ring[i+1][0]*ring[i][1]);
    c[1] += (ring[i][1] + ring[i+1][1]) * (ring[i][0]*ring[i+1][1] - ring[i+1][0]*ring[i][1]);
  }
  var a = area(poly, shapeType);
  c[0] /= a*6;
  c[1] /= a*6;
  return c;
}


function createMap(response){
  var features = response.features
  console.log(features);   

  // pull countries boundaries for use in sattelite map
  d3.json("../data/countries.geojson").then(function(countriesData){
    console.log(countriesData); 

    // ********************************************
    // ********** INITIALIZE TILE LAYERS **********
    // ********************************************
    var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 10,
      id: "light-v10",
      accessToken: API_KEY
    });

    // create tile layer satelite
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 10,
      id: "satellite-v9",
      accessToken: API_KEY
    });
  
    // create tile layer outdoor
    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 10,
      id: "outdoors-v11",
      accessToken: API_KEY
    });
    
    // create a base map object to hold tile layers
    var baseMaps = {
      "Satellite": satellite,
      "Grayscale": light,
      "Outdoors": outdoors
    };


    // ***************************************************
    // ********** INITIALIZE EARTHQUAKE MARKERS **********
    // ***************************************************
    // intialize an array to hold markers
    var markers = [];

    // loop through each features
    for (var i = 0; i <features.length; i++){
      
      var coordinates = features[i].geometry.coordinates;
      var properties = features[i].properties;
      
      // verifying if data for this feature has geometry data
      if (typeof coordinates === "undefined"){
        console.log(`This location does not exist: ${properties.place}`)
      } 
      // verifying if coordinate data for this feature is not missing
      else if (typeof coordinates[0] === "undefined" || typeof coordinates[1] === "undefined") {
        console.log(`This location does not have lat/long information: ${properties.place}`)
      } 
      else if ((coordinates[0] != null) && (coordinates[1] != null)){

        // add a marker to array
        markers.push(L.circle([coordinates[1], coordinates[0]],{
            weight: 1,
            stroke: true,
            color: "none",
            // using chooseColor function above for selecting color based on earthquake magitute
            fillColor: chooseColor(properties.mag),
            fillOpacity: defaultMarkerOpacity,
            // radius is calculated based on magitute level, 25000 is minimum marker size
            radius: properties.mag * 15000 + 25000
            // adding popup to marker
          }).bindPopup(
              `<h3>Magnitute: ${properties.mag}</h3><hr>
              <b>${properties.place}</b><br>
              Time: ${new Date(properties.time)}<br>
              Lat: ${coordinates[1]}  Long: ${coordinates[0]}
              Radius: ${properties.mag * 15000 + 25000}`
            )
            // create event handling when mouse hover over the marker
          .on({
            mouseover: function(event){
              var marker = event.target;
              marker.openPopup()
                .bringToFront()
                .setStyle({
                  fillOpacity: 1,
                  color: "black",
                  weight: 2
                });
            },
            mouseout: function(event){
              var marker = event.target;
              marker.closePopup()
                .bringToBack()
                .setStyle({
                  fillOpacity: defaultMarkerOpacity,
                  color: "none",
                  weight: 1.5
                });
            } 
          })
        );
      };
    };
 

    // add markers to a group layer
    var markersLayer = L.layerGroup(markers)

    // ***************************************************
    // ********** CREATE TECTONIC PLATES LAYER ***********
    // ***************************************************
    // pull data for tectonic plates from data folder
    d3.json("static/data/PB2002_boundaries.json").then(function(data){
      console.log(data);
      var tectonicPlates = L.geoJSON(data,{
        style: {
          color: "#ff9900",
          weight: 2.5
        }
      });
     
      // create an overlay object to hold over-layers
      var overlayMaps = {
        "Fault Lines": tectonicPlates,
        "Earthquakes": markersLayer
      };

    // *******************************************************
    // ** CREATE COUNTRY BOUNDARIES and COUNTRY NAMES LAYER **
    // *******************************************************
      var counter = 0;
      // create a default layer for countries boundary
      var countriesName = [];
      var countriesLayer = L.geoJSON(countriesData,{
        style: function(feature){
          return {
            color: "white",
            fillColor: "none",
            weight: 0.5
          };
        },
        // Called on each feature
        onEachFeature: function(feature, layer) {
          var centerPolygon;
          var geometry =feature.geometry
          if (geometry.type != "Polygon"){
            var biggestArrayIndex = 0;
            var currentArraySize = 0;
            for (j = 0; j < geometry.coordinates.length; j++){
              // console.log("index:"+ j + "size: " +geometry.coordinates[j][0].length);

              if (currentArraySize < geometry.coordinates[j][0].length ){
                currentArraySize = geometry.coordinates[j][0].length;
                biggestArrayIndex = j;
              }
            };  
          }
          else {
            biggestArrayIndex = 0
          };

          centerPolygon  = centroid(geometry, geometry.type , biggestArrayIndex).reverse();

          if ((!isNaN(centerPolygon[0])) && (!isNaN(centerPolygon[1])) && (typeof centerPolygon != "undefined")){
            var myTextLabel = L.marker(centerPolygon, {
                icon: L.divIcon({
                    className: 'text-labels',   // Set class for CSS styling
                    html: feature.properties.name
                }),
                zIndexOffset: 10000     // Make appear above other map features
            });
            countriesName.push(myTextLabel);
          } 
        }
      } )
      
      var countriesNameLayer = L.layerGroup(countriesName)


      // ********************************************
      // ********** INITIALIZE MAP LEGEND **********
      // ********************************************
      // configure legend location 
      var legend = L.control({position: 'bottomright'});
    
      legend.onAdd = function (){
      
          var div = L.DomUtil.create('div', 'info legend'),
              magnitutes = [0, 1, 2, 3, 4 , 5];
      
          // loop through our density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < magnitutes.length; i++) {
              div.innerHTML +=
                  '<i style="background:' + chooseColor(magnitutes[i] ) + '"></i> ' +
                  magnitutes[i] + (magnitutes[i + 1] ? '&ndash;' + magnitutes[i + 1] + '<br>' : '+');
          }
          return div;
      };
    
      // create map object
      var myMap = L.map("map", {
        center: [ 20.6418, -68.0684],
        zoom: 2.5,
        layers: [satellite, markersLayer, tectonicPlates,countriesLayer,countriesNameLayer]
      });
      

      // ********************************************
      // ********** CREATE EVENT HANDLING  **********
      // ********************************************
      // create event handling when different map layer was selected
      myMap.on({
        baselayerchange: function(event){
          if (event.layer.options.id === "satellite-v9"){
            // add add-on layers
            myMap.addLayer(countriesLayer);
            myMap.addLayer(countriesNameLayer);

            // modify marker appearance corresponding to baselayer
            markers.forEach(function(marker){
              marker.setStyle({
              color: "none",
              weight: 1.5 
              })
            });
            markersLayer = L.layerGroup(markers)
          }
          else {
            // remove add-on layers
            myMap.removeLayer(countriesLayer);
            myMap.removeLayer(countriesNameLayer);

            // modify marker appearance corresponding to baselayer
            markers.forEach(function(marker){
              marker.setStyle({
              color: "grey",
              weight: 1.5 
              })
            });
            markersLayer = L.layerGroup(markers)
          }
          ;
        }
      });
      
      legend.addTo(myMap);
    
      // add layer control to map
      L.control.layers(baseMaps,overlayMaps,{collapsed: false}).addTo(myMap);
    });
  }); 
};
// ********************************************
// ***** request data from USGS website******** 
// ********************************************
// EarthQuakeData = "static/data/all_week.geojson"
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(url).then(createMap).catch(function(error)
{console.warn(error);});