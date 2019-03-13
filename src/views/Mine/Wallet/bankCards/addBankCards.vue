<template>
  <!-- =====================   添 加 银 行 卡 页 面   =======================-->
  <div class="addBankCards">
    <div class="header">
      <li class="header_left" @click="prev()">返回</li>
      <li class="p">添 加 银 行 卡</li>
    </div>
    <!-- ================       选 项 卡      =============== -->
    <div class="tabControl">
      <li @click="showValueOne()" :class="{'cur':showNoOne==true}">个人账户
        <p v-show="showNoOne==true"></p>
      </li>
      <li @click="showValueTwo()" :class="{'cur':showNoTwo==true}">企业账户
        <p v-show="showNoTwo==true"></p>
      </li>
    </div>
    <div class="showNoOne" v-if="showNoOne == true">
      <!-- 提示栏目 -->
      <div class="list_Reminder">请绑定持卡人本人银行卡</div>
      <!-- 输入栏 -->
      <ul class="inputField">
        <mt-field label="持卡人" placeholder="请输入真实姓名" v-model="user" disabled></mt-field>
        <mt-field
          label="身份证号"
          placeholder="请输入身份证号码"
          minlenght="18"
          maxlenght="18"
          type="number"
          v-model="ID"
          disabled
        ></mt-field>
        <mt-field label="银行名称" readonly>
          <select v-model="bankName" @change="getIdValue($event)" class="select" id="optionText">
            <option selected="selected" value disabled>请选择银行</option>
            <option
              v-for="item in list"
              :value="item.bankCode"
              :key="item.bankCode"
              :label="item.bankName"
            >{{item.bankName}}</option>
          </select>
        </mt-field>
        <mt-field label="银行卡号" type="tel" placeholder="请输入银行卡号" v-model="bankNumber"></mt-field>
        <mt-field label="手机" placeholder="请输入手机预留号" type="tel" v-model="phone">
          <img src="@/assets/image/Mine/Wallet/prompt .png" @click="CAPION()">
        </mt-field>
        <mt-field label="验证码" v-model="captcha" placeholder="请输入验证码">
          <!--  <li>发送验证码</li> -->
          <li v-show="sendAuthCode" class="auth_text auth_text_blue" @click="getAuthCode">获取验证码</li>
          <li v-show="!sendAuthCode" class="auth_text glay">
            <span class="auth_text_blue">{{auth_time}}</span> S
          </li>
        </mt-field>
      </ul>
      <button
        type="submit"
        class="sub_btn"
        @click.prevent="onSubmit(user,ID,bankName,bankNumber,phone,captcha,selected)"
      >提交</button>
    </div>

    <div class="showNoTwo" v-if="showNoTwo == true">
      <div class="list_Reminder">请绑定法人所属企业账户</div>
      <ul class="inputField">
        <mt-field label="企业账户" placeholder="请输入企业账户" v-model="corporate"></mt-field>
        <mt-field label="企业账号" placeholder="请输入企业账号" v-model="Identification" type="tel"></mt-field>
        <mt-field label="银行名称" readonly>
          <select v-model="bankName" @change="getIdValue($event)" class="select" id="optionText">
            <option selected="selected" value disabled>请选择银行</option>
            <option
              v-for="item in list"
              :value="item.bankCode"
              :key="item.bankCode"
              :label="item.bankName"
            >{{item.bankName}}</option>
          </select>
        </mt-field>
        <mt-field label="开户行" placeholder="请输入开户行" v-model="openbankName"></mt-field>
        <div class="upimg">
          <!-- 营业执照 -->
          <vue-clip
            :img="option.Operating"
            :dataUrlType="option.dataUrlType"
            :accept="option.accept"
            :autoClip="option.autoClip"
            :autoClipWidth="option.autoClipWidth"
            :autoClipHeight="option.autoClipHeight"
            :fixed="option.fixed"
            :outputSize="option.outputSize"
            :theme="option.theme"
            :fixedNumber="option.fixedNumber"
            @finish="Operat"
          ></vue-clip>
          <!-- 开户证明 -->
          <vue-clip
            :img="option.opening "
            :dataUrlType="option.dataUrlType"
            :accept="option.accept"
            :autoClip="option.autoClip"
            :autoClipWidth="option.autoClipWidth"
            :autoClipHeight="option.autoClipHeight"
            :fixed="option.fixed"
            :outputSize="option.outputSize"
            :theme="option.theme"
            :fixedNumber="option.fixedNumber"
            @finish="open"
          ></vue-clip>
          <button type="submit" class="btn" @click.prevent="next()">提交</button>
        </div>
      </ul>
    </div>

    <!-- 未实名认证 -->
    <mt-popup v-model="showError" popup-transition="popup-fade">
      <div class="alertMsg">
        <div class="alertMsgText">请先进行实名认证~</div>
        <div class="box alertMsgForgetPassword" @click="toRenZheng()">去实名认证</div>
        <div class="box retry" @click="cancel()">取消</div>
      </div>
    </mt-popup>
  </div>
</template>
<script>
const axios = require("axios");
import qs from "qs";
import { VueClip } from "vue-pic-clip";
import { Toast, MessageBox } from "mint-ui";
import "@/CSSFILE/alert.css";
import {
  queryTwoElementsResult,
  queryBankSup,
  checkToken,
  BASE_URL
} from "@/api/api.js";
export default {
  inject: ["reload"],
  name: "addBankCards",
  data() {
    return {
      current: 1,
      // 个人
      user: "", // 姓名
      ID: "", // 身份证号码
      bankName: "", // 银行
      bankNumber: "", // 卡号
      phone: "", // 预留手机号
      captcha: "", // 验证码
      // 企业
      corporate: "", // 企业账户
      Identification: "", // 企业账号
      openbankName: "", // 开户行
      bankComName: "", //银行名称
      list: [],
      Operating: "", // 营业执照
      opening: "", // 开户证明
      showComText: "", // 选择银行
      option: {
        Operating: require("@/assets/image/Mine/Wallet/charter.png"), // 营业执照
        opening: require("@/assets/image/Mine/Wallet/Account .png"), // 开户证明
        accept: "image/png, image/jpeg, image/jpg, image/gif", // 可上传的图片类型
        outputSize: 0.7, // 压缩质量
        autoClip: true, // 是否开启截图框
        dataUrlType: "base64", // 数据类型
        canMoveBox: true, // 截图框是否可以移动
        fixed: true, // 截图框是否开启固定宽高比
        fixedNumber: [1, 0.6], // 宽高比 w/h
        fixedNumber3: [0.3, 0.5], // 宽高比 w/h
        theme: "rect", // 样式风格，默认rect:方形，circle:圆形
        clipImg: "" // 裁剪后的图片
      },
      showError: false,
      showBank: false,
      showDefBank: true,
      qdcrmUserId: JSON.parse(window.localStorage.getItem("userInfo"))
        .qdcrmUserId, // 所属上级商户号
      access_token: JSON.parse(window.localStorage.getItem("token"))
        .access_token,
      merchantId: JSON.parse(window.localStorage.getItem("userInfo"))
        .merchantId,
      showIndexText: "",
      sendAuthCode: true /*布尔值，通过v-show控制显示‘获取按钮’还是‘倒计时’ */,
      auth_time: 0 /*倒计时 计数器*/,
      showNoOne: true, // 添加个人账户
      showNoTwo: false // 添加企业账户
    };
  },
  methods: {
    prev() {
      history.go(-1);
    },
    CAPION() {
      MessageBox("与银行预留手机保持一致");
    },
    showPopup() {
      this.popupVisible = true;
    },
    // 个人账户
    showValueOne() {
      this.showNoOne = true;
      this.showNoTwo = false;
    },
    // 企业账户
    showValueTwo() {
      this.showNoOne = false;
      this.showNoTwo = true;
    },
    // 营业执照
    Operat(name, url) {
      // 完成上传图片，返回图片名称、数据
      let formData = new FormData();
      this.Operating = url.slice(23);
      console.log(this.Operating);
    },
    // 开户证明
    open(name, url) {
      // 完成上传图片，返回图片名称、数据
      let formData = new FormData();
      this.opening = url.slice(23);
      console.log(this.opening);
    },
    // 跳转到实名认证
    toRenZheng() {
      this.$router.push("/Identification");
    },
    cancel() {
      this.$router.push("/BKManagement");
    },
    // 个人账户获取option的text
    getIdValue(event) {
      this.value = event.target.value;
      console.log(this.value);
      var myselect = document.getElementById("optionText");
      var index = myselect.selectedIndex; // selectedIndex代表的是你所选中项的index
      this.showIndexText = myselect.options[index].label;
      console.log(this.showIndexText);
    },
    // 企业账户获取option的text
    getValue(event) {
      this.value = event.target.value;
      console.log(this.value);
      var myselect = document.getElementById("optionText");
      var index = myselect.selectedIndex; // selectedIndex代表的是你所选中项的index
      this.showComText = myselect.options[index].value;
      console.log(this.showComText);
    },

    // 发送验证码
    getAuthCode() {
      if (this.phone == "") {
        Toast("请输入手机号");
        return;
      } else {
        this.sendAuthCode = false;
        this.auth_time = 60;
        var auth_timetimer = setInterval(() => {
          this.auth_time--;
          if (this.auth_time <= 0) {
            this.sendAuthCode = true;
            clearInterval(auth_timetimer);
          }
        }, 1000);
        var params = new URLSearchParams();
        params.append("access_token", this.access_token);
        params.append("qdcrmUserId", this.qdcrmUserId);
        params.append("phone", this.phone);
        params.append("type", 2); //  添加企业银行卡
        params.append("number", Math.random());
        console.log(params);
        // 请求验证码
        axios
          .post(`${BASE_URL}/msmng/api/vertifycode/sendVertifyCode`, params, {
            header: {
              "Access-Control-Allow-Origin": "*"
            }
          })
          .then(response => {
            console.log(response);
            if (response.data.code == 400) {
              Toast(response.data.message);
            }
          })
          .catch(function(err) {
            Toast(err.data.message);
          });
      }
    },
    // 提交个人账户信息
    onSubmit() {
      if (!this.bankName) {
        Toast("请选择银行");
        return;
      }
      if (!this.bankNumber) {
        Toast("请输入银行卡号");
        return;
      }
      if (!this.phone) {
        Toast("请输入预留手机号");
        return;
      }
      if (!/^1(3|4|5|7|8)\d{9}$/.test(this.phone)) {
        Toast("手机号码格式有误，请重填");
        return;
      }
      if (!this.captcha) {
        Toast("请输入验证码");
        return;
      }
      checkToken();
      var params = new URLSearchParams();
      params.append("access_token", this.access_token);
      params.append("qdcrmUserId", this.qdcrmUserId);
      params.append("merchantId", this.merchantId);
      params.append("mobile", this.phone);
      params.append("holderName", this.user);
      params.append("idCard", this.ID);
      params.append("bankName", this.showIndexText);
      params.append("bankCode", this.bankNumber);
      params.append("vertifyCode", this.captcha);
      params.append("number", Math.random());
      console.log(params);
      axios
        .post(`${BASE_URL}/msmng/api/bankcard/addPersonalBankCard`, params, {
          header: {
            "Access-Control-Allow-Origin": "*"
          }
        })
        .then(response => {
          console.log(response.data);
          if (response.data.code == 200) {
            this.$router.push("/BKManagement");
          } else {
            Toast(response.data.message);
          }
        })
        .catch(function(err) {
          Toast(err.data.message);
        });
    },
    // 提交企业账户信息
    next() {
      if (!this.corporate) {
        Toast("请输入企业账户");
        return;
      }
      if (!this.Identification) {
        Toast("请输入企业账号");
        return;
      }
      if (!this.bankName) {
        Toast("请选择银行");
        return;
      }
      if (!this.openbankName) {
        Toast("请输入开户行");
        return;
      }
      if (!this.Operating) {
        Toast("请上传营业执照");
        return;
      }
      if (!this.opening) {
        Toast("请上传开户证明");
        return;
      }
      var params = new URLSearchParams();
      params.append("access_token", this.access_token); // 访问令牌
      params.append("qdcrmUserId", this.qdcrmUserId); // 商户号
      params.append("merchantName", this.corporate); // 商户名（企业账号）
      params.append("bankCode", this.Identification); // 银行卡号
      params.append("bankName", this.showIndexText); // 开户行（下拉框）
      params.append("branchName", this.openbankName); // 支行名（用户手动输入）
      params.append("authImgbizLicense", this.Operating); // 营业执照
      params.append("authImgOpProof", this.opening); // 开户证明
      params.append("number", Math.random());
      console.log(params);
      checkToken();
      // 添加企业账户请求
      axios
        .post(`${BASE_URL}/msmng/api/bankcard/addBizBankCard`, params, {
          header: {
            "Access-Control-Allow-Origin": "*"
          }
        })
        .then(response => {
          console.log(response);
          if (response.data.code == 200) {
            this.$router.push("/BKManagement");
          } else {
            Toast(response.data.message);
          }
          if (response.data.code == 400) {
            Toast(response.data.message);
          }
        })
        .catch(function(err) {
          Toast(err.data.message);
        });
    }
  },
  /* 注册组件 */
  components: {
    VueClip
  },
  created() {
    checkToken();
    queryTwoElementsResult()
      .then(response => {
        console.log(response.data.data);
        let data = response.data.data;
        if (data.status == 1) {
          this.user = data.realName;
          this.ID = data.idCardNum;
          queryBankSup()
            .then(response => {
              console.log(response.data);
              this.list = response.data.data;
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          this.showError = true;
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }
};
</script>
<style lang="less" scoped>
@blue: #1c8cff;
.clip .icon {
  border: none !important;
}
/* 头部 */
.header {
  width: 100%;
  height: 1.2rem;
  line-height: 1.2rem;
  font-size: 0.4rem;
  font-weight: 100;
  background: @blue;
  position: fixed;
  top: 0;
  text-align: center;
  color: #fff;
  z-index: 9999;
  .header_left {
    width: 10%;
    margin-left: 0.3rem;
    font-size: 0.38rem;
    float: left;
  }
  .p {
    width: 90%;
  }
}
.mint-popup {
  width: 90%;
  height: 4rem;
  border-radius: 5px; /* no */
}
// 验证码
.glay {
  background: #b0b0b0 !important;
}
.tabControl {
  position: fixed;
  top: 1.2rem;
  width: 100%;
  height: 1.2rem;
  background: #fff;
  z-index: 999;
  li {
    width: 50%;
    height: 1.2rem;
    line-height: 1.2rem;
    text-align: center;
    float: left;
    color: #9b9b9b;
    font-size: 0.38rem;
    p {
      width: 0.5rem;
      height: 0.05rem;
      background: #1c8cff;
      margin: 0 auto;
    }
  }
}
.cur {
  color: #1c8cff !important;
}
.list_Reminder {
  position: absolute;
  top: 2.45rem;
  width: 100%;
  height: 1rem;
  line-height: 1rem;
  background: #f5f5f5;
  color: #606060;
  text-indent: 0.5rem;
  font-size: 0.35rem;
}
.inputField {
  width: 100%;
  height: auto;
  position: absolute;
  background: #fff;
  top: 3.45rem;
  z-index: 9999;
  select {
    width: 3rem;
    height: 0.5rem;
    border: none;
    appearance: none;
    -moz-appearance: none; /* Firefox */
    -webkit-appearance: none; /* Safari 和 Chrome */
    background: transparent;
    outline: none;
    background: url("~@/assets/image/Mine/Wallet/more.png") no-repeat right;
    background-size: 0.5rem;
    direction: rtl;
    padding-right: 0.7rem;
    color: #000;
    option {
      color: #000 !important;
    }
  }
  .mint-cell {
    width: 90%;
    height: 1.2rem;
    border-bottom: 1px solid #d9d9d9; /* no */
    margin: 0 auto;
    font-size: 0.4rem;
  }
  li {
    width: 2.5rem;
    height: 0.7rem;
    background: #1c8cff;
    border-radius: 5px; /* no */
    text-align: center;
    line-height: 0.7rem;
    color: #fff;
    font-size: 0.35rem;
    margin-left: 0.5rem;
  }
  img {
    width: 0.5rem;
    margin-left: 0.3rem;
  }
}
.addBankCards {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  background: #f5f5f5;
}

.CloseBank {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  background: #000;
}
.alertDetail {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 1.2rem;
  bottom: 0;
  background: #fff;
  li {
    width: 90%;
    height: 1.2rem;
    line-height: 1.2rem;
    border-bottom: 1px solid #d9d9d9; /* no */
    margin: 0 auto;
    font-size: 0.4rem;
  }
  p {
    width: 100%;
    height: 1.4rem;
    background: #ceebff;
    text-align: center;
    span {
      position: absolute;
      left: 0;
      right: 0;
      top: 0.2rem;
      margin: 0 auto;
      width: 90%;
      height: 1rem;
      background: #fff;
      text-align: center;
      line-height: 1rem;
      border-radius: 5px; /* no */
      box-shadow: 0px 2px 5px rgb(133, 154, 156); /* no */
    }
  }
}
.upimg {
  width: 100%;
  height: 8rem;
  position: absolute;
  top: 4.8rem;
  background: #fff;
  .clip[data-v-29874490] {
    height: 50%;
  }
}
.btn {
  bottom: -1.2rem;
}
.sub_btn {
  bottom: 2rem;
}
button {
  width: 90%;
  height: 1rem;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  border: none;
  background: #1c8cff;
  color: #fff;
  font-size: 0.4rem;
  letter-spacing: 0.2rem;
  border-radius: 5px; /* no */
}
.alertMsg {
  width: 100%;
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
    line-height: 1rem;
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
</style>
<style lang="less">
textarea:disabled,
input:disabled,
option:disabled {
  background-color: rgb(255, 255, 255);
}
.mint-header-title {
  overflow: visible !important;
}
.mintui {
  font-size: 0.4rem !important;
}
.mint-field-core {
  font-size: 0.35rem !important;
  direction: rtl !important;
}
.mint-cell-text {
  font-size: 0.38rem;
}
.mint-field .mint-cell-title {
  width: 2.45rem;
}
.mint-header-title {
  overflow: visible !important;
}
.mintui {
  font-size: 0.4rem;
}
.mint-cell-title {
  width: 2rem !important;
}
.picture {
  img {
    width: 50%;
  }
}
.clip .icon {
  border: none !important;
}
</style>