// pages/user/user.js
var http = require('../../utils/http');
var util1 = require('../../utils/util.js');

const {getTargetUrl, navigateWithAuth} = require("../../utils/navigateUtil")
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0,
    titleBarHeight: 0,
    isLogin: app.globalData.isLogin,
    sysinfo: '',
    userinfo: {
      couponCount: 0,
      giftBalance: 0,
      balance: 0
    },//用户信息
    cardList: [],
    serviceInfo: [],
    showExpireModal: false,

    // 常用功能
    functionsList: [
      {
        iconName: "dingdan",
        text: "预定订单",
        targetUrl: "/pages/orderList/orderList",
        isNeedLogin: false,
        openType: "switchTab",
        show: true
      },
      {
        iconName: "shangpindingdan1",
        text: "商品订单",
        targetUrl: "../productOrder/productOrder",
        isNeedLogin: true,
        openType: "navigate",
        show: true
      },
      {
        iconName: "zhangdan",
        text: "余额账单",
        targetUrl: "../myBalance/myBalance",
        isNeedLogin: true,
        openType: "navigate",
        show: true
      },
      {
        iconName: "youhuiquan",
        text: "我的优惠券",
        targetUrl: "../coupon/coupon",
        isNeedLogin: false,
        openType: "navigate",
        show: true
      },
      {
        iconName: "youhuikaquan",
        text: "收款账户",
        targetUrl: "../yeepay/index",
        isNeedLogin: true,
        openType: "navigate",
        show: true
      },
      {
        iconName: "changjianwentixiangguanwenti",
        text: "常见问题",
        targetUrl: "../help/help",
        isNeedLogin: false,
        openType: "navigate",
        show: true
      },
      {
        iconName: "sousuo",
        text: "订单查询",
        targetUrl: "../searchOrder/index",
        isNeedLogin: false,
        openType: "navigate",
        show: true
      }
    ],
    // 功能专区
    // 功能专区配置：按用户类型分类，和原功能一一对应
    functionSections: {
      // 商家端（userType != 14）
      merchant: [
        { iconName: 'mendian', color: '#5AAB6E', text: '门店管理', url: '/packageA/pages/setStore/setStore' },
        { iconName: 'fangjian', color: '#5AAB6E', text: '房间控制', url: '/packageA/pages/roomList/roomList' },
        { iconName: 'dingdan1', color: '#5AAB6E', text: '订单管理', url: '/packageA/pages/SetOrder/SetOrder' },
        { iconName: 'huiyuan', color: '#5AAB6E', text: '用户管理', url: '/packageA/pages/setVip/setVip' },
        { iconName: 'tuangou', color: '#5AAB6E', text: '团购验券', url: '/packageA/pages/scanQr/scanQr' },
        { iconName: 'baojie', color: '#5AAB6E', text: '保洁订单', url: '/packageA/pages/taskManager/taskManager' },
        { iconName: 'tongjitu', color: '#5AAB6E', text: '数据统计', url: '/packageA/pages/statics/statics' },
        { iconName: 'e23lock', color: '#5AAB6E', text: '门锁配置', url: '/packageA/pages/addLock/addLock' },
      ],
      // 保洁端（userType = 14）
      cleaner: [
        { iconName: 'iov-store', color: '#5AAB6E', text: '任务大厅', url: '/packageA/pages/task/task' },
        { iconName: 'shebeiguanli', color: '#5AAB6E', text: '房间状态', url: '/packageA/pages/roomList/roomList' },
        { iconName: 'duiqifangshi2', color: '#5AAB6E', text: '任务统计', url: '/packageA/pages/taskStatics/taskStatics' },
      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSysInfo();
    this.setData({
      statusBarHeight: wx.getStorageSync("statusBarHeight"),
      titleBarHeight: wx.getStorageSync("titleBarHeight"),
    });
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
    let that = this;
    that.setData({
      isLogin: app.globalData.isLogin,
    })

    if (!app.globalData.isLogin) {
      that.setData({
        couponCount: 0,
        giftBalance: 0,
        balance: 0
      })
    }
    that.getuserinfo();
    // that.getTabBar().updateTabTar();
    // this.getTabBar().setData({
    //   selected: 3
    // })
    // this.getCardPage();
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

  },

  getuserinfo: function () {
    var that = this;
    if (app.globalData.isLogin) {
      http.request(
        "/member/user/get",
        "1",
        "get", {
      },
        app.globalData.userDatatoken.accessToken,
        "",
        function success(info) {
          console.info('我的信息===');
          console.info(info);
          if (info.code == 0) {
            that.setData({
              userinfo: info.data,
            })
            if(info.data.userType ==12 || info.data.userType ==13){
              http.request(
                "/member/store/getServiceInfo",
                "1",
                "post", {
              },
                app.globalData.userDatatoken.accessToken,
                "",
                function success(res) {
                  console.info(res);
                  if (res.code == 0) {
                    that.setData({
                      serviceInfo: res.data,
                    })
                    if(res.data && res.data.length >0){
                      that.setData({
                        showExpireModal: true,
                      })
                    }
                  }
                },
                function fail(info) {
                }
              )
            }
          }
        },
        function fail(info) {

        }
      )
    } else {
      //console.log('未登录失败！')
    }
  },
  getSysInfo: function () {
    var that = this;
    http.request(
      "/member/index/getSysInfo",
      "1",
      "get", {
    },
      "",
      "",
      function success(info) {
        console.info(info);
        if (info.code == 0) {
          that.setData({
            sysinfo: info.data,
          })
        }
      },
      function fail(info) {

      }
    )
  },
  gotosetuserinfo: function () {
    wx.navigateTo({
      url: '../setUserInfo/setUserInfo',
    })
  },
  goOrder: function () {
    wx.switchTab({
      url: '../orderList/orderList',
    })
  },
  //到登录界面
  gotologin() {
    wx.navigateTo({
      url: '../login/login',
    })
  },
  getCardPage() {
    const that = this
    if (app.globalData.isLogin) {
      http.request(
        `/member/card/getMyCardPage`,
        "1",
        "post",
        {
          "pageNo": 1,
          "pageSize": 100,
          userId: app.globalData.userDatatoken.userId
        },
        app.globalData.userDatatoken.accessToken,
        "",
        function success(info) {
          if (info.code == 0) {
            that.setData({
              cardList: info.data.list
            })
          } else {
            wx.showModal({
              content: info.msg || "请求服务异常，请稍后重试",
              showCancel: false,
            });
          }
        },
        function fail(info) { }
      );
    }
  },
  goScore() {
    wx.showToast({
      title: '暂不支持',
      icon: 'none'
    })
  },
  goCoupon() {
    wx.navigateTo({
      url: '../coupon/coupon',
    })
  },
  closeExpireModal(){
    this.setData({
      showExpireModal: false
    })
  },

  // 常用功能
  handleFunctionTap(e) {
    const { item } = e.currentTarget.dataset;
    const { isLogin } = this.data;

    navigateWithAuth({
      isLogin: item.isNeedLogin && !isLogin,
      openType: item.openType,
      targetUrl: item.targetUrl
    })
  },

  // 统一跳转处理函数
  handleNavigate(e) {
    const { targetUrl, openType } = e.currentTarget.dataset;
    const { isLogin } = this.data;
    navigateWithAuth({
      isLogin,
      targetUrl,
      openType,
    });
  },
})