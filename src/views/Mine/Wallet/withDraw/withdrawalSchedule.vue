<template>
  <div class="WithdrawalSchedule">
    <!-- ===========   提现进度详情   ========== -->
    <!-- 状态详细 -->
    <div class="underReview">
      <mt-header title="提 现 详 情" fixed>
        <mt-button icon="back" @click="prev()" class="header_left" slot="left"></mt-button>
      </mt-header>
      <!-- 等待银行处理 -->
      <div class="underReview_Top_Inhandle" v-if="this.reviewStatus==4">
        <ul>
          <li>
            <img src="@/assets/image/Mine/Wallet/ic-Audit .png">
          </li>
          <li></li>
          <li>
            <img src="@/assets/image/Mine/Wallet/bank-.png">
          </li>
          <li></li>
          <li>
            <img src="@/assets/image/Mine/Wallet/ic-AuditSuccess.png">
          </li>
        </ul>
        <li class="li">等待银行处理</li>
      </div>
      <!-- 提现失败 -->
      <div class="underReview_Top_Inhandle" v-if="this.reviewStatus==6 || this.reviewStatus==7 || this.reviewStatus==3">
        <ul>
          <li>
            <img src="@/assets/image/Mine/Wallet/ic-Audit .png">
          </li>
          <li></li>
          <li>
            <img src="@/assets/image/Mine/Wallet/bank-.png">
          </li>
          <li></li>
          <li>
            <img src="@/assets/image/Mine/Wallet/AuditSuccess.png">
          </li>
        </ul>
        <li class="li">提现失败（资金已退回）</li>
      </div>
      <!-- 已到账 -->
      <div class="underReview_Top_Inhandle" v-if="this.reviewStatus==5">
        <ul>
          <li>
            <img src="@/assets/image/Mine/Wallet/ic-Audit .png">
          </li>
          <li></li>
          <li>
            <img src="@/assets/image/Mine/Wallet/bank-.png">
          </li>
          <li></li>
          <li>
            <img src="@/assets/image/Mine/Wallet/ic-cash033.png">
          </li>
        </ul>
        <li class="li">已到账</li>
      </div>
      <!-- 审核中 -->
      <div class="underReview_Top_Inhandle" v-if="this.reviewStatus==1 || this.reviewStatus==2">
        <ul>
          <li>
            <img src="@/assets/image/Mine/Wallet/ic-Audit .png">
          </li>
          <li></li>
          <li>
            <img src="@/assets/image/Mine/Wallet/ic-Bank01.png">
          </li>
          <li></li>
          <li>
            <img src="@/assets/image/Mine/Wallet/ic-AuditSuccess.png">
          </li>
        </ul>
        <li class="li">审核中</li>
      </div>
      <!-- 提现拒绝 -->
<!--       <div class="underReview_Top_Inhandle" v-if="this.reviewStatus==7">
        <ul>
          <li>
            <img src="@/assets/image/Mine/Wallet/ic-Audit .png">
          </li>
          <li></li>
          <li>
            <img src="@/assets/image/Mine/Wallet/reject.png">
          </li>
          <li></li>
          <li>
            <img src="@/assets/image/Mine/Wallet/ic-AuditSuccess.png">
          </li>
        </ul>
        <li class="li">提现失败（资金已退回）</li>
      </div> -->
      <!-- 列表 -->
      <div class="underReview_Detail">
        <ul>
          <li>
            申请时间
            <span>{{gmtCreate | formatDate}}</span>
          </li>
          <li>
            预计到账时间
            <span>{{predictAccountDate | formatDate}}</span>
          </li>
          <li>
            到账银行卡
            <span>{{bankName}} ({{bankCardTailNum}})</span>
          </li>
          <li>
            到账金额
            <span>￥{{withdrawAmount}}</span>
          </li>
          <li>
            资金类型
            <span v-if="this.withdrawType == 1">分润提现</span>
            <span v-if="this.withdrawType == 2">服务费返现</span>
            <span v-if="this.withdrawType == 3">服务费返现</span>
            <span v-if="this.withdrawType == 4">激活奖励</span>
            <span v-if="this.withdrawType == 5">刷卡奖励</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { checkToken, BASE_URL } from "@/api/api.js";
