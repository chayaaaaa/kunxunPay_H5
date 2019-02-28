<template>
  <div class="dealDetail">
    <!-- ==================   交 易 详 情 页 面   ==================-->
    <mt-header title="交 易 详 情" fixed>
      <mt-button icon="back" @click="prev()" slot="left"></mt-button>
    </mt-header>
    <div class="content">
      <p v-for="item in title" :key="item.e">{{item.name}}</p>
      <div class="listContent">
        <div class="dealCount" v-for="item in count" :key="item.f">
          <li>
            交易金额
            <span class="count">{{item.count}}</span>
          </li>
        </div>
        <ul class="list" v-for="item in list" :key="item.e">
          <li>
            会员号
            <span>{{item.userNumber}}</span>
          </li>
          <li>
            会员名
            <span>{{item.userName}}</span>
          </li>
          <li>
            终端号
            <span>{{item.Terminal}}</span>
          </li>
          <li>
            序列号
            <span>{{item.Serial}}</span>
          </li>
          <li>
            交易订单号
            <span>{{item.TradeNumber}}</span>
          </li>
          <li>
            支付方式
            <span>{{item.payment}}</span>
          </li>
          <li>
            交易状态
            <span class="status">{{item.dealStatus}}</span>
          </li>
          <li>
            下单时间
            <span>{{item.dealTime}}</span>
          </li>
          <li>
            付款时间
            <span>{{item.PayTime}}</span>
          </li>
        </ul>
        <ul class="lists" v-for="item in list" :key="item.e">
          <li>
            <b>摘要</b>
            <span>{{item.abstract}}</span>
          </li>
          <li>
            <b>备注</b>
            <span>{{item.remark}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "dealDetail",
  data() {
    return {
      title: [
        {
          // 交易金额
          name: "实时收款-极速民生（T+0）"
        }
      ],
      count: [
        {
          count: "￥5000.00"
        }
      ],
      list: [
        {
          // 会员号
          userNumber: "138****5678",
          // 会员名
          userName: "*华腾",
          // 终端号
          Terminal: "T0303064",
          // 序列号
          Serial: "9988008000002851",
          // 交易订单号
          TradeNumber: "18020619441200100327",
          // 支付方式
          payment: "银行卡",
          // 交易状态
          dealStatus: "交易成功",
          // 下单时间
          dealTime: "2017-12-31 16:35:56",
          // 付款时间
          PayTime: "2018-02-06 19:44:56",
          // 摘要
          abstract:
            "实时收款-极速民生(T+0)-137****8000-金额-20000.00-收款方-137****8000",
          // 备注
          remark: "购物贷款"
        }
      ]
    };
  },
  methods: {
    prev() {
      this.$router.go(-1);
    }
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
          }
        }
      }
      .lists {
        width: 90%;
        height: auto;
        margin-left: 5%;
        font-size: 0.35rem;
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
  .status{
      color: #1C8CFF;
  }
  .count{
      color: #E3383E;
  }
}
</style>
