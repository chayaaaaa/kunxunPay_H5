<template>
  <div class="successedPage">
    <!-- ==============     录 入 成 功 页 面     =============== -->
    <p>代理商信息录入成功</p>
    <ul>
      <li class="user" @click="activateTheMerchants()">激活商户</li>
      <li class="business" @click="configBusiness()">配置业务</li>
    </ul>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import { BASE_URL } from "@/api/api.js";
const axios = require("axios");
import qs from "qs";
export default {
  name: "successedPage",
  data() {
    return {};
  },
  methods: {
    activateTheMerchants() {
      var params = new URLSearchParams();
      params.append(
        "access_token",
        JSON.parse(window.localStorage.getItem("token")).access_token
      );
      params.append(
        "merchantId",
        JSON.parse(window.localStorage.getItem("messageFirstPage")).merchantId
      );
      params.append("number", Math.random());
      axios
        .post(`${BASE_URL}/msmng/api/agent/activateAgent`, params, {
          header: {
            "Access-Control-Allow-Origin": "*"
          }
        })
        .then(response => {
          console.log(response);
          Toast(response.data.message);
          window.localStorage.removeItem("messageFirstPage");
          this.$router.push('/QueryAgent')
        })
        .catch(function(err) {
          Toast(err.data.message);
        });
    },
    configBusiness() {
      this.$router.push("/BusinessConfiguration");
    }
  }
};
</script>
<style lang="less">
.successedPage {
  width: 100%;
  height: 100%;
  position: fixed;
  background: url("~@/assets/image/Manger/Agents/terminal_bg.png") no-repeat;
  background-size: 100% 100%;
  top: 0;
  bottom: 0rem;
  p {
    text-align: center;
    margin-top: 88%;
    color: #fff;
    font-size: 0.5rem;
  }
  ul {
    width: 100%;
    height: 1.2rem;
    text-align: center;
    display: flex;
    position: absolute;
    bottom: 2rem;
    li {
      width: 40%;
      height: 1.2rem;
      line-height: 1.2rem;
      border-radius: 0.2rem;
    }
    .user {
      background: #242e3e;
      margin-left: 5%;
      color: #fff;
    }
    .business {
      margin-left: 10%;
      background: #1c8cff;
      border: 1px solid #000; /* no */
    }
  }
}
</style>
