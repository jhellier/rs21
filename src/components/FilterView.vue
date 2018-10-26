<template>
    <div id="sidebar">

        <div class="filterButtons">
          <div class="toggleElement">  
          <span id="twitterToggle" @click="twitterToggle"  title="Click to toggle display">
              <font-awesome-icon :icon="['fab','twitter']" transform="down-3" class="iconStyle" style="color: lightblue"/>
          </span>
          </div>  
          <div class="toggleElement">  
          <span id="facebookToggle" @click="facebookToggle" title="Click to toggle display">
              <font-awesome-icon :icon="['fab','facebook']" transform="down-3" class="iconStyle" style="color: blue"/>
          </span>
          <input id="facebookCheckinThreshold" size="5" v-model="checkinThreshold" title="Checkins Greater Than">            
          <span id="facebookResetCheckinThreshold" @click="resetCheckinThreshold" title="Click to Redo">
            <font-awesome-icon :icon="['fas','redo']" transform="right-3"/>
          </span>
          </div>

        </div>
       <div id="tabPanel">
           <b-tabs>
                <b-tab title="Overview" active>
                    <OverviewTab/>                        
                </b-tab>  
                <b-tab title="Get Started">
                    <GetStartedTab/>
                </b-tab>      
                <b-tab title="BC Census" >
                    <BCCensusTab/>
                </b-tab>
                <b-tab title="Facebook" >
                    <FacebookTab/>
                </b-tab>
                <b-tab title="Twitter">
                    <TwitterTab/>
                </b-tab>
           </b-tabs>

       </div>     
    </div>       
</template>

<script>

import { EventBus } from '../main.js';

import OverviewTab from './FilterTabs/OverviewTab.vue'
import GetStartedTab from './FilterTabs/GetStartedTab.vue'
import BCCensusTab from './FilterTabs/BCCensusTab.vue'
import FacebookTab from './FilterTabs/FacebookTab.vue'
import TwitterTab from './FilterTabs/TwitterTab.vue'

import bTabs from 'bootstrap-vue/es/components/tabs/tabs';
import bTab from 'bootstrap-vue/es/components/tabs/tab';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faRedo, faFacebook, faTwitter);



export default {
  name: 'sidebar',
  components: {
    bTabs,
    bTab,
    library,
    faRedo,
    faFacebook,
    faTwitter,
    FontAwesomeIcon,
    OverviewTab,
    GetStartedTab,
    BCCensusTab,
    FacebookTab,
    TwitterTab
  },

  data() {
    return {
      checkinThreshold: 5000
    };
  },

  methods: {
    facebookToggle: function() {
      this.facebookShowing = !this.facebookShowing;
      EventBus.$emit('toggleFacebookView', this.facebookShowing);
    },
    twitterToggle: function() {
      this.twitterShowing = !this.twitterShowing;
      EventBus.$emit('toggleTwitterView', this.twitterShowing);
    },
    resetCheckinThreshold: function() {
      EventBus.$emit('resetThreshold', this.checkinThreshold);
    }

  }
};


</script>

<style>

.toggleElement {
  white-space: no-wrap;
  float: left;
  cursor: pointer;
}


.nav-tabs {
  font-size: 12px;
}

#tabPanel {
  margin-top: 40px;
  padding-top: 5px;
}

.tabContent {
  font-size: 12px;
  overflow: auto;
}

.iconStyle {
  margin-left: 25px;
  font-size: 30px;
  cursor: pointer;
}

.iconStyledGreyed {
  opacity: 0.3;
}


button {
  font-size: 12px;
  margin-right: 10px;
  border-radius: 5px;
  cursor: pointer;
}



.textNoWrap {
  white-space: nowrap;
}
</style>
