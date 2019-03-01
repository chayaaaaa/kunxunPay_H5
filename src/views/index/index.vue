<template>
  <div class="index">
    <mt-header fixed title="首  页"></mt-header>
    <div class="header_bg"></div>
    <div class="nav_bg"></div>
    <!-- 主页广告图 -->
    <div class="banner">
      <mt-swipe :auto="4000">
        <mt-swipe-item v-for="(item,index) in bannerData" :key="index">
          <img :src="item.bannerImg">
        </mt-swipe-item>
      </mt-swipe>
    </div>

    <div class="divBopx" @click="popupVisible=true">
      <img class="imgTop" src="@/assets/image/Home/ic-severs.png">
    </div>
    <mt-popup v-model="popupVisible" position="bottom">
      <div class="cellPhone">
        <p class="p">
          <a href="tel:400-6969-619">创鑫客服热线：400-6969-619</a>
        </p>
        <p @click="popupVisible=false">取消</p>
      </div>
    </mt-popup>

    <!-- NAV收益和交易 -->
    <div class="nav">
      <div class="nav_c" @click="msg=0" :class="{'active' :msg===0}">
        <span>收益</span>
      </div>
      <div class="nav_c" @click="msg=1" :class="{'active' :msg===1}">
        <span>交易</span>
      </div>
    </div>
    <div class="container">
      <div class="month">
        <span v-show="msg===0">本月收益(元)</span>
        <span v-show="msg===1">本月交易(元)</span>
        <br>
        <!-- 收益 -->
        <span class="span" v-show="msg===0">{{ProfitDetails.monthProfitString}}</span>
        <!-- 交易 -->
        <span class="span" v-show="msg===1">{{dealDetails.monthDeal}}</span>
      </div>
      <div class="today">
        <span v-show="msg===0">昨日收益(元)</span>
        <span v-show="msg===1">昨日交易(元)</span>
        <br>
        <!-- 收益 -->
        <span class="span" v-show="msg===0">{{ProfitDetails.yesterdayProfitString}}</span>
        <!-- 交易 -->
        <span class="span" v-show="msg===1">{{dealDetails.yesterdayDeal}}</span>
      </div>
    </div>

    <!-- 文字滚动公告 -->
    <div class="fontAnimation">
      <span>
        <img src="@/assets/image/Home/ic-msg.png">
      </span>
      <p class="marquee">{{showData}}</p>
    </div>

    <!-- 今日新增 -->
    <div class="newly">
      <li v-show="msg === 0">
        <img src="@/assets/image/Home/ic-incom.png">
        今日新增收益
      </li>
      <li v-show="msg === 1">
        <img src="@/assets/image/Home/ic-incom.png">
        今日新增交易
      </li>
    </div>
    <div class="newlyDetail">
      <div class="newlyDetailIn">
        <li class="top">
          <p v-show="msg === 0">暂无收益</p>
          <p v-show="msg === 1">暂无交易</p>
        </li>
        <div id="myChart"></div>
        <li class="left">
          <span>可提现收益(元)</span>
          <br>
          <span class="span">{{ProfitDetails.canDrawProfitString}}</span>
        </li>
        <li class="right">
          <span>累计收益(元)</span>
          <br>
          <span class="span">{{ProfitDetails.totalProfitString}}</span>
        </li>
      </div>
    </div>
    <!-- tabbar -->
    <div class="tabbar">
      <mt-tabbar v-model="selected">
        <li @click="goToIndex()">
          <mt-tab-item id="index">
            <img slot="icon" src="@/assets/image/Home/home.png" v-if="this.selected == 'index'">
            <img slot="icon" src="@/assets/image/Home/home-selected.png" v-else>
            首页
          </mt-tab-item>
        </li>
        <li @click="goToManger()">
          <mt-tab-item id="manger">
            <img
              slot="icon"
              src="@/assets/image/Home/manger-selected.png"
              v-if="this.selected == 'manger'"
            >
            <img slot="icon" src="@/assets/image/Home/manger.png" v-else>
            平台管理
          </mt-tab-item>
        </li>
        <li @click="goToMine()">
          <mt-tab-item id="main">
            <img
              slot="icon"
              src="@/assets/image/Home/main-selected.png"
              v-if="this.selected == 'main'"
            >
            <img slot="icon" src="@/assets/image/Home/main.png" v-else>
            我的
          </mt-tab-item>
        </li>
      </mt-tabbar>
    </div>
  </div>
