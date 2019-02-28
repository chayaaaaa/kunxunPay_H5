<template>
  <div class="Wallet">
    <!-- =================      我 的 钱 包 页 面        ================= -->
    <mt-header title="我 的 钱 包" fixed v-show="current==1 || current==2">
      <mt-button icon="back" @click="prev()" class="header_left" slot="left"></mt-button>
      <mt-button slot="right" class="detail" @click="showfinancialDetail()">明细</mt-button>
    </mt-header>
    <!-- 账户余额 -->
    <div class="Balance" v-show="current==1 || current==2">
      <p>
        <img src="@/assets/image/Mine/ic-balance.png">账户余额
      </p>
      <p>{{totalCashMoney}}</p>
      <ul>
        <li @click="goToBankCardPages()">银行卡</li>
        <li @click="goTowithDrawPages()">提现</li>
      </ul>
    </div>
    <!-- 自营余额 & 下级余额 -->
    <div class="remaining" v-show="current==1 || current==2">
      <ul>
        <li @click="current=1" :class="{'curr':current == 1}">自营余额
          <p v-show="current==1"></p>
        </li>
        <li @click="current=2" :class="{'curr':current == 2}">下级余额
          <p v-show="current==2"></p>
        </li>
      </ul>
    </div>
    <!-- 详细 -->
    <div class="remaining_detail" v-show="current==1 || current==2">
      <li>总余额(元)</li>
      <li v-if="current==1">{{ownerBalanceMoney}}</li>
      <li v-if="current==2">{{lowerBalanceMoney}}</li>
      <ul class="left">
        <p>服务费返现(元)</p>
        <p v-if="current==1">{{ownerDpositMoney}}</p>
        <p v-if="current==2">{{lowerDpositMoney}}</p>
        <p>激活奖励(元)</p>
        <p v-if="current==1">{{ownerMposMoney}}</p>
        <p v-if="current==2">{{lowerMposMoney}}</p>
      </ul>
      <ul class="right">
        <p>刷卡奖励(元)</p>
        <p v-if="current==1">{{ownerSwipingCardMoney}}</p>
        <p v-if="current==2">{{lowerSwipingCardMoney}}</p>
        <p>分润收益(元)</p>
        <p v-if="current==1">{{ownerProfitMoney}}</p>
        <p v-if="current==2">{{lowerProfitMoney}}</p>
      </ul>
    </div>
  </div>
