<template>
        <div class="tabContent">
        <br>
        The Twitter data is a collection of tweets in ABQ from 2014-10-30 -> 2014-10-31. 
        There are 2130 tweets by 647 Twitter users. These tweets are displayed on the map as squares.
        You can toggle the tweet view by clicking on the Twitter icon above.
        <br><br>
        Clicking on any one of the top 5 tweeters will display only their locations.
        To reset toggle the Twitter icon above twice.
        <br>
        <br>
        <span style="font-weight: bold;">Top 5 Tweeters</span>
        <br>
        <br>

        <table class="table">
        <thead>
            <tr>
            <th scope="col">Tweeter</th>
            <th scope="col">Count</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <td><span class="linkTweeter" @click="highlightTweeter('CierrRaw')">CierrRaw</span></td>
            <td align="right">52</td>
            </tr>
            <tr>
            <td><span class="linkTweeter" @click="highlightTweeter('iveyjanette_207')">iveyjanette_207</span></td>
            <td align="right">52</td>
            </tr>
            <tr>
            <td><span class="linkTweeter" @click="highlightTweeter('Jayliddo')">Jayliddo</span></td>
            <td align="right">29</td>
            </tr>
            <tr>
            <td><span class="linkTweeter" @click="highlightTweeter('kianaolivar')">kianaolivar</span></td>
            <td align="right">29</td>
            </tr>
            <tr>
            <td><span class="linkTweeter" @click="highlightTweeter('rlong812')">rlong812</span></td>
            <td align="right">25</td>
            </tr>
        </tbody>
        </table>

    </div> 
</template>

<script>

import { EventBus } from '../../main.js';

export default {
  name: 'TwitterTab',
    components: {
      EventBus
  },

  data() {
    return {
      twitterShowing: false
    };
  },
  methods: {
    highlightTweeter: function(tweeter) {
      EventBus.$emit('highlightTweeter', tweeter);
    }


  }
};
</script>

<style>

.linkTweeter,
.linkCheckin {
  color: blue;
  cursor: pointer;
}

</style>
