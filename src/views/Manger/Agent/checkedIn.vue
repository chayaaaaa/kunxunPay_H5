<template>
  <div class="checkedIn">
    <!-- ============  代理利润详情页面 ============ -->
    <mt-header title="代理利润" fixed>
      <mt-button icon="back" @click="prev()" slot="left"></mt-button>
    </mt-header>
    <div class="title">
      <img src="@/assets/image/Manger/Agents/ic-baseMsg.png">
      <span>{{merchantId}} - {{merchantName}}</span>
    </div>
    <div class="listDetail">
      <ul>
        <li>
          总利润
          <span>￥{{itemList.allProfit}}</span>
        </li>
        <!-- 0开头 -->
        <li v-if="itemList['0021']">
          信用卡代换
          <span>￥{{itemList['0021']}}</span>
        </li>
        <!-- 8开头 -->
        <li v-if="itemList[8101]">
          押金返现
          <span>￥{{itemList[8101]}}</span>
        </li>
        <li v-if="itemList[8102]">
          M7 POS押金返现
          <span>￥{{itemList[8102]}}</span>
        </li>
        <li v-if="itemList[8103]">
          M7 POS激活返现
          <span>￥{{itemList[8103]}}</span>
        </li>
        <li v-if="itemList[8104]">
          M7 POS刷卡返现
          <span>￥{{itemList[8104]}}</span>
        </li>
        <!-- 3开头 -->
        <li v-if="itemList[3022]">
          个人收款（T+1）
          <span>￥{{itemList[3022]}}</span>
        </li>
        <li v-if="itemList[3043]">
          及时收款-急速民生（T+0）
          <span>￥{{itemList[3043]}}</span>
        </li>
        <li v-if="itemList[3044]">
          实时收款-急速民生（T+1）
          <span>￥{{itemList[3044]}}</span>
        </li>
        <li v-if="itemList[3080]">
          跨界支付收款-积分
          <span>￥{{itemList[3080]}}</span>
        </li>
        <li v-if="itemList[3081]">
          快捷支付收款-无积分
          <span>￥{{itemList[3081]}}</span>
        </li>
        <li v-if="itemList[3126]">
          普通收款-急速（T+1）
          <span>￥{{itemList[3126]}}</span>
        </li>
        <!-- 6开头 -->
        <li v-if="itemList[6020]">
          渠道无卡（T+0）
          <span>￥{{itemList[6020]}}</span>
        </li>
        <li v-if="itemList[6666]">
          新信用卡代换
          <span>￥{{itemList[6666]}}</span>
        </li>
        <!-- 7开头 -->
        <li v-if="itemList[7010]">
          渠道接入T0
          <span>￥{{itemList[7010]}}</span>
        </li>
        <li v-if="itemList[7110]">
          渠道接入T1
          <span>￥{{itemList[7110]}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { checkToken, BASE_URL } from "@/api/api.js";
import { MessageBox, Toast } from "mint-ui";
const axios = require("axios");
export default {
  name: "checkedIn",
  data() {
    return {
      itemList: "", // 传递过来的数据
      merchantId: "", // 商户号
      merchantName: "" // 商户名
    };
  },
  created() {
    checkToken();
      var checkInList = JSON.parse(window.localStorage.getItem("checkInList"));
          this.itemList = checkInList;
      this.merchantId = this.itemList.merchantId;
      this.merchantName = this.itemList.merchantName;
  },
  methods: {
    prev() {
      this.$router.go(-1);
    },
  }
};
</script>
<style lang="less" scoped>
@blue: #1c8cff;
/* 头部 */
.mint-header {
  height: 1.2rem;
  font-size: 0.5rem;
  font-weight: 100;
  background: @blue;
}
.mint-button {
  font-size: 0.35rem !important;
}
.header_left {
  margin-left: 0.3rem;
}
.mintui {
  font-size: 0.4rem;
}
/* 整个页面 */
.checkedIn {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  background: #f5f5f5;
  /* 身体 */
  .title {
    width: 100%;
    height: 1rem;
    margin-top: 1.2rem;
    line-height: 1rem;
    img {
      width: 0.5rem;
      margin-left: 0.5rem;
      vertical-align: middle;
      margin-right: 0.1rem;
    }
    span {
      color: #1c8cff;
      font-size: 0.35rem;
    }
  }
  /* 内容详细 */
  .listDetail {
    width: 90%;
    height: auto;
    margin: 0 auto;
    ul {
      width: 100%;
      height: auto;
      background: #fff;
      border-radius: 5px; /* no */
      box-shadow: 0px 3px 10px #bcbcbc;
      li:nth-child(1) {
        height: 1.5rem;
        line-height: 1.5rem;
        font-size: 0.4rem;
        letter-spacing: 0.05rem;
        border-bottom: 1px solid #d9d9d9;
        span {
          margin-right: 5.5rem;
          color: #e3383e;
          letter-spacing: 0rem;
          font-size: 0.4rem;
        }
      }
      li {
        width: 90%;
        height: 1rem;
        line-height: 1rem;
        margin: 0 auto;
        font-size: 0.38rem;
        span {
          float: right;
          font-size: 0.35rem;
        }
      }
    }
  }
}
</style>