</template>
<script>
import { MessageBox, Toast } from "mint-ui";
import "@/CSSFILE/alert.css";
import {
  queryDrawPermissions,
  getCashDetails,
  getRefreshToken,
  BASE_URL,
  returnAuthStatus
} from "@/api/api.js";
export default {
  name: "Wallet",
  data() {
    return {
      current: 1,
      allowDraw: "", // 是否具备提现权限（0/否 1/是）
      allowSubDraw: "", // 是否开启下级提现权限（0/否 1/是）
      meetCashNeeds: "", // 是否满足提现金额需求（0/否 1/是）
      totalCashMoney: "", // 账户余额
      // 自营余额
      ownerBalanceMoney: "", // 总余额
      ownerDpositMoney: "", // 服务费返现
      ownerMposMoney: "", // 激活奖励
      ownerSwipingCardMoney: "", // 刷卡奖励
      ownerProfitMoney: "", //  分润余额
      // 下级余额
      lowerBalanceMoney: "", // 总余额
      lowerDpositMoney: "", // 服务费返现
      lowerMposMoney: "", // 激活奖励
      lowerSwipingCardMoney: "", // 刷卡奖励
      lowerProfitMoney: "" // 分润余额
    };
  },
  methods: {
    prev() {
      history.go(-1);
    },
    // 银行卡
    goToBankCardPages() {
      this.$router.push("/BKManagement");
    },
    // 提现
    showfinancialDetail() {
      returnAuthStatus().then(response => {
        console.log(response.data);
        if (response.data.data == 1) {
          this.$router.push("/financialDetail");
        } else {
          MessageBox("实名认证通过后才能提现");
        }
      });
    },
    goTowithDrawPages() {
      if (
        this.allowDraw == 0 ||
        this.meetCashNeeds == 0 ||
        this.allowSubDraw == 0
      ) {
        MessageBox("不可提现");
      } else {
        this.$router.push("/withDraw");
      }
    }
  },
  mounted() {
    getRefreshToken();
    queryDrawPermissions()
      .then(response => {
        console.log(response.data);
        this.allowDraw = response.data.allowDraw;
        this.allowSubDraw = response.data.allowSubDraw;
        this.meetCashNeeds = response.data.meetCashNeeds;
      })
      .catch(function(error) {
        console.log(response.message);
      });
    getCashDetails()
      .then(response => {
        console.log(response.data.data);
        let res = response.data.data;
        this.totalCashMoney = res.totalCashMoney;
        // 自营
        this.ownerBalanceMoney = res.ownerBalanceMoney;
        this.ownerDpositMoney = res.ownerDpositMoney;
        this.ownerMposMoney = res.ownerMposMoney;
        this.ownerSwipingCardMoney = res.ownerSwipingCardMoney;
        this.ownerProfitMoney = res.ownerProfitMoney;
        // 下级
        this.lowerBalanceMoney = res.lowerBalanceMoney;
        this.lowerDpositMoney = res.lowerDpositMoney;
        this.lowerMposMoney = res.lowerMposMoney;
        this.lowerSwipingCardMoney = res.lowerSwipingCardMoney;
        this.lowerProfitMoney = res.lowerProfitMoney;
      })
      .catch(function(error) {
        console.log(response.message);
      });
  }
};
</script>
<style lang="less" scoped>
@blue: #1c8cff;
/* 头部 */
.mint-header {
  height: 1.2rem;
  font-size: 0.4rem;
  font-weight: 100;
  background: @blue;
}
.header_left {
  margin-left: 0.3rem;
}
.detail {
  font-size: 0.3rem;
  margin-right: 0.3rem;
}
/* 账户余额 */
.Balance {
  width: 100%;
  position: absolute;
  top: 1.2rem;
  height: 4rem;
  background: @blue;
  text-align: center;
  color: #fff;
  img {
    width: 0.5rem;
    vertical-align: middle;
    margin-right: 0.1rem;
  }
  p {
    width: 100%;
    margin-top: 0.3rem;
    font-size: 0.35rem;
  }
  p:nth-child(2) {
    font-size: 0.5rem;
  }
  p:nth-child(1) {
    margin-top: 0.5rem;
  }
  ul {
    width: 100%;
    height: 1rem;
    position: absolute;
    bottom: 0.3rem;
    li {
      height: 1rem;
      width: 50%;
      float: left;
      line-height: 1rem;
      font-size: 0.4rem;
      vertical-align: middle;
      img {
        width: 0.6rem;
        margin-right: 0.2rem;
      }
    }
    li:nth-child(1) {
      border-right: 1px solid #8accff; /* no */
      width: 48.7%;
      background: url("~@/assets/image/Mine/ic-bank.png") no-repeat;
      background-position: 25% center;
      background-size: 0.6rem;
    }
    li:nth-child(2) {
      background: url("~@/assets/image/Mine/ic-put.png") no-repeat;
      background-position: 30% center;
      background-size: 0.6rem;
    }
  }
}
/* 自营余额 & 下级余额 */
.remaining {
  width: 100%;
  height: 1.2rem;
  position: absolute;
  top: 5.2rem;
  ul {
    li {
      width: 50%;
      height: 1.2rem;
      line-height: 1.2rem;
      float: left;
      text-align: center;
      color: #9b9b9b;
      font-size: 0.4rem;
      p {
        width: 10%;
        height: 0.05rem;
        background: #1c8cff;
        margin: 0 auto;
      }
    }
  }
  .curr {
    color: #1c8cff;
  }
}
.remaining_detail {
  width: 100%;
  height: 7rem;
  position: absolute;
  top: 6.42rem;
  background: #f5f5f5;
  text-align: center;
  li {
    width: 100%;
    font-size: 0.4rem;
    height: 0.5rem;
    line-height: 0.5rem;
    color: #1c8cff;
  }
  li:nth-child(1) {
    margin-top: 1rem;
    color: #70b4f0;
  }
  li:nth-child(2) {
    margin-top: 0.3rem;
    font-size: 0.5rem;
  }
  ul {
    width: 50%;
    height: 3rem;
    float: left;
    margin-top: 1rem;
  }
  .left {
    width: 48.7%;
    border-right: 1px solid #d9d9d9; /* no */
    p {
      width: 100%;
      font-size: 0.35rem;
      color: #9b9b9b;
    }
    p:nth-child(2) {
      color: #606060;
      font-size: 0.45rem;
      margin-top: 0.3rem;
    }
    p:nth-child(3) {
      margin-top: 0.8rem;
    }
    p:nth-child(4) {
      color: #606060;
      font-size: 0.45rem;
      margin-top: 0.3rem;
    }
  }
  .right {
    p {
      width: 100%;
      font-size: 0.35rem;
      color: #9b9b9b;
    }
    p:nth-child(2) {
      color: #606060;
      font-size: 0.45rem;
      margin-top: 0.3rem;
    }
    p:nth-child(3) {
      margin-top: 0.8rem;
    }
    p:nth-child(4) {
      color: #606060;
      font-size: 0.45rem;
      margin-top: 0.3rem;
    }
  }
}
</style>
<style lang="less">
.mint-header-title {
  height: 1rem;
  line-height: 1rem;
}
</style>
