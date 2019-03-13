<template>
  <div class="BKManagement">
    <!-- =============    银 行 卡 管 理 页 面     ============== -->
    <mt-header title="银 行 卡 管 理" fixed>
      <mt-button icon="back" @click="prev()" class="header_left" slot="left"></mt-button>
      <mt-button slot="right" class="detail" @click="addBankCards()">
        <img src="@/assets/image/Mine/Wallet/Add.png">
      </mt-button>
    </mt-header>
    <!-- 列表 -->
    <div class="BankCardsList" v-if="showbanklist == true">
      <!-- 银行卡 -->
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多数据了~"
          loading-text="加载中"
          @load="onLoad"
          :offset="30"
        >
          <li
            v-for="(item, index) in deviceList"
            :key="item.index"
            class="li2"
            v-show="item.cardType==0"
            @click="goToBankDealDetail(index,item)"
          >
            <p>
              <img :src="item.iconPath">
            </p>
            <p>
              {{item.bankName}}
              <span v-if="item.status == 0">待验证</span>
              <span v-if="item.status == 1">验证通过</span>
              <span v-if="item.status == 2">验证不通过</span>
              <span v-if="item.status == 3">已解绑</span>
            </p>
            <p v-if="item.cardType==0">个人账户</p>
            <p v-if="item.cardType==1">企业账户</p>
            <p>{{item.cardNo}}</p>
          </li>
          <li
            v-for="(item, index) in deviceList"
            :key="index"
            class="li1"
            @click="goToBankDealDetail(index,item)"
            v-show="item.cardType==1"
          >
            <p>
              <img :src="item.iconPath">
            </p>
            <p>
              {{item.bankName}}
              <span v-if="item.status == 0">待验证</span>
              <span v-if="item.status == 1">验证通过</span>
              <span v-if="item.status == 2">验证不通过</span>
              <span v-if="item.status == 3">已解绑</span>
            </p>
            <p v-if="item.cardType==0">个人账号</p>
            <p v-if="item.cardType==1">企业账号</p>
            <p>{{item.cardNo}}</p>
          </li>
        </van-list>
      </van-pull-refresh>
      <!--    <li></li> -->
    </div>
    <div class="noNotification" v-if="nothing == true">
      <img src="@/assets/image/Mine/nothing.png">
      <p>还没有添加银行卡~</p>
    </div>
    <div class="BankCardsBottom">
      <!-- 底部 -->
      <p @click="CAPION()">
        <img src="@/assets/image/Mine/Wallet/visa.png">申请信用卡
      </p>
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
import { MessageBox, Toast } from "mint-ui";
import "@/CSSFILE/alert.css";
import {
  returnAuthStatus,
  checkToken,
  BASE_URL,
  queryTwoElementsResult
} from "@/api/api.js";
const axios = require("axios");
export default {
  name: "BKManagement",
  data() {
    return {
      showError: false, //  未认证
      result: "", // 实名认证状态
      pageNumber: 0, // 当前页
      deviceList: [], // 银行卡数据列表
      nothing: false, //没有数据
      showbanklist: true, // 银行卡数据
      pageNumber: 0,
      loading: false, //控制上拉加载的加载动画
      finished: false, //控制在页面往下移动到底部时是否调用接口获取数据
      isLoading: false //控制下拉刷新的加载动画
    };
  },
  methods: {
    prev() {
      history.go(-1);
    },
    addBankCards() {
      if (this.result != 1) {
        this.showError = true;
      } else {
        this.$router.push("/addBankCards");
      }
    },
    goToBankDealDetail(index, item) {
      window.localStorage.setItem("_bankListDetails", JSON.stringify(item));
      this.$router.push("/transactionDetails");
    },
    // 跳转到实名认证
    toRenZheng() {
      this.$router.push("/Identification");
    },
    cancel() {
      this.showError = false;
    },
    CAPION() {
      MessageBox("暂未开放");
    },
    // 下拉刷新上拉加载
    init() {
      // 当前页数
      let data = {
        access_token: JSON.parse(window.localStorage.getItem("token"))
          .access_token,
        qdcrmUserId: JSON.parse(window.localStorage.getItem("userInfo"))
          .qdcrmUserId,
        pageNum: this.pageNumber + 1,
        number: Math.random()
      };
      let self = this;
      axios
        .get(`${BASE_URL}/msmng/api/withdrawdeposit/queryBalanceDetailRecord`, {
          params: data
        })
        .then(response => {
          let res = response.data.data;
          console.log(res);
          // 用 data 里定义的空数组储存得到的数据
          self.deviceList = res;
          console.log(self.deviceList);
          // 向数组中追加内容
          self.deviceList = self.deviceList.concat(res);
          // 取消刷新动画
          self.isLoading = false;
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    //下拉刷新
    onRefresh() {
      let self = this;
      setTimeout(() => {
        self.pageNumber = 0;
        Toast({
          message: "刷新成功"
        });
        this.isLoading = false;
        /* self.init(); */ //加载数据
      }, 500);
    },
    //页面初始化之后会触发一次，在页面往下加载的过程中会多次调用【上拉加载】
    onLoad() {
      checkToken();
      let self = this;
      setTimeout(() => {
        let datatwo = {
          access_token: JSON.parse(window.localStorage.getItem("token"))
            .access_token,
          qdcrmUserId: JSON.parse(window.localStorage.getItem("userInfo"))
            .qdcrmUserId,
          pageNum: this.pageNumber + 1,
          number: Math.random()
        };
        console.log(datatwo.pageNum);
        axios
          .get(`${BASE_URL}/msmng/api/bankcard/showBankCardList`, {
            params: datatwo
          })
          .then(response => {
            console.log(response.data);
            let res = response.data.data;
            console.log(res);

            if (res != null) {
              self.deviceList = self.deviceList.concat(res);
              self.loading = false;
              self.pageNumber++;
              console.log(res);
              if (res == 0) {
                self.loading = false;
                self.finished = true;
              } else {
                self.finished = false;
              }
            } else {
              this.showbanklist = true;
            }
          })
          .catch(function(err) {
            console.log(err);
          });
      }, 500);
    }
  },
  created() {
    checkToken();
    queryTwoElementsResult()
      .then(response => {
        console.log(response.data.data);
        this.result = response.data.data.status;
      })
      .catch(function(error) {
        console.log(error);
      });
  }
};
</script>
<style lang="less" scoped>
@blue: #1c8cff;
.BKManagement {
  background: #f1f9ff;
  width: 100%;
  height: 100%;
}
/* 头部 */
.mint-header {
  height: 1.2rem;
  font-size: 0.4rem;
  font-weight: 100;
  background: @blue;
}
.header_left {
  margin-left: 0.3rem;
  font-size: 0.4rem;
}
.detail {
  font-size: 0.3rem;
  margin-right: 0.3rem;
  img {
    width: 0.5rem;
  }
}
.BankCardsList {
  width: 100%;
  position: absolute;
  top: 1.2rem;
  bottom: 0;
  background: #f1f9ff;
  li {
    width: 95%;
    height: 2.5rem;
    border-radius: 5px; /* no */
    margin: 0.3rem auto;
    padding-top: 0.5rem;
    p:nth-child(1) {
      width: 1rem;
      height: 2.5rem;
      float: left;
      margin-right: 1rem;
      img {
        width: 1rem;
        margin-left: 0.5rem;
      }
    }
    p:nth-child(3) {
      font-size: 0.35rem;
    }
    p {
      height: 0.7rem;
      font-size: 0.4rem;
      color: #fff;
      span {
        float: right;
        margin-right: 0.5rem;
      }
    }
  }
  .li1 {
    background: url("~@/assets/image/Mine/Wallet/BankBule.png") no-repeat;
    background-size: 100% 100%;
  }
  .li2 {
    background: url("~@/assets/image/Mine/Wallet/BankRed.png") no-repeat;
    background-size: 100% 100%;
  }
}
.BankCardsBottom {
  position: fixed;
  height: 1.2rem;
  width: 100%;
  bottom: 0;
  background: #1c8cff;
  line-height: 1.2rem;
  text-align: center;
  color: #fff;
  font-size: 0.4rem;
  p {
    letter-spacing: 0.05rem;
    img {
      vertical-align: middle;
      width: 0.6rem;
      margin-right: 0.2rem;
    }
  }
}
.noNotification {
  width: 100%;
  height: 100%;
  margin-top: 0.3rem;
  text-align: center;
  background: #f1f9ff;
  img {
    display: block;
    width: 30%;
    margin: 0 auto;
    margin-top: 40%;
  }
  p {
    margin-top: 0.3rem;
  }
}

.mint-popup {
  width: 90%;
  height: 4rem;
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
.mint-header-title {
  overflow: visible !important;
}
.mintui {
  font-size: 0.4rem;
}
</style>