import { MessageBox, Toast } from "mint-ui";
export default {
  name: "WithdrawalSchedule",
  data() {
    return {
      current: 0,
      status: 1,
      gmtCreate: "", // 申请时间
      predictAccountDate: "", // 预计到账时间
      bankName: "", // 到账银行卡
      bankCardTailNum: "", // 到账银行卡尾号
      withdrawAmount: "", // 到账金额
      withdrawType: "", // 资金类型
      reviewStatus:'', // 提现状态
    };
  },
  filters: {
    formatDate: function(value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
    }
  },
  created() {
    this.getParams();
    checkToken();
  },
  watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
    $route: "getParams"
  },
  methods: {
    prev() {
      history.go(-1);
    },
    getParams() {
      // 取到路由带过来的参数
      var list = this.$route.params.item;
      console.log(list);
      this.gmtCreate = list.gmtCreate;
      this.predictAccountDate = list.predictAccountDate;
      this.bankName = list.bankName;
      this.bankCardTailNum = list.bankCardTailNum;
      this.withdrawAmount = list.withdrawAmount;
      this.withdrawType = list.withdrawType;
      this.reviewStatus = list.reviewStatus
    }
  }
};
</script>
<style lang="less" scoped>
@blue: #1c8cff;
/* 头部 */
.mint-header {
  height: 1.2rem;
  font-size: 0.45rem;
  font-weight: 100;
  background: @blue;
}
.header_left {
  margin-left: 0.3rem;
  font-size: 0.5rem;
}
// 状态详细
//审核中
.underReview {
  position: fixed;
  top: 1.2rem;
  bottom: 0;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .underReview_Top {
    width: 100%;
    height: 4.5rem;
    background: @blue;
    padding-top: 1.5rem;
    img {
      width: 3rem;
      display: block;
      margin: 0 auto;
    }
    p {
      text-align: center;
      font-size: 0.45rem;
      margin-top: 0.5rem;
      color: #fff;
      opacity: 0.9;
      letter-spacing: 3px; /* no */
      font-weight: 300;
    }
  }
  .underReview_Detail {
    width: 100%;
    height: 5rem;
    background: #fff;
    ul {
      width: 90%;
      height: auto;
      margin: 0 auto;
      li {
        width: 100%;
        height: 1rem;
        line-height: 1rem;
        font-size: 0.4rem;
        span {
          float: right;
        }
      }
      li:nth-child(4) {
        span {
          color: @blue;
        }
      }
      li:nth-child(6) {
        span {
          color: @blue;
        }
      }
    }
  }
}
.underReview_Top_Inhandle {
  width: 100%;
  height: 3rem;
  background: url("~@/assets/image/Mine/Wallet/bj.png") no-repeat;
  background-size: 100% 100%;
  padding-top: 1rem;
  ul {
    width: 90%;
    height: 1.2rem;
    margin: 0 auto;
    li {
      width: 16%;
      height: 1.2rem;
      float: left;
      img {
        width: 1.1rem;
      }
    }
    li:nth-child(2) {
      width: 17%;
      margin-left: 3%;
      margin-right: 6%;
      height: 0.05rem;
      background: #ffffff;
      margin-top: 0.6rem;
      opacity: 0.5;
    }
    li:nth-child(4) {
      width: 17%;
      margin-left: 3%;
      margin-right: 6%;
      height: 0.05rem;
      background: #ffffff;
      margin-top: 0.6rem;
      opacity: 0.5;
    }
  }

  .li {
    text-align: center;
    color: #fff;
    font-size: 0.5rem;
    opacity: 0.9;
    font-weight: 200;
    width: 100%;
    height: 1rem;
    margin-top: 1rem;
  }
}
</style>
