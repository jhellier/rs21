
<template>
    <div class="map-view"> 
       <div>
        <div id='world'>
          <ul id="selectedAges" class="selectedAges">
            <li v-for="age in selectedAges" v-bind:key="age.label">
              {{ age.meta + " " + age.label }}
            </li>
          </ul>           
        </div>    
       </div>
    </div>
</template>

<script>
import * as d3 from "d3";
import { EventBus } from "../main.js";
//import fbCheckins from "../../public/data/clean/FacebookPlaces_ABQ.csv";
import bcData from "../../public/data/BernallioCensusBlocks_Joined.json";

/* eslint-disable */



let log = true;

export default {
  name: "map-view",

  props: {},

  data() {
    return {
      bcData,
      fbCheckins: [],
      busTypes: {},
      toolTipDiv: {},
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


// Define the div for the tooltip
that.div = d3.select("body").append("div")	
    .attr("class", "toolTip")				
    .style("opacity", 0);

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
          // let target = e.target;
          // let count = 0;
          // let popupText = '';
          // that.selectedAges.forEach(function(element) {
          //   count += +e.sourceTarget.feature.properties[element.value];
          //   popupText += '<div>' + element.meta 
          //                   + ' ' + element.label 
          //                   + ' ' + +e.sourceTarget.feature.properties[element.value]
          //                   + '</div>';
          // })
          // let popupHeader = "<div class='popupHeader'>Total Count For Section: " + count + '</div>'; 
          // // popup.setLatLng(e.latlng)
          //     .setContent("<div class='popupBody'>" + popupHeader + popupText + '</div>')
          //     .openOn(that.mainMap);
        });
        layer.on("mouseout", function(e) {
          // mainLayer.resetStyle(this);
        });
        layer.on('click', function(e) {
          let target = e.target;
          let count = 0;
          let popupText = '';
          that.selectedAges.forEach(function(element) {
            count += +e.sourceTarget.feature.properties[element.value];
            popupText += '<div>' + element.meta 
                            + ' ' + element.label 
                            + ' ' + +e.sourceTarget.feature.properties[element.value]
                            + '</div>';
          })
          let popupHeader = "<div class='popupHeader'>Total Count For Section: " + count + '</div>'; 
         
          
          popup.setLatLng(e.latlng)
              .setContent("<div class='popupBody'>" + popupHeader + popupText + '</div>')
              .openOn(that.mainMap);

        })
      }.bind(this)
    }).addTo(that.mainMap);

    //let latLonPoint = new L.LatLng(40.7127837, -74.0059413);

    L.svg().addTo(that.mainMap);

    that.gMap = d3
      .select("#world")
      .select("svg")
      .append("g");

    that.adjustDimensions();
    that.getFacebookCheckins();


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

    getColor(n) {
        var colors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
        return colors[n % colors.length];
    },
    getFacebookCheckins() {
      let that = this;

      d3.csv("data/clean/BusTypes.csv", function(d) {
        return {
          name: d.column1
        };
      }).then(function(data) {
        data.forEach(function(element,index) {that.busTypes[element.name] = index})
      })

      d3.csv("data/clean/FacebookPlaces_ABQ.csv", function(d) {
          return {
            place: d.place,
            bus_type: d.bus_type,
            checkins: d.checkins,
            lat: d.lat,
            lon: d.lon,
            LatLng: new L.LatLng(d.lat,d.lon)
          };
        }).then(function(data) {
          that.fbCheckins = data;
          //console.log(that.fbCheckins);  
           that.gMap.selectAll('circle')
            .data(that.fbCheckins.filter(element => element.checkins > 5000))
            .enter()
            .append('circle')
            .attr("pointer-events","visible")
            .attr('r',5)
            .attr('fill',function(d,i) { return that.getColor(that.busTypes[d.bus_type])})
            .attr("cx", d => that.mainMap.latLngToLayerPoint(d.LatLng).x)
            .attr("cy", d => that.mainMap.latLngToLayerPoint(d.LatLng).y)
        .on('mouseover', function(d) {
            d3.selectAll('.toolTip')
                // .transition()		
                // .duration(200)		
                .style("opacity", .9);		
            d3.selectAll('.toolTip').html(d.place + '<br>' + d.bus_type)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");
          
          
            d3.select(this).style('cursor','pointer')})
        .on('mouseout', function(d) { 

            d3.select(this).style('cursor','default')
            d3.select('.toolTip')
                // .transition()		
                // .duration(500)		
                .style("opacity", 0);	
          })
        });

    },
    onResize(event) {
      this.adjustDimensions();
    },
    adjustPan() {},
    adjustDimensions() {
      this.cWidth = document.getElementsByTagName("html")[0].clientWidth * 0.7;
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
          return {color: 'rgba(0,215,0,0.8', "fillOpacity": opacity}
          
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

.popupHeader {
  font-weight: bold;
  font-size: 12px;
}

.popupBody {
  font-size: 12px;
}

div.toolTip {	
    position: absolute;			
    text-align: center;			
    width: 200px;					
    height: 50px;					
    padding: 2px;				
    font: 12px sans-serif;		
    background: rgb(218, 220, 223);	
    border: 1px;
    border-style: solid;		
    border-radius: 8px;			
    pointer-events: none;	
    z-index: 2000;

}

</style>