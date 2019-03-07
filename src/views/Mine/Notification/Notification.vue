<template>
  <div class="Notification">
    <!-- =================      消 息 通 知 页 面        ================= -->
    <mt-header title="消 息" fixed>
      <mt-button icon="back" @click="prev()" slot="left" class="header_left"></mt-button>
    </mt-header>
    <div class="Notification_body">
      <div class="topNavBar">
        <li @click="showBusinessMessage()">
          <img src="@/assets/image/Mine/ic-bmsg.png">
          <p class="curr" v-if="showMsgOne==true">业务消息</p>
          <p v-else>业务消息</p>
        </li>
        <li @click="showSystemInformation()">
          <img src="@/assets/image/Mine/ic-xmsg.png">
          <p class="curr" v-if="showMsgTwo==true">系统消息</p>
          <p v-else>系统消息</p>
        </li>
        <li @click="showSystemNotification()">
          <img src="@/assets/image/Mine/ic-nmsg.png">
          <p class="curr" v-if="showMsgThree==true">系统公告</p>
          <p v-else>系统公告</p>
        </li>
      </div>
      <!-- 列表 -->
      <div class="Notification_list 1" v-if="showMsgOne==true">
        <van-pull-refresh v-model="isLoading" @refresh="onRefreshOne">
          <van-list
            v-model="loadingOne"
            :finished="finished"
            finished-text="没有更多数据了~"
            loading-text="加载中"
            @load="onLoadOne"
            :offset="30"
          >
            <li v-for="(item,index) in deviceList" :key="index">
              <p>
                {{item.title}}
                <span>{{item.gmtCreate}}</span>
              </p>
              <p>{{item.msgContent}}</p>
            </li>
          </van-list>
        </van-pull-refresh>
      </div>
      <div class="Notification_list 2" v-if="showMsgTwo==true">
        <van-pull-refresh v-model="isLoading" @refresh="onRefreshTwo">
          <van-list
            v-model="loadingTwo"
            :finished="finished"
            finished-text="没有更多数据了~"
            loading-text="加载中"
            @load="onLoadTwo"
            :offset="30"
          >
            <li v-for="(item,index) in deviceList" :key="index">
              <p>
                {{item.title}}
                <span>{{item.gmtCreate}}</span>
              </p>
              <p>{{item.msgContent}}</p>
            </li>
          </van-list>
        </van-pull-refresh>
      </div>

      <!-- 消息 3 -->
      <div class="Notification_list 3" v-if="showMsgThree==true">
        <van-pull-refresh v-model="isLoading" @refresh="onRefreshThree">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多数据了~"
            loading-text="加载中"
            @load="onLoadThree"
            :offset="30"
          >
            <li v-for="(item,index) in deviceList" :key="index">
              <p>
                {{item.title}}
                <span>{{item.gmtCreate}}</span>
              </p>
              <p>{{item.msgContent}}</p>
            </li>
          </van-list>
        </van-pull-refresh>
      </div>
      <div class="noNotification" v-if="nothing == true">
        <img src="@/assets/image/Mine/nothing.png">
        <p>暂无消息</p>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
