<template>
    <div>
        <div id='social'>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import * as d3 from "d3";
import { EventBus } from "../main.js";

var div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
//.style('display','none')

/* eslint-disable */
Vue.use(VueAxios, axios);
export default {
  name: "cityView",

  data() {
    return {
      cityList: []
    };
  },

  mounted() {
    var that = this;

    EventBus.$on("someEvent", msg => {
      // Put some handler code in here
      // Put this line in the vue that you want to send or emit an event from

      // EventBus.$emit('someEvent', this.selectedList); 
      
      // this.selectedList is the msg
      // that you want sent. It can be an object or string or whatever

      // Whoever uses it has to be sure to import
      // import { EventBus } from '../main.js';
    });

    // Vue.axios.get('./data/CitiesSort.csv').then((response) => {
    //     console.log(response.data);
    //     that.cityList = response;
    // })

    // d3.select('#circleView')
    //     .append('svg')
    //     // .attr('height', 200)
    //     // .attr('width', 200)
    //     .append('circle')
    //     .attr('cx',100)
    //     .attr('cy',100)
    //     .attr('r',30)

    // var sHeight = $('#social').height() * 0.9;
    // var sWidth =  $('#social').width() * 0.9;
    // var sHeight = 400;
    // var sWidth =  800;

    var sWidth = document.getElementsByTagName("html")[0].clientWidth * 0.8;
    var sHeight = document.getElementsByTagName("html")[0].clientHeight * 0.8;

    var svgSocial = d3.select("#social").append("svg");

    svgSocial.attr("width", sWidth);
    svgSocial.attr("height", sHeight);

    var colorSocial = d3.scaleOrdinal(d3.schemeDark2);

    var simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3.forceLink().id(function(d) {
          return d.id;
        })
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(sWidth / 2, sHeight / 2));

    d3.json("./data/trump.json").then(function(graph) {
      var link = svgSocial
        .append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("stroke-width", function(d) {
          return Math.sqrt(d.relation);
        });

      var node = svgSocial
        .append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("fill", function(d) {
          return colorSocial(d.detail);
        })
        .on("mouseenter", function(d) {
          d3.select(this)
            .attr("r", 10)
            .attr("fill", "red");

          div.style("opacity", 0.9);

          div
            .html(d.id)
            .style("left", d3.event.pageX + 30 + "px")
            .style("top", d3.event.pageY - 28 + "px");
          return;
        })
        .on("mouseout", function(d) {
          div.style("opacity", 0.0);
          d3.select(this)
            .attr("r", 5)
            .attr("fill", function(d) {
              return colorSocial(d.detail);
            });
        })
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

      //   node.append("title")
      //       .html(function(d) {
      //           return d.id;
      //         });

      simulation.nodes(graph.nodes).on("tick", ticked);

      simulation.force("link").links(graph.links);

      function ticked() {
        link
          .attr("x1", function(d) {
            return d.source.x;
          })
          .attr("y1", function(d) {
            return d.source.y;
          })
          .attr("x2", function(d) {
            return d.target.x;
          })
          .attr("y2", function(d) {
            return d.target.y;
          });

        node
          .attr("cx", function(d) {
            return d.x;
          })
          .attr("cy", function(d) {
            return d.y;
          });
      }
    });

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  },

  methods: {
    getCities: function() {}
  }
};
</script>

<style>
#social {
  background-color: rgb(27, 27, 27);
}

.links line {
  stroke: #999;
  stroke-opacity: 0.6;
}

.nodes circle {
  stroke: rgb(71, 69, 69);
  stroke-width: 1.5px;
}

div.tooltip {
  position: absolute;
  text-align: center;
  width: 200px;
  height: 150px;
  padding: 5px;
  font: 12px sans-serif;
  color: white;
  background: rgb(22, 22, 22);
  border-width: 1px;
  border: rgb(49, 48, 48);
  border-style: solid;
  border-radius: 8px;
  pointer-events: none;
}
</style>

