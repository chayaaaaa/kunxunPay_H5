<template>
  <div class="mine">
    <!-- ==================        这 是 我 的 页 面       ==================== -->
    <div class="top">
      <p>个 人 中 心</p>
    </div>
    <div class="mine_photo_body">
      <div class="img">
        <img src="@/assets/image/Mine/ic-headimg.png">
      </div>
      <p>{{text}}</p>
      <p v-if="areaType == 'OEM'">&nbsp;&nbsp;&nbsp;&nbsp;机构</p>
      <p v-if="areaType == 'PROVINCE'">&nbsp;&nbsp;&nbsp;&nbsp;省代理</p>
      <p v-if="areaType == 'CITY'">&nbsp;&nbsp;&nbsp;&nbsp;市代理</p>
      <p v-if="areaType == 'DISTRICT'">&nbsp;&nbsp;&nbsp;&nbsp;区县代理</p>
      <p v-if="areaType == 'AGENT'">&nbsp;&nbsp;&nbsp;&nbsp;代办点</p>
      <p v-if="areaType == 'INDUSTRY'">&nbsp;&nbsp;&nbsp;&nbsp;行业代理</p>
    </div>
    <div class="mine_list_body">
      <ul>
        <li @click="goToIdentificationPage()">
          实名认证
          <span v-if="returnAuthData == 0">认证中</span>
          <span v-if="returnAuthData == 3">认证中</span>
          <span v-if="returnAuthData == 4">认证中</span>
          <span v-if="returnAuthData == 1">认证成功</span>
          <span v-if="returnAuthData == 2">认证失败</span>
        </li>
        <li @click="goToNotificationPage()">消息通知</li>
        <li @click="goToWalletPage()">我的钱包</li>
        <li @click="goTomangerPage()">平台管理</li>
        <li @click="CAPION()">月排行榜</li>
        <li @click="goToSettingPage()">设置</li>
      </ul>
    </div>
    <!-- tabbar -->
    <div class="tabbar">
      <mt-tabbar v-model="selected">
        <li @click="goToIndex()">
          <mt-tab-item id="index">
            <img
              slot="icon"
              src="@/assets/image/Home/home-selected.png"
              v-if="this.selected == 'index'"
            >
            <img slot="icon" src="@/assets/image/Home/home.png" v-else>
            首页
          </mt-tab-item>
        </li>
        <li @click="goToManger()">
          <mt-tab-item id="manger">
            <img
              slot="icon"
              src="@/assets/image/Home/manger-selected.png"
              v-if="this.selected == 'manger'"
            >
            <img slot="icon" src="@/assets/image/Home/manger.png" v-else>
            平台管理
          </mt-tab-item>
        </li>
        <li @click="goToMine()">
          <mt-tab-item id="main">
            <img slot="icon" src="@/assets/image/Home/main.png" v-if="this.selected == 'main'">
            <img slot="icon" src="@/assets/image/Home/main-selected.png" v-else>
            我的
          </mt-tab-item>
        </li>
      </mt-tabbar>
    </div>
  </div>
</template>
<script>
import { MessageBox, Toast } from "mint-ui";
import "@/CSSFILE/alert.css";
import {
  returnAuthStatus,
  checkToken,
  getRefreshToken,
  BASE_URL
} from "@/api/api.js";
export default {
  name: "mine",
  data() {
    return {
      msg: 2,
      selected: "main",
      text: JSON.parse(window.localStorage.getItem("userInfo")).name, //名字
      areaType: JSON.parse(window.localStorage.getItem("userInfo")).areaType, //机构
      returnAuthData: "" // 实名认证返回结果
    };
  },
  created() {
    this.selected = this.$route.name;
    getRefreshToken();
    returnAuthStatus()
      .then(response => {
        console.log(response.data);
        this.returnAuthData = response.data.data;
        console.log(this.returnAuthData);
      })
      .catch(function(error) {
        Toast(response.message);
      });
  },
  methods: {
    // tababr 跳转
    goToIndex() {
      if (this.$route !== "index") {
        this.$router.push({
          path: "/index"
        });
      }
    },
    goToManger() {
      if (this.$route !== "manger") {
        this.$router.push({
          path: "/manger"
        });
      }
    },
    goToMine() {
      if (this.$route !== "mine") {
        this.$router.push({
          path: "/mine"
        });
      }
    },
    //  列表跳转
    goToIdentificationPage() {
      // 实名认证
      this.$router.push("/statusPages");
    },
    goToNotificationPage() {
      // 消息通知
      this.$router.push("/Notification");
    },
    goToWalletPage() {
      // 我的钱包
      this.$router.push("/Wallet");
    },
    goTomangerPage() {
      // 平台管理
      this.$router.push("/manger");
    },
    /*    goToRankingPage() {
      // 排行榜
       this.$router.push("/Ranking");
    }, */
    CAPION() {
      MessageBox("暂未开放");
    },
    goToSettingPage() {
      // 设置
      this.$router.push("/Setting");
    }
  }
};
</script>
<style lang="less" scoped>
.mine {
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #d0e7ff;
  overflow: auto;
  .top {
    width: 100%;
    height: 4rem;
    background: url("~@/assets/image/Mine/bj.png") no-repeat;
    background-size: 100%;
    p {
      width: 100%;
      height: 1.2rem;
      line-height: 1.2rem;
      text-align: center;
      color: #fff;
      font-size: 0.45rem;
    }
  }
  .mine_photo_body {
    width: 90%;
    height: 3.5rem;
    margin: -1rem auto;
    background: #fff;
    border-radius: 5px; /* no */
    .img {
      display: block;
      width: 2.5rem;
      margin: 0 auto;
    }
    img {
      width: 100%;
      margin-top: -1rem;
    }
    p {
      width: 100%;
      height: 0.5rem;
      line-height: 0.5rem;
      text-align: center;
      vertical-align: middle;
    }
    p:nth-child(2) {
      margin-top: 0.3rem;
      font-size: 0.4rem;
      font-weight: 500;
    }
    p:nth-child(3) {
      margin-top: 0.1rem;
      color: #606060;
      background: url("~@/assets/image/Mine/ic-sd.png") no-repeat 3.7rem;
      background-size: 0.45rem;
    }
  }
  .mine_list_body {
    width: 90%;
    height: 7.3rem;
    margin: 1.3rem auto;
    background: #fff;
    border-radius: 5px; /* no */
    ul {
      width: 90%;
      height: auto;
      margin: 0 auto;
      li {
        width: 88%;
        height: 1.2rem;
        line-height: 1.2rem;
        border-bottom: 1px solid #d9d9d9; /* no */
        padding-left: 12%;
        font-size: 0.37rem;
        span {
          position: absolute;
          right: 15%;
          color: #1c8cff;
        }
      }
      li:nth-child(1) {
        background: url("~@/assets/image/Mine/ic-renzheng.png") no-repeat;
        background-position: left center;
        background-size: 0.6rem;
      }
      li:nth-child(2) {
        background: url("~@/assets/image/Mine/ic-tongzhi.png") no-repeat;
        background-position: left center;
        background-size: 0.6rem;
      }
      li:nth-child(3) {
        background: url("~@/assets/image/Mine/ic-qianbao.png") no-repeat;
        background-position: left center;
        background-size: 0.6rem;
      }
      li:nth-child(4) {
        background: url("~@/assets/image/Mine/ic-manger.png") no-repeat;
        background-position: left center;
        background-size: 0.6rem;
      }
      li:nth-child(5) {
        background: url("~@/assets/image/Mine/ic-paihang.png") no-repeat;
        background-position: left center;
        background-size: 0.6rem;
      }
      li:nth-child(6) {
        background: url("~@/assets/image/Mine/ic-shezhi.png") no-repeat;
        background-position: left center;
        background-size: 0.6rem;
        border: none;
      }
    }
  }
}
</style>

<style lang="less">
/* tabbar */
.tabbar {
  width: 100%;
  height: 1.3rem;
  background: #fff;
  position: fixed;
  bottom: 0;
  .mint-tabbar {
    height: 1.5rem;
    .mint-tab-item-label {
      font-size: 0.35rem;
    }
    .mint-tab-item-icon {
      width: 0.6rem !important;
      height: 0.6rem !important;
    }
  }
  li {
    width: 33.3%;
    height: 1.3rem;
    float: left;
    text-align: center;
  }
}
</style>
