
<template>
    <div class="map-view"> 
        <div id="world">
          <ul id="demographicSelect" class="demographicSelect">
            <li v-for="dg in demographicSelect" v-bind:key="dg.label">
              {{ dg.selectName + " " + dg.label }}
            </li>
          </ul>
        </div>    
    </div>
</template>




<script>
import * as d3 from 'd3';
import * as L from 'leaflet';
import { EventBus } from '../main.js';
import bcData from '../../public/data/clean/BernallioCensusBlocks_Joined.json';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faFacebook,faTwitter)

export default {
  name: 'map-view',

  components: {
    library,
    faFacebook,
    faTwitter,
    FontAwesomeIcon
  },

  data() {
    return {
      bcData,
      fbCheckins: [],
      busTypes: {},
      twitterFeeds: [],
      toolTipDiv: {},
      mainMap: {},
      mainLayer: {},
      gMap: {},
      cWidth: {},
      cHeight: {},
      demographicSelect: [],
      totalPopulation: {},
      totalTargetPopulation: {},
      checkinThreshold: 5000,
      defaultCheckinThreshold: 5000,
      showBCCountTotal: {},
      fbCircles: []
    };
  },

  mounted() {

    // Event Bus is used to handle events between components
    this.addEventBusHandlers();

    // Builds the main map with the Bernallio Census Blocks
    this.buildMap();

    // Use this constuct for summary BC census data.
    //this.totalTargetPopulation = this.getTargetPopulation('B01001-HD01_VD06');
    //this.getTotalPopulation('B01001-HD01_VD26');

    // Add the facebook checkin data as D3 circle elements
    this.getFacebookCheckins();

    // Get the Twitter feeds
    this.getTwitterFeeds();

    // Register an event listener when the Vue component is ready
    window.addEventListener('resize', this.onResize);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },

  methods: {

    buildMap() {
      let that = this;
      that.cWidth = document.getElementsByTagName('html')[0].clientWidth * 0.8;
      that.cHeight =
        document.getElementsByTagName('html')[0].clientHeight * 0.8;

      // Beware putting this after the tileLayer declaration. It will give you a mini map.
      document.getElementById('world').style.height = that.cHeight + 'px';
      document.getElementById('world').style.width = that.cWidth + 'px';

      that.mainMap = L.map('world').setView([35.1240721, -106.594435], 12);

      L.tileLayer(
        'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
        {
          attribution:
            'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
          maxZoom: 18,
          minZoom: 2,
          id: 'mapbox.light',
          accessToken: this.$mapboxAccessToken
        }
      ).addTo(that.mainMap);

      that.mainMap.on('zoom', that.adjustDimensions);

      let popup = L.popup();

      that.mainLayer = L.geoJSON(bcData.features, {

        onEachFeature: function(feature, layer) {

          layer.setStyle({ color: '#8cc48b', fillOpacity: 0.2 });

          layer.on('click', function(e) {
            let count = 0;
            let popupText = '';
            that.demographicSelect.forEach(function(element) {
              count += +e.sourceTarget.feature.properties[element.value];
              popupText +=
                '<div>' +
                element.meta +
                ' ' +
                element.label +
                ' ' +
                +e.sourceTarget.feature.properties[element.value] +
                '</div>';
            });

            let popupHeader = '';
            if (that.showBCCountTotal) {
              popupHeader =
                '<div class="popupHeader">Total Count For Section: ' +
                count +
                '</div>';
            }

            popup
              .setLatLng(e.latlng)
              .setContent(
                '<div class="popupBody">' + popupHeader + popupText + '</div>'
              )
              .openOn(that.mainMap);
          });

        }.bind(this)

      }).addTo(that.mainMap);

    var legend = L.control({position: 'bottomleft'});

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        var labels = ['<strong>Legend</strong>'];

        div.innerHTML += labels.push('&nbsp;&#9711; Facebook Checkins');
        div.innerHTML += labels.push('&#9726; Tweet Locations');
        div.innerHTML = labels.join('<br>');
        return div;
    };

    legend.addTo(that.mainMap);

      L.svg().addTo(that.mainMap);

      // Add a D3 SVG and group for later SVG element placement
      // This creates something like a layer. In order to have mouse interaction on
      // be sure to add .attr('pointer-events','visible') to any appended element
      that.gMap = d3
        .select('#world')
        .select('svg')
        .append('g');
    },

    // This is used to color the circles of the Facebook checkins
    // It is not the best way to cover a large number of categories. In this case
    // the bulk of the data is confined to the first 15 or so categories, so this
    // largely works. Another scheme might be needed for a more distributed data set    
    getColor(n) {
      var colors = [
        '#3366cc',
        '#dc3912',
        '#ff9900',
        '#109618',
        '#990099',
        '#0099c6',
        '#dd4477',
        '#66aa00',
        '#b82e2e',
        '#316395',
        '#994499',
        '#22aa99',
        '#aaaa11',
        '#6633cc',
        '#e67300',
        '#8b0707',
        '#651067',
        '#329262',
        '#5574a6',
        '#3b3eac'
      ];
      return colors[n % colors.length];
    },

    updateMapSVG() {
      let that = this;
      d3.selectAll('.mapLocations').attr("transform", 
        function(d) { 
          return "translate("+ 
            that.mainMap.latLngToLayerPoint(d.LatLng).x +","+ 
            that.mainMap.latLngToLayerPoint(d.LatLng).y +")";
          });

    },

    // Get the facebook checkins and generates a set of D3 circle elements
    // based on the lat/lon data for each checkin location
    getFacebookCheckins() {
      let that = this;

      d3.csv('data/clean/BTypes.csv', function(d) {
        return {
          name: d.column1
        };
      }).then(function(data) {
        data.forEach(function(element, index) {
          that.busTypes[element.name] = index;
        });
      });

      d3.csv('data/clean/FacebookPlaces_ABQ.csv', function(d) {
        return {
          place: d.place,
          bus_type: d.bus_type,
          checkins: d.checkins,
          lat: d.lat,
          lon: d.lon,
          LatLng: new L.LatLng(d.lat, d.lon)
        };
      }).then(function(data) {
        that.fbCheckins = data;
        that.fbCircles = that.gMap
          .selectAll('circle')
          .data(that.fbCheckins.filter(element => element.checkins > that.checkinThreshold))
          .enter()
          .append('circle')
          .attr('class','facebookLocations mapLocations')
          .attr('pointer-events', 'visible')
          .attr('r', 5)
          .attr('fill', function(d) {
            return that.getColor(that.busTypes[d.bus_type]);
          })
          // .attr('cx', d => that.mainMap.latLngToLayerPoint(d.LatLng).x)
          // .attr('cy', d => that.mainMap.latLngToLayerPoint(d.LatLng).y)
          .on('mouseover', function(d) {
            d3.select('body')
              .append('div')
              .attr('class', 'toolTip')
              .attr('id','toolTip')
              .html(d.place + '<br>'  + d.checkins + ' checkins' + '<br><br>' + d.bus_type)
              .style('left', d3.event.pageX + 'px')
              .style('top', d3.event.pageY - 28 + 'px');
            d3.select(this).style('cursor', 'pointer');
          })
          .on('mouseout', function() {
            d3.selectAll('#toolTip').remove();

          });
          that.updateMapSVG();
      });

    },

    // Gets the twitter feeds and generate d3 rects for all tweet locations.
    // Each tweet has a lat and lon position.
    getTwitterFeeds() {
      let that = this;

      d3.csv('data/clean/Twitter_ABQ_2014_10_30.csv', function(d) {
        return {
          tweet: d.tweet,
          username: d.username,
          time: d.time,
          lat: d.lat,
          lon: d.lon,
          LatLng: new L.LatLng(d.lat, d.lon)
        };
      }).then(function(data) {
        that.twitterFeeds = data;
        that.gMap
          .selectAll('rect')
          .data(that.twitterFeeds)
          .enter()
          .append('rect')
          .attr('class','tweetLocations mapLocations')
          .attr('pointer-events', 'visible')
          // .attr('x', d => that.mainMap.latLngToLayerPoint(d.LatLng).x)
          // .attr('y', d => that.mainMap.latLngToLayerPoint(d.LatLng).y)
          .attr('height',5)
          .attr('width',5)
          .on('mouseover', function(d) {
            d3.select('body')
              .append('div')
              .attr('class', 'toolTip')
              .attr('id','toolTip')
              .classed('tweetToolTipSizing',true)
                .html(d.tweet + '<br><br>' + d.username + '<br>' + d.time)
              .style('left', d3.event.pageX + 'px')
              .style('top', d3.event.pageY - 28 + 'px');

            d3.select(this).style('cursor', 'pointer');
          })
          .on('mouseout', function() {
            d3.selectAll('#toolTip').remove();
          });
      })      
    },

    onResize() {
      this.adjustDimensions();
    },

    adjustDimensions() {
      this.cWidth = document.getElementsByTagName('html')[0].clientWidth * 0.7;
      this.cHeight =
        document.getElementsByTagName('html')[0].clientHeight * 0.8;

      document.getElementById('world').style.height = this.cHeight + 'px';
      document.getElementById('world').style.width = this.cWidth + 'px';

      d3.select('#world')
        .attr('height', this.cHeight)
        .attr('width', this.cWidth);

      this.updateMapSVG();

    },

    // Used for get the pixel location given a set of lat long points
    // This returns the Lat pixel location or the x
    getPXFromLat(latLng) {
      let latLonPoint = new L.LatLng(latLng.lat, latLng.lng);
      return this.mainMap.latLngToLayerPoint(latLonPoint).x;
    },

    // Used for get the pixel location given a set of lat long points
    // This returns the Long pixel location or the y
    getPXFromLng(latLng) {
      let latLonPoint = new L.LatLng(latLng.lat, latLng.lng);
      return this.mainMap.latLngToLayerPoint(latLonPoint).y;
    },

    // This gets the total population from the BC Census data
    // The key required is of the form: B01001-HD01_VD01 depending on
    // which population band or other demographic band
    getTotalPopulation(targetKey) {
      let features = this.bcData.features;
      this.totalPopulation = 0;
      features.forEach(element => {
        let amount = element.properties[targetKey];
        this.totalPopulation += +amount;
      });
      //console.log(this.totalPopulation);
    },

    // This gets the target population from the BC Census data
    // The key required is of the form: B01001-HD01_VD01 depending on
    // which population band or other demographic band
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

    // This resets the filter and the map for BC Census data
    clearLayer(clear) {
      let that = this;
      this.mainLayer.eachLayer(function(featureLayer) {
        featureLayer.setStyle(
          (function(el, feature) {
            if (clear) {
              return { color: '#8cc48b', fillOpacity: 0.2 };
            }
            let count = 0;
            that.demographicSelect.forEach(function(element) {
              count += +feature.feature.properties[element.value];
              return count;
            });
            var opacity = count / (that.demographicSelect.length * 200);
            return { color: 'rgba(0,215,0,0.8', fillOpacity: opacity };
          })(that, featureLayer)
        );
      });
    },

    // This is a utility function that will declare handlers any EventBus events
    // from other components. All your EventBus handlers should be declared in here.
    addEventBusHandlers() {
      let that = this;

      EventBus.$on('BCCensusSelectionChange', msg => {
        //console.log('Mapview event selection change ',msg);
        that.demographicSelect = msg.selectedList;
        that.showBCCountTotal = msg.showBCCountTotal;

        if (that.demographicSelect != 0) this.clearLayer(false);
        else that.clearLayer(true);
      });

      EventBus.$on('toggleTwitterView', msg => {
        if (msg)
          d3.selectAll('.tweetLocations')
              .style('opacity',0)
              .attr('pointer-events', 'none')

        else
          d3.selectAll('.tweetLocations')
              .style('opacity',1)
              .attr('pointer-events', 'visible')
      });

      EventBus.$on('toggleFacebookView', msg => {
        if (msg)
          d3.selectAll('.facebookLocations')
              .style('opacity',0)
              .attr('pointer-events', 'none')

        else
          d3.selectAll('.facebookLocations')
              .style('opacity',1)
              .attr('pointer-events', 'visible')
      });

      EventBus.$on('resetThreshold', msg => {
        let threshold = +msg;
        if (threshold < this.checkinThreshold) {
          this.checkinThreshold = threshold;
          // Get a new set of data for the facebook checkins
          this.getFacebookCheckins();
        } else {
        d3.selectAll('.facebookLocations')
          .style('opacity', function(d) {
            if (d.checkins > +msg) 
              return 1
            else return 0
          })
        }
      });

      EventBus.$on('highlightTweeter', msg => {
        d3.selectAll('.tweetLocations')
          .style('opacity', function(d) {
            if (d.username === msg) {
              return 1;
            } else return 0;
          })
          .attr('pointer-events',function(d) {
            if (d.username === msg)
              return 'visible';
            else 
              return 'none';  
          })

      });

      EventBus.$on('highlightFilteredCheckin', msg => {
        d3.selectAll('.facebookLocations')
          .style('opacity', function(d) {
            if (d.checkins === msg && d.checkins > this.defaultCheckinThreshold)
              return 1;
            else 
              return 0;  
          })
          .attr('pointer-events',function(d) {
            if (d.checkins === msg && d.checkins > this.defaultCheckinThreshold)
              return 'visible';
            else 
              return 'none';  
          })
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

.demographicSelect {
  z-index: 1000;
  position: absolute;
  right: 30px;
  top: 30px;
  font-size: 20px;
  opacity: 0.5;
  list-style-type: none;
  text-align: right;
}

#toggleButtonPanel {
  z-index: 1000;
  position: absolute;
  left: 30px;
  bottom: 20px;
  font-size: 20px;

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
  height: 80px;
  padding: 2px;
  font: 12px sans-serif;
  background: rgb(218, 220, 223);
  border: 1px;
  border-style: solid;
  border-radius: 8px;
  pointer-events: none;
  z-index: 2000;
}

div.toolTip.tweetToolTipSizing {
  height: 150px;

} 
</style>