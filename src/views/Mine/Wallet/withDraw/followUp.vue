<template>
  <div class="followUp">
    <!-- ============     提 现 进 度 查 询    ============ -->
    <!-- 进度查询界面 -->
    <mt-header title="提 现 进 度" fixed>
      <mt-button icon="back" @click="prev()" class="header_left" slot="left"></mt-button>
    </mt-header>
    <!-- 提现进度列表 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" v-if="showlist == true">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多数据了~"
        loading-text="加载中"
        @load="onLoad"
        :offset="30"
      >
        <div
          class="followUpList"
          v-for="(item,index) in list"
          :key="index"
          @click="showWihtDrawDetails(index,item)"
        >
          <ul>
            <li v-if="item.withdrawType==1">分润提现</li>
            <li v-if="item.withdrawType==2">服务费返现</li>
            <li v-if="item.withdrawType==3">服务费返现</li>
            <li v-if="item.withdrawType==4">激活奖励</li>
            <li v-if="item.withdrawType==5">刷卡奖励</li>
            <li>到账金额</li>
            <li>￥{{item.withdrawAmount}}</li>
            <li class="li">
              提现银行
              <span>{{item.bankName}} 尾号 ( {{item.bankCardTailNum}} )</span>
            </li>
            <li class="li">
              提现状态
              <span v-if="item.reviewStatus==1">待审核</span>
              <span v-if="item.reviewStatus==2">已审核</span>
              <span v-if="item.reviewStatus==3">审核失败</span>
              <span v-if="item.reviewStatus==4">银行处理中</span>
              <span v-if="item.reviewStatus==5">提现成功</span>
              <span v-if="item.reviewStatus==6">提现失败</span>
              <span v-if="item.reviewStatus==7">退款</span>
            </li>
            <li class="li">
              提现时间
              <span>{{item.gmtCreate | formatDate}}</span>
            </li>
            <li class="li">
              预计到账时间
              <span>{{item.predictAccountDate | formatDate}}</span>
            </li>
          </ul>
        </div>
      </van-list>
    </van-pull-refresh>
    <!-- 没有数据 -->
    <div class="noNotification" v-if="nothing == true">
      <img src="@/assets/image/Mine/nothing.png">
      <p>还没有提现记录~</p>
    </div>
  </div>
</template>
<script>
import { checkToken, BASE_URL } from "@/api/api.js";
import { MessageBox, Toast } from "mint-ui";
const axios = require("axios");
export default {
  name: "followUp",
  data() {
    return {
      pageNumber: 0,
      nothing: false, //没有数据
      showlist: true, // 数据列表
      loading: false, //控制上拉加载的加载动画
      finished: false, //控制在页面往下移动到底部时是否调用接口获取数据
      isLoading: false, //控制下拉刷新的加载动画
      list: [] // 数据列表
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
 /*      let data = {
        access_token: JSON.parse(window.localStorage.getItem("token"))
          .access_token,
        qdcrmUserId: JSON.parse(window.localStorage.getItem("userInfo"))
          .qdcrmUserId,
        pageSize: 10,
        page: this.pageNumber + 1,
        number: Math.random()
      };
      let self = this; */
    /*   axios
        .get(`${BASE_URL}/msmng/api/withdrawdeposit/queryWithdrawRecord`, {
          params: data
        })
        .then(response => {
          let res = response.data.data;
          console.log(res);
          // 用 data 里定义的空数组储存得到的数据
          self.list = res;
          console.log(self.list);
          // 向数组中追加内容
          self.list = self.list.concat(res);
          // 取消刷新动画
          self.isLoading = false;
        })
        .catch(function(err) {
          console.log(err);
        }); */
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
          pageSize: 10,
          page: this.pageNumber + 1,
          number: Math.random()
        };
        console.log(datatwo.page);
        axios
          .get(`${BASE_URL}/msmng/api/withdrawdeposit/queryWithdrawRecord`, {
            params: datatwo
          })
          .then(response => {
            console.log(response.data);
            let res = response.data.data;
            console.log(res);
            if (res != null) {
              self.list = self.list.concat(res);
              self.loading = false;
              self.pageNumber++;
              console.log(res);
            } else {
              if (res == null) {
                self.loading = false;
                self.finished = true;
              } else {
                self.finished = false;
              }
            }
          })
          .catch(function(err) {
            console.log(err);
          });
      }, 500);
    },
    showWihtDrawDetails(index, item) {
      this.$router.push({
        name: "WithdrawalSchedule",
        params: {
          id: index,
          item: item
        }
      });
    }
  },
  created() {
    checkToken();
    // 获取提现列表
  }
};
</script>
<style lang="less" scoped>
@blue: #1c8cff;
.nothing {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background: #f5f5f5 !important;
  text-align: center;
  img {
    width: 40%;
    margin-top: 5rem;
  }
  p {
    margin-top: 1rem;
  }
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
  font-size: 0.5rem;
}
/* allPages */
.followUp {
  position: absolute;
  width: 100%;
  top: 1.2rem;
  bottom: 0;
  background: #f5f5f5;
  .followUpList {
    width: 100%;
    height: 6.5;
    background: #fff;
    margin-bottom: 0.4rem;
    ul {
      width: 90%;
      height: auto;
      margin: 0 auto;
      li:nth-child(1) {
        font-size: 0.4rem;
        color: #1c8cff;
        width: 100%;
        height: 1.2rem;
        line-height: 1.2rem;
      }
      li:nth-child(2) {
        text-align: center;
        height: 1rem;
        line-height: 1rem;
        color: #606060;
        font-size: 0.3rem;
      }
      li:nth-child(3) {
        text-align: center;
        font-size: 0.5rem;
        font-weight: 600;
        width: 100%;
        height: 1rem;
        border-bottom: 1px solid #d9d9d9; /* no */
      }
      li:nth-child(5) {
        span {
          color: red;
        }
      }
      .li {
        width: 100%;
        height: 0.8rem;
        line-height: 0.8rem;
        span {
          float: right;
        }
      }
    }
  }
}
</style>
<style lang="less">
.mintui {
  font-size: 0.5rem !important;
}
</style>
