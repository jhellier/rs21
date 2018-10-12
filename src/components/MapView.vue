
<template>
    <div class="map-view"> 
       <div>
        <div id='world'>
          <ul id="selectedAges" class="selectedAges">
            <li v-for="age in selectedAges" v-bind:key="age.label">
              {{ age.label }}
            </li>
          </ul>           
        </div>    
       </div> 
    </div>
</template>

<script>
import * as d3 from "d3";
import { EventBus } from "../main.js";
import bcData from "../../public/data/BernallioCensusBlocks_Joined.json";

/* eslint-disable */

let log = true;

export default {
  name: "map-view",

  props: {},

  data() {
    return {
      bcData,
      mainMap: {},
      mainLayer: {},
      gMap: {},
      cWidth: {},
      cHeight: {},
      selectedAges: [],
      totalPopulation: {},
      totalTargetPopulation: {}
    };
  },

  mounted() {
    var that = this;

     that.totalTargetPopulation = that.getTargetPopulation('B01001-HD01_VD06');
   

    EventBus.$on("selectionChange", msg => {
      if (log) {
        console.log(" This is ", msg);
      }
      that.selectedAges = msg;

      if (msg.length != 0)
        that.clearLayer(false);
      else 
        that.clearLayer(true);  
     });

    that.cWidth = document.getElementsByTagName("html")[0].clientWidth * 0.8;
    that.cHeight = document.getElementsByTagName("html")[0].clientHeight * 0.8;

    // Beware putting this after the tileLayer will give you a mini map.
    document.getElementById("world").style.height = that.cHeight + "px";
    document.getElementById("world").style.width = that.cWidth + "px";

    that.mainMap = L.map("world").setView([35.1740721, -106.594435], 12);

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

    that.mainMap.on("zoom", that.adjustDimensions);
    that.mainMap.on("moveend", that.adjustPan);

    let popup = L.popup();

    that.mainLayer = L.geoJSON(bcData.features, {
      // style: {
      //   color: 'g#8cc48b'
      // },
      
      onEachFeature: function(feature, layer) {
        layer.setStyle({color: '#8cc48b' , fillOpacity: 0.2})          
        layer.on("mouseover", function(e) {
          let target = e.target;
          let count = 0;
          that.selectedAges.forEach(element => count += +e.sourceTarget.feature.properties[element.value])
          popup.setLatLng(e.latlng)
              .setContent('Hello John ' + count )
              .openOn(that.mainMap);
        });
        layer.on("mouseout", function(e) {
          // mainLayer.resetStyle(this);
        });
      }.bind(this)
    }).addTo(that.mainMap);

    //let latLonPoint = new L.LatLng(40.7127837, -74.0059413);

    // L.svg().addTo(that.mainMap);

    // that.gMap = d3
    //   .select("#world")
    //   .select("svg")
    //   .append("g");

    that.adjustDimensions();

    // that.gMap.append('circle')
    //   .attr('r',50)
    //   .attr('cx',200)
    //   .attr('cy',200)
    //   .attr("pointer-events","visible")
    //   .on('click', function(d) {
    //     console.log('This is ', d);
    //   })

    // Register an event listener when the Vue component is ready
    window.addEventListener("resize", that.onResize);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },

  methods: {
    onResize(event) {
      this.adjustDimensions();
    },
    adjustPan() {},
    adjustDimensions() {
      this.cWidth = document.getElementsByTagName("html")[0].clientWidth * 0.8;
      this.cHeight =
        document.getElementsByTagName("html")[0].clientHeight * 0.8;

      document.getElementById("world").style.height = this.cHeight + "px";
      document.getElementById("world").style.width = this.cWidth + "px";

      d3.select("#world")
        .attr("height", this.cHeight)
        .attr("width", this.cWidth);
    },
    getPXFromLat(latLng) {
      let latLonPoint = new L.LatLng(latLng.lat, latLng.lng);
      return this.mainMap.latLngToLayerPoint(latLonPoint).x;
    },
    getPXFromLng(latLng) {
      let latLonPoint = new L.LatLng(latLng.lat, latLng.lng);
      return this.mainMap.latLngToLayerPoint(latLonPoint).y;
    },

    getTotalPopulation(targetKey) {
      let features = this.bcData.features;
      this.totalPopulation = 0;
      features.forEach(element => {
        let amount = element.properties[targetKey];
        this.totalPopulation += +amount;
      });
     // console.log(this.totalPopulation);
      
    },

    getTargetPopulation(targetKey) {
      let features = this.bcData.features;
      let total = 0;
      features.forEach(element => {
        let amount = element.properties[targetKey];
        total += +amount;
      });
      //console.log(total);
      return total;
    },
    
    clearLayer(clear) {
      let that = this;
      this.mainLayer.eachLayer(function(featureLayer) {
        featureLayer.setStyle(function(el,feature) {
          if (clear) {
            return {color: '#8cc48b', fillOpacity: 0.2};
            //that.mainLayer.resetStyle();
          }
          let count = 0;
          that.selectedAges.forEach(function(element) {
            count += +feature.feature.properties[element.value];;
            return count;
          })
          var opacity = count/(that.selectedAges.length * 200);
          return {color: 'rgba(255,0,0,0.9', "fillOpacity": opacity}
          
        }(that, featureLayer));
      })
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

 .selectedAges {
  z-index: 1000;
  position: absolute;
  right: 30px;
  top: 30px;
  font-size: 20px;
  opacity: 0.5;
  list-style-type: none;
  text-align: right;
} 
</style>