<template>
  <div class="retrunDeposit">
    <!-- ==========  押 金 返 现 页 面  ========== -->
    <div class="header">
      <img class="header_left" @click="prev()" src="@/assets/image/Manger/Agents/icn_back@2x.png">
      押金返现
    </div>
    <p>
      <img src="@/assets/image/Manger/Agents/ic-pos.png">
      {{merchantId}}-{{merchantName}}
    </p>
    <div class="retrunDeposit_body">
      <ul>
        <li>押金返现
          <van-switch
            size="15px"
            v-model="checked"
            active-color="#D9D9D9"
            inactive-color="#1c8cff"
          />
        </li>
        <li>
          金额
          <span id>元</span>
          <input id="input" type="number" v-model="money">
        </li>
      </ul>
    </div>
    <button @click="sumbit()">保存</button>
  </div>
</template>
<script>
import { getRefreshToken, BASE_URL } from "@/api/api.js";
import { MessageBox, Toast } from "mint-ui";
const axios = require("axios");
export default {
  name: "retrunDeposit",
  data() {
    return {
      checked: false,
      // 上一步带过来的数据
      qdcrmUserId: "",
      merchantName: "",
      merchantId: "",
      money: "",
      switchIcon: ""
    };
  },
  created() {
    this.getParams();
    getRefreshToken();
    this.merchantId = JSON.parse(
      window.localStorage.getItem("agentDetails")
    ).merchantId;
    this.merchantName = JSON.parse(
      window.localStorage.getItem("agentDetails")
    ).merchantName;
    let obj = {
      merchantId: JSON.parse(window.localStorage.getItem("agentDetails"))
        .merchantId,
      access_token: JSON.parse(window.localStorage.getItem("token"))
        .access_token
    };
    axios
      .get(`${BASE_URL}/msmng/api/configdepositandmpos/showDepositConfig`, {
        params: obj
      })
      .then(response => {
        console.log(response.data);
        this.money = response.data.data.depositMoney;
      })
      .catch(function(error) {
        console.log(error);
      });
  },

  watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
    $route: "getParams"
  },
  methods: {
    prev() {
      this.$router.go(-1);
    },
    getParams() {
      // 取到路由带过来的参数
      this.qdcrmUserId = this.$route.params.item;
      this.merchantName = this.$route.params.name;
      this.merchantId = this.$route.params.merchantId;
    },
    sumbit() {
      if (this.checked == false) {
        this.switchIcon = 1;
      } else {
        this.switchIcon = 0;
      }
      console.log(this.switchIcon);
      if (!this.money) {
        Toast("请输入金额");
      }
      console.log(this.checked);
      var params = new URLSearchParams();
      params.append(
        "access_token",
        JSON.parse(window.localStorage.getItem("token")).access_token
      );
      params.append("merchantId", this.merchantId);
      params.append("depositMoney", this.money);
      params.append("status", this.switchIcon);
      params.append("number", Math.random());
      axios
        .post(
          `${BASE_URL}/msmng/api/configdepositandmpos/depositConfig`,
          params,
          {
            header: {
              "Access-Control-Allow-Origin": "*"
            }
          }
        )
        .then(response => {
          console.log(response.data);
          Toast(response.data.message);
          this.$router.push("/QueryAgent");
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="less" scoped>
@blue: #1c8cff;
// allPages
.retrunDeposit {
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
  .retrunDeposit_body {
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
          width: 1rem;
          direction: ltr;
        }
      }
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
</style>

