<template>
  <div class="forgetPWD">
    <!-- =================      设 置 页 面        ================= -->
    <mt-header title="设 置" fixed>
      <mt-button icon="back" @click="prev()" class="header_left" slot="left"></mt-button>
    </mt-header>
    <!-- 忘记密码 -->
    <div class="forgetPWD" v-if="autoCode==true">
      <mt-header title="忘 记 密 码" fixed>
        <mt-button icon="back" @click="prev()" class="header_left" slot="left"></mt-button>
      </mt-header>
      <div class="inputList">
        <p>验证手机后修改支付密码</p>
        <van-cell-group>
          <van-field v-model="phone" type="tel" label="手机号" disabled/>
          <van-field v-model="sms" center clearable label="短信验证码" placeholder="请输入短信验证码">
            <van-button
              slot="button"
              v-show="sendAuthCode"
              size="small"
              type="primary"
              @click="getCode()"
            >获取验证码</van-button>
            <van-button
              slot="button"
              v-show="!sendAuthCode"
              size="small"
              type="primary"
              @click="getCode()"
            >{{auth_time}}S</van-button>
          </van-field>
        </van-cell-group>
        <button class="accomplish" @click="sumbitPWD()">下一步</button>
      </div>
    </div>
    <!-- 设置密码 -->
    <div class="payPassWord" v-if="showSettingNewPWD==true">
      <div class="inputList">
        <p>设置支付密码，用以支付验证</p>
        <van-cell-group>
          <van-field v-model="newpassword" type="password" label="新密码" placeholder="请输入新密码"/>
        </van-cell-group>
        <van-cell-group>
          <van-field v-model="surepassword" type="password" label="确认密码" placeholder="请确认新密码"/>
        </van-cell-group>
        <button class="accomplish" @click="sumbit()">确定</button>
      </div>
    </div>
  </div>
</template>
<script>
import { checkToken, BASE_URL } from "@/api/api.js";
import { MessageBox, Toast } from "mint-ui";
const axios = require("axios");
import md5 from "js-md5";
export default {
  name: "forgetPWD",
  data() {
    return {
      phone: JSON.parse(window.localStorage.getItem("userInfo")).mobile,
      sms: "",
      showSettingNewPWD: false, // 控制显示设密码
      autoCode: true, // 显示获取验证码
      newpassword: "", // 新密码
      surepassword: "", // 确认密码
      sendAuthCode: true /*布尔值，通过v-show控制显示‘获取按钮’还是‘倒计时’ */,
      auth_time: 0 /*倒计时 计数器*/
    };
  },
  methods: {
    prev() {
      history.go(-1);
    },
    getCode() {
      this.sendAuthCode = false;
      this.auth_time = 60;
      var auth_timetimer = setInterval(() => {
        this.auth_time--;
        if (this.auth_time <= 0) {
          this.sendAuthCode = true;
          clearInterval(auth_timetimer);
        }
      }, 1000);
      // 发送验证码
      var params = new URLSearchParams();
      params.append(
        "access_token",
        JSON.parse(window.localStorage.getItem("token")).access_token
      );
      params.append(
        "qdcrmUserId",
        JSON.parse(window.localStorage.getItem("userInfo")).qdcrmUserId
      );
      params.append("phone", this.phone); // 手机号
      params.append("type", 1); // 重置密码验证码
      // 发送重置密码短信
      axios
        .post(`${BASE_URL}/msmng/api/vertifycode/sendVertifyCode`, params, {
          header: {
            "Access-Control-Allow-Origin": "*"
          }
        })
        .then(response => {
          console.log(response);
          if (response.data.code == 200) {
          } else {
            Toast(response.data.message);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 忘记密码
    sumbitPWD() {
      if (!this.sms) {
        Toast("请输入验证码");
        return;
      }
      this.autoCode = false;
      this.showSettingNewPWD = true;
    },
    sumbit() {
      if (!this.newpassword) {
        Toast("请输入新密码");
        return;
      }
      if (!this.surepassword) {
        Toast("请确认密码");
        return;
      }
      if (this.newpassword != this.surepassword) {
        Toast("两次密码输入不一致！");
        return;
      }
      if (this.newpassword.length != 6 || this.surepassword.length != 6) {
        Toast("请设置6位数的支付密码");
        return;
      }
      var params = new URLSearchParams();
      params.append(
        "access_token",
        JSON.parse(window.localStorage.getItem("token")).access_token
      );
      params.append(
        "qdcrmUserId",
        JSON.parse(window.localStorage.getItem("userInfo")).qdcrmUserId
      );
      params.append("payPassword", this.$md5(this.newpassword)); // 新支付密码
      params.append("phone", this.phone); // 验证码
      params.append("vertifyCode", this.sms); // 验证码
      // 重置支付密码
      axios
        .post(`${BASE_URL}/msmng/api/paypassword/resetPayPassword`, params, {
          header: {
            "Access-Control-Allow-Origin": "*"
          }
        })
        .then(response => {
          console.log(response.data);
          if (response.data.code == 200) {
            Toast(response.data.message);
            setTimeout(() => {
              this.$router.push("/setting");
            }, 500);
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
    checkToken();
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
.forgetPWD {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  background: #f5f5f5;
  .inputList {
    width: 100%;
    margin-top: 1.2rem;
    p {
      height: 1rem;
      line-height: 1rem;
      margin-left: 0.5rem;
      color: #606060;
    }
    .van-cell {
      height: 1.2rem;
      line-height: 0.75rem;
      font-size: 0.35rem;
    }
  }
  .accomplish {
    width: 90%;
    height: 1.2rem;
    position: absolute;
    left: 0;
    right: 0;
    margin: 0.8rem auto;
    border: none;
    border-radius: 5px; /* no */
    background: #1c8cff;
    color: #fff;
    font-size: 0.4rem;
  }
  .van-button--primary {
    border: none;
    background: #fff;
    color: #1c8cff;
    border: 1px solid #1c8cff; /* no */
  }
  .van-button--small {
    width: 2.5rem;
    height: 0.8rem;
    border-radius: 5px; /* no */
    font-size: 0.3rem;
  }
}
// 支付密码
.payPassWord {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  background: #f5f5f5;
  .inputList {
    width: 100%;
    margin-top: 1.2rem;
    p {
      height: 1rem;
      line-height: 1rem;
      margin-left: 0.5rem;
      color: #606060;
    }
    .van-cell {
      height: 1.2rem;
      line-height: 0.7rem;
      font-size: 0.35rem;
    }
  }
  .accomplish {
    width: 90%;
    height: 1.2rem;
    position: absolute;
    left: 0;
    right: 0;
    margin: 0.8rem auto;
    border: none;
    border-radius: 5px; /* no */
    background: #1c8cff;
    color: #fff;
    font-size: 0.4rem;
  }
  span {
    float: right;
    display: block;
    margin-top: 2.5rem;
    margin-right: 0.5rem;
    color: #1c8cff;
  }
}
</style>
<style lang="less">
.van-field .van-cell__title {
  max-width: 2rem;
  margin-left: 0.3rem;
}
</style>