const axios = require("axios");
import { showAllMessage, getRefreshToken, BASE_URL } from "@/api/api.js";
export default {
  inject: ["reload"],
  name: "Notification",
  data() {
    return {
      current: 1,
      status: "",
      showMsgOne: true,
      showMsgTwo: false,
      showMsgThree: false,
      messageDetails: [],
      loadingOne: false,
      loadingTwo: false,
      loading: false, //控制上拉加载的加载动画
      finished: false, //控制在页面往下移动到底部时是否调用接口获取数据
      isLoading: false, //控制下拉刷新的加载动画
      deviceList: [], //用于存放加载的数据
      totalPage: 0, // 总数page
      pageNumber: 0, // 当前页
      nothing: false, // 没有数据
      valueLength: "", //数据长度
      type: ""
    };
  },
  methods: {
    // 返回
    prev() {
      this.$router.go(-1);
      this.reload();
    },
    // 业务消息
    showBusinessMessage() {
      this.showMsgOne = true;
      this.showMsgTwo = false;
      this.showMsgThree = false;
      this.type = 1;
      this.onLoadOne();
      this.onRefreshOne();
    },
    // 系统消息
    showSystemInformation() {
      this.showMsgOne = false;
      this.showMsgTwo = true;
      this.showMsgThree = false;
      this.type = 2;
      this.onLoadTwo();
      this.onRefreshTwo();
    },
    // 系统公告
    showSystemNotification() {
      this.showMsgOne = false;
      this.showMsgTwo = false;
      this.showMsgThree = true;
      this.type = 3;
      this.onLoadThree();
      this.onRefreshThree();
    },
    //第一项数据
    initOne() {
      let self = this;
      // 当前页数
      let data = {
        access_token: JSON.parse(window.localStorage.getItem("token"))
          .access_token,
        qdcrmUserId: JSON.parse(window.localStorage.getItem("userInfo"))
          .qdcrmUserId,
        pageNum: self.pageNumber + 1,
        type: this.type,
        number: Math.random()
      };
      getRefreshToken();
      axios
        .get(`${BASE_URL}/msmng/api/message/showAllMessage`, {
          params: data
        })
        .then(response => {
          console.log(response);
          let res = response.data.data.messages;
          console.log(res);
          // 用 data 里定义的空数组储存得到的数据
          self.deviceList = res;
          console.log(self.deviceList);
          // 储存总页数
          self.totalPage = response.data.data.pages;
          // 向数组中追加内容
          self.deviceList = self.deviceList.concat(res);
          // 取消刷新动画
          self.isLoading = false;
        })
        .catch(function(err) {
           Toast(err);
        });
    },
    //下拉刷新
    onRefreshOne() {
      let self = this;
      setTimeout(() => {
        self.totalPage = 0;
        self.pageNumber = 0;
        Toast({
          message: "刷新成功"
        });
        this.isLoading = false;
        self.initOne(); //加载数据
      }, 500);
    },
    //页面初始化之后会触发一次，在页面往下加载的过程中会多次调用【上拉加载】
    onLoadOne() {
      this.type = 1;
      getRefreshToken();
      let self = this;
      setTimeout(() => {
        let data = {
          access_token: JSON.parse(window.localStorage.getItem("token"))
            .access_token,
          qdcrmUserId: JSON.parse(window.localStorage.getItem("userInfo"))
            .qdcrmUserId,
          pageNum: self.pageNumber + 1,
          type: this.type,
          number: Math.random()
        };
        axios
          .get(`${BASE_URL}/msmng/api/message/showAllMessage`, {
            params: data
          })
          .then(response => {
            console.log(response);
            if (response.data.data == null) {
              this.nothing = true;
              this.showMsgOne = false;
            } else if (response.data.data != null) {
              this.nothing = false;
              this.showMsgOne = true;
              let obj = response.data.data.messages;
              console.log(obj);
              self.totalPage = response.data.data.pages;
              console.log(self.totalPage);
              self.deviceList = self.deviceList.concat(obj);
              console.log(self.deviceList);
              console.log(this.pageNumber);
              self.loadingOne = false;
              self.pageNumber++;
              if (self.pageNumber >= self.totalPage) {
                self.finished = true;
              } else {
                self.finished = false;
              }
              self.onRefreshTwo();
            }
          })
          .catch(function(err) {
             Toast(err);
          });
      }, 500);
    },

    // 第二项数据 下拉刷新上拉加载
    initTwo() {
      let self = this;
      // 当前页数
      let data = {
        access_token: JSON.parse(window.localStorage.getItem("token"))
          .access_token,
        qdcrmUserId: JSON.parse(window.localStorage.getItem("userInfo"))
          .qdcrmUserId,
        pageNum: self.pageNumber + 1,
        type: this.type,
        number: Math.random()
      };
      getRefreshToken();
      axios
        .get(`${BASE_URL}/msmng/api/message/showAllMessage`, {
          params: data
        })
        .then(response => {
          console.log(response);
          let res = response.data.data.messages;
          console.log(res);
          // 用 data 里定义的空数组储存得到的数据
          self.deviceList = res;
          console.log(self.deviceList);
          // 储存总页数
          self.totalPage = response.data.data.pages;
          // 向数组中追加内容
          self.deviceList = self.deviceList.concat(res);
          // 取消刷新动画
          self.isLoading = false;
        })
        .catch(function(err) {
          Toast(err);
        });
    },
    //下拉刷新
    onRefreshTwo() {
      let self = this;
      setTimeout(() => {
        self.totalPage = 0;
        self.pageNumber = 0;
        Toast({
          message: "刷新成功"
        });
        this.isLoading = false;
        self.initTwo(); //加载数据
      }, 500);
    },
    //页面初始化之后会触发一次，在页面往下加载的过程中会多次调用【上拉加载】
    onLoadTwo() {
      getRefreshToken();
      let self = this;
      setTimeout(() => {
        let data = {
          access_token: JSON.parse(window.localStorage.getItem("token"))
            .access_token,
          qdcrmUserId: JSON.parse(window.localStorage.getItem("userInfo"))
            .qdcrmUserId,
          pageNum: self.pageNumber + 1,
          type: this.type,
          number: Math.random()
        };
        axios
          .get(`${BASE_URL}/msmng/api/message/showAllMessage`, {
            params: data
          })
          .then(response => {
            console.log(response);
            if (response.data.data == null) {
              this.showMsgTwo = false;
              this.nothing = true;
            } else {
              this.showMsgTwo = true;
              this.nothing = false;
              let obj = response.data.data.messages;
              console.log(obj);
              self.totalPage = response.data.data.pages;
              console.log(self.totalPage);
              self.deviceList = self.deviceList.concat(obj);
              console.log(self.deviceList);
              console.log(this.pageNumber);
              self.loadingTwo = false;
              self.pageNumber++;
              if (self.pageNumber >= self.totalPage) {
                self.finished = true;
              } else {
                self.finished = false;
              }
              self.onRefreshTwo();
            }
          })
          .catch(function(err) {
            Toast(err);
          });
      }, 500);
    },

    // 第三项数据 下拉刷新上拉加载
    initThree() {
      let self = this;
      // 当前页数
      let data = {
        access_token: JSON.parse(window.localStorage.getItem("token"))
          .access_token,
        qdcrmUserId: JSON.parse(window.localStorage.getItem("userInfo"))
          .qdcrmUserId,
        pageNum: self.pageNumber + 1,
        type: this.type,
        number: Math.random()
      };
      getRefreshToken();
      axios
        .get(`${BASE_URL}/msmng/api/message/showAllMessage`, {
          params: data
        })
        .then(response => {
          console.log(response);
          let res = response.data.data.messages;
          console.log(res);
          // 用 data 里定义的空数组储存得到的数据
          self.deviceList = res;
          console.log(self.deviceList);
          // 储存总页数
          self.totalPage = response.data.data.pages;
          // 向数组中追加内容
          self.deviceList = self.deviceList.concat(res);
          // 取消刷新动画
          self.isLoading = false;
        })
        .catch(function(err) {
         Toast('暂无消息');
        });
    },
    //下拉刷新
    onRefreshThree() {
      let self = this;
      setTimeout(() => {
        self.totalPage = 0;
        self.pageNumber = 0;
        Toast({
          message: "刷新成功"
        });
        this.isLoading = false;
        self.initThree(); //加载数据
      }, 500);
    },
    //页面初始化之后会触发一次，在页面往下加载的过程中会多次调用【上拉加载】
    onLoadThree() {
      getRefreshToken();
      let self = this;
      setTimeout(() => {
        let data = {
          access_token: JSON.parse(window.localStorage.getItem("token"))
            .access_token,
          qdcrmUserId: JSON.parse(window.localStorage.getItem("userInfo"))
            .qdcrmUserId,
          pageNum: self.pageNumber + 1,
          type: this.type,
          number: Math.random()
        };
        axios
          .get(`${BASE_URL}/msmng/api/message/showAllMessage`, {
            params: data
          })
          .then(response => {
            console.log(response);
            if (response.data.data == null) {
              this.showMsgThree = false;
              this.nothing = true;
              }else if(response.data.data != null){
                 this.showMsgThree = true;
              this.nothing = false;
              let obj = response.data.data.messages;
              console.log(obj);
              self.totalPage = response.data.data.pages;
              console.log(self.totalPage);
              self.deviceList = self.deviceList.concat(obj);
              console.log(self.deviceList);
              console.log(this.pageNumber);
              self.loading = false;
              self.pageNumber++;
              if (self.pageNumber >= self.totalPage) {
                self.finished = true;
              } else {
                self.finished = false;
              }
              self.onRefreshThree();
            }
          })
          .catch(function(err) {
            Toast(err.message);
          });
      }, 500);
    }
  }
};
</script>
<style lang="less" scoped>
@blue: #1c8cff;
@body: #f1f9ff;
.Notification {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  background: @body;
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
}
.Notification_body {
  width: 100%;
  position: absolute;
  top: 1.2rem;
  .topNavBar {
    width: 90%;
    height: 2.7rem;
    background: #fff;
    margin: 0 auto;
    margin-top: 0.3rem;
    border-radius: 5px; /* no */
    box-shadow: 0px 5px 10px rgb(227, 240, 250); /* no */
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: space-around;
    justify-content: space-around;
    li {
      width: 20%;
      height: 2rem;
      margin-top: 0.4rem;
      text-align: center;
      color: #606060;
      img {
        width: 70%;
      }
      p {
        margin-top: 0.2rem;
      }
    }
    .curr {
      color: @blue;
    }
  }
  /* 列表 */
  .Notification_list {
    width: 100%;
    height: auto;
    background: #fff;
    margin-top: 0.3rem;
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
          font-size: 0.3rem;
          color: #606060;
        }
      }
      p:nth-child(1) {
        font-size: 0.4rem;
        color: #222222;
      }
    }
  }
  .noNotification {
    width: 100%;
    height: auto;
    margin-top: 0.3rem;
    text-align: center;
    margin-top: 3rem;
    img {
      display: block;
      width: 30%;
      height: 30%;
      margin: 0 auto;
    }
    p {
      margin-top: 0.3rem;
    }
  }
}
</style>
