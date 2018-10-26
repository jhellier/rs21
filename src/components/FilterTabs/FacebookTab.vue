<template>
                        <div class="tabContent" style="overflow:auto; height: 400px;">
                        <br>
                        The Facebook data is a collection of Checkins for businesses in ABQ. The checkins show where someone has been. The more checkins for a business the more likely it is popular.
                        The map will show each checkin site as a colored circle. The color of the circle corresponds
                        to the busines type. There are more than 80 business types listed in this data set.
                        <br>
                        <br>
                        The Facebook icon in the toggle views section allows you to toggle the facebook checkin view
                        as well as set the number of checkins to limit to view for. For example, if you only wanted
                        places that had checkins more than 5000 then you would enter 5000 into the textfield
                        next the Facebook icon. Then hit the redo button. This will show an updated selection
                        of checkins sites on the map.
                        <br><br>
                        Clicking on any one of the most popular checkins will
                        highlight only that location. Toggle the Facebook icon above twice to reset. 
                        <br>
                        <br>
                        <span style="font-weight: bold;">Most Popular Checkins</span>
                        <br>
                        <br>

                        <table class="table">
                        <thead>
                            <tr>
                            <th scope="col">Place</th>
                            <th scope="col">Checkins</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td><span class="linkCheckin" @click="highlightFilteredCheckin(132671)">Century Rio 24</span></td>
                            <td align="right">132671</td>
                            </tr>
                            <tr>
                            <td><span class="linkCheckin" @click="highlightFilteredCheckin(111136)">Sandia Resort & Casino Arts</span></td>
                            <td align="right">111136</td>
                            </tr>
                            <tr>
                            <td><span class="linkCheckin" @click="highlightFilteredCheckin(106606)">Isotopes Park</span></td>
                            <td align="right">106606</td>
                            </tr>
                            <tr>
                            <td><span class="linkCheckin" @click="highlightFilteredCheckin(83461)">The University of New Mexico - UNM</span></td>
                            <td align="right">83461</td>
                            </tr>
                            <tr>
                            <td><span class="linkCheckin" @click="highlightFilteredCheckin(65108)">Ojos Locos</span></td>
                            <td align="right">65108</td>
                            </tr>
                            <tr>
                            <td><span class="linkCheckin" @click="highlightFilteredCheckin(49364)">The Pit</span></td>
                            <td align="right">49364</td>
                            </tr>
                            <tr>
                            <td><span class="linkCheckin" @click="highlightFilteredCheckin(49079)">Hooters on San Mateo</span></td>
                            <td align="right">49079</td>
                            </tr>
                            <tr>
                            <td><span class="linkCheckin" @click="highlightFilteredCheckin(46212)">Tucanos Brazilian Grill</span></td>
                            <td align="right">46212</td>
                            </tr>
                            <tr>
                            <td><span class="linkCheckin" @click="highlightFilteredCheckin(45619)">Elephant Bar</span></td>
                            <td align="right">45619</td>
                            </tr>
                            <tr>
                            <td><span class="linkCheckin" @click="highlightFilteredCheckin(44488)">Frontier Restaurant</span></td>
                            <td align="right">44488</td>
                            </tr>
                        </tbody>
                        </table>
                    </div>                    

</template>

<script>

import { EventBus } from '../../main.js';

export default {
  name: 'FacebookTab',
  components: {

  },

  data() {
    return {
      facebookShowing: false,
  
    };
  },
  methods: {
    highlightFilteredCheckin: function(count) {
      EventBus.$emit('highlightFilteredCheckin', count);
    },


  }
};
</script>

<style>
#facebookCheckinThreshold {
  margin-left: 10px;
}

.linkTweeter,
.linkCheckin {
  color: blue;
  cursor: pointer;
}
</style>
