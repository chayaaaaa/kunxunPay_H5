<template>
  <div class="withDarwSuccessPage">
    <!-- ============     提 交 申 请 成 功 页 面     ============ -->
    <mt-header title="提 现 详 情" fixed>
      <mt-button icon="back" @click="prev()" class="header_left" slot="left"></mt-button>
    </mt-header>
    <div class="withDarwSuccessPage_body">
      <div class="underReview_Top">
        <img src="@/assets/image/Mine/Wallet/object.png">
        <p>提现申请已提交</p>
      </div>
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
            <span>{{bankName}} 尾号 {{bankCardTailNum}}</span>
          </li>
          <li>
            到账金额
            <span>￥ {{withdrawAmount}}</span>
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
import { getRefreshToken, BASE_URL } from "@/api/api.js";
import { Toast, MessageBox } from "mint-ui";
const axios = require("axios");
export default {
  name: "withDarwSuccessPage",
  data() {
    return {
      tradeNo: "",
      gmtCreate: "", // 申请时间
      predictAccountDate: "", // 预计到账时间
      bankName: "", // 到账银行卡
      bankCardTailNum: "", // 到账银行卡尾号
      withdrawAmount: "", // 到账金额
      withdrawType: "" // 资金类型
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
  },
  watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
    $route: "getParams"
  },
  methods: {
    prev() {
      this.$router.push("/index");
    },
    getParams() {
      // 取到路由带过来的参数
      this.tradeNo = this.$route.params.item;
      console.log(this.tradeNo);
    }
  },
  mounted() {
    getRefreshToken();
    // 查询提现记录
    let data = {
      access_token: JSON.parse(window.localStorage.getItem("token"))
        .access_token,
      qdcrmUserId: JSON.parse(window.localStorage.getItem("userInfo"))
        .qdcrmUserId,
      tradeNo: this.tradeNo,
      number: Math.random()
    };
    axios
      .get(`${BASE_URL}/msmng/api/withdrawdeposit/queryWithdrawRecordDetails`, {
        params: data
      })
      .then(response => {
        console.log(response.data);
        let detailList = response.data.data;
        this.gmtCreate = detailList.gmtCreate; // 申请时间
        this.predictAccountDate = detailList.predictAccountDate; // 预计到账时间
        this.bankName = detailList.bankName; // 到账银行卡
        this.bankCardTailNum = detailList.bankCardTailNum; // 到账银行卡尾号
        this.withdrawAmount = detailList.withdrawAmount; // 到账金额
        this.withdrawType = detailList.withdrawType; // 资金类型
      })
      .catch(function(error) {
        console.log(error);
      });
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
/* 身体 */
.withDarwSuccessPage_body {
  width: 100%;
  position: absolute;
  top: 1.2rem;
  bottom: 0;
  background: #f5f5f5;
  //审核中

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
</style>
