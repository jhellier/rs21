<template>
    <div id='sidebar'>
        <div class="filterButtons">
          <span id="filterButtonsTitle">
              Toggle Views
          </span>  
          <span id="twitterToggle" @click="twitterToggle"  title="Click to toggle display">
              <font-awesome-icon :icon="['fab','twitter']" transform="down-3" class="iconStyle" style="color: lightblue"/>
          </span>  

          <span id="facebookToggle" @click="facebookToggle" title="Click to toggle display">
              <font-awesome-icon :icon="['fab','facebook']" transform="down-3" class="iconStyle" style="color: blue"/>
          </span>
          Checkins ><input id="facebookCheckinThreshold" size="5" v-model="checkinThreshold" title="Checkin Threshold">            
          <span id="facebookResetCheckinThreshold" @click="resetCheckinThreshold" title="Click to Redo">
            <font-awesome-icon :icon="['fas','redo']" transform="right-3"/>
          </span>

        </div>
       <div id="tabPanel">
           <b-tabs>
                <b-tab title="Overview" active>
                   <div id="overviewPanel">
                       Welcome to the ABQ View
                   </div>                         
                </b-tab>    
                <b-tab title="BC Census" >
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
import { faRedo } from '@fortawesome/free-solid-svg-icons'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faRedo,faFacebook,faTwitter)

/* eslint-disable */

export default {
  name: "sidebar",
  components: {
    bTabs,
    bTab,
    library,
    faRedo,
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
      facebookShowing: false,
      checkinThreshold: 5000,
      showBCCountTotal: true
    };
  },
  methods: {
    toggleShowBCCountTotal: function(stringCheck) {
        // Checking to see if all is in the list of selected bands
        // If is is then the toatl coutns wont' make sense, so don't display 
        // total count for those cases.
        if (stringCheck.toUpperCase().indexOf('ALL') != -1)
            this.showBCCountTotal = false;

    },   
    selectedAgeBand: function(event) {
      let msg = {};
      msg.meta = event.currentTarget.id.split("Age")[0];
      msg.value = event.currentTarget.value;
      msg.label = event.currentTarget.selectedOptions[0].label;
      this.toggleShowBCCountTotal(msg.label);
      this.selectedList.push(msg);
      let sendMsg= {};
      sendMsg.showBCCountTotal = this.showBCCountTotal;
      sendMsg.selectedList = this.selectedList;
      EventBus.$emit("selectionChange", sendMsg);
    },
    selectedMedAge: function(event) {
      let msg = {};
      msg.meta = event.currentTarget.id.split("Select")[0];
      msg.value = event.currentTarget.value;
      msg.label = event.currentTarget.selectedOptions[0].label;
      this.toggleShowBCCountTotal(msg.label);
      this.selectedList.push(msg);
      let sendMsg = {};
      sendMsg.showBCCountTotal = this.showBCCountTotal;
      sendMsg.selectedList = this.selectedList;
      EventBus.$emit("selectionChange", sendMsg);
    },
    selectedTransport: function(event) {
      let msg = {};
      msg.meta = event.currentTarget.id.split("Select")[0];
      msg.value = event.currentTarget.value;
      msg.label = event.currentTarget.selectedOptions[0].label;
      this.toggleShowBCCountTotal(msg.label);
      this.selectedList.push(msg);
      let sendMsg = {};
      sendMsg.showBCCountTotal = this.showBCCountTotal;
      sendMsg.selectedList = this.selectedList;
      EventBus.$emit("selectionChange", sendMsg);
    },
    selectedHouse: function(event) {
      let msg = {};
      msg.meta = event.currentTarget.id.split("Select")[0];
      msg.value = event.currentTarget.value;
      msg.label = event.currentTarget.selectedOptions[0].label;
      this.toggleShowBCCountTotal(msg.label);
      this.selectedList.push(msg);
      let sendMsg = {};
      sendMsg.showBCCountTotal = this.showBCCountTotal;
      sendMsg.selectedList = this.selectedList;
      EventBus.$emit("selectionChange", sendMsg);
    },
    selectedEarn: function(event) {
      let msg = {};
      msg.meta = '';
      msg.value = event.currentTarget.value;
      msg.label = event.currentTarget.selectedOptions[0].label;
      this.toggleShowBCCountTotal(msg.label);
      this.selectedList.push(msg);
      let sendMsg = {};
      sendMsg.showBCCountTotal = this.showBCCountTotal;
      sendMsg.selectedList = this.selectedList;
      EventBus.$emit("selectionChange", sendMsg);
    },
    clearSelections: function(event) {
      this.selectedList = [];
      this.selectedM = "";
      this.selectedF = "";
      this.selectedMedianAge = "";
      this.selectedTransportation = "";
      this.selectedHousehold = "";
      this.selectedEarnings = "";
      this.showBCCountTotal = true;
      let sendMsg = {};
      sendMsg.showBCCountTotal = this.showBCCountTotal;
      sendMsg.selectedList = this.selectedList;
      EventBus.$emit("selectionChange", sendMsg);
    },

    twitterToggle: function(event) {
        this.twitterShowing = !this.twitterShowing;
        EventBus.$emit("toggleTwitterView", this.twitterShowing);
    },
    facebookToggle: function(event) {
        this.facebookShowing = !this.facebookShowing;
        EventBus.$emit("toggleFacebookView", this.facebookShowing);
    },

    resetCheckinThreshold: function(event) {
        EventBus.$emit('resetThreshold', this.checkinThreshold);
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

#overviewPanel {
    margin: 10px;
    margin-top: 20px;
    font-size: 16px;
    text-align: center;
}
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
