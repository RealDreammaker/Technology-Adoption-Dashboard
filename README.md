# Project_2

## Project team: ##
* Kelvin Nguyen
* Matt Suffra
* Anita Rynkanen
* Raymond Chau

## Data source ##
* [Our World in Data](https://ourworldindata.org/technology-adoption)


## Background ##
 
For this project we explored the dataset related to adoption of mobile phones across different countries between 1960 and 2019. We used Whimsical for sketching our project plan.
We have created a dashboard with 3 visualizations that include a heat map, line chart and bubble chart with an ability to change the charts based on the country selection and year. These visualisations show the number of mobile telephone subscriptions, measured as the number per 100 people versus gross domestic product (GDP) per capita.

## Development process and technologies ##

1. We designed a web page using Python Flask-powered API, HTML, CSS and Javascript to show the dashboard.
2. We have uploaded [the technology adoption data](technology/static/data/mobile-phone-subscriptions-vs-gdp-per-capita.csv) to PostgreSQL database server using Flask API application
3. GeoJON data for map is assessed by using d3 queries to [link](https://raw.githubusercontent.com/RealDreammaker/Project_2/main/technology/static/data/countries.geojson) on GitHub
4.We used multiple selection menu and slider as new features for user interaction. 
5. All three visualizations are responsive to window size are updated simultaneously when user submit their selection or select year from the slider
   - [multiple selection menu and slider js code](technology/static/js/filter.js) 
   - [Leaflet map js code](technology/static/js/leaflet.js)
   - [Bubble chart js code](technology/static/js/bubblecharts.js)
   - [Line chart js code](technology/static/js/linecharts.js) 
6. The application ([app.py](technology/app.py)) was successfully deployed [online](https://technologyadoption.herokuapp.com/) using Heroku. 

**Other Links**
* [Project proposal](https://docs.google.com/document/d/1WuXtjEu_4yP9bqrYKtSxezkih-kNpky11a9ftDdth68/edit)
* [Project presentation](https://www.canva.com/design/DAE7Zl4m7Hc/YRmcR02giW9PzyiMosw0zw/view?utm_content=DAE7Zl4m7Hc&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink)
