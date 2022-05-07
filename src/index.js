//package.json webpack server (put inside package.json if needed)
/*"scripts": {
    "start": "SET NODE_OPTIONS=--openssl-legacy-provider && webpack-dev-server  --content-base  ./public --output-path ./public --hot"
  },
*/

import * as mapboxgl from 'mapbox-gl';
import {MapboxLayer} from '@deck.gl/mapbox';
import {ScatterplotLayer} from '@deck.gl/layers';
//import {IconLayer} from '@deck.gl/layers';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import heatmapLayer from '@deck.gl/aggregation-layers/dist/es5/heatmap-layer/heatmap-layer';


mapboxgl.accessToken = 'pk.eyJ1IjoicmFmaW96MCIsImEiOiJjbDJqOWVxNnYwMWQ5M29wa2FuZWJ3NG4zIn0.ocVrhgHM9MrABOj9isMg-A';
const eruptions = './volcanoEruptions.json';
const eruptionsObj = require('../public/volcanoEruptions.json'); 

const cont = document.getElementById('content');
const volInfo = [];
let minVal = -11345;
let maxVal = 2020;

function getEruptions(volcano_name) {
  return eruptionsObj.filter(
      function(eruptionsObj){ return eruptionsObj.volcano_name == volcano_name }
  );
}
let found = {};

let toggleScatter = true;
let toggleHeat = false;
let toggleHex = false;

//let test1 = 2;

const scatterplot = new MapboxLayer
({
    id: 'scatter',
    type: ScatterplotLayer,
    data: eruptions,
    opacity: 0.8,
    filled: true,
    radiusMinPixels: 2,
    radiusMaxPixels: 8,
    getPosition: d => (parseInt(d.start_year) >=  minVal && parseInt(d.start_year) <= maxVal) && toggleScatter == true ? [parseFloat(d.longitude), parseFloat(d.latitude)] : [0,0],
    getFillColor: d => parseInt(d.start_year) >=  minVal && parseInt(d.start_year) <= maxVal ? (parseInt(d.number_of_eruptions) > 20 ? [350, 0, 40, 300] : [255, 160, 0, 150]) : [0,0,0,0],
    updateTriggers: 
    {
      getPosition: [minVal, maxVal, toggleScatter],
      getFillColor: [minVal, maxVal]
    },
    pickable: true,
    onHover: ({object, x, y}) => 
    {
        const el = document.getElementById('tooltip');
        if (object) 
        {
          const { volcano_name, subregion, number_of_eruptions } = object;
          el.innerHTML = `<h1>Volcano name: </h1><p>${volcano_name}</p><h1>Subregion: </h1><p>${subregion}</p><h1>Number of eruptions: </h1><p>${number_of_eruptions}</p>`;
          el.style.display = 'block';
          el.style.opacity = 0.9;
          el.style.left = x + 'px';
          el.style.top = y + 'px';
        } 
        else 
        {
          el.style.left = '-100%';
          el.style.opacity = 0.0;
        }
    },
    onClick: ({object, x, y}) => 
    {
      const { volcano_name, number_of_eruptions, subregion, country, elevation, primary_volcano_type, last_eruption_year, population_within_5_km, population_within_10_km, population_within_30_km, population_within_100_km, latitude, longitude } = object;

      volInfo[0] = volcano_name;
      volInfo[1] = subregion;
      volInfo[2] = country;
      volInfo[3] = elevation;
      volInfo[4] = primary_volcano_type;
      volInfo[5] = number_of_eruptions;
      volInfo[6] = last_eruption_year;
      volInfo[7] = population_within_5_km;
      volInfo[8] = population_within_10_km;
      volInfo[9] = population_within_30_km;
      volInfo[10] = population_within_100_km;
      volInfo[11] = latitude;
      volInfo[12] = longitude;

      found = getEruptions(volInfo[0]);
      /*for (x in found)
      {
        console.log(found[x].start_year);
      }*/

      cont.innerHTML = `
      <div id="arrows"><p>scroll</p></div>
      <h1>${volInfo[0]}</h1>
      <p><i>${volInfo[1]}</i></p>
      <br>
      <p><b>Country: </b>${volInfo[2]}</p>
      <p><b>Elevation: </b>${volInfo[3]}</p>
      <p><b>Volcano type: </b>${volInfo[4]}</p>
      <p><b>Number of eruptions: </b>${volInfo[5]}</p>
      <p><b>Last eruption <i>(year)</i>: </b>${volInfo[6]}</p>
      <p><b>Latitude: </b>${volInfo[11]}</p>
      <p><b>Longitude: </b>${volInfo[12]}</p>
      <h2>Population</h2>
      <p><b>within 5km: </b>${volInfo[7]}</p>
      <p><b>within 10km: </b>${volInfo[8]}</p>
      <p><b>within 30km: </b>${volInfo[9]}</p>
      <p><b>within 100km: </b>${volInfo[10]}</p>`;

      if(!detailsToggle)
      {
        det.style.transform = 'translate(0,0)';
        dotL.style.outline = '15px solid #fff';
        dotL.style.outlineOffset = '0px';
        detailsToggle = true;
      }
      //window.open(`https://www.gunviolencearchive.org/incident`)
    }
});