</template>
<script>
var echarts = require("echarts");
require("echarts/lib/chart/bar");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
import {
  checkToken,
  getRefreshToken,
  getIndexBanner,
  getProfitDetails,
  getDealDetails,
  getshowMessage
} from "@/api/api.js";
import qs from "qs";
import axios from "axios";
export default {
  inject: ["reload"],
  name: "index",
  data() {
    return {
      // 轮播图
      bannerData: [],
      // 收益信息
      ProfitDetails: [],
      // 交易信息
      dealDetails: [],
      // 数据图
      echartsPhoto: [],
      // 电话
      popupVisible: false,
      msg: 0,
      active: 0,
      selected: "index",
      message: this.selected,
      // 文字滚动
      showMessage: []
    };
  },
  created() {
    this.selected = this.$route.name;
  },

  methods: {
    goToIndex() {
      if (this.$route !== "index") {
        this.$router.push({
          path: "/index"
        });
      }
    },
    goToManger() {
      if (this.$route !== "manger") {
        this.$router.push({
          path: "/manger"
        });
      }
    },
    goToMine() {
      if (this.$route !== "main") {
        this.$router.push({
          path: "/mine"
        });
      }
    }
  },
  mounted() {
    // banner
    getIndexBanner()
      .then(response => {
        checkToken();
        getRefreshToken();
        var _this = this;
        _this.bannerData = response.data;
        console.log(_this.bannerData);
      })
      .catch({
        function(error) {
          console.log("catch:", error);
        }
      });

    // 收益
    getProfitDetails()
      .then(response => {
        var _a = this;
        _a.ProfitDetails = response.data;
        //
        console.log(_a.ProfitDetails);
        if (
          _a.ProfitDetails.depositCashBackString == 0.0 &&
          _a.ProfitDetails.mposCashBackString == 0.0 &&
          _a.ProfitDetails.shareProfitString == 0.0 &&
          _a.ProfitDetails.swipeCashBackString == 0.0
        ) {
          /*ECharts图表*/
          var myChart = echarts.init(document.getElementById("myChart"));
          // 圆环图各环节的颜色
          var color = ["#D0E7FF", "#D0E7FF", "#D0E7FF", "#D0E7FF"];

          // 圆环图各环节的名称和值(系列中各数据项的名称和值)
          var data = [
            {
              name: "押金返现",
              value: response.data.depositCashBackString
            },
            {
              name: "激活奖励",
              value: response.data.mposCashBackString
            },
            {
              name: "分润收益",
              value: response.data.shareProfitString
            },
            {
              name: "刷卡奖励",
              value: response.data.swipeCashBackString
            }
          ];
          myChart.setOption({
            // 提示框
            tooltip: {
              show: true, // 是否显示提示框
              formatter: "{b} </br> {c}元" // 提示框显示内容,此处{b}表示各数据项名称，此项配置为默认显示项，{c}表示数据项的值，默认不显示，({d}%)表示数据项项占比，默认不显示。
            },

            // graphic 是原生图形元素组件。可以支持的图形元素包括：image, text, circle, sector, ring, polygon, polyline, rect, line, bezierCurve, arc, group,
            graphic: {
              type: "text", // [ default: image ]用 setOption 首次设定图形元素时必须指定。image, text, circle, sector, ring, polygon, polyline, rect, line, bezierCurve, arc, group,
              top: "center", // 描述怎么根据父元素进行定位。top 和 bottom 只有一个可以生效。如果指定 top 或 bottom，则 shape 里的 y、cy 等定位属性不再生效。『父元素』是指：如果是顶层元素，父元素是 echarts 图表容器。如果是 group 的子元素，父元素就是 group 元素。
              left: "center", // 同上
              style: {
                text: "各服装销量对比", // 文本块文字。可以使用 \n 来换行。[ default: '' ]
                fill: "#fff", // 填充色。
                fontSize: 16, // 字体大小
                fontWeight: "bolder" // 文字字体的粗细，可选'normal'，'bold'，'bolder'，'lighter'
              }
            },

            // 系列列表
            series: [
              {
                type: "pie", // 系列类型
                center: ["50%", "50%"], // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。[ default: ['50%', '50%'] ]
                radius: ["50%", "70%"], // 饼图的半径，数组的第一项是内半径，第二项是外半径。[ default: [0, '75%'] ]
                hoverAnimation: true, // 是否开启 hover 在扇区上的放大动画效果。[ default: true ]
                color: color, // 圆环图的颜色
                labelLine: {
                  // 标签的视觉引导线样式,在 label 位置 设置为'outside'的时候会显示视觉引导线。
                },
                data: data // 系列中的数据内容数组。
              }
            ]
          });
        } else {
          /*ECharts图表*/
          var myChart = echarts.init(document.getElementById("myChart"));
          // 圆环图各环节的颜色
          var color = ["#DDBA76", "#1677CB", "#434958", "#115FA2"];

          // 圆环图各环节的名称和值(系列中各数据项的名称和值)
          var data = [
            {
              name: "押金返现",
              value: response.data.depositCashBackString
            },
            {
              name: "激活奖励",
              value: response.data.mposCashBackString
            },
            {
              name: "分润收益",
              value: response.data.shareProfitString
            },
            {
              name: "刷卡奖励",
              value: response.data.swipeCashBackString
            }
          ];
          myChart.setOption({
            // 提示框
            tooltip: {
              show: true, // 是否显示提示框
              formatter: "{b} </br> {c}元" // 提示框显示内容,此处{b}表示各数据项名称，此项配置为默认显示项，{c}表示数据项的值，默认不显示，({d}%)表示数据项项占比，默认不显示。
            },

            // graphic 是原生图形元素组件。可以支持的图形元素包括：image, text, circle, sector, ring, polygon, polyline, rect, line, bezierCurve, arc, group,
            graphic: {
              type: "text", // [ default: image ]用 setOption 首次设定图形元素时必须指定。image, text, circle, sector, ring, polygon, polyline, rect, line, bezierCurve, arc, group,
              top: "center", // 描述怎么根据父元素进行定位。top 和 bottom 只有一个可以生效。如果指定 top 或 bottom，则 shape 里的 y、cy 等定位属性不再生效。『父元素』是指：如果是顶层元素，父元素是 echarts 图表容器。如果是 group 的子元素，父元素就是 group 元素。
              left: "center", // 同上
              style: {
                text: "各服装销量对比", // 文本块文字。可以使用 \n 来换行。[ default: '' ]
                fill: "#fff", // 填充色。
                fontSize: 16, // 字体大小
                fontWeight: "bolder" // 文字字体的粗细，可选'normal'，'bold'，'bolder'，'lighter'
              }
            },

            // 系列列表
            series: [
              {
                type: "pie", // 系列类型
                center: ["50%", "50%"], // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。[ default: ['50%', '50%'] ]
                radius: ["50%", "70%"], // 饼图的半径，数组的第一项是内半径，第二项是外半径。[ default: [0, '75%'] ]
                hoverAnimation: true, // 是否开启 hover 在扇区上的放大动画效果。[ default: true ]
                color: color, // 圆环图的颜色
                label: {
                  // 饼图图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等.
                  normal: {
                    show: true, // 是否显示标签[ default: false ]
                    position: "outside", // 标签的位置。'outside'饼图扇区外侧，通过视觉引导线连到相应的扇区。'inside','inner' 同 'inside',饼图扇区内部。'center'在饼图中心位置。
                    formatter: "{b} : {c}元" // 标签内容
                  }
                },
                labelLine: {
                  // 标签的视觉引导线样式,在 label 位置 设置为'outside'的时候会显示视觉引导线。
                  normal: {
                    show: false, // 是否显示视觉引导线。
                    length: 15, // 在 label 位置 设置为'outside'的时候会显示视觉引导线。
                    length2: 10, // 视觉引导项第二段的长度。
                    lineStyle: {
                      // 视觉引导线的样式
                      //color: '#000',
                      //width: 1
                    }
                  }
                },
                data: data // 系列中的数据内容数组。
              }
            ]
          });
        }

        //
      })
      .catch({
        function(reason) {
          console.log("catch:", reason);
        }
      });
    // 交易
    getDealDetails()
      .then(response => {
        var _b = this;
        _b.dealDetails = response.data;
      })
      .catch({
        function(reason) {
          console.log("catch:", reason);
        }
      });
    // 消息通知
    getshowMessage()
      .then(response => {
        var _c = this;
        _c.showMessage = response.data;
        console.log(response);
        console.log(_c.showMessage);
      })
      .catch({
        function(reason) {
          console.log("catch:", reason);
        }
      });
  },

  computed: {
    //遍历消息通知
    showData() {
      let pname = "";
      this.showMessage.forEach(function(v, i) {
        pname += v["msgContent"] + " ";
      });
      return pname;
    }
  }
};
</script>
<style lang="less">
@blue: #1c8cff;
@paleblue: #d0e7ff;
/* 头部 */
.mint-header {
  height: 1.2rem;
  font-size: 0.5rem;
  font-weight: 100;
  background: @blue;
}
.header_bg {
  width: 100%;
  height: 3rem;
  background: @blue;
}
.nav_bg {
  width: 100%;
  height: 2.5rem;
  background: @paleblue;
}
/* 头部客服 */
.divBopx {
  width: 0.6rem;
  height: 0.6rem;
  position: fixed;
  top: 0.3rem;
  right: 0.5rem;
  z-index: 9999;
  img {
    width: 100%;
  }
}
.mint-popup-bottom{
  width: 100%;
  background: rgba(0, 0, 0, 0);
}
.cellPhone {
  background: rgba(0, 0, 0, 0);
  width: 100%;
  p {
    background: #fff;
    text-align: center;
    height: 1.2rem;
    width: 100%;
    line-height: 1.2rem;
    border-radius: 5px; /* no */
     margin-bottom: 0.2rem;
  }
  .p {
    a {
      font-size: 0.4rem;
    }
  }
}
/* 广告图栏 */
.banner {
  width: 95%;
  height: 4rem;
  position: absolute;
  top: 1.5rem;
  left: 2.5%;
  img {
    width: 100%;
  }
}

