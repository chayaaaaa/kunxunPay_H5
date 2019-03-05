<template>
  <div class="transactionDetails">
    <!-- ================     银 行 卡 明 细      ================= -->
    <mt-header title="银 行 卡 明 细" fixed>
      <mt-button icon="back" @click="prev()" class="header_left" slot="left"></mt-button>
    </mt-header>
    <!-- 卡号详情列表 -->
    <div class="bankDetail" v-if="showDetails==true">
      <div class="Detail">
        <!-- 银行卡 -->
        <li>
          <p>
            <img :src="iconPath">
          </p>
          <p>
            {{bankName}}
            <span v-if="status == 0">待验证</span>
            <span v-if="status == 1">验证通过</span>
            <span v-if="status == 2">验证不通过</span>
            <span v-if="status == 3">已解绑</span>
          </p>
          <p v-if="cardType==0">个人账号</p>
          <p v-if="cardType==1">企业账号</p>
          <p>{{cardNo}}</p>
        </li>
      </div>
      <ul>
        <li>
          单笔提现额度
          <span>2000元</span>
        </li>
        <li>
          每日提现额度
          <span>20000元</span>
        </li>
      </ul>
      <button @click="Unpinless()">解除绑定</button>
    </div>
    <!-- 未设置支付密码提示框 -->
    <mt-popup v-model="showPrempt" popup-transition="popup-fade">
      <ul class="prempt_ul">
        <li class="prempt_li1">您还未设置支付密码 , 请先设置支付密码</li>
        <li class="prempt_li2" @click="cancelPrempt()">取消</li>
        <li class="prempt_li3" @click="goSettingPWD()">去设置</li>
      </ul>
    </mt-popup>
    <!-- 提示框 -->
    <mt-popup v-model="showAlert" popup-transition="popup-fade">
      <div class="alertMsg">
        <div class="alertMsgText">密码错误</div>
        <div class="box alertMsgForgetPassword" @click="ForgetPassword()">忘记密码</div>
        <div class="box retry" @click="retry()">重试一次</div>
      </div>
    </mt-popup>
    <van-popup v-model="show" :overlay="false">
      <div class="pay_password">
        <!-- 密码输入框 -->
        <div class="password_input">
          <p style="text-align: center">请输入支付密码解绑银行卡</p>
          <van-password-input
            :value="value"
            v-model="value"
            @focus="showKeyboard = true"
            close-button-text="取消"
          />
        </div>
        <!-- 确定框 -->
        <button @click="sumbitPwd()">提交</button>
        <!--键盘-->
        <!-- 数字键盘 -->
        <van-number-keyboard
          :show="show"
          theme="custom"
          extra-key="."
          close-button-text="取消"
          @blur="show = false"
          @input="onInput"
          @delete="onDelete"
          delete-button-text="删除"
          transition
        />
      </div>
    </van-popup>
    <ul class="nothing" v-if="nothing == true">
      <img src="@/assets/image/Manger/Trade/nothing.png">
      <p>请耐心等候银行卡认证通过唷~~</p>
    </ul>
  </div>
