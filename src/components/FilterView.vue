<template>
    <div id='sidebar'>
        <div class="filterButtons">
          <span id="filterButtonsTitle">
              Toggle Views
          </span>  
          <span id="twitterToggle" @click="twitterToggle">
              <font-awesome-icon :icon="['fab','twitter']" transform="down-3" class="iconStyle" style="color: lightblue"/>
          </span>  

          <span id="facebookToggle" @click="facebookToggle">
              <font-awesome-icon :icon="['fab','facebook']" transform="down-3" class="iconStyle" style="color: blue"/>
          </span>
          <input id="facebookCheckinThreshold" size="10">            
        </div>
       <div id="tabPanel">
           <b-tabs>
                <b-tab title="BC Census" active>
                    <div class="tabContent">
        <div class="filterViewHeader">
            Demographics Filter
        </div>    
        <div>
        <div class="selectBlock">
            <span class="selectLabel">Male Age</span>
            <select id="MaleAgeSelect" v-model="selectedM" @change="selectedAgeBand">
                    <option v-for="option in optionsM" v-bind:key="option.value" v-bind:value="option.value">
                        {{ option.text }}
                    </option>    
            </select>
        </div>
        <div class="selectBlock">        
            <span class="selectLabel">Female Age</span>
            <select id="FemaleAgeSelect" v-model="selectedF" @change="selectedAgeBand">
                    <option v-for="option in optionsF" v-bind:key="option.value" v-bind:value="option.value">
                        {{ option.text }}
                    </option>    
            </select>
        </div>
        <div class="selectBlock">        
            <span class="selectLabel">Median Age</span>
            <select id="MedianAgeSelect" v-model="selectedMedianAge" @change="selectedMedAge">
                    <option v-for="option in optionsMedianAge" v-bind:key="option.value" v-bind:value="option.value">
                        {{ option.text }}
                    </option>    
            </select>
        </div>
    

        <div class="selectBlock">        
            <span class="selectLabel">Transport</span>
            <select id="TransportSelect" v-model="selectedTransportation" @change="selectedTransport">
                    <option v-for="option in optionsTransportation" v-bind:key="option.value" v-bind:value="option.value">
                        {{ option.text }}
                    </option>    
            </select>
        </div>
        <div class="selectBlock">        
            <span class="selectLabel">Household</span>
            <select id="HouseholdSelect" v-model="selectedHousehold" @change="selectedHouse">
                    <option v-for="option in optionsHousehold" v-bind:key="option.value" v-bind:value="option.value">
                        {{ option.text }}
                    </option>    
            </select>
        </div>
        <div class="selectBlock">        
            <span class="selectLabel">Earnings</span>
            <select id="EarningsSelect" v-model="selectedEarnings" @change="selectedEarn">
                    <option v-for="option in optionsEarnings" v-bind:key="option.value" v-bind:value="option.value">
                        {{ option.text }}
                    </option>    
            </select>
        </div>
        </div>
        <div class="filterButtons"> 
           <button id="clearSelection" @click="clearSelections">Clear</button>

        </div>
                    </div>                    
                </b-tab>
                <b-tab title="Facebook" >
                    <div class="tabContent">
                        <br>I'm the second tab
                    </div>                    
                </b-tab>
                <b-tab title="Twitter">
                    <div class="tabContent">
                        <br>I'm the third tab
                    </div>                    
                </b-tab>
           </b-tabs>

       </div>     
    </div>       
</template>

<script>
import * as d3 from "d3";
import { EventBus } from "../main.js";
import bTabs from 'bootstrap-vue/es/components/tabs/tabs';
import bTab from 'bootstrap-vue/es/components/tabs/tab';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCoffee,faFacebook,faTwitter)

/* eslint-disable */

