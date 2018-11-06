# rs21 Challenge
<i>The original submission is the original_submission branch. All other branches including master are experiments in what could be done</i>

This is a project in support of a coding challenge as part of the interview process for [RS 21](https://rs21.io/)

The app is currently hosted on: [Quin Moto](http://quinmoto.com/rs21.html)

The app stack includes:
* Vue.js 2.5.17
  * Vue-Bootstrap
  * Vue-FontAwesome
* D3.js 5.7.0
* Leaflet.js 1.3.4

The component branch cleans up a lot of what was omitted or incomplete for the challenge including:
* Adding custom select components
* Breaking out the tab panels into individual vues
* Making Leaflet a node module
* Fixing the svg element handling so that svg elements are moved rather than recreated after zooming
* All files pass es-lint
* TODO: Testing



You can checkout and build this project locally by following these steps. The primary data sets were provided by RS 21. All other data and development was performed by John Hellier. Any questions: qmnoise@gmail.com

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```
