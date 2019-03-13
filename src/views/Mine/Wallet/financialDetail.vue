<template>
  <!-- ================   资 金 明 细 页 面    ================== -->
  <div class="financialDetail">
    <mt-header title="资 金 明 细" fixed>
      <mt-button icon="back" @click="prev()" class="header_left" slot="left"></mt-button>
    </mt-header>
    <!-- 列表 -->
    <div class="financialDetail_list">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多数据了~"
          loading-text="加载中"
          @load="onLoad"
          :offset="30"
        >
          <li v-for="item in deviceList" :key="item.a">
            <p>
              <span class="type" v-if="item.balanceType == 1">分润收益</span>
              <span class="type" v-if="item.balanceType == 2">服务费返现</span>
              <span class="type" v-if="item.balanceType == 3">服务费返现</span>
              <span class="type" v-if="item.balanceType == 4">激活奖励</span>
              <span class="type" v-if="item.balanceType == 5">刷卡奖励</span>
              <span class="type" v-if="item.balanceType == 6">分润提现</span>
              <span class="type" v-if="item.balanceType == 7">服务费提现</span>
              <span class="type" v-if="item.balanceType == 8">服务费提现</span>
              <span class="type" v-if="item.balanceType == 9">激活奖励提现</span>
              <span class="type" v-if="item.balanceType == 10">刷卡奖励提现</span>
              <span class="type" v-if="item.balanceType == 11">退款</span>
              <span class="type" v-if="item.balanceType == 12">手续费</span>
              <span class="type" v-if="item.balanceType == 13">上级提现</span>
              <span class="type" v-if="item.balanceType == 14">下级提现</span>
              <!-- <span class="Minus">{{item.cashTotal}}</span> -->
              <span>￥{{item.cashTotal}}</span>
            </p>
            <p>{{item.gmtCreate | formatDate}}</p>
          </li>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script>
const axios = require("axios");
import qs from "qs";
import {
  queryBalanceDetailRecord,
  checkToken,
  BASE_URL
} from "@/api/api.js";
import { Toast } from "mint-ui";
export default {
  name: "financialDetail",
  data() {
    return {
      status: 0,
      pageNumber: 0,
      loading: false, //控制上拉加载的加载动画
      finished: false, //控制在页面往下移动到底部时是否调用接口获取数据
      isLoading: false, //控制下拉刷新的加载动画
      nothing: false, // 没有数据
      deviceList: []
    };
  },
  filters: {
    formatDate: function(value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
    }
  },
  methods: {
    prev() {
      history.go(-1);
    },
    // 下拉刷新上拉加载
    init() {
      // 当前页数
      let data = {
        access_token: JSON.parse(window.localStorage.getItem("token"))
          .access_token,
        qdcrmUserId: JSON.parse(window.localStorage.getItem("userInfo"))
          .qdcrmUserId,
        pageSize: 20,
        page: 1,
        number: Math.random()
      };
      let self = this;
      axios
        .get(`${BASE_URL}/msmng/api/withdrawdeposit/queryBalanceDetailRecord`, {
          params: data
        })
        .then(response => {
          checkToken();
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
        self.init(); //加载数据
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
          pageSize: 20,
          page: self.pageNumber + 1,
          number: Math.random()
        };
        console.log(datatwo.page);
        axios
          .get(
            `${BASE_URL}/msmng/api/withdrawdeposit/queryBalanceDetailRecord`,
            {
              params: datatwo
            }
          )
          .then(response => {
            console.log(response.data);
            let res = response.data.data;
            console.log(res);
            if (res != null) {
              self.deviceList = self.deviceList.concat(res);
              self.loading = false;
              self.pageNumber++;
              console.log(res);
            } else {
              this.nothing = true;
            }
            if (res == null) {
              self.loading = false;
              self.finished = true;
            } else {
              self.finished = false;
            }
          })
          .catch(function(err) {
            console.log(err);
          });
      }, 500);
    }
  }
};
</script>
<style lang="less" scoped>
@blue: #1c8cff;
/* 头部 */
.mint-header {
  height: 1.2rem;
  font-size: 0.4rem;
  font-weight: 100;
  background: @blue;
}
.header_left {
  margin-left: 0.3rem;
}
.mint-header-title {
  overflow: visible;
}
/* 列表 */
.financialDetail_list {
  width: 100%;
  height: auto;
  background: #fff;
  position: absolute;
  top: 1.2rem;
  bottom: 0;
  li {
    width: 90%;
    height: 1.45rem;
    border-bottom: 1px solid #d9d9d9; /* no */
    margin: 0 auto;
    p {
      width: 100%;
      height: 0.7rem;
      line-height: 0.7rem;
      color: #606060;
      span {
        float: right;
        font-size: 0.4rem;
        color: #06a253;
        line-height: 1.45rem;
      }
    }
    .Minus {
      color: red;
    }
    .type {
      float: left;
      line-height: 0.7rem;
      color: #606060;
    }
    p:nth-child(1) {
      font-size: 0.4rem;
      color: #222222;
    }
  }
}
</style>
