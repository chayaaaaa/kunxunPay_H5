<template>
  <div class="dealDetail">
    <!-- ==================   交 易 详 情 页 面   ==================-->
    <mt-header title="交 易 详 情" fixed>
      <mt-button icon="back" @click="prev()" slot="left"></mt-button>
    </mt-header>
    <div class="content">
      <p>{{name}}</p>
      <div class="listContent">
        <div class="dealCount">
          <li>
            交易金额
            <span class="count">￥{{count}}</span>
          </li>
        </div>
        <ul class="list">
          <li>
            会员号
            <span>{{userNumber}}</span>
          </li>
          <li>
            会员名
            <span>{{userName}}</span>
          </li>
          <li>
            终端号
            <span>{{Terminal}}</span>
          </li>
          <li>
            序列号
            <span>{{Serial}}</span>
          </li>
          <li>
            交易订单号
            <span>{{TradeNumber}}</span>
          </li>
          <li>
            支付方式
            <span>{{payment}}</span>
          </li>
          <!--     <li>
            交易状态
            <span class="status">{{dealStatus}}</span>
          </li>-->
          <li>
            下单时间
            <span>{{dealTime}}</span>
          </li>
          <li>
            付款时间
            <span>{{PayTime}}</span>
          </li>
        </ul>
        <ul class="lists">
          <li>
            <b>摘要</b>
            <span>{{abstract}}</span>
          </li>
          <li>
            <b>备注</b>
            <span>{{remark}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
const axios = require("axios");
import { checkToken, BASE_URL } from "@/api/api.js";
export default {
  name: "dealDetail",
  data() {
    return {
      // 交易金额
      name: "",
      count: "",
      // 会员号
      userNumber: "",
      // 会员名
      userName: "",
      // 终端号
      Terminal: "",
      // 序列号
      Serial: "",
      // 交易订单号
      TradeNumber: "",
      // 支付方式
      payment: "",
      // 交易状态
      dealStatus: "",
      // 下单时间
      dealTime: "",
      // 付款时间
      PayTime: "",
      // 摘要
      abstract: "",
      // 备注
      remark: ""
    };
  },
  methods: {
    prev() {
      this.$router.go(-1);
    }
  },
  created() {
    checkToken();
    //获取当前时间
    var myDate = new Date();
    var Y = myDate.getFullYear() + "-";
    var M =
      (myDate.getMonth() + 1 < 10
        ? "0" + (myDate.getMonth() + 1)
        : myDate.getMonth() + 1) + "-";
    var D = myDate.getDate() + " ";
    D = D < 10 ? "0" + D : D;
    let access_token = JSON.parse(window.localStorage.getItem("token"))
      .access_token;
    let qdcrmUserId = JSON.parse(window.localStorage.getItem("userInfo"))
      .qdcrmUserId;
    let gmtStart = Y + M + "01";
    let gmtEnd = Y + M + D;
    let orderNo = JSON.parse(window.localStorage.getItem("orderNo"));
    console.log(orderNo);
    let queryData = {
      orderNo: orderNo,
      access_token: JSON.parse(window.localStorage.getItem("token"))
        .access_token,
      gmtStart: gmtStart,
      gmtEnd: gmtEnd,
      currentPage: 1,
      number: Math.random()
    };
    axios
      .get(`${BASE_URL}/msmng/api/order/queryTradeOrderDetails`, {
        params: queryData
      })
      .then(response => {
        console.log(response.data.data);
        let res = response.data.data;
        this.count = res.transAmount;
        this.name = res.bizType;
        this.userNumber = res.memberNo;
        this.userName = res.memberName;
        this.Terminal = res.termNo;
        this.Serial = res.snId;
        this.TradeNumber = res.orderNo;
        this.payment = res.payMode;
        this.dealTime = res.createTime;
        this.PayTime = res.payTime;
        this.abstract = res.transAbs;
        this.remark = res.memo;
      })
      .catch(function(error) {
        console.log(error);
      });
  }
};
</script>
<style lang="less" scoped>
.dealDetail {
  background: #f5f5f5;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  /* ==============       header        ============= */
  .mint-header {
    height: 1.2rem;
    font-size: 0.4rem;
    font-weight: 100;
    background: #1c8cff;
    padding-left: 5%;
    padding-right: 5%;
  }
  .mint-header-title {
    line-height: 1rem;
  }
  .mint-botton-text {
    font-size: 0.3rem !important;
  }
  .mintui {
    font-size: 0.4rem;
  }
  .content {
    width: 100%;
    p {
      margin-left: 5%;
      width: 100%;
      height: 1.2rem;
      line-height: 1.2rem;
      font-size: 0.4rem;
      color: #1c8cff;
    }
    position: absolute;
    top: 1.2rem;
    bottom: 0;
    .listContent {
      width: 90%;
      height: 12rem;
      border-radius: 0.1rem;
      box-shadow: 0 5px 5px #cacaca;
      background: #fff;
      margin-left: 5%;
      color: #222222;
      .dealCount {
        width: 90%;
        height: 1.2rem;
        margin-left: 5%;
        line-height: 1.2rem;
        border-bottom: 1px solid #d9d9d9;
        li {
          font-size: 0.45rem;
        }
      }
      .list {
        width: 90%;
        height: auto;
        margin-left: 5%;
        border-bottom: 1px solid #d9d9d9;
        li {
          line-height: 0.8rem;
          height: 0.8rem;
          font-size: 0.4rem;
          span {
            float: right;
            font-size: 0.354rem;
          }
        }
      }
      .lists {
        width: 90%;
        height: auto;
        margin-left: 5%;
        li {
          height: 1.5rem;
          margin-top: 0.2rem;
          text-align: left;
          font-size: 0.4rem;
        }
        li span {
          display: inline-block;
          width: 80%;
          height: 1.5rem;
          line-height: 0.5rem;
           font-size: 0.35rem;
        }
        li b {
          display: block;
          width: 10%;
          height: 1.5rem;
          float: left;
          margin-right: 0.5rem;
        }
      }
    }
  }
  .status {
    color: #1c8cff;
  }
  .count {
    color: #e3383e;
    font-size: 0.45rem;
  }
}
</style>
