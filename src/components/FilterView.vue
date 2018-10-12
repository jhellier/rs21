<template>
    <div>
        <button id="clearSelection" @click="clearSelections">Clear</button>
<div class="selectBlock">
        <span class="ageLabel">Male Age</span>
        <select v-model="selectedM" @change="selectedChallenge">
                <option v-for="option in optionsM" v-bind:key="option.value" v-bind:value="option.value">
                    {{ option.text }}
                </option>    
        </select>
</div>
<div class="selectBlock">        
        <span class="ageLabel">Female Age</span>
        <select v-model="selectedF" @change="selectedChallenge">
                <option v-for="option in optionsF" v-bind:key="option.value" v-bind:value="option.value">
                    {{ option.text }}
                </option>    
        </select>
</div>
    </div>       
</template>

<script>
import * as d3 from "d3";
import { EventBus } from '../main.js';

export default {
        name: 'select1',
        props: {fileLocation: String},
        data() {
            return {
            selectedM: '',
            selectedF: '',
            filePlace: this.fileLocation,    
            optionsM: loadSelect('data/lookups/B01001_Male.csv'),
            optionsF: loadSelect('data/lookups/B01001_Female.csv'),
            selectedList: []
            }
        },
        methods: {
            selectedChallenge: function(event) {
                console.log(event.currentTarget.value);
                let msg = {};
                msg.value = 'B01001-' + event.currentTarget.value;
                msg.label = event.currentTarget.selectedOptions[0].label;
                this.selectedList.push(msg);
                EventBus.$emit('selectionChange', this.selectedList);

            },
            clearSelections: function(event) {
                this.selectedList = [];
                this.selectedM = '';
                this.selectedF = '';
                EventBus.$emit('selectionChange', this.selectedList);
            }
        }
}

function loadSelect(gender) {

   let selectArray = [];
   d3.csv(gender, function(d) {
      return {
        key: d.key,  
        value: d.value,
        selected: false
      };
    }).then(function(data) {
        data.forEach(element => {
            selectArray.push({text: element.value, value: element.key});    
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

.ageLabel {
    padding: 5px;
    font-size: 14px;
}

.selectBlock {
    padding: 10px;
}
</style>
