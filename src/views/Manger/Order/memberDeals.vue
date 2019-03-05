<template>
  <div class="memberDeals">
    <!-- ================     会 员 交 易     ================ -->
    <mt-header title="会 员 交 易" fixed>
      <mt-button icon="back" @click="prev()" slot="left"></mt-button>
    </mt-header>
    <!-- 弹出层 -->
    <mt-popup v-model="showOrgan" popup-transition="popup-fade">
      <!-- title -->
      <div class="title">选 择 代 理 商</div>
      <van-picker :columns="queryAgents" @change="onChange"/>
      <div class="box cancel" @click="cancel()">取消</div>
      <div class="box Confirm" @click="Confirm()">确认</div>
    </mt-popup>
    <!-- 选择栏 -->
    <div class="Choice">
      <div class="CliTitle">
        <li class="Cli" @click="showOrgan = true" v-if="display==true">{{showText}}</li>
        <li class="Cli" @click="showOrgan = true" v-if="showThis==true">{{textvalue}}</li>
      </div>
      <div class="CicTime" @touchmove.prevent>
        <!-- 时间选择器 -->
        <input
          class="startTime choiceTime"
          onfocus="this.blur()"
          @click="showStartTime()"
          placeholder="开始日期"
          v-model="startTime"
        >
        <span class="memberDeals_span">-</span>
        <input
          class="endTime choiceTime"
          onfocus="this.blur()"
          @click="showStartTime()"
          placeholder="结束日期"
          v-model="endTime"
        >

        <mt-datetime-picker
          v-model="currentDate"
          ref="picker"
          type="date"
          year-format="{value} 年"
          month-format="{value} 月"
          date-format="{value} 日"
          @confirm="sure"
          :startDate="startDate"
          :endDate="endDate"
        ></mt-datetime-picker>
        <mt-datetime-picker
          v-model="currentDate"
          ref="pic"
          type="date"
          year-format="{value} 年"
          month-format="{value} 月"
          date-format="{value} 日"
          @confirm="sureTwo"
          :startDate="startDate"
          :endDate="endDate"
        ></mt-datetime-picker>
        <!-- 含未消费 -->
        <div class="consume">
          <van-checkbox v-model="checked" checked-color="#fff" @change="toggle()">含未消费</van-checkbox>
        </div>
      </div>
      <div class="showDetail showDetail_memberDeals">
        <div class="left">
          <p>
            <img src="@/assets/image/Manger/Trade/fanxian.png">总交易额
          </p>
          <p>
            {{totalMoney}}
            <span>元</span>
          </p>
        </div>
        <div class="right">
          <p>
            <img src="@/assets/image/Manger/Trade/jihuo.png">交易笔数
          </p>
          <p>
            {{totalNum}}
            <span>笔</span>
          </p>
        </div>
      </div>
    </div>
    <!-- 列表头部 -->
    <ul class="listTop">
      <li>会员姓名</li>
      <li>交易笔数</li>
      <li>交易额</li>
    </ul>
    <ul class="listTal" v-if="showListPages==true">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多数据了~"
          loading-text="加载中"
          @load="onLoad"
          :offset="30"
        >
          <li v-for="item in deviceList" :key="item.b">
            <span>{{item.memberName}}</span>
            <span>{{item.nums}}</span>
            <span>{{item.allAmount}}</span>
          </li>
        </van-list>
      </van-pull-refresh>
    </ul>
    <ul class="listTal" v-if="showQueryPages == true">
      <li v-for="item in querymemberDeals" :key="item.b">
        <span>{{item.memberName}}</span>
        <span>{{item.nums}}</span>
        <span>{{item.allAmount}}</span>
      </li>
      <p class="more">没有更多数据了~</p>
    </ul>
    <ul class="listTal nothing" v-if="nothing == true">
      <img src="@/assets/image/Manger/Trade/nothing.png">
      <p>未获取到数据，请重新设置查询条件</p>
    </ul>
    <!--    tabbar -->
    <div class="footer">
      <van-tabbar v-model="active">
        <van-tabbar-item @click="jumpToTradeOrder()">
          <span>交易订单</span>
          <img slot="icon" slot-scope="props" :src="props.active ? icon.active : icon.normal">
        </van-tabbar-item>
        <van-tabbar-item @click="jumpToMemberDeal()">
          <span>会员交易</span>
          <img slot="icon" slot-scope="props" :src="props.active ? icon.active2 : icon.normal2">
        </van-tabbar-item>
        <van-tabbar-item @click="jumpToMemberInfo()">
          <span>会员信息</span>
          <img slot="icon" slot-scope="props" :src="props.active ? icon.active3 : icon.normal3">
        </van-tabbar-item>
        <van-tabbar-item @click="jumpToCashBack()">
          <span>返现活动</span>
          <img slot="icon" slot-scope="props" :src="props.active ? icon.active4 : icon.normal4">
        </van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>
