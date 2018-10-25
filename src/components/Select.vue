<template>
    <div class="customSelect" >
     <span class="selectLabel">{{ selectName }}</span>
        <select :id="id" v-model="selectedOption" @change="selected" ref="selectedOptions">
            <option v-for="option in mutableOptions" v-bind:key="option.value" v-bind:value="option.value">
                {{ option.label }}
            </option>    
        </select>
    </div>
</template>

<script>
/* eslint-disable */

import { EventBus } from "../main.js";

export default {

    props: {
      options: {
        type: Array,
        default() {
          return [{value:'First',label:'First'},{value:'Second',label:'Second'}]
        },
      },
      id: {},
      selectName: null
    },

    data() {
        return {
            selectedOption: '',
            mutableOptions: []
        }
    },

    created() {
        this.mutableOptions = this.options;
    },

    mounted() {
    },

    beforeDestroy() {
        //console.log('Hit before destroy');
    },

    methods: {
        selected: function(event) {
            let msg = {};
            msg.selectName = this.selectName;
            msg.value = event.currentTarget.value;
            msg.label = event.currentTarget.selectedOptions[0].label;
            EventBus.$emit('selectionChange',msg);
        },

        clearSelection: function() {
            this.selectedOption = '';
        }

    }


};
</script>

<style>

.customSelect {
    /* width: 200px; */
    margin: 10px;
}

.selectLabel {
  padding: 5px;
  font-size: 14px;
  white-space: nowrap;
}
</style>