</template>
<script>
import { Toast, MessageBox } from "mint-ui";
import { PasswordInput, NumberKeyboard } from "vant";
import "@/CSSFILE/alert.css";
import "@/CSSFILE/alert.css";
import {
  getRefreshToken,
  queryPasswordExist,
  BASE_URL,
  checkPayPassword
} from "@/api/api.js";
import md5 from "js-md5";
const axios = require("axios");
export default {
  name: "transactionDetails",
  data() {
    return {
      value: "",
      showKeyboard: true,
      show: false,
      inputValue: "",
      iconPath: "",
      bankName: "",
      status: "",
      id: "",
      cardType: "",
      cardNo: "",
      itemDetails: [], // 传递过来的参数
      showAlert: false, //
      nothing: false, //认证还未通过
      showDetails: true,
      data: "", // 设置密码的值
      showPrempt: false, // 未设置密码弹框
      tailNum: "" // 银行卡后四位
    };
  },
  created() {
    this.getParams();
    getRefreshToken();
  },
  watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
    $route: "getParams"
  },
  methods: {
    prev() {
      history.go(-1);
    },
    onInput(key) {
      this.value = (this.value + key).slice(0, 6);
    },
    onDelete() {
      this.value = this.value.slice(0, this.value.length - 1);
    },
    Unpinless() {
      queryPasswordExist()
        .then(response => {
          console.log(response.data.data);
          if (response.data.data == 1) {
            this.show = true;
          } else {
            this.showPrempt = false;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    cancelPrempt() {
      this.showPrempt = false;
    },
    goSettingPWD() {
      this.$router.push("/setting");
    },
    sumbitPwd() {
      console.log(this.value);
      if (!this.value) {
        MessageBox("请输入密码");
        return;
      }
      if (this.value.length != 6) {
        MessageBox("请输入6位数密码");
        return;
      }
      let pwd = this.value;
      var params = new URLSearchParams();
      params.append(
        "access_token",
        JSON.parse(window.localStorage.getItem("token")).access_token
      );
      params.append(
        "qdcrmUserId",
        JSON.parse(window.localStorage.getItem("userInfo")).qdcrmUserId
      );
      params.append("payPassword", this.$md5(this.value));
      this.tailNum = this.cardNo.substring(15);
      axios
        .post(`${BASE_URL}/msmng/api/paypassword/checkPayPassword`, params, {
          header: {
            "Access-Control-Allow-Origin": "*"
          }
        })
        .then(response => {
          console.log(response.data);
          let password = response.data.data;
          if (password == 1) {
            var params = new URLSearchParams();
            params.append(
              "access_token",
              JSON.parse(window.localStorage.getItem("token")).access_token
            );
            params.append(
              "qdcrmUserId",
              JSON.parse(window.localStorage.getItem("userInfo")).qdcrmUserId
            );
            params.append("tailNum", this.tailNum);
            params.append("payPassword", this.$md5(pwd));
            axios
              .post(`${BASE_URL}/msmng/api/bankcard/untieBankCard`, params, {
                header: {
                  "Access-Control-Allow-Origin": "*"
                }
              })
              .then(response => {
                MessageBox("解绑成功,稍后生效");
                setTimeout(() => {
                  this.$router.push("/BKManagement");
                }, 2000);
              })
              .catch(function(error) {
                console.log(error);
              });
          } else {
            this.showAlert = true;
          }
        })
        .catch(function(err) {
          Toast(err.message);
        });

      this.value = "";
    },
    getParams() {
      // 取到路由带过来的参数
      var routerParams = this.$route.params.id;
      var list = this.$route.params.item;
      this.itemDetails = list;
      console.log(this.itemDetails);
      this.iconPath = list.iconPath;
      this.bankName = list.bankName;
      this.status = list.status;
      this.cardType = list.cardType;
      this.cardNo = list.cardNo;
    },
    ForgetPassword() {
      this.$router.push("/forgetPWD");
    },
    retry() {
      this.showAlert = false;
      this.show = true;
    }
  },
  mounted() {
    getRefreshToken();
    if (this.itemDetails == undefined) {
      this.showDetails = false;
    }
  }
};
</script>
<style lang="less" scoped>
@blue: #1c8cff;
.van-popup {
  transform: none;
  button {
    width: 70%;
    height: 1rem;
    margin: 4rem auto;
    position: absolute;
    left: 0;
    right: 0;
    border: none;
    background: @blue;
    color: #fff;
    border-radius: 5px; /* no */
  }
}
.mint-popup {
  background: none;
}
.alertMsg {
  width: 8rem;
  height: 4.5rem;
  background: #fff;
  border-radius: 8px; /* no */
  text-align: center;
  .alertMsgText {
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    font-size: 0.45rem;
  }
  .box {
    width: 35%;
    float: left;
    line-height: 1.2rem;
    font-size: 0.35rem;
    background: #1c8cff;
    color: #fff;
    border-radius: 5px; /* no */
  }
  .alertMsgForgetPassword {
    margin-left: 10%;
    margin-right: 10%;
  }
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.pay_password {
  background: #e2e1e1;
  position: fixed;
  left: 0;
  bottom: 0;
  top: 1.2rem;
  width: 100%;
  height: 100%;
  z-index: 800;
}

.password_input {
  position: fixed;
  left: 0;
  top: 2rem;
  width: 100%;
  height: 2rem;
  z-index: 900;
}
.van-password-input {
  top: 1rem;
}
/* 头部 */
.mint-header {
  height: 1.2rem;
  font-size: 0.45rem;
  font-weight: 100;
  background: @blue;
}
.header_left {
  margin-left: 0.3rem;
  font-size: 0.4rem;
}
.bankDetail {
  width: 100%;
  position: absolute;
  top: 1.2rem;
  bottom: 0;
  background: #f5f5f5;
  .Detail {
    width: 100%;
    height: 3rem;
    background: #fff;
    li {
      width: 95%;
      height: 2.5rem;
      border-radius: 5px; /* no */
      margin: 0rem auto;
      padding-top: 0.5rem;
      p:nth-child(1) {
        width: 1rem;
        height: 2.5rem;
        float: left;
        margin-right: 1.5rem;
        img {
          width: 1.5rem;
          margin-left: 0.5rem;
        }
      }
      p:nth-child(3) {
        font-size: 0.35rem;
      }
      p {
        height: 0.7rem;
        font-size: 0.4rem;
        color: #000;
        span {
          float: right;
          margin-right: 0.5rem;
        }
      }
    }
  }
  ul {
    margin-top: 0.5rem;
    width: 100%;
    height: auto;
    background: #fff;
    li {
      width: 90%;
      height: 1.2rem;
      text-align: left;
      margin: 0 auto;
      line-height: 1.2rem;
      border-bottom: 1px solid #d9d9d9; /* no */
      font-size: 0.35rem;
      span {
        float: right;
      }
    }
  }
  button {
    width: 90%;
    height: 1rem;
    border: none;
    position: absolute;
    left: 0;
    right: 0;
    margin: 1rem auto;
    background: #1c8cff;
    color: #fff;
    border-radius: 5px; /* no */
    letter-spacing: 0.05rem;
    font-size: 0.4rem;
    font-weight: 200;
  }
}
.prempt_ul {
  width: 8.5rem;
  height: 4rem;
  background: #fff;
  border-radius: 5px; /* no */
  text-align: center;
  li {
    width: 40%;
    height: 1rem;
    line-height: 1rem;
    float: left;
    background: @blue;
    border-radius: 5px; /* no */
    color: #fff;
    margin-top: 0.8rem;
  }
  .prempt_li1 {
    color: #000;
    width: 100%;
    background: none;
    font-size: 0.4rem;
  }
  .prempt_li2 {
    margin-left: 5%;
    margin-right: 10%;
  }
}
</style>
<style lang="less">
.van-password-input__security {
  height: 1.2rem;
  width: 70%;
  margin: 0 auto;
}
.van-number-keyboard {
  height: 6rem;
}
.van-key {
  height: 1.5rem;
  line-height: 1.5rem;
  font-size: 0.4rem;
}
/* .van-key--gray {
  background: none;
} */
</style>