export default {
  name: "sidebar",
  components: {
    bTabs,
    bTab,
    library,
    faCoffee,
    faFacebook,
    faTwitter,
    FontAwesomeIcon
  },

  data() {
    return {
      selectedM: "",
      selectedF: "",
      selectedTransportation: "",
      selectedHousehold: "",
      selectedEarnings: "",      
      selectedMedianAge: "",
      optionsM: loadSelect("data/lookups/B01001_Age_Male.csv"),
      optionsF: loadSelect("data/lookups/B01001_Age_Female.csv"),
      optionsMedianAge: loadSelect("data/lookups/B01002_Median_Age.csv"),
      optionsTransportation: loadSelect("data/lookups/B08301_Transportation.csv"),
      optionsHousehold: loadSelect('data/lookups/B11001_Household.csv'),
      optionsEarnings: loadSelect('data/lookups/B19051_earnings.csv'),
      selectedList: [],
      twitterShowing: false,
      facebookShowing: false
    };
  },
  methods: {
    selectedAgeBand: function(event) {
      console.log(event.currentTarget.value);
      let msg = {};
      msg.meta = event.currentTarget.id.split("Age")[0];
      msg.value = event.currentTarget.value;
      msg.label = event.currentTarget.selectedOptions[0].label;
      this.selectedList.push(msg);
      EventBus.$emit("selectionChange", this.selectedList);
    },
    selectedMedAge: function(event) {
      console.log(event.currentTarget.value);
      let msg = {};
      msg.meta = event.currentTarget.id.split("Select")[0];
      msg.value = event.currentTarget.value;
      msg.label = event.currentTarget.selectedOptions[0].label;
      this.selectedList.push(msg);
      EventBus.$emit("selectionChange", this.selectedList);
    },
    selectedTransport: function(event) {
      console.log(event.currentTarget.value);
      let msg = {};
      msg.meta = event.currentTarget.id.split("Select")[0];
      msg.value = event.currentTarget.value;
      msg.label = event.currentTarget.selectedOptions[0].label;
      this.selectedList.push(msg);
      EventBus.$emit("selectionChange", this.selectedList);
    },
    selectedHouse: function(event) {
      console.log(event.currentTarget.value);
      let msg = {};
      msg.meta = event.currentTarget.id.split("Select")[0];
      msg.value = event.currentTarget.value;
      msg.label = event.currentTarget.selectedOptions[0].label;
      this.selectedList.push(msg);
      EventBus.$emit("selectionChange", this.selectedList);
    },
    selectedEarn: function(event) {
      console.log(event.currentTarget.value);
      let msg = {};
      msg.meta = '';
      msg.value = event.currentTarget.value;
      msg.label = event.currentTarget.selectedOptions[0].label;
      this.selectedList.push(msg);
      EventBus.$emit("selectionChange", this.selectedList);
    },
    selectMedianAge: function(event) {
        console.log(event.currentTarget.value);
    },
    clearSelections: function(event) {
      this.selectedList = [];
      this.selectedM = "";
      this.selectedF = "";
      this.selectedMedianAge = "";
      this.selectedTransportation = "";
      this.selectedHousehold = "";
      this.selectedEarnings = "";
      EventBus.$emit("selectionChange", this.selectedList);
    },

    twitterToggle: function(event) {
        console.log('Clicked it');
        this.twitterShowing = !this.twitterShowing;
        EventBus.$emit("toggleTwitterView", this.twitterShowing);
    },
    facebookToggle: function(event) {
        console.log('Clicked it');
        this.facebookShowing = !this.facebookShowing;
        EventBus.$emit("toggleFacebookView", this.facebookShowing);
    }
  }
};


function loadSelect(file) {
  let selectArray = [];
  d3.csv(file, function(d) {
    return {
      key: d.key,
      value: d.value,
      selected: false
    };
  }).then(function(data) {
    data.forEach(element => {
      selectArray.push({ text: element.value, value: element.key });
    });
  });
  return selectArray;
}
</script>

<style>

#facebookCheckinThreshold {
    margin-left: 10px;
}
.nav-tabs {
    font-size: 14px;
}

#tabPanel {
    margin-top: 20px;
    padding-top: 5px;
}

.tabContent {
    font-size: 12px;
}

.iconStyle {
    margin-left: 25px;
    font-size: 30px;
    /* float: right; */
}

.iconStyledGreyed {
    opacity: 0.3;
}

select {
  font-size: 14px;
  float: right;
}

button {
  font-size: 14px;
  margin-right: 10px;
  border-radius: 5px;
  padding-bottom: 5px;
}

.selectLabel {
  padding: 5px;
  font-size: 14px;
  white-space: nowrap;
}

.selectBlock {
  margin: 10px;
}

.filterViewHeader {
    padding-top: 10px;
    text-align: center;
    font-size: 14px;
}

.filterButtons {
    font-size: 14px;
    padding: 10px;
    margin-bottom: 10px;
}

#filterButtonsTitle {
    font-size: 16px;
}

.radioCenter {
    padding-left: 50px;
    white-space: nowrap;
}

.textNoWrap {
    white-space: nowrap;
}
</style>
