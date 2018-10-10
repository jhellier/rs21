
<template>
    <div class="d3-view"> 
       <div>
        <div id='world'>
        </div>    
       </div> 
    </div>
</template>

<script>
//import * as d3 from "d3";
import { EventBus } from '../main.js';
import bcData from "../../public/data/BernallioCensusBlocks_Joined.json";

/* eslint-disable */

let log = true;


export default {
  name: "d3-view",

  props: {},

  

  data() {
    return {
      color: "orange",
      data: {},
      bcData,
      mainMap: {},
      gMap: {},
      rsCities: [],
      cWidth: {},
      cHeight: {},
      selectedChallenges: [],
      challengeLU: {},
      allCities: [],
      filteredCities: []
    };
  },

  computed: {
    // runIt: function() {
    //   console.log("Hello there John ", this);
    // }
  },

  beforeMount() {},

  mounted() {

    
    var that = this;
  EventBus.$on('whatJohn', msg => {
    if (log) {
      console.log(' This is ', msg);
    }
    that.selectedChallenges = msg;
    //this.getFilteredCityArray(['disease-outbreak']);
    if (msg.length == 0) {
      this.loadCities(this.allCities);  
      this.filteredCities = [];
    } else {
      this.getFilteredCityArray(msg);
    }
  })

  // d3.csv("data/CitiesSort.csv", function(d) {
  //     return {
  //       city: d.city,
  //       country: d.country,
  //       latitude: d.latitude,
  //       longitude: d.longitude,
  //       LatLng: new L.LatLng(d.latitude, d.longitude)
  //     };
  //   }).then(function(data) {
  //     that.filteredCities = data;
  //     that.allCities = data;
  //     that.loadCities(that.filteredCities);
  //   });

  // d3.csv("data/challenges.csv", function(d) {
  //   return {
  //     challenge: d.challenge,
  //     region: d.region,
  //     city: d.city,
  //     country: d.country
  //   };
  //   }).then(function(data) {
  //     data.forEach(function(d) {
  //       let challenges = d.challenge.split(' ');
  //       challenges.forEach(function(challenge,i) {
  //         if (i != 0) {
  //           if (that.challengeLU[challenge] === undefined)
  //             that.challengeLU[challenge] = [];
  //           that.challengeLU[challenge].push(d.city);
  //         }
  //       })

  //     })
   //  });




    that.cWidth = document.getElementsByTagName("html")[0].clientWidth * 0.8;
    that.cHeight = document.getElementsByTagName("html")[0].clientHeight * 0.8;

    // Beware putting this after the tileLayer will give you a mini map.
    document.getElementById("world").style.height = that.cHeight + "px";
    document.getElementById("world").style.width = that.cWidth + "px";

    that.mainMap = L.map("world").setView([35.1740721, -106.5944350], 12);
    //that.mainMap = L.map("world").setView([0, 0], 2);

    L.tileLayer(
      "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        minZoom: 2,
        id: "mapbox.light",
        accessToken: this.$mapboxAccessToken
      }
    ).addTo(that.mainMap);

    // L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    //   attribution:
    //     'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    //   maxZoom: 18,
    //   minZoom: 2,
    //   id: "mapbox.light",
    //   accessToken: this.$mapboxAccessToken
    // }).addTo(that.mainMap);

     that.mainMap.on("zoom", that.adjustDimensions);
     that.mainMap.on("moveend", that.adjustPan);



     let mainLayer = L.geoJSON(bcData.features, {
        style: {
          'color':'green'          
        },
        onEachFeature:  function (feature, layer) {
          layer.on('mouseover', function(e) {
            let target = e.target;
            target.setStyle({
              color: 'red'
            })
            console.log('Hello');
            console.log(e);
         });
         layer.on('mouseout', function(e) {
           mainLayer.resetStyle(this);
         });

       }

      }
     ).addTo(that.mainMap);

    //let latLonPoint = new L.LatLng(40.7127837, -74.0059413);

    // L.svg().addTo(that.mainMap);

    // that.gMap = d3
    //   .select("#world")
    //   .select("svg")
    //   .append("g");

    // that.adjustDimensions();

    // Register an event listener when the Vue component is ready
    window.addEventListener("resize", that.onResize);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
    this.data = {};
  },

  methods: {


    onResize(event) {
    },
    adjustPan() {
    },
    adjustDimensions() {
       this.cWidth = document.getElementsByTagName("html")[0].clientWidth * 0.8;
       this.cHeight =
         document.getElementsByTagName("html")[0].clientHeight * 0.8;

       document.getElementById("world").style.height = this.cHeight + "px";
       document.getElementById("world").style.width = this.cWidth + "px";

      // d3.select("#mapSVG")
      //   .attr("height", this.cHeight)
      //   .attr("width", this.cWidth);

    },
    getPXFromLat(latLng) {
      let latLonPoint = new L.LatLng(latLng.lat, latLng.lng);
      return this.mainMap.latLngToLayerPoint(latLonPoint).x;
    },
    getPXFromLng(latLng) {
      let latLonPoint = new L.LatLng(latLng.lat, latLng.lng);
      return this.mainMap.latLngToLayerPoint(latLonPoint).y;
    }



  }
};
</script>

<style>
#world {
  height: 95%;
  width: 85%;
  margin-left: 10px;
}

/* .selectedChallenges {
  z-index: 1000;
  position: absolute;
  right: 30px;
  top: 30px;
  font-size: 20px;
  opacity: 0.5;
  list-style-type: none;
  text-align: right;
} */
</style>