/* nav交易与收益 */
.nav {
  width: 100%;
  height: 1.2rem;
  background: @paleblue;
  .nav_c {
    width: 50%;
    height: 1rem;
    line-height: 1rem;
    float: left;
    text-align: center;
    color: #fff;
  }
  .active {
    span {
      border-bottom: 2px solid @blue; /* no */
      color: @blue;
      padding-bottom: 10px;
    }
  }
}
.container {
  width: 100%;
  height: 3.5rem;
  text-align: center;
  background: url("~@/assets/image/Home/bj.png") center center no-repeat;
  background-position: center bottom;
  background-repeat: no-repeat;
  background-size: contain;
  background-size: 100% 2rem;
  font-size: 0.35rem;

  .month {
    width: 50%;
    height: 3.5rem;
    float: left;
    background: #1677cb;
    opacity: 0.8;
    span {
      display: inline-block;
      margin-top: 15px;
      color: #70b4f0;
      line-height: 0.5rem;
    }
    .span {
      color: #f6f2f1;
      font-size: 0.45rem;
    }
  }
  .today {
    width: 50%;
    height: 3.5rem;
    float: left;
    background: #f2f2f2;
    opacity: 0.7;
    span {
      display: inline-block;
      margin-top: 15px;
      color: #959595;
      line-height: 0.5rem;
    }
    .span {
      color: #3f3f3f;
      font-size: 0.45rem;
    }
  }
}
/* 文字公告滚动栏 */
.fontAnimation {
  width: 100%;
  height: 0.8rem;
  span {
    display: inline-block;
    width: 0.8rem;
    background: #f2f2f2;
    position: absolute;
    img {
      width: 70%;
      margin-top: 0.1rem;
      margin-left: 0.1rem;
    }
  }
}
.marquee {
  width: 100%;
  height: 0.8rem;
  line-height: 0.8rem;
  background: #f2f2f2;
  margin: 0 auto;
  overflow: hidden;
  white-space: nowrap;
  box-sizing: border-box;
  animation: marquee 50s linear infinite;
  color: #606060;
}
@keyframes marquee {
  0% {
    text-indent: 10em;
  }
  100% {
    text-indent: -150em;
  }
}

