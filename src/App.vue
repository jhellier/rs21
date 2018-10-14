<template>
  <!-- <div id="app">
  </div> -->

<div id="mainPage" class="wrapper">
        <header class="main-head">RS21 Code Challenge</header>
           <MapView/>

        <aside class="side">
          <FilterView fileLocation="data/lookups/B01001_lookup.csv"/>
        </aside>
        <footer class="main-footer">
          Developed by: John Hellier &nbsp; Contact: qmnoise@gmail.com
        </footer>
</div>



</template>

<script>
import MapView from './components/MapView.vue'
import FilterView from './components/FilterView.vue'

export default {
  name: 'mainPage',
  components: {
    MapView,
    FilterView
  }
}
</script>

<style>
#mainPage {
  margin: 5px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

* {box-sizing: border-box;}

    .wrapper {
        max-width: 2000px;
        margin: 0 auto;
        font: 1.2em Helvetica, arial, sans-serif;
    }

    .wrapper > * {
        border: 2px solid #d6d1d1;
        background-color: #eff6f7;
        border-radius: 5px;
        padding: 7px;
    }

.main-head {
  grid-area: header;
}
.content {
  grid-area: content;
}
.side {
  grid-area: sidebar;
}
.main-footer {
  grid-area: footer;
  font-size: 12px;
}
.wrapper {
  display: grid;
  grid-gap: 10px;
  grid-template-areas: 
    "header"
    "content"
    "sidebar"
    "footer";
}

/* #challengeSelect {
  float: right;
} */

@media (min-width: 500px) {
  .wrapper {
    grid-template-columns: 1fr 3fr;
    grid-template-areas: 
      "header  header"
      "sidebar content";
  }
}
@media (min-width: 700px) {
  .wrapper {
    grid-template-columns: 3fr 1fr;
    grid-template-areas: 
      "header header"
      "content sidebar"
      "footer footer"
   }

}


</style>
