<template>
  <div class="MPOSactivity">
    <!-- ==========  MPOS 活 动 页 面  ========== -->
    <div class="header">
      <img class="header_left" @click="prev()" src="@/assets/image/Manger/Agents/icn_back@2x.png">
      MPOS活动
    </div>
    <p>
      <img src="@/assets/image/Manger/Agents/ic-pos.png">
      {{merchantId}}-{{merchantName}}
    </p>
    <div class="MPOSactivity_body">
      <ul>
        <li>激活奖励
          <van-switch
            size="15px"
            v-model="showOff"
            inactive-color="#D9D9D9"
            active-color="#1c8cff"
          />
        </li>
        <li class="li">
          金额
          <span id>元</span>
          <input id="input" type="number" placeholder="请输入金额" v-model="activationMoney">
        </li>
      </ul>
      <ul class="ul">
        <li>周期任务奖励
          <van-switch size="15px" v-model="showOn" inactive-color="#D9D9D9" active-color="#1c8cff"/>
        </li>
        <li>
          第一期周期奖励金额
          <span id>元</span>
          <input id="input" type="number" placeholder="请输入金额" v-model="firstMonth">
        </li>
        <li>
          第二期周期奖励金额
          <span id>元</span>
          <input id="input" type="number" placeholder="请输入金额" v-model="secondMonth">
        </li>
        <li>
          第三期周期奖励金额
          <span id>元</span>
          <input id="input" type="number" placeholder="请输入金额" v-model="threeMonth">
        </li>
        <li>
          第四期周期奖励金额
          <span id>元</span>
          <input id="input" type="number" placeholder="请输入金额" v-model="fourMonth">
        </li>
        <li>
          第五期周期奖励金额
          <span id>元</span>
          <input id="input" type="number" placeholder="请输入金额" v-model="fiveMonth">
        </li>
        <li>
          第六期周期奖励金额
          <span id>元</span>
          <input id="input" type="number" placeholder="请输入金额" v-model="sixMonth">
        </li>
      </ul>
    </div>
    <button @click="save()">保存</button>
  </div>
