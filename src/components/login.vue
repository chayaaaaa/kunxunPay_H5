<template>
  <div class="login">
    <img class="logo" src="@/assets/image/login/logo.png">
    <img class="ic-logo" src="@/assets/image/login/ic-logo.png">
    <img class="bg" src="@/assets/image/login/bg.png">
    <p class="login_p">综合业务管理平台</p>
    <form class="logoInput">
      <input
        type="text"
        class="user"
        placeholder="请输入分润管理账户账号"
        id="name"
        v-model="name"
        @focus="inputFocus()"
      >
      <input
        type="password"
        class="pwd"
        placeholder="输入分润管理账户密码"
        id="pwd"
        v-model="pwd"
        @focus="inputFocus()"
      >
      <button class="btn" @click.prevent="login()">登录</button>
    </form>
    <p>支付许可证编号：Z2004951000010</p>
  </div>
</template>

<script>
import "@/CSSFILE/common.css";
import { BASE_URL } from "@/api/api.js";
import { Toast, MessageBox } from "mint-ui";
const axios = require("axios");
export default {
  name: "login",
  data() {
    return {
      name: "", // 用户名
      pwd: "" // 密码
    };
  },
  methods: {
    inputFocus() {
      var dom = document.getElementById("name");
      var pwd = document.getElementById("pwd");
      setTimeout(function() {
        dom.scrollIntoView(true);
        dom.scrollIntoViewIfNeeded();
        pwd.scrollIntoView(true);
        pwd.scrollIntoViewIfNeeded();
      }, 500);
    },
    login() {
      //  校验
      if (!this.name) {
        Toast("请输入用户名!");
        return;
      } else if (!this.pwd) {
        Toast("请输入密码!");
        return;
      }
      var params = new URLSearchParams();
      params.append("username", this.name);
      params.append("password", this.pwd);
      params.append("number", Math.random());
      axios
        .post(`${BASE_URL}/api/oauth/login`, params, {
          header: {
            "Access-Control-Allow-Origin": "*"
          }
        })
        .then(response => {
          console.log(response.data);
          console.log(response.data.code);
          if (response.data.code == 200) {
            window.localStorage.setItem(
              "userInfo",
              JSON.stringify(response.data.data)
            );
            window.localStorage.setItem(
              "loginInfo",
              JSON.stringify({
                name: this.name,
                pwd: this.pwd
              })
            );
            window.localStorage.setItem(
              "token",
              JSON.stringify(response.data.token)
            );
            this.$router.push("/index");
          }
        })
        .catch(function(error) {
          Toast(error);
        });
    }
  },
  mounted() {
    this.$commonJS.inputBlur();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.login {
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  background: url("~@/assets/image/login/bj.png") no-repeat;
  background-size: 100% 100%;
  .logo {
    width: 60%;
    height: 1rem;
    position: absolute;
    left: 20%;
    right: 20%;
    top: 12rem;
  }
  .ic-logo {
    height: 2.3rem;
    width: 24%;
    position: absolute;
    top: 2rem;
    left: 38%;
    right: 38%;
  }
  .bg {
    width: 25%;
    height: 0.6rem;
    position: absolute;
    top: 5.2rem;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
  .login_p {
    width: 100%;
    height: 0.5rem;
    position: absolute;
    top: 4.5rem;
    font-size: 0.4rem;
    letter-spacing: 0.04rem;
    font-weight: 500;
  }
  .logoInput {
    width: 70%;
    height: 4.6rem;
    background: #fff;
    position: absolute;
    top: 6.2rem;
    left: 0;
    right: 0;
    margin: 0 auto;
    border-radius: 20px; /* no */
    padding: 0 0.6rem;
    box-shadow: 0px 5px 5px #2376cb; /* no */
    input {
      width: 70%;
      height: 1rem;
      border-bottom: 1px solid #d9d9d9; /* no */
      margin-top: 0.3rem;
      padding: 0 1rem;
      outline: none;
      font-size: 0.4rem;
      line-height: 1.2rem;
    }
    .user {
      background: url("~@/assets/image/login/user.png") no-repeat 0.2rem 0.2rem;
      background-size: 0.6rem 0.6rem;
      margin-top: 1rem;
    }
    .pwd {
      background: url("~@/assets/image/login/pwd.png") no-repeat 0.2rem 0.2rem;
      background-size: 0.6rem 0.6rem;
    }
    .btn {
      width: 35%;
      height: 1rem;
      position: absolute;
      top: 4rem;
      left: 32.5%;
      right: 32.5%;
      border-radius: 20px; /* no */
      border: none;
      background: #1eb7ff;
      box-shadow: 0px 5px 2px #2376cb;
      color: #fff;
      outline: none;
      font-size: 0.45rem;
    }
  }
  p {
    width: 100%;
    position: absolute;
    top: 13.5rem;
    text-align: center;
    color: #fff;
    font-weight: 300;
    font-size: 0.35rem;
  }
}
</style>
