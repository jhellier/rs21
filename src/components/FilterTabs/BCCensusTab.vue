<template>
        <div class="tabContent" style="overflow: auto; height: 500px;">
        <div class="filterViewHeader">
            Demographics Filter
        </div>    
        <div>
            <Select id="MaleAgeSelect" 
                        :options="optionsM" selectName="Male Age" />
            <Select id="FemaleAgeSelect" 
                        :options="optionsF" selectName="Female Age" />
            <Select id="MedianAgeSelect" 
                        :options="optionsMedianAge" selectName="Median Age"/>
            <Select id="TransportSelect" 
                        :options="optionsHousehold" selectName="Transport"/>
            <Select id="EarningsSelect" 
                        :options="optionsEarnings" selectName="Earnings"/>
        </div>
        <div class="filterButtons"> 
        <button id="clearSelection" @click="clearSelections">Clear</button>

        </div>
        <table class="table">
        <tbody>
            <tr>
            <td>Total Population</td>
            <td align="right">667092</td>
            </tr>
            <tr>
            <td>Total Male Population</td>
            <td align="right">326983</td>
            </tr>
            <tr>
            <td>Total Female Population</td>
            <td align="right">340109</td>
            </tr>
        </tbody>
        </table>        
        <div>
        At any time you can clear the selections and start with a new 
        investigation. You can click on any colored section to see the makeup of that
        section. Since the popup stays open you can compare the makeup of the section against the Facebook checkins
        or the Twitter tweets by mousing over either. 
        <br>
        <br>
        </div>

    </div>                    

</template>

<script>

import * as d3 from 'd3';
import Select from './../Select.vue';
import { EventBus } from '../../main.js';


export default {

  name:'bcCensusTab',
  
  components: {
      Select,
      EventBus
  },

  data() {
    return {
      selectedM: '',
      selectedF: '',
      selectedTransportation: '',
      selectedHousehold: '',
      selectedEarnings: '',
      selectedMedianAge: '',
      optionsM: loadSelect('data/lookups/B01001_Age_Male.csv'),
      optionsF: loadSelect('data/lookups/B01001_Age_Female.csv'),
      optionsMedianAge: loadSelect('data/lookups/B01002_Median_Age.csv'),
      optionsTransportation: loadSelect(
        'data/lookups/B08301_Transportation.csv'
      ),
      optionsHousehold: loadSelect('data/lookups/B11001_Household.csv'),
      optionsEarnings: loadSelect('data/lookups/B19051_earnings.csv'),
      selectedList: [],
      showBCCountTotal: true
    };
  },

  created() {
   this.addEventBusHandlers();
  },

  methods: {

     toggleShowBCCountTotal: function(stringCheck) {
      // Checking to see if all is in the list of selected bands
      // If is is then the toatl coutns wont' make sense, so don't display
      // total count for those cases.
      if (stringCheck.toUpperCase().indexOf('ALL') != -1)
        this.showBCCountTotal = false;
    },
    
// How do you get a reference to components in your page like one of the selects?
// You need this so that you can reset them after a clear has been called.
// You can using a EventBus but that seems heavy handed

    clearSelections: function(event) {
      this.selectedList = [];
      this.selectedM = '';
      this.selectedF = '';
      this.selectedMedianAge = '';
      this.selectedTransportation = '';
      this.selectedHousehold = '';
      this.selectedEarnings = '';
      this.showBCCountTotal = true;
      let sendMsg = {};
      sendMsg.showBCCountTotal = this.showBCCountTotal;
      sendMsg.selectedList = this.selectedList;
      EventBus.$emit('BCCensusSelectionChange', sendMsg);
    },

     addEventBusHandlers() {
      EventBus.$on('selectionChange', msg => {
          //console.log('The is the msg payload ', msg);
          this.toggleShowBCCountTotal(msg.label);
          this.selectedList.push(msg);
          let sendMsg = {};
          sendMsg.showBCCountTotal = this.showBCCountTotal;
          sendMsg.selectedList = this.selectedList;
          EventBus.$emit('BCCensusSelectionChange', sendMsg);
      });
    }

  }

}

// This loads the target list of select options. It is called for each
// select element on this page.
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
      selectArray.push({ label: element.value, value: element.key });
    });
  });
  return selectArray;
}
</script>

<style>

.tabContent {
  font-size: 12px;
  overflow: auto;
}

select {
  font-size: 14px;
  float: right;
}

button {
  font-size: 12px;
  margin-right: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.selectLabel {
  padding: 5px;
  font-size: 14px;
  white-space: nowrap;
}

.selectBlock {
  margin: 10px;
}

.textNoWrap {
  white-space: nowrap;
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

</style>