<script>
import "@/CSSFILE/tabbar.css";
import "@/CSSFILE/Order.css";
import { DatetimePicker, Toast, Popup, Picker } from "mint-ui";
const axios = require("axios");
import {
  getqueryMemberTrade,
  checkToken,
  getRefreshToken,
  BASE_URL
} from "@/api/api.js";
export default {
  name: "memberDeals",
  data() {
    return {
      active: 1,
      cur: 1,
      // time
      pickerVisible: "",
      /* 选择弹框 */
      showOrgan: false,
      /* 头部含未消费的值 */
      checked: true,
      /* tabbar */
      icon: {
        normal: require("@/assets/image/Manger/Trade/icon01.png"),
        active: require("@/assets/image/Manger/Trade/icon01_choice.png"),
        normal2: require("@/assets/image/Manger/Trade/icon02.png"),
        active2: require("@/assets/image/Manger/Trade/icon02_choice.png"),
        normal3: require("@/assets/image/Manger/Trade/icon03.png"),
        active3: require("@/assets/image/Manger/Trade/icon03_choice.png"),
        normal4: require("@/assets/image/Manger/Trade/icon04.png"),
        active4: require("@/assets/image/Manger/Trade/icon04_choice.png")
      },
      /* 列表的渲染内容 */
      queryMemberTrade: [], // 空数据储存
      totalNum: "", // 总交易笔数
      totalMoney: "", // 总交易额
      deviceList: [], //用于存放加载的数据
      totalPage: 0, // 总数page
      pageNumber: 0, // 当前页
      loading: false, //控制上拉加载的加载动画
      finished: false, //控制在页面往下移动到底部时是否调用接口获取数据
      isLoading: false, //控制下拉刷新的加载动画
      querymemberDeals: [], // 查询到的数据
      valueLength: "", // 数据长度
      showListPages: true, // 原始数据
      showQueryPages: false, // 显示查询数据
      nothing: false, // 没有数据
      startTime: "", // 开始时间
      endTime: "", // 结束时间
      /* 选择代理商 */
      queryAgents: [], // 储存代理商数据
      /* 选择器 */
      optionValue: "",
      display: true,
      showThis: false,
      showalltime: false,
      startDate: new Date(2018, 1, 1),
      endDate: new Date(2030, 1, 1),
      currentDate: new Date(),
      showText: JSON.parse(window.localStorage.getItem("userInfo")).name // 显示总代理
    };
  },

  methods: {
    // 时间
    // 格式化获取的时间
    formatDate(date) {
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;

      return y + "-" + m + "-" + d;
    },
    //开始
    showStartTime() {
      console.log(this.formatDate(this.$refs.pic.value));
      this.$refs.pic.open();
    },
    sureTwo(data) {
      // 输出格式化后的时间
      this.startTime = this.formatDate(this.$refs.pic.value);
      this.$refs.picker.open();
    },
    //结束时间
    sure(data) {
      // 输出格式化后的时间
      this.endTime = this.formatDate(this.$refs.picker.value);
      console.log(this.startTime);
      console.log(this.endTime);
      let queryData = {
        qdcrmUserId: JSON.parse(window.localStorage.getItem("userInfo"))
          .qdcrmUserId,
        access_token: JSON.parse(window.localStorage.getItem("token"))
          .access_token,
        gmtStart: this.startTime,
        gmtEnd: this.endTime,
        currentPage: 1,
        number: Math.random()
      };
      axios
        .get(`${BASE_URL}/msmng/api/order/queryMemberTrade`, {
          params: queryData
        })
        .then(response => {
          console.log(response.data.data);
          let _this = this;
          let listDetails = response.data.data.list;
          _this.querymemberDeals = listDetails;
          _this.valueLength = response.data.data.paginator.length;
          console.log(_this.querymemberDeals);
          console.log(_this.valueLength);
          if (_this.valueLength == 0) {
            _this.showListPages = false;
            _this.nothing = true;
          } else {
            _this.showListPages = false;
            _this.showQueryPages = true;
            _this.nothing = false;
          }
        })
        .catch(function(err) {
          Toast(err.message);
        });
    },
    prev() {
      this.$router.go(-1);
    },
    jumpToTradeOrder() {
      this.$router.push("/tradeOrder");
    },
    jumpToMemberDeal() {
      this.$router.push("/memberDeal");
    },
    jumpToMemberInfo() {
      this.$router.push("/memberInfo");
    },
    jumpToCashBack() {
      this.$router.push("/cashBack");
    },
    Confirm() {
      let queryData = {
        qdcrmUserId: this.value,
        access_token: JSON.parse(window.localStorage.getItem("token"))
          .access_token,
        gmtStart: this.startTime,
        gmtEnd: this.endTime,
        currentPage: this.pageNumber + 1,
        number: Math.random()
      };
      axios
        .get(`${BASE_URL}/msmng/api/order/queryMemberTrade`, {
          params: queryData
        })
        .then(response => {
          console.log(response.data.data);
          let _this = this;
          let listDetails = response.data.data.list;
          _this.querymemberDeals = listDetails;
          _this.valueLength = response.data.data.paginator.length;
          console.log(_this.querymemberDeals);
          console.log(_this.valueLength);
          if (_this.valueLength == 0) {
            _this.showListPages = false;
            _this.nothing = true;
          } else {
            _this.showListPages = false;
            _this.showQueryPages = true;
            _this.nothing = false;
          }
        })
        .catch(function(err) {
          Toast(err.message);
        });
      this.showOrgan = false;
      this.display = false;
      this.showThis = true;
    },
    cancel() {
      this.showOrgan = false;
    },

    onChange(picker, value, index) {
      this.textvalue = value.text;
      this.value = value.id;
      console.log(value);
      console.log(this.textvalue);
      console.log(this.value);
      console.log(index);
    },
    toggle() {
      console.log(this.checked);
      if (this.checked == true) {
        let queryData = {
          qdcrmUserId: JSON.parse(window.localStorage.getItem("userInfo"))
            .qdcrmUserId,
          access_token: JSON.parse(window.localStorage.getItem("token"))
            .access_token,
          gmtStart: this.startTime,
          gmtEnd: this.endTime,
          currentPage: this.pageNumber + 1,
          isConsume: 1,
          number: Math.random()
        };
        axios
          .get(`${BASE_URL}/msmng/api/order/queryMemberTrade`, {
            params: queryData
          })
          .then(response => {
            console.log(response.data.data);
            let _this = this;
            let listDetails = response.data.data.list;
            _this.querymemberDeals = listDetails;
            _this.valueLength = response.data.data.paginator.length;
            console.log(_this.querymemberDeals);
            console.log(_this.valueLength);
            if (_this.valueLength == 0) {
              _this.showListPages = false;
              _this.nothing = true;
            } else {
              _this.showListPages = false;
              _this.showQueryPages = true;
              _this.nothing = false;
            }
          })
          .catch(function(err) {
            Toast(err.message);
          });
      } else {
        let queryData = {
          qdcrmUserId: JSON.parse(window.localStorage.getItem("userInfo"))
            .qdcrmUserId,
          access_token: JSON.parse(window.localStorage.getItem("token"))
            .access_token,
          gmtStart: this.startTime,
          gmtEnd: this.endTime,
          currentPage: this.pageNumber + 1,
          number: Math.random()
        };
        axios
          .get(`${BASE_URL}/msmng/api/order/queryMemberTrade`, {
            params: queryData
          })
          .then(response => {
            console.log(response.data.data);
            let _this = this;
            let listDetails = response.data.data.list;
            _this.querymemberDeals = listDetails;
            _this.valueLength = response.data.data.paginator.length;
            console.log(_this.querymemberDeals);
            console.log(_this.valueLength);
            if (_this.valueLength == 0) {
              _this.showListPages = false;
              _this.nothing = true;
            } else {
              _this.showListPages = false;
              _this.showQueryPages = true;
              _this.nothing = false;
            }
          })
          .catch(function(err) {
            Toast(err.message);
          });
      }
    },
    // 下拉刷新上拉加载
    init() {
      // 当前页数
      let data = {
        currentPage: this.pageNumber + 1
      };
      let self = this;
      getqueryMemberTrade(data)
        .then(response => {
          getRefreshToken();
          let res = response.data.data.list;
          console.log(res);
          // 用 data 里定义的空数组储存得到的数据
          self.deviceList = res;
          console.log(self.deviceList);
          // 储存总页数
          self.totalPage = response.data.data.paginator.pages;
          // 向数组中追加内容
          self.deviceList = self.deviceList.concat(res);
          // 取消刷新动画
          self.isLoading = false;
        })
        .catch({
          function(error) {
            Toast(response.message);
          }
        });
    },
    //下拉刷新
    onRefresh() {
      let self = this;
      setTimeout(() => {
        self.totalPage = 0;
        self.pageNumber = 0;
        Toast({
          message: "刷新成功"
        });
        this.isLoading = false;
        self.init(); //加载数据
      }, 500);
    },
    //页面初始化之后会触发一次，在页面往下加载的过程中会多次调用【上拉加载】
    onLoad() {
      getRefreshToken();
      let self = this;
      setTimeout(() => {
        let data = this.$qs.stringify({
          currentPage: self.pageNumber + 1
        });
        window.sessionStorage.setItem("page", JSON.stringify(data));
        getqueryMemberTrade(data)
          .then(response => {
            console.log(response.data);
            let res = response.data.data.list;
            console.log(res);
            self.totalPage = response.data.data.paginator.pages;
            console.log(self.totalPage);
            self.deviceList = self.deviceList.concat(res);
            self.loading = false;
            self.pageNumber++;
            self.totalNum = response.data.data.totalNum;
            self.totalMoney = response.data.data.totalMoney;
            if (self.pageNumber >= self.totalPage) {
              self.finished = true;
            } else {
              self.finished = false;
            }
          })
          .catch({
            function(error) {
              Toast(response.message);
            }
          });
      }, 500);
    }
  },
  created() {
    let queryData = {
      qdcrmUserId: JSON.parse(window.localStorage.getItem("userInfo"))
        .qdcrmUserId,
      access_token: JSON.parse(window.localStorage.getItem("token"))
        .access_token
    };
    axios
      .get(`${BASE_URL}/msmng/api/agent/getAgentTree`, {
        params: queryData
      })
      .then(response => {
        this.queryAgents = response.data.data;
        console.log(this.queryAgents);
      })
      .catch(function(err) {
        Toast(err.message);
      });
  }
};
</script>
<style lang="less" scoped>
@blue: #1c8cff;
/* 头部 */
.memberDeals {
  background: #f5f5f5;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  .picker {
    background: #fff;
  }

  /* 代理商选择 */
  .select {
    width: 50%;
    height: 1rem;
    margin-left: 25%;
    margin-bottom: 1rem;
    margin-top: 1rem;
    border: none;
    border-top: 1px solid #1c8cff; /* no */
    border-bottom: 1px solid #1c8cff; /* no */
    background: #fff;
    outline: none;
    option {
      outline: none;
      border: 1px solid #1c8cff; /* no */
    }
  }
  /* 时间选择栏 */
  .Choice {
    width: 100%;
    height: 3.36rem;
    .CliTitle {
      width: 20%;
      float: left;
      .Cli {
        overflow: hidden;
        -webkit-overflow: hidden;
      }
    }
    .CicTime {
      width: 100;
      width: 80%;
      float: left;
      .mint-popup {
        width: 100%;
        border-radius: 0;
        background: #fff;
      }
      .choiceTime {
        text-align: center;
        width: 26%;
        background: #fff;
        float: left;
        height: 0.6rem;
        line-height: 0.6rem;
        font-size: 0.3rem;
        border-radius: 5px; /* no */
        color: #d9d9d9;
      }
      .startTime {
        margin-left: 0.5rem;
        margin-right: 0.2rem;
      }
      .endTime {
        margin-left: 0.2rem;
      }
      .memberDeals_span {
        width: 2%;
        float: left;
        height: 0.6rem;
        line-height: 0.6rem;
      }
    }
    /* 含未消费 */
    .consume {
      /*  width: 25%; */
      float: right;

      .van-icon {
        margin-top: 0.2rem !important;
      }
      .van-icon::before {
        display: none !important;
      }
    }
  }
  /* 列表 */
  .nothing {
    width: 100%;
    height: 5rem;
    background: #f5f5f5 !important;
    text-align: center;
    img {
      width: 40%;
      margin-top: 1rem;
    }
    p {
      margin-top: 1rem;
    }
  }
  .listTop {
    li {
      width: 100%;
    }
  }
  .listTal {
    width: 100%;
    height: auto;
    .more {
      width: 100%;
      height: 2.5rem;
      line-height: 1rem;
      text-align: center;
      background: #f5f5f5;
    }
    li {
      width: 90%;
      margin-left: 5%;
      height: 1.2rem;
      border-bottom: 1px solid #d9d9d9; /* no */
      text-align: center;
      line-height: 1.2rem;
      span {
        display: inline-block;
        width: 32%;
        font-size: 0.35rem;
      }
      span:nth-child(3) {
        color: #e3383e;
        font-weight: 800;
      }
    }
  }
}
.el-date-editor .el-range-input {
  color: #fff;
}
.el-input__inner:hover {
  color: #fff;
}
.el-range-editor.el-input__inner {
  margin-left: -0rem;
  width: 4.2rem;
}
.el-range__icon {
  margin-left: -33px;
}
</style>

<style lang="less">
.van-checkbox__icon {
  height: 20px !important;
  width: 10px !important;
  margin-left: 0.1rem !important;
  .van-checkbox__label {
    line-height: 10px !important;
  }
}
.van-list__finished-text,
.van-list__loading-text {
  height: 2.5rem !important;
  line-height: 1.2rem !important;
  text-align: center;
}
.van-picker__columns {
  margin-bottom: -1.5rem;
  .van-picker-column {
    margin-top: -1rem;
  }
  .van-hairline--top-bottom {
    width: 30% !important;
    margin-left: 35%;
  }

  .van-hairline--top-bottom::after {
    border: 1px solid #1c8cff !important;
    border-left: none !important;
    border-right: none !important;
  }
  .van-picker__frame,
  .van-picker__loading .van-loading {
    top: 32%;
  }
}
// 时间选择器
.el-range-editor.el-input__inner {
  height: 0.7rem;
  width: 4.5rem;
  margin-right: 0rem;
}
.el-date-editor .el-range-separator {
  line-height: 0.5rem;
}
.showDetail_memberDeals {
  margin-top: 0.9rem !important;
}
.el-date-editor .el-range-input {
  font-size: 0.2rem;
  margin-left: -0.1rem;
}
</style>