/* 今日新增 */
.newly {
  width: 100%;
  height: 2rem;
  background: #1677cb;
  line-height: 1.5rem;
  li {
    width: 100%;
    text-align: center;
    color: #fff;
    font-size: 0.35rem;
    img {
      vertical-align: middle;
      width: 0.5rem;
    }
  }
}
.newlyDetail {
  width: 100%;
  height: 11rem;
  background: @paleblue;
  position: relative;
  text-align: center;
  .newlyDetailIn {
    width: 95%;
    height: 10rem;
    position: absolute;
    left: 2.5%;
    top: -0.5rem;
    background: #fff;
    #myChart {
      width: 100%;
      height: 6rem;
      position: absolute;
      left: 0;
      right: 0;
      margin: 0 auto;
      top: 1rem;
      background: #fff;
    }
    span {
      display: inline-block;
      margin-top: 15px;
      line-height: 0.5rem;
      font-size: 0.35rem;
    }
    .span {
      font-size: 0.45rem;
    }
    .top {
      width: 100%;
      height: 7rem;
      position: absolute;
      top: 3.8rem;
      z-index: 10;
      font-size: 0.45rem;
      color: #70b4f0;
    }
    .left {
      width: 49%;
      height: 2rem;
      border-right: 1px solid #d9d9d9; /* no */
      position: absolute;
      bottom: 0.5rem;
      left: 0;
      span {
        color: #6ab4ff;
      }
      .span {
        color: #1c8cff;
      }
    }
    .right {
      width: 49.9%;
      height: 2rem;
      position: absolute;
      bottom: 0.5rem;
      right: 0;
      span {
        color: #9b9b9b;
      }
      .span {
        color: #606060;
      }
    }
  }
}
/* tabbar */
.tabbar {
  width: 100%;
  height: 1.3rem;
  background: #fff;
  position: fixed;
  bottom: 0;
  z-index: 20;
  .mint-tabbar {
    height: 1.3rem;
    .mint-tab-item-label {
      font-size: 0.35rem;
    }
    .mint-tab-item-icon {
      width: 0.6rem;
      height: 0.6rem;
    }
  }
  li {
    width: 33.3%;
    height: 1.3rem;
    float: left;
    text-align: center;
  }
}
</style>