</template>
<script>
import { Toast, MessageBox } from "mint-ui";
import { getRefreshToken, BASE_URL } from "@/api/api.js";
const axios = require("axios");
export default {
  name: "MPOSactivity",
  data() {
    return {
      merchantId: "",
      merchantName: "",
      activationMoney: "", //激活奖励金额
      activationStatus: "", //激活奖励活动状态（是否开启0：开启，1：关闭）
      cycleStatus: "", // 追加返现状态（是否开启0：开启，1：关闭）
      firstMonth: "", //第一个月返现金额
      secondMonth: "", //第二
      threeMonth: "", //第三
      fourMonth: "", //第四
      fiveMonth: "", //第五
      sixMonth: "", //第六
      showOff: false,
      showOn: false
    };
  },
  methods: {
    prev() {
      this.$router.go(-1);
    },
    save() {
      /*  MessageBox("上级商户未配置业务！"); */
      if (this.showOff == false) {
        this.activationStatus = 1;
      } else {
        this.activationStatus = 0;
      }
      if (this.showOn == false) {
        this.cycleStatus = 1;
      } else {
        this.cycleStatus = 0;
      }
      console.log(this.activationStatus);
      console.log(this.cycleStatus);
      if (!this.firstMonth) {
        Toast("请设置第一期周期奖励金额");
        return;
      }
      if (!this.secondMonth) {
        Toast("请设置第二期周期奖励金额");
        return;
      }
      if (!this.threeMonth) {
        Toast("请设置第三期周期奖励金额");
        return;
      }
      if (!this.fourMonth) {
        Toast("请设置第四期周期奖励金额");
        return;
      }
      if (!this.fiveMonth) {
        Toast("请设置第五期周期奖励金额");
        return;
      }
      if (!this.sixMonth) {
        Toast("请设置第六期周期奖励金额");
        return;
      }
      var params = new URLSearchParams();
      params.append(
        "access_token",
        JSON.parse(window.localStorage.getItem("token")).access_token
      );
      params.append("merchantId", this.merchantId);
      params.append("activationMoney", this.activationMoney);
      params.append("activationStatus", this.activationStatus);
      params.append("cycleStatus", this.cycleStatus);
      params.append("firstMonth", this.firstMonth);
      params.append("secondMonth", this.secondMonth);
      params.append("threeMonth", this.threeMonth);
      params.append("fourMonth", this.fourMonth);
      params.append("fiveMonth", this.fiveMonth);
      params.append("sixMonth", this.sixMonth);
      params.append("number", Math.random());
      axios
        .post(
          `${BASE_URL}/msmng/api/configdepositandmpos/mposActivityConfig`,
          params,
          {
            header: {
              "Access-Control-Allow-Origin": "*"
            }
          }
        )
        .then(response => {
          console.log(response.data);
          if (response.data.code == 200) {
            Toast(response.data.message);
            this.$router.push("/QueryAgent");
          } else {
            Toast(response.data.message);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  created() {
    getRefreshToken();
    this.merchantId = JSON.parse(
      window.localStorage.getItem("agentDetails")
    ).merchantId;
    this.merchantName = JSON.parse(
      window.localStorage.getItem("agentDetails")
    ).merchantName;
    let queryData = {
      merchantId: JSON.parse(window.localStorage.getItem("agentDetails"))
        .merchantId,
      access_token: JSON.parse(window.localStorage.getItem("token"))
        .access_token,
      number: Math.random()
    };
    console.log(queryData);
    axios
      .get(
        `${BASE_URL}/msmng/api/configdepositandmpos/showMposActivityConfig`,
        {
          params: queryData
        }
      )
      .then(response => {
        console.log(response.data);
        let res = response.data.data;
        this.activationMoney = res.activationMoney;
        this.activationStatus = res.activationStatus;
        this.cycleStatus = res.cycleStatus;
        this.firstMonth = res.firstMonth;
        this.secondMonth = res.secondMonth;
        this.threeMonth = res.threeMonth;
        this.fourMonth = res.fourMonth;
        this.fiveMonth = res.fiveMonth;
        this.sixMonth = res.sixMonth;
      })
      .catch(function(error) {
        console.log(error);
      });
  }
};
</script>
<style lang="less" scoped>
@blue: #1c8cff;
// allPages
.MPOSactivity {
  background: #f5f5f5;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  /* 头部 */
  .header {
    height: 1.2rem;
    font-size: 0.4rem;
    font-weight: 100;
    background: @blue;
    color: #fff;
    text-align: center;
    line-height: 1.2rem;
    font-weight: 500;
  }
  .header_left {
    width: 0.4rem;
    position: absolute;
    left: 0.5rem;
    top: 0.45rem;
  }
  p {
    color: @blue;
    line-height: 1.2rem;
    margin-left: 0.5rem;
    font-size: 0.38rem;
    img {
      vertical-align: middle;
      width: 0.5rem;
      margin-right: 0.2rem;
    }
  }
  .MPOSactivity_body {
    position: absolute;
    width: 100%;
    top: 2.4rem;
    ul {
      width: 100%;
      height: auto;
      background: #fff;
      li {
        width: 90%;
        height: 1.2rem;
        margin: 0 auto;
        line-height: 1.2rem;
        border-bottom: 1px solid #d9d9d9; /* no */
        font-size: 0.38rem;
        .van-switch {
          float: right;
          margin-top: 0.4rem;
        }
        span {
          display: block;
          float: right;
        }
        #input {
          float: right;
          width: 2.2rem;
          direction: rtl;
          margin-right: 0.1rem;
        }
      }
      .li {
        border: none;
      }
    }
    .ul {
      margin-top: 0.5rem;
    }
  }
  button {
    position: absolute;
    bottom: 1rem;
    width: 90%;
    height: 1rem;
    margin: 0 auto;
    left: 0;
    right: 0;
    border: none;
    background: #1c8cff;
    border-radius: 5px; /* no */
    color: #fff;
    font-size: 0.37rem;
  }
}
</style>
<style lang="less">
.mint-header-title {
  overflow: visible;
}
.mintui {
  font-size: 0.4rem;
}
/* toast */
.mint-msgbox {
  height: 4.5rem;
  border-radius: 0.2rem;
}
.mint-msgbox-header {
  height: 2.6rem;
  line-height: 2.6rem;
  border: none;
}
.mint-msgbox-title {
  font-size: 0.4rem;
  font-weight: 400;
}
.mint-msgbox-btns {
  height: 1rem;
  width: 80%;
  margin-left: 10%;
}
.mint-msgbox-confirm {
  background: #1c8cff;
  color: white;
  border-radius: 0.2rem;
}
</style>