const heatmap =  new MapboxLayer
({
  id: 'heat',
  type: HeatmapLayer,
  data: eruptions,
  getPosition: d => (parseInt(d.start_year) >=  minVal && parseInt(d.start_year) <= maxVal) && toggleHeat == true ? [parseFloat(d.longitude), parseFloat(d.latitude)] : [0,0],
  getWeight: d => parseInt(d.start_year) >=  minVal && parseInt(d.start_year) <= maxVal ? parseInt(d.number_of_eruptions) : 0,
  radiusPixels: 50,
  weightsTextureSize: 512,

  updateTriggers: 
    {
      getPosition: [minVal,maxVal, toggleHeat],
      getWeight: [minVal, maxVal]
    },
});

const hexagon = new MapboxLayer
({
  id: 'hex',
  type: HexagonLayer,
  data: eruptions,
  getPosition: d => (parseInt(d.start_year) >=  minVal && parseInt(d.start_year) <= maxVal) && toggleHex == true ? [parseFloat(d.longitude), parseFloat(d.latitude)] : [0,0],
  getElevationWeight: d => parseInt(d.start_year) >=  minVal && parseInt(d.start_year) <= maxVal ? parseInt(d.number_of_eruptions) : 0,
  getColorWeight: d => (parseInt(d.start_year) >=  minVal && parseInt(d.start_year) <= maxVal) && toggleHex == true ? 1 : 0,
  elevationScale: 600*10,
  extruded: true,
  radius: 32000*2,         
  opacity: 0.6,        
  coverage: 0.8,
  lowerPercentile: 1,
  antialias: true,

  updateTriggers: 
    {
      getPosition: [minVal, maxVal,toggleHex],
      getColorWeight: [minVal, maxVal],
      getElevationWeight: [minVal, maxVal]
    },
});

const map = new mapboxgl.Map
({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v9',
  center: [0, 0],
  zoom: 2,
  antialias: true
});

map.on('load', () => 
{
  map.addLayer(scatterplot);
  map.addLayer(heatmap);
  map.addLayer(hexagon);

  //map.setLayoutProperty('scatter','visibility','none'); 
  map.setLayoutProperty('hex','visibility','none'); 
  map.setLayoutProperty('heat','visibility','none'); 
});

const scatterB = document.getElementById("scatterB");
const heatB = document.getElementById("heatB");
const hexB = document.getElementById("hexB");
//onClick doesn't work but this does
scatterB.onclick = function() {scatterToggle()};
heatB.onclick = function() {heatToggle()};
hexB.onclick = function() {hexToggle()};


heatB.style.outline = '#fff 5px inset';
heatB.style.backgroundColor = '#ea3737';
heatB.style.color = '#fff';
heatB.style.opacity = '50%';
heatB.style.transform = 'translate(-45px,0)';

hexB.style.outline = '#fff 5px inset';
hexB.style.backgroundColor = '#ea3737';
hexB.style.color = '#fff';
hexB.style.opacity = '50%';
hexB.style.transform = 'translate(-45px,0)';


function scatterToggle()
{
  if(toggleScatter)
  {
    map.setLayoutProperty('scatter','visibility','none'); 
    toggleScatter = false;

    scatterB.style.outline = '#fff 5px inset';
    scatterB.style.backgroundColor = '#ea3737';
    scatterB.style.color = '#fff';
    scatterB.style.opacity = '50%';
    scatterB.style.transform = 'translate(-45px,0)';

    scatterplot.setProps({
      updateTriggers: {
        getPosition: [minVal, maxVal, toggleScatter],
        getFillColor: [minVal, maxVal]
      }
    });
  }
  else
  {
    map.setLayoutProperty('scatter','visibility','visible'); 
    toggleScatter = true;

    scatterB.style.outline = '#ea3737 5px inset';
    scatterB.style.backgroundColor = '#fff';
    scatterB.style.color = '#ea3737';
    scatterB.style.opacity = '100%';
    scatterB.style.transform = 'translate(0,0)';

    scatterplot.setProps({
      updateTriggers: {
        getPosition: [minVal, maxVal, toggleScatter],
        getFillColor: [minVal, maxVal]
      }
    });
  }
}
function heatToggle()
{
  if(toggleHeat)
  {
    map.setLayoutProperty('heat','visibility','none'); 
    toggleHeat = false;

    heatB.style.outline = '#fff 5px inset';
    heatB.style.backgroundColor = '#ea3737';
    heatB.style.color = '#fff';
    heatB.style.opacity = '50%';
    heatB.style.transform = 'translate(-45px,0)';

    heatmap.setProps({
      updateTriggers: 
    {
      getPosition: [minVal,maxVal, toggleHeat],
      getWeight: [minVal, maxVal]
    },
    });
  }
  else
  {
    map.setLayoutProperty('heat','visibility','visible'); 
    toggleHeat = true;

    heatB.style.outline = '#ea3737 5px inset';
    heatB.style.backgroundColor = '#fff';
    heatB.style.color = '#ea3737';
    heatB.style.opacity = '100%';
    heatB.style.transform = 'translate(0,0)';

    heatmap.setProps({
      updateTriggers: 
    {
      getPosition: [minVal,maxVal, toggleHeat],
      getWeight: [minVal, maxVal]
    },
    });
  }
}
function hexToggle()
{
  //test1 = 20;
  //scatterplot.setProps({radiusMinPixels: test1});
  if(toggleHex)
  {
    map.setLayoutProperty('hex','visibility','none'); 
    toggleHex = false;

    hexB.style.outline = '#fff 5px inset';
    hexB.style.backgroundColor = '#ea3737';
    hexB.style.color = '#fff';
    hexB.style.opacity = '50%';
    hexB.style.transform = 'translate(-45px,0)';

    hexagon.setProps({
      updateTriggers: 
      {
        getPosition: [minVal, maxVal,toggleHex],
        getColorWeight: [minVal, maxVal],
        getElevationWeight: [minVal, maxVal]
      }
    });
  }
  else
  {
    map.setLayoutProperty('hex','visibility','visible'); 
    toggleHex = true;

    hexB.style.outline = '#ea3737 5px inset';
    hexB.style.backgroundColor = '#fff';
    hexB.style.color = '#ea3737';
    hexB.style.opacity = '100%';
    hexB.style.transform = 'translate(0,0)';

    hexagon.setProps({
      updateTriggers: 
      {
        getPosition: [minVal, maxVal,toggleHex],
        getColorWeight: [minVal, maxVal],
        getElevationWeight: [minVal, maxVal]
      }
    });
  }
}

//  slider  //

const rangeInput = document.querySelectorAll(".range-input input"),
priceInput = document.querySelectorAll(".price-input input"),
range = document.querySelector(".slider .progress");
let priceGap = 0;
priceInput.forEach(input =>{
    input.addEventListener("input", e =>{
        let minPrice = parseInt(priceInput[0].value),
        maxPrice = parseInt(priceInput[1].value);
        minVal = minPrice;
        maxVal = maxPrice;
        // refresh layer //
        if(scatterToggle)
        {
          scatterplot.setProps({
            updateTriggers: {
              getPosition: [minVal, maxVal],
              getFillColor: [minVal, maxVal]
            }
          });
        }
        if(heatToggle)
        {
          heatmap.setProps({
            updateTriggers: 
            {
              getPosition: [minVal,maxVal, toggleHeat],
              getWeight: [minVal, maxVal]
            },
          });
        }
        if(hexToggle)
        {
          hexagon.setProps({
            updateTriggers: 
            {
              getPosition: [minVal, maxVal,toggleHex],
              getColorWeight: [minVal, maxVal],
              getElevationWeight: [minVal, maxVal]
            }
          });
        }
        // # //
        
        if((maxPrice - minPrice >= priceGap) && maxPrice <= rangeInput[1].max){
            if(e.target.className === "input-min"){
                rangeInput[0].value = minPrice;
                range.style.left = 100 - (((13365 - (minPrice + 11345)) / 1336) * 10) + "%";
            }else{
                rangeInput[1].value = maxPrice;
                range.style.right = ((13365 - (maxPrice + 11345)) / 1336) * 10 + "%";
            }
        }
    });
});
rangeInput.forEach(input =>{
    input.addEventListener("input", e =>{
        minVal = parseInt(rangeInput[0].value);
        maxVal = parseInt(rangeInput[1].value);

        // refresh layer //
        if(scatterToggle)
        {
          scatterplot.setProps({
            updateTriggers: {
              getPosition: [minVal, maxVal],
              getFillColor: [minVal, maxVal]
            }
          });
        }
        if(heatToggle)
        {
          heatmap.setProps({
            updateTriggers: 
            {
              getPosition: [minVal,maxVal, toggleHeat],
              getWeight: [minVal, maxVal]
            },
          });
        }
        if(hexToggle)
        {
          hexagon.setProps({
            updateTriggers: 
            {
              getPosition: [minVal, maxVal,toggleHex],
              getColorWeight: [minVal, maxVal],
              getElevationWeight: [minVal, maxVal]
            }
          });
        }
        // # //
        if((maxVal - minVal) < priceGap){
            if(e.target.className === "range-min"){
                rangeInput[0].value = maxVal - priceGap;
            }else{
                rangeInput[1].value = minVal + priceGap;
            }
        }else{
            priceInput[0].value = minVal;
            priceInput[1].value = maxVal;
            range.style.left = 100 - (((13365 - (minVal + 11345)) / 1336) * 10) + "%";
            range.style.right = ((13365 - (maxVal + 11345)) / 1336) * 10 + "%";
        }
    });
});
//  # //

const wrapperM = document.getElementById("wrapperMove");
const dotD = document.getElementById("dotDown");
const dotL = document.getElementById("dotLeft");
const det = document.getElementById('details');

dotD.onclick = function() {slideDown()};
dotL.onclick = function() {slideLeft()};
let wrapperToggle = false;
let detailsToggle = true;

function slideDown()
{
  if(wrapperToggle)
  {
    wrapperM.style.transform = 'translate(0,-90%)';
    dotD.style.outline = '10px solid #fff';
    dotD.style.outlineOffset = '-15px';
    wrapperToggle = false;
  }
  else
  {
    wrapperM.style.transform = 'translate(0,0)';
    dotD.style.outline = '15px solid #fff';
    dotD.style.outlineOffset = '0px';
    wrapperToggle = true;
  }
}
function slideLeft()
{
  if(detailsToggle)
  {
    det.style.transform = 'translate(97%,0)';
    dotL.style.outline = '10px solid #fff';
    dotL.style.outlineOffset = '-15px';
    detailsToggle = false;
  }
  else
  {
    det.style.transform = 'translate(0,0)';
    dotL.style.outline = '15px solid #fff';
    dotL.style.outlineOffset = '0px';
    detailsToggle = true;
  }
}

const info = document.getElementById('volcanoInfo');
const about = document.getElementById('about');
const eruptionsTab = document.getElementById('eruptionsTab');
info.onclick = function() {infoF()};
about.onclick = function() {aboutF()};
eruptionsTab.onclick = function() {eruptionsF()};

function infoF()
{
  if(volInfo[0] == undefined)
  {
    cont.innerHTML = `<h1>Click on a point on the map for info</h1>`;
  }
  else
  {
    cont.innerHTML = `
    <div id="arrows"><p>scroll</p></div>
    <h1>${volInfo[0]}</h1>
    <p><i>${volInfo[1]}</i></p>
    <br>
    <p><b>Country: </b>${volInfo[2]}</p>
    <p><b>Elevation: </b>${volInfo[3]}</p>
    <p><b>Volcano type: </b>${volInfo[4]}</p>
    <p><b>Number of eruptions: </b>${volInfo[5]}</p>
    <p><b>Last eruption <i>(year)</i>: </b>${volInfo[6]}</p>
    <p><b>Latitude: </b>${volInfo[11]}</p>
    <p><b>Longitude: </b>${volInfo[12]}</p>
    <h2>Population</h2>
    <p><b>within 5km: </b>${volInfo[7]}</p>
    <p><b>within 10km: </b>${volInfo[8]}</p>
    <p><b>within 30km: </b>${volInfo[9]}</p>
    <p><b>within 100km: </b>${volInfo[10]}</p>`;
  }
}
function aboutF()
{
  cont.innerHTML = `<h1>About</h1>
  <p>The website was created to visualize volcanic activity around the world. The data contains information about volcanoes and eruptions from <span class="underlineClass">11345 BCE to 2020 CE</span></p>
  <h2>Source</h2>
  <ul>
    <li><a target="_blank" href="https://www.kaggle.com/datasets/jessemostipak/volcano-eruptions?resource=download">Data</a></li>
    <li><a target="_blank" href="https://www.mapbox.com">Map</a></li>
  </ul>
  <br>
  <h3>App created by: Rafał Szatkiewicz</h3>`;
}
function eruptionsF()
{
  if(Object.keys(found).length === 0 && found.constructor === Object)
  {
    cont.innerHTML = `<h1>Click on a point on the map for info</h1>`;
  }
  else
  {
    cont.innerHTML = `
    <div id="arrows"><p>scroll</p></div>
    <h1>Eruptions</h1><br>`;

    var tbl = document.createElement("table");
    var tblBody = document.createElement("tbody");

    // i = rows
    for (var i = 0; i < found.length; i++) 
    {
      // creates a table row
      var row = document.createElement("tr");

      // j = columns
      for (var j = 0; j < 5; j++) 
      {
        if(i==0)
        {
          var cell = document.createElement("th");
          if(j==0)
          {
            var cellText = document.createTextNode("Year");
          }
          else if(j==1)
          {
            var cellText = document.createTextNode("Category");
          }
          else if(j==2)
          {
            var cellText = document.createTextNode("Evidence method dating");
          }
          else if(j==3)
          {
            var cellText = document.createTextNode("Area of activity");
          }
          else
          {
            var cellText = document.createTextNode("Vei");
          }
          cell.appendChild(cellText);
          row.appendChild(cell);
        }
        else
        {
          var cell = document.createElement("td");
          if(j==0)
          {
            var cellText = document.createTextNode(found[i].start_year);
          }
          else if(j==1)
          {
            var cellText = document.createTextNode(found[i].eruption_category);
          }
          else if(j==2)
          {
            var cellText = document.createTextNode(found[i].evidence_method_dating);
          }
          else if(j==3)
          {
            var cellText = document.createTextNode(found[i].area_of_activity);
          }
          else
          {
            var cellText = document.createTextNode(found[i].vei);
          }
          cell.appendChild(cellText);
          row.appendChild(cell);
        }
      }

      // add the row to the end of the table body
      tblBody.appendChild(row);
    }

    // put the <tbody> in the <table>
    tbl.appendChild(tblBody);

    cont.appendChild(tbl);
  }

  


  /*const table = document.getElementById('table');
  
  for (let x in found)
  {
    table.innerHTML = `<tr><th>${found[x].start_year}</th><th>${found[x].vei}</th></tr>`;
  }*/
}

//testing
/*document.body.onkeyup = function()
{
  console.log('pressed');
}*/