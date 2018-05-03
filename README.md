# google-map-mvvm
a simple mvvm for google map | 以MVVM的方式使用谷歌地图

## usage | 使用

html

```
<script src="./dist/google-map-mvvm.umd.js"></script>
<script src="./index.js"></script>
<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap">
```

index.js

```
window.initMap = function () {
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    center: { lat: 24.886, lng: -70.268 },
    mapTypeId: 'terrain',
  });

  // I want both paths and points | 我同时需要画点和路径
  const triangleCoords = [
    { lat: 25.774, lng: -80.190 },
    { lat: 18.466, lng: -66.118 },
    { lat: 32.321, lng: -64.757 },
    { lat: 20.774, lng: -80.190 },
  ];

  // items to show | 需要展示的元素列表
  const items = [
    {
      // a Polyline for paths | 用于画路径的Polyline
      Constructor: google.maps.Polyline,
      // data is param for the constructor | 用于构造Polyline的数据参数
      data: {
        path: triangleCoords,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      },
    },
    // 4 Circle for each point | 4个Circle用来绘制点
    ...(triangleCoords.map((x)=>{
      return {
        Constructor: google.maps.Circle,
        data: {
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          center: x,
          radius: 40000
        },
        listeners:{
          // alert point data when click | 点击的时候alert点的信息
          click:function(e){
            console.log({event:e,point:this.data.center})
            alert(JSON.stringify(this.data.center))
          }
        },
      }
    })),
  ]

  // show items through mvvm | 使用mvvm显示这些元素
  const vm = new GoogleMapMvvm({
    items,
  }, map)
}

```

## CMD && ES6

install

```
npm i google-map-mvvm
```

use

```
const GoogleMapMvvm = require('google-map-mvvm')

//or ES6
//import GoogleMapMvvm from 'google-map-mvvm'
```

## apis

### config

```
const config = {
    // items to render
    items: [{
        // constructor
        Constructor: google.maps.Polyline,

        // param for constructor
        data: {
            ...
        },

        // listen to events
        listeners:{
          // like click
          click: function(e){
            ...
          }
        },
    }], 
    // methods
    methods: {
        log: function(){}
    },
    ready: function(){}
}

new GoogleMapMvvm(config,map) 
```
- ready: this = GoogleMapMvvm instance
- methods: in each method, this = GoogleMapMvvm instance
- listeners: in each listener, this = item in items
- item.$ref: the instance of item.Constructor
- item.$vm: GoogleMapMvvm instance

### context

```
const config = {
    items: [{
        Constructor: google.maps.Polyline,
        data: {
            ...
        },
        listeners:{
          click: function(e){
            // call from listener
            this.$vm.log(this)
          }
        },
    }], 
    // methods
    methods: {
        log: function(...args){
            console.log(args)
        }
    },
    ready: function(){
        // call from ready
        this.log('ready')
    }
}
const vm = new GoogleMapMvvm(config,map) 

// call from outside
vm.log('outside')
```

### setItems, addItem, removeItem

```
// update all
vm.$setItems(items)

// add
vm.$addItem(item)

// remove
vm.$removeItem(vm.$items[0])
```
use `this` instead of `vm` in `ready` or `method`, use `this.$vm` in `listener` 

## try it out | 体验一下

```
git clone https://github.com/postor/google-map-mvvm.git
cd google-map-mvvm
npm install && npm run build && npm run start
```

open http://localhost:8080