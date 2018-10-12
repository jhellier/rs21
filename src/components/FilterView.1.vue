<template>
    <div>
        <button id="clearSelection" @click="clearSelections">Clear</button>
<div class="selectBlock">
        <select v-model="selectedM" @change="selectedChallenge">
                <option v-for="option in optionsMMin" v-bind:key="option.value" v-bind:value="option.value">
                    {{ option.text }}
                </option>    
        </select>
        <span class="ageLabel">Age</span>
        <select v-model="selectedM" @change="selectedChallenge">
                <option v-for="option in optionsMMax" v-bind:key="option.value" v-bind:value="option.value">
                    {{ option.text }}
                </option>    
        </select>
</div>
<div class="selectBlock">        

        <select v-model="selectedF" @change="selectedChallenge">
                <option v-for="option in optionsFMin" v-bind:key="option.value" v-bind:value="option.value">
                    {{ option.text }}
                </option>    
        </select>
        <span class="ageLabel">Age</span>
        <select v-model="selectedF" @change="selectedChallenge">
                <option v-for="option in optionsFMax" v-bind:key="option.value" v-bind:value="option.value">
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
            optionsMMin: loadSelect('data/lookups/B01001_M_lookup.csv','min'),
            optionsMMax: loadSelect('data/lookups/B01001_M_lookup.csv','max'),
            optionsFMin: loadSelect('data/lookups/B01001_F_lookup.csv','min'),
            optionsFMax: loadSelect('data/lookups/B01001_F_lookup.csv','max'),
            selectedList: []
            }
        },
        methods: {
            selectedChallenge: function(event) {
                console.log(event.currentTarget.value);
                this.selectedList.push(event.currentTarget.value);
                //EventBus.$emit('whatJohn', this.selectedList);

            },
            clearSelections: function(event) {
                this.selectedList = [];
                this.selected = '';
                //EventBus.$emit('whatJohn', this.selectedList);
            }
        }
}

function loadSelect(gender, minMax) {

   let selectArray = [];
   d3.csv(gender, function(d) {
      return {
        key: d.key,  
        min: d.min_year,
        max: d.max_year,
        selected: false
      };
    }).then(function(data) {
        data.forEach(element => {
            let textString = element.max
            if (minMax == 'min')
                textString = element.min
            selectArray.push({text: textString, value: element.key});    
        });
        
    });
    return selectArray;
}        

    
</script>

<style>
select {
    font-size: 14px;
}

button {
    font-size: 14px;
    margin-right: 10px;
    border-radius: 5px;
}

.ageLabel {
    padding: 5px;
}

.selectBlock {
    padding: 10px;
}
</style>
