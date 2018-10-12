<template>
    <div>
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
</template>

<script>
import * as d3 from "d3";
import { EventBus } from "../main.js";



export default {
  name: "select1",
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
      selectedList: []
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
select {
  font-size: 14px;
  float: right;
}

button {
  font-size: 14px;
  margin-right: 10px;
  border-radius: 5px;
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
    text-align: center;
}

.filterButtons {
    font-size: 14px;
    padding: 10px;
    margin-top: 20px;
}

.radioCenter {
    padding-left: 50px;
    white-space: nowrap;
}

.textNoWrap {
    white-space: nowrap;
}
</style>
