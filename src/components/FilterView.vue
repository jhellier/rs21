<template>
    <div id="sidebar">
            <div class="container">
              <div class="row">
                  <div class="col-sm">   
                    <Gauge  gauge_id="facebookFilter" gauge_range_max="25000" gauge_range_default="2000" gauge_icon="fa-facebook" gauge_text="Checkins" icon_color="blue"/>
                  </div>
                  <div class="col-sm">   
                    <Gauge  gauge_id="twitterFilter" gauge_range_max="1000" gauge_icon="fa-twitter" icon_color="lightblue" gauge_text="Tweets"/>
                  </div>
                </div>
             </div>
             <div id="tabPanel">
                  <b-tabs end >
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

import Gauge from './Gauge.vue'
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
    TwitterTab,
    Gauge
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

.tabContent {
  font-size: 12px;
  margin-top: 10px;
  height: 100%;
  overflow: scroll;
} 

.toggleElement {
  white-space: no-wrap;
  float: left;
  cursor: pointer;
}

.nav-tabs {
  font-size: 12px;
}

.tab-pane {
  height: 55vh;
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
