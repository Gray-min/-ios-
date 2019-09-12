// pages/weather/weather.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data:{
    weatherData:[],
    location:'',
    height:'',
    tips: '请稍后',
    show: true,
    animated: true,
    top:0,
    margintop:'',
    mode:'',
    iconMode:'./weatherIcon/'
  }, 
  scroll: function(e) {
   // console.log(e)
    let that = this;
    that.setData({
      top:e.detail.scrollTop
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //设置loading
    setTimeout(() => {
      this.setData({
        show: !this.data.show
      })
    }, 2000)
    var that=this
    var heightw=wx.getSystemInfoSync().windowHeight*0.87+"px"
    var mar=wx.getSystemInfoSync().windowHeight*0.10
    console.log(heightw)
    that.setData({
      margintop:mar,
      height:heightw
    })
    //获取地址及天气状况
    wx.getLocation({
      type: 'wgs84',
      success (res) 
      {
        console.log(res)
      // const  latitude = res.latitude
      // const  longitude = res.longitude
        // const speed = res.speed
        // const accuracy = res.accuracy
      },
      complete(res){
        wx.request({
          url: 'https://jisutqybmf.market.alicloudapi.com/weather/query', //阿里天气
          data: {
            location: res.latitude+","+res.longitude
          },
          header: {
            'Authorization':'APPCODE b3af8aa9aa31470da7b8836492b7b045',//appcode简单认证
            'content-type': 'application/json' // 默认值
          },
          success (res) {
            console.log(res.data)

       var d=res.data.result.hourly
       let flagss=true
       let flagst=true
       let sunrise=res.data.result.daily[0].sunrise
       let sunset=res.data.result.daily[0].sunset
        if(d[0].time.split(":")[0]>sunrise.split(":")[0])
            sunrise=res.data.result.daily[1].sunrise
        if(d[0].time.split(":")[0]>sunset.split(":")[0])
            sunset=res.data.result.daily[1].sunset
            //  debugger
        for(let i=0;i<24;i++){
          let t=parseInt(d[i].time.split(":"))
          let ss=parseInt(sunrise.split(":")[0])
          let st=parseInt(sunset.split(":")[0])
        if(flagss){
         if(t<=ss&&t+1>ss){
           console.log(1)
            d.splice(i+1,0,{time: sunrise,weather: "",temp: "日出",img: "sunrise"}) 
            flagss=false
         }
        }
        if(flagst){
         if(t<=st&&t+1>st){
           console.log(2)
          d.splice(i+1,0,{time: sunset,weather: "",temp: "日落",img: "sunset"}) 
          flagst=false
       }}
        }
            //保存天气信息
            that.setData({
              weatherData:res.data.result
            }) 
            //设置模式
            var sunSetTime=new Date(that.data.weatherData.date+' '+that.data.weatherData.daily[0].sunset).getTime();
            var sysTime=new Date().getTime();
            if(sysTime>sunSetTime){
              that.setData({
                mode:"dark",
                iconMode:"./weatherIcon02/"
              })
              wx.setNavigationBarColor({
                frontColor: '#ffffff',
                backgroundColor: '#000',
              })
              wx.setBackgroundColor({
                backgroundColor: '#000000', // 窗口的背景色为白色
              })
              
            }
              else{
                that.setData({
                  mode:"",
                  iconMode:"./weatherIcon/"
                })}
          }
        })
      }
     })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})