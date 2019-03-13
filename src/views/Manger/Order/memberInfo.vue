<template>
  <div class="memberInfo">
    <!-- ================     会 员 信 息     ================ -->
    <mt-header title="会 员 信 息" fixed>
      <mt-button icon="back" @click="prev()" slot="left"></mt-button>
    </mt-header>
    <!-- 选择栏 -->
    <div class="Choice">
      <li class="Cli">全部</li>
      <div class="CicTime">
        <!-- 搜索框 -->
        <div class="search" @click="showOrgan = true">
          <input v-model="phoneNumber" id="inputColor" type="number">
          <img src="@/assets/image/Manger/Trade/search.png">
        </div>
        <!-- 含未认证 -->
        <div class="consume">
          <img
            src="@/assets/image/Manger/border_yuan.png"
            @click="onConsume()"
            v-if="thisonConsume == true"
          >
          <img
            src="@/assets/image/Manger/yuan_white.png"
            @click="consume()"
            v-if="thisconsume == true"
          >
          <span>含未认证</span>
        </div>
      </div>
      <div class="showDetail">
        <div class="left">
          <p>
            <img src="@/assets/image/Manger/Trade/fanxian.png">总会员数
          </p>
          <p>
            {{totalNum}}
            <span>人</span>
          </p>
        </div>
        <div class="right">
          <p>
            <img src="@/assets/image/Manger/Trade/jihuo.png">已认证人数
          </p>
          <p>
            {{authNum}}
            <span>人</span>
          </p>
        </div>
      </div>
    </div>
    <!-- 弹出层 -->
    <mt-popup v-model="showOrgan" popup-transition="popup-fade">
      <div class="title">请输入会员手机号查询</div>
      <mt-field type="tel" v-model="queryAgent" class="queryAgent"></mt-field>
      <div class="box cancel" @click="cancel()">取消</div>
      <div class="box Confirm" @click="Confirm()">确认</div>
    </mt-popup>
    <!-- 列表头部 -->
    <ul class="listTop_memberInfo">
      <li>会员姓名</li>
      <li>注册时间</li>
      <li>会员状态</li>
      <li>认证状态</li>
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
            <span>{{item.merchantName}}</span>
            <span class="time">{{item.regTime}}</span>
            <span class="blue" v-if="item.merStatus == 1">激活</span>
            <span class="name" v-if="item.merStatus == 2">未激活</span>
            <span class="name" v-if="item.merStatus == 3">已注销</span>
            <span v-if="item.authStatus == 1">未认证</span>
            <span v-if="item.authStatus == 2">认证中</span>
            <span v-if="item.authStatus == 3">未通过</span>
            <span v-if="item.authStatus == 4">通过</span>
          </li>
        </van-list>
      </van-pull-refresh>
    </ul>
    <ul class="listTal" v-if="showQueryPages==true">
      <li v-for="item in MemberInfo" :key="item.b">
        <span>{{item.merchantName}}</span>
        <span class="time">{{item.regTime}}</span>
        <span class="blue" v-if="item.merStatus == 1">激活</span>
        <span class="name" v-if="item.merStatus == 2">未激活</span>
        <span class="name" v-if="item.merStatus == 3">已注销</span>
        <span v-if="item.authStatus == 1">未认证</span>
        <span v-if="item.authStatus == 2">认证中</span>
        <span v-if="item.authStatus == 3">未通过</span>
        <span v-if="item.authStatus == 4">通过</span>
      </li>
      <p>没有更多数据了~</p>
    </ul>
    <!--    tabbar-->
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
const searchPage = () => import("@/views/Manger/Order/searchPage.vue");
import "@/CSSFILE/tabbar.css";
import "@/CSSFILE/Order.css";
import "@/CSSFILE/force.css";
import { Toast } from "mint-ui";
const axios = require("axios");
import { getqueryMemberInfo, checkToken, BASE_URL } from "@/api/api.js";
export default {
  name: "memberInfo",
  data() {
    return {
      active: 2,
      cur: 2,
      current: 0,
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
      MemberInfo: [], // 空数据储存
      authNum: "", // 认证人数
      totalNum: "", // 总会员数
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
      value: "",
      queryAgent: "",
      /* 时间选择框值 */
      value8: "",
      /* 选择弹框 */
      showOrgan: false,
      /* 认证 */
      thisonConsume: false,
      thisconsume: true,
      phoneNumber: "" // input框的值
    };
  },
  methods: {
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
    onChange(picker, value, index) {
      Toast(`当前值：${value}, 当前索引：${index}`);
    },
    Confirm() {
      console.log(this.queryAgent);
      // 还没有给会员手机号查询接口
      this.showOrgan = false;
    },
    cancel() {
      this.showOrgan = false;
    },
    jumpToDealDetail() {
      this.$router.push("/dealDetail");
    },
    search() {
      console.log(this.phoneNumber);
    },
    // 未认证
    onConsume() {
      this.thisconsume = true;
      this.thisonConsume = false;

      let queryData = {
        qdcrmUserId: JSON.parse(window.localStorage.getItem("userInfo"))
          .qdcrmUserId,
        access_token: JSON.parse(window.localStorage.getItem("token"))
          .access_token,
        currentPage: this.pageNumber + 1,
        number: Math.random()
      };
      axios
        .get(`${BASE_URL}/msmng/api/order/queryMemberInfo`, {
          params: queryData
        })
        .then(response => {
          console.log(response.data.data);
          let _this = this;
          let listDetails = response.data.data.memberQueryList;
          _this.MemberInfo = listDetails;
          _this.valueLength = response.data.data.paginator.length;
          console.log(_this.MemberInfo);
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
    // 已认证
    consume() {
      this.thisconsume = false;
      this.thisonConsume = true;
      let queryData = {
        qdcrmUserId: JSON.parse(window.localStorage.getItem("userInfo"))
          .qdcrmUserId,
        access_token: JSON.parse(window.localStorage.getItem("token"))
          .access_token,
        currentPage: this.pageNumber + 1,
        authStatus: 1,
        number: Math.random()
      };
      axios
        .get(`${BASE_URL}/msmng/api/order/queryMemberInfo`, {
          params: queryData
        })
        .then(response => {
          console.log(response.data.data);
          let _this = this;
          let listDetails = response.data.data.memberQueryList;
          _this.MemberInfo = listDetails;
          _this.valueLength = response.data.data.paginator.length;
          console.log(_this.MemberInfo);
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
    // 下拉刷新上拉加载
    init() {
      // 当前页数
      let data = {
        currentPage: this.pageNumber + 1
      };
      let self = this;
      getqueryMemberInfo(data)
        .then(response => {
          checkToken();
          let res = response.data.data.memberQueryList;
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
      checkToken();
      let self = this;
      setTimeout(() => {
        let data = this.$qs.stringify({
          currentPage: self.pageNumber + 1
        });
        window.sessionStorage.setItem("page", JSON.stringify(data));
        getqueryMemberInfo(data)
          .then(response => {
            console.log(response.data);
            let res = response.data.data.memberQueryList;
            console.log(res);
            self.totalPage = response.data.data.paginator.pages;
            console.log(self.totalPage);
            self.deviceList = self.deviceList.concat(res);
            self.loading = false;
            self.pageNumber++;
            self.authNum = response.data.data.authNum;
            self.totalNum = response.data.data.totalNum;
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
  computed: {
    filterResult() {
      return this.defaultResult.filter(value =>
        new RegExp(this.value, "i").test(value)
      );
    }
  }
};
</script>
<style lang="less" scoped>
.memberInfo {
  background: #f5f5f5;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  a {
    text-decoration: none;
  }
  input {
    background: rgba(0, 0, 0, 0);
    color: #fff;
  }
  // 含未认证
  .consume {
    margin-top: -0.9rem;
    line-height: 1rem;
    img {
      width: 0.4rem;
      vertical-align: middle;
    }
  }
  .queryAgent {
    width: 70%;
    height: 1rem;
    border: 1px solid #1c8cff;
    margin-left: 15%;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    border-radius: 5px; /* no */
  }
  .cancel {
    border-radius: 5px; /* no */
  }
  .Confirm {
    border-radius: 5px; /* no */
  }
  .listTop_memberInfo {
    width: 91%;
    height: 1.1rem;
    position: absolute;
    top: 5.1rem;
    display: flex;
    flex-direction: row;
    text-align: center;
    line-height: 1.1rem;
    background: #fff;
    color: #1c8cff;
    font-size: 0.4rem;
    padding-left: 4.5%;
    padding-right: 4.5%;
    li {
      width: 100%;
      border-bottom: 0.5px solid #1c8cff; /* no */
    }
  }
  /* 列表 */
  .listTal {
    li {
      width: 90%;
      height: 1.1rem;
      text-align: center;
      line-height: 1.1rem;
      border-bottom: 1px solid #d9d9d9; /* no */
      margin-left: 5%;
      .name {
        color: #e3383e;
      }
      .blue {
        color: #1c8cff;
      }
      span {
        display: inline-block;
        width: 21%;
        font-size: 0.35rem;
        overflow: hidden;
        white-space: nowrap;
        img {
          width: 0.5rem;
          vertical-align: middle;
        }
      }
      .time {
        width: 22%;
        margin-left: 4%;
        margin-right: 3%;
        overflow: hidden;
      }
      .span {
        color: #e3383e;
        font-weight: 700;
      }
    }
    p {
      height: 2.5rem;
      line-height: 1rem;
      text-align: center;
      background: #f5f5f5;
    }
  }
}
.el-range-editor.el-input__inner {
  margin-left: -0rem;
  width: 4.5rem;
}
.search {
  border: 1px solid #fff; /* no */
  border-radius: 0.1rem;
  background: rgba(0, 0, 0, 0);
  height: 0.6rem;
  line-height: 0.6rem;
  width: 3.8rem;
  padding-left: 0.2rem;
  margin-left: 3rem;
  padding-right: 0.2rem;
  input {
    width: 3rem;
  }
  img {
    width: 0.4rem;
    display: block;
    margin-top: 0.1rem;
    float: right;
  }
}
</style>

<style lang="less">
.mint-field-core {
  direction: ltr !important;
}
.van-picker__columns {
  margin-bottom: -1.5rem;
  height: 6rem !important;
  .van-picker-column {
    margin-top: -1rem;
  }
  .van-hairline--top-bottom {
    width: 0!important;
    margin-left: 35%;
  }
}
// 加载中模块
.van-list__loading {
  margin-bottom: 2rem;
}
</style>
