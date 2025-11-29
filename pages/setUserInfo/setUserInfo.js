// pages/setUserInfo/setUserInfo.js
var http = require('../../utils/http');
var util1 = require('../../utils/util.js');
const app = getApp()
const genderOptions= [
  { label: '男', value: '1' },
  { label: '女', value: '2' },
  { label: '未知', value: '0' }
];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},//用户信息
    isIpx: app.globalData.isIpx ? true : false,
    genderLabel: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getuserinfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  // 获取用户信息
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
          // console.info('我的信息===');
          // console.info(info);
          if (info.code == 0) {
            that.setData({
              userinfo: info.data,
              genderLabel: genderOptions.find(gender=>gender.value===info.data.gender)?.label || '未知'
            })
          }
        },
        function fail(info) {

        }
      )
    } else {
      //console.log('未登录失败！')
    }
  },
  closeUserInfo() {
    this.setData({
      photoShow: false
    })
  },
  // 修改昵称
  setUserName: function () {
    let name = this.data.userinfo.nickname ? this.data.userinfo.nickname : ''
    wx.navigateTo({
      url: '../setUserName/setUserName?name=' + name,
    })
  },
  // 修改手机号
  setPhone: function () {
    let that = this
    let phone = this.data.userinfo.mobile ? this.data.userinfo.mobile : ''
    wx.navigateTo({
      url: '../setUserPhone/setUserPhone?phone=' + phone,
    })
  },
  // 选择头像
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    //console.log(avatarUrl);
    var that = this;
    wx.uploadFile({
      url: app.globalData.baseUrl + '/member/store/uploadImg',
      filePath: avatarUrl,
      name: 'file',
      header: {
        'tenant-id': app.globalData.tenantId,
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.userDatatoken.accessToken,
      },
      success(res) {
        var data = JSON.parse(res.data)
        that.updateAvatar(data.data)
      },
    });
  },
  // 修改头像
  updateAvatar: function (avatarUrl) {
    var that = this;
    if (app.globalData.isLogin) {
      http.request(
        "/member/user/updateAvatar?avatarUrl=" + avatarUrl,
        "1",
        "post", {
        "avatarUrl": avatarUrl
      },
        app.globalData.userDatatoken.accessToken,
        "",
        function success(info) {
          if (info.code == 0) {
            wx.showToast({
              title: '修改成功',
              icon: 'success'
            })
            that.getuserinfo()
          }
        },
        function fail(info) {

        }
      )
    } else {
      //console.log('未登录失败！')
    }
  },
  // 退出登录
  exitLogin: function () {
    var that = this;
    if (app.globalData.isLogin) {
      http.request(
        "/member/auth/logout",
        "1",
        "post", {
      },
        app.globalData.userDatatoken.accessToken,
        "加载中...",
        function success(info) {
          if (info.code == 0) {
            wx.showToast({
              title: '已退出',
              icon: 'success'
            })
            app.globalData.userData = {}
            wx.setStorageSync("userDatatoken", "")
            app.globalData.isLogin = false
            app.globalData.userDatatoken = {}
            wx.navigateBack()
          }
        },
        function fail(info) {

        }
      )
    } else {
      //console.log('未登录失败！')
    }



  },

  // 修改性别
  openGenderModal() {
    wx.showActionSheet({
      itemList: genderOptions.map(item => item.label),
      itemColor: '#333333',
      success: (res) => {
        if (res.tapIndex < 0 || res.tapIndex >= genderOptions.length) {
          wx.showToast({ title: '选择失败，请重试', icon: 'none' });
          return;
        }
  
        const selectedGender = genderOptions[res.tapIndex].value;
        const selectedGenderLabel = genderOptions[res.tapIndex].label;
        const that = this;
  
        // 1. 发起请求前显示 Loading（mask: true 防止用户重复点击）
        wx.showLoading({
          title: '提交中...',
          mask: true // 遮罩层，禁止背景操作
        });
  
        http.request(
          `/member/user/updateGender?gender=${selectedGender}`,
          "1",
          "post",
          { gender: selectedGender },
          app.globalData.userDatatoken?.accessToken || "", // 可选链避免 token 不存在报错
          "",
          function success(info) {
            // 2. 请求成功后，先关闭 Loading
            wx.hideLoading();
  
            if (info.code === 0) {
              that.setData({ 'genderLabel': selectedGenderLabel });
              wx.showToast({
                title: `修改性别为${selectedGenderLabel}`,
                icon: 'none',
                duration: 1500
              });
            } else {
              wx.showToast({
                title: info.msg || '修改失败',
                icon: 'none',
                duration: 1500
              });
            }
          },
          function fail(error) {
            // 3. 请求失败后，同样关闭 Loading（关键：避免 Loading 一直显示）
            wx.hideLoading();
  
            wx.showToast({
              title: '网络异常，请重试',
              icon: 'none',
              duration: 1500
            });
            console.error('性别修改失败：', error);
          }
        );
      },
      fail: (res) => {
        if (res.errMsg === 'showActionSheet:fail cancel') {
          return;
        }
        wx.showToast({ title: '操作失败，请重试', icon: 'none' });
      }
    });
  }
})