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


mapboxgl.accessToken = 'pk.eyJ1IjoicmFmaW96MCIsImEiOiJjbDJqOWVxNnYwMWQ5M29wa2FuZWJ3NG4zIn0.ocVrhgHM9MrABOj9isMg-A';
const eruptions = './volcanoEruptions.json';

const cont = document.getElementById('content');
const volInfo = [];
let minVal = -11345;
let maxVal = 2020;

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
    getPosition: d => parseInt(d.start_year) >=  minVal && parseInt(d.start_year) <= maxVal ? [parseFloat(d.longitude), parseFloat(d.latitude)] : [0,0],
    getFillColor: d => parseInt(d.start_year) >=  minVal && parseInt(d.start_year) <= maxVal ? (parseInt(d.number_of_eruptions) > 20 ? [350, 0, 40, 300] : [255, 160, 0, 150]) : [0,0,0,0],
    updateTriggers: 
    {
      getPosition: [minVal, maxVal],
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
      const { volcano_name, eruption_number, number_of_eruptions, subregion } = object;

      volInfo[0] = volcano_name;
      volInfo[1] = subregion;
      cont.innerHTML = `<h1>${volInfo[0]}</h1><p><i>${volInfo[1]}</i></p>`;
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
  getPosition: d => [parseFloat(d.longitude), parseFloat(d.latitude)],
  getWeight: d => parseInt(d.number_of_eruptions),
  radiusPixels: 50,
});

const hexagon = new MapboxLayer
({
  id: 'hex',
  type: HexagonLayer,
  data: eruptions,
  getPosition: d => [parseFloat(d.longitude), parseFloat(d.latitude)],
  getElevationWeight: d => parseInt(d.number_of_eruptions),
  elevationScale: 600*10,
  extruded: true,
  radius: 32000*2,         
  opacity: 0.6,        
  coverage: 0.8,
  //lowerPercentile: 0,
  antialias: true
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

let toggleScatter = true;
let toggleHeat = false;
let toggleHex = false;

heatB.style.transform = 'translate(-45px,0)';
hexB.style.transform = 'translate(-45px,0)';

function scatterToggle()
{
  if(toggleScatter)
  {
    map.setLayoutProperty('scatter','visibility','none'); 
    toggleScatter = false;

    scatterB.style.backgroundColor = '#ff4646a0';
    scatterB.style.opacity = '50%';
    scatterB.style.transform = 'translate(-45px,0)';
  }
  else
  {
    map.setLayoutProperty('scatter','visibility','visible'); 
    toggleScatter = true;

    scatterB.style.backgroundColor = '#ff4646';
    scatterB.style.opacity = '100%';
    scatterB.style.transform = 'translate(0,0)';
  }
}
function heatToggle()
{
  if(toggleHeat)
  {
    map.setLayoutProperty('heat','visibility','none'); 
    toggleHeat = false;

    heatB.style.backgroundColor = '#ff4646a0';
    heatB.style.opacity = '50%';
    heatB.style.transform = 'translate(-45px,0)';
  }
  else
  {
    map.setLayoutProperty('heat','visibility','visible'); 
    toggleHeat = true;

    heatB.style.backgroundColor = '#ff4646';
    heatB.style.opacity = '100%';
    heatB.style.transform = 'translate(0,0)';
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

    hexB.style.backgroundColor = '#ff4646a0';
    hexB.style.opacity = '50%';
    hexB.style.transform = 'translate(-45px,0)';
  }
  else
  {
    map.setLayoutProperty('hex','visibility','visible'); 
    toggleHex = true;

    hexB.style.backgroundColor = '#ff4646';
    hexB.style.opacity = '100%';
    hexB.style.transform = 'translate(0,0)';
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
        scatterplot.setProps({
          updateTriggers: {
            getPosition: [minVal, maxVal],
            getFillColor: [minVal, maxVal]
          }
        });
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
        scatterplot.setProps({
          updateTriggers: {
            getPosition: [minVal, maxVal],
            getFillColor: [minVal, maxVal]
          }
        });
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
info.onclick = function() {infoF()};
about.onclick = function() {aboutF()};

function infoF()
{
  if(volInfo[0] == undefined)
  {
    cont.innerHTML = `<h2>Click on a point on the map to get info</h2>`;
  }
  else
  {
    cont.innerHTML = `<h1>${volInfo[0]}</h1><p><i>${volInfo[1]}</i></p>`;
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

//testing
/*document.body.onkeyup = function()
{
  console.log('pressed');
}*/