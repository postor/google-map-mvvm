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
      listeners:{
        click: function(){
          this.$vm.$setItems(items)
        }
      }
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

  const [i0,i1,i2,i3,i4] = items
  // show items through mvvm | 使用mvvm显示这些元素
  const vm = new GoogleMapMvvm({
    items:[i0,i1,i2],
  }, map)
  
  setTimeout(()=>{
    vm.$setItems([i0,i3,i4])
  },3000)

}