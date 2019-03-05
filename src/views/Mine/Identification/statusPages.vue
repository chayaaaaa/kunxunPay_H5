<template>
  <div class="statusPages">
    <mt-header title="实 名 认 证" fixed>
      <mt-button icon="back" class="header_left" @click="prev()" slot="left"></mt-button>
    </mt-header>
    <!-- =================      实 名 认 证 状 态 页 面        ================= -->
    <!-- 认证中 -->
    <submitSuccessPage v-if="AuthData == 3"></submitSuccessPage>
    <submitSuccessPage v-if="AuthData == 0"></submitSuccessPage>
    <submitSuccessPage v-if="AuthData == 4"></submitSuccessPage>
    <!-- 认证成功 -->
    <div class="outBox" v-if="AuthData == 1">
      <div class="submitSuccessPage">
        <mt-header title="实 名 认 证" fixed>
          <mt-button icon="back" @click="prev()" slot="left"></mt-button>
        </mt-header>
        <img class="sucImg" src="@/assets/image/Mine/Identification/ic-font.png">

        <li class="li2">
          姓名
          <span>{{TwoElementsResultRealName}}</span>
        </li>
        <li class="li3">
          证件号码
          <span>{{TwoElementsResultIdCardNum}}</span>
        </li>
        <li @click="back()">返回首页</li>
      </div>
    </div>
    <!-- 认证失败 -->
    <div class="outBox" v-if="AuthData == 2">
      <div class="submitSuccessPage">
        <mt-header title="实 名 认 证" fixed>
          <mt-button icon="back" @click="prev()" slot="left"></mt-button>
        </mt-header>
        <img src="@/assets/image/Mine/Identification/ic-loser.png">
        <p class="p1">很遗憾 · 实名认证失败</p>
        <p>手持身份证不清晰，请重新认证</p>
        <li @click="again()">重新认证</li>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import EXIF from "exif-js";
import { VueClip } from "vue-pic-clip";
import { checkToken } from "@/api/api.js";
import qs from "qs";
import submitSuccessPage from "@/views/Mine/Identification/submitSuccessPage.vue";
import {
  returnAuthStatus,
  queryTwoElementsResult,
  getRefreshToken,
  BASE_URL
} from "@/api/api.js";
export default {
  inject: ["reload"],
  name: "statusPages",
  data() {
    return {
      current: 0,
      // 状态
      status: "",
      AuthData: "", //实名认证状态
      TwoElementsResultIdCardNum: "", //二要素ID信息
      TwoElementsResultRealName: "" // 二要素姓名信息
    };
  },

  props: ["model"],
  created() {},
  ready() {},
  methods: {
    prev() {
      this.$router.go(-1);
    },
    back() {
      this.$router.push("/index");
    },
    again() {
      this.$router.push("/Identification");
      window.localStorage.removeItem("one"); //清除文件
      window.localStorage.removeItem("two"); //清除文件
      window.localStorage.removeItem("three"); //清除文件
    }
  },
  created() {
    getRefreshToken();
    returnAuthStatus()
      .then(response => {
        console.log(response.data);
        this.AuthData = response.data.data;
        console.log(this.AuthData);
        if (this.AuthData == 1) {
          queryTwoElementsResult()
            .then(response => {
              console.log(response.data);
              let data = response.data.data;
              this.TwoElementsResultIdCardNum = data.idCardNum;
              this.TwoElementsResultRealName = data.realName;
            })
            .catch(function(error) {
              Toast(response.message);
            });
        }
      })
      .catch(function(error) {
        Toast(response.message);
      });
  },
  /* 注册组件 */
  components: {
    VueClip,
    submitSuccessPage
  }
};
</script>
<style lang="less" scoped>
@blue: #1c8cff;
/* 头部 */
.mint-header {
  height: 1.2rem;
  font-size: 0.5rem;
  font-weight: 100;
  background: @blue;
}
.header_left {
  margin-left: 0.3rem;
}
.mintui {
  font-size: 0.4rem;
}
.outBox {
  width: 100%;
  height: 100%;
  background: #fff;
  position: absolute;
  top: 0;
  bottom: 0;
}
.submitSuccessPage {
  width: 100%;
  height: 8rem;
  background: url("~@/assets/image/Mine/Identification/bj.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  text-align: center;
  color: #fff;
  z-index: 500;
  .sucImg {
    width: 60%;
  }
  img {
    display: block;
    width: 3rem;
    height: 3rem;
    margin: 2rem auto;
  }
  .mint-header {
    background: none;
  }
  p {
    width: 100%;
    height: 0.5rem;
  }
  .p1 {
    margin-top: -1.5rem;
    font-size: 0.6rem;
    margin-bottom: 0.3rem;
  }
  li {
    width: 95%;
    height: 1.2rem;
    line-height: 1.2rem;
    background: #1c8cff;
    border-radius: 5px; /* no */
    color: #fff;
    position: absolute;
    bottom: -4rem;
    left: 0;
    right: 0;
    margin: 0 auto;
    font-size: 0.4rem;
    span {
      display: block;
      float: right;
    }
  }
  .li2 {
    width: 95%;
    height: 1.2rem;
    position: absolute;
    bottom: -1.3rem;
    background: #fff;
    border-radius: 0;
    border-bottom: 1px solid #d9d9d9; /* no */
    color: #000;
    text-align: left;
  }
  .li3 {
    width: 95%;
    height: 1.2rem;
    position: absolute;
    bottom: -2.6rem;
    background: #fff;
    border-radius: 0;
    color: #000;
    text-align: left;
    border-bottom: 1px solid #d9d9d9; /* no */
  }
}
</style>


