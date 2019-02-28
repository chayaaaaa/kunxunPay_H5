<template>
  <div class="terminalInfo">
    <!-- ================     会 员 交 易     ================ -->
    <mt-header title="终 端 信 息" fixed>
      <mt-button icon="back" @click="prev()" slot="left"></mt-button>
    </mt-header>
    <!-- 弹出层 -->
    <mt-popup v-model="showOrgan" popup-transition="popup-fade">
      <!-- title -->
      <div class="title">选 择 代 理 商</div>
       <van-picker :columns="queryAgents" @change="onChangeone"/>
      <div class="box cancel" @click="cancel()">取消</div>
      <div class="box Confirm" @click="Confirm()">确认</div>
    </mt-popup>
    <mt-popup v-model="showType" popup-transition="popup-fade">
      <div class="title">选 择 终 端 类 型</div>
      <!-- title -->
      <van-picker :columns="columns" @change="onChange"/>
      <div class="box cancel" @click="cel()">取消</div>
      <div class="box Confirm" @click="sure()">确认</div>
    </mt-popup>
    <!-- 选择栏 -->
    <div class="Choice">
      <li class="Cli" v-if="defaultvalue == true" @click="showOrgan = true">{{showText}}</li>
      <li class="Cli" v-if="IndexText == true" @click="showOrgan = true">{{showIndexText}}</li>
      <div class="CicTime">
        <!-- 搜索框 -->
        <div class="search">
          <input type="search" placeholder="请输入联系人电话查询" v-model="queryNO">
          <img src="@/assets/image/Manger/Trade/search.png" @click="queryTerminalDetail()">
        </div>
        <!-- 搜索页面 -->
        <!-- 包含下级 -->
        <van-checkbox class="include" v-model="checked" checked-color="#fff" @change="toggle()">包含下级</van-checkbox>
        <!-- 含未认证 -->
        <div class="consume">
          <li class="Cli change" v-if="display==true" @click="showType = true">POS终端</li>
          <li class="Cli change" v-if="showThis==true" @click="showType = true">{{textvalue}}</li>
        </div>
      </div>
      <div class="showDetail">
        <div class="left">
          <p>
            <img src="@/assets/image/Manger/Trade/fanxian.png">激活终端
          </p>
          <p>
            {{termActiveNum}}
            <span>台</span>
          </p>
        </div>
        <div class="right">
          <p>
            <img src="@/assets/image/Manger/Trade/jihuo.png">终端数量
          </p>
          <p>
            {{termTotalNum}}
            <span>台</span>
          </p>
        </div>
      </div>
    </div>
    <!-- 列表头部 -->
    <ul class="listTop">
      <li>终端类型</li>
      <li>序列号</li>
      <li>状态</li>
    </ul>
    <ul class="listTal" v-if="showList == true">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多数据了~"
          loading-text="加载中"
          @load="onLoad"
          :offset="30"
        >
          <li v-for="(item,index) in deviceList" :key="index">
            <span v-if="item.terminalExtraBaseModel.termStyle == 'LARGE_TERMINAL'">大型终端</span>
            <span v-if="item.terminalExtraBaseModel.termStyle == 'POS_TERMINAL'">POS终端</span>
            <span v-if="item.terminalExtraBaseModel.termStyle == 'QRCODE_TERMINAL'">二维码终端</span>
            <span v-if="item.terminalExtraBaseModel.termStyle == 'ACTIVCODE_TERMINAL'">激活码终端</span>
            <span>{{item.terminalExtraBaseModel.posId}}</span>
            <span v-if="item.terminalExtraBaseModel.status == 'ACTIVATED'">已开通</span>
            <span v-if="item.terminalExtraBaseModel.status == 'WAIT_ACTIVATION'">未开通</span>
            <span v-if="item.terminalExtraBaseModel.status == 'LOG_OUT'">已停用</span>
            <span v-if="item.terminalExtraBaseModel.status == 'LOG_OFF'">已注销</span>
          </li>
        </van-list>
      </van-pull-refresh>
    </ul>
    <!-- 列表 -->
    <ul class="listTal" v-if="showQueryList == true">
      <li v-for="(item,index) in querymemberDeals" :key="index">
        <span v-if="item.terminalExtraBaseModel.termStyle == 'LARGE_TERMINAL'">大型终端</span>
        <span v-if="item.terminalExtraBaseModel.termStyle == 'POS_TERMINAL'">POS终端</span>
        <span v-if="item.terminalExtraBaseModel.termStyle == 'QRCODE_TERMINAL'">二维码终端</span>
        <span v-if="item.terminalExtraBaseModel.termStyle == 'ACTIVCODE_TERMINAL'">激活码终端</span>
        <span>{{item.terminalExtraBaseModel.posId}}</span>
        <span class="YKT" v-if="item.terminalExtraBaseModel.status == 'ACTIVATED'">已开通</span>
        <span class="WKT" v-if="item.terminalExtraBaseModel.status == 'WAIT_ACTIVATION'">未开通</span>
        <span class="YTY" v-if="item.terminalExtraBaseModel.status == 'LOG_OUT'">已停用</span>
        <span class="YZX" v-if="item.terminalExtraBaseModel.status == 'LOG_OFF'">已注销</span>
      </li>
      <P>没有更多数据了~</P>
    </ul>
    <ul class="nothing" v-if="showNothing == true">
      <img src="@/assets/image/Manger/Trade/nothing.png">
      <p>未获取到数据，请重新设置查询条件</p>
    </ul>
    <!--    tabbar -->
    <div class="footer">
      <van-tabbar v-model="active">
        <van-tabbar-item @click="toTerminalInfo()">
          <span>终端信息</span>
          <img slot="icon" slot-scope="props" :src="props.active ? icon.active : icon.normal">
        </van-tabbar-item>
        <van-tabbar-item @click="toRemoveTerminal()">
          <span>终端转移</span>
          <img slot="icon" slot-scope="props" :src="props.active ? icon.active2 : icon.normal2">
        </van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>
<script>
const searchPage = () => import("@/views/Manger/Order/searchPage.vue");
import "@/CSSFILE/tabbar.css";
import "@/CSSFILE/Order.css";
import "@/CSSFILE/input.css";
import { Toast } from "mint-ui";
const axios = require("axios");
import {
  queryTerminal,
  checkToken,
  getRefreshToken,
  BASE_URL
} from "@/api/api.js";
export default {
  name: "terminalInfo",
  data() {
    return {
      active: 0,
      cur: 1,
      current: 0,
      /* 选择弹框 */
      showOrgan: false,
      /* 选择器 */
      columns: ["POS终端", "二维码终端", "激活码终端"],
      /* 头部含未消费的值 */
      checked: true,
      IndexText: false, // 选择的
      showText: JSON.parse(window.localStorage.getItem("userInfo")).name, // 显示总代理
      /* tabbar */
      icon: {
        normal: require("@/assets/image/Manger/terminal/icon05.png"),
        active: require("@/assets/image/Manger/terminal/icon05_choice.png"),
        normal2: require("@/assets/image/Manger/terminal/icon06.png"),
        active2: require("@/assets/image/Manger/terminal/icon06_choice.png")
      },
      queryTerminalList: [], //
      selectedCheck: [], //遍历数组
      /* 下拉加载 */
      pageNumber: 0, // 当前页
      showList: true, // 显示列表
      showNothing: false, // 没有数据
      termActiveNum: "", // 激活总数
      termTotalNum: "", // 终端总数
      listDetails: [], // 初始化数据
      deviceList: [], //用于存放加载的数据
      totalPage: 0, // 总数page
      pageNumber: 0, // 当前页
      loading: false, //控制上拉加载的加载动画
      finished: false, //控制在页面往下移动到底部时是否调用接口获取数据
      isLoading: false, //控制下拉刷新的加载动画
      valueLength: "", // 数据长度
      showListPages: true, // 原始数据
      showQueryList: false, // 查询数据
      nothing: false, // 没有数据
      querymemberDeals: [],
      optionValue: "", //选择代理商的value
      queryAgents: [], // 储存代理商数据
      showText: JSON.parse(window.localStorage.getItem("userInfo")).name, // 总代理
      typeValue: "", // 终端类型
      showType: false, // 终端类型选择框
      textvalue: "", //终端名称
      queryNO: "", // 输入会员号
      defaultvalue: true, // 默认打开
      display: true,
      showThis: false,
      showIndexText: ""// 选择代理商
    };
  },
  methods: {
    prev() {
      this.$router.go(-1);
    },
    toTerminalInfo() {
      this.$router.push("/terminalInfo");
    },
    toRemoveTerminal() {
      this.$router.push("/removeTerminal");
    },
    onChange(picker, value, index) {
      if (index == 0) {
        this.typeValue = 2;
      } else if (index == 1) {
        this.typeValue = 3;
      } else if (index == 2) {
        this.typeValue = 4;
      }
      this.textvalue = value;
      console.log(this.typeValue);
    },
        onChangeone(picker, value, index) {
      this.showIndexText = value.text;
      this.value = value.id;
      console.log(this.showIndexText);
      console.log(this.value);
      console.log(index);
    },
    cel() {
      this.showType = false;
    },
    toggle() {
      console.log(this.checked);
      if (this.checked == true) {
        let queryData = {
          qdcrmUserId: this.value,
          access_token: JSON.parse(window.localStorage.getItem("token"))
            .access_token,
          currentPage: "1",
          contionsLower: "on",
          termStyle: this.typeValue,
          contactPhone: "",
          number: Math.random()
        };
        axios
          .get(`${BASE_URL}/msmng/api/terminal/queryTerminal`, {
            params: queryData
          })
          .then(response => {
            console.log(response.data);
            let _this = this;
            let listDetails = response.data.data.terminals;
            console.log(listDetails.length);
            if (listDetails.length == 0) {
              let _this = this;
              _this.showList = false;
              _this.showQueryList = false;
              _this.showNothing = true;
              _this.termActiveNum = 0;
              _this.termTotalNum = 0;
            } else {
              let _this = this;
              _this.querymemberDeals = listDetails;
              console.log(_this.querymemberDeals);
              _this.termActiveNum = response.data.data.termActiveNum;
              _this.termTotalNum = response.data.data.termTotalNum;
              _this.showList = false;
              _this.showQueryList = true;
              _this.showNothing = false;
            }
          })
          .catch(function(err) {
            Toast(err.message);
          });
      } else {
        let queryData = {
          qdcrmUserId: this.value,
          access_token: JSON.parse(window.localStorage.getItem("token"))
            .access_token,
          currentPage: "1",
          contionsLower: "",
          termStyle: this.typeValue,
          contactPhone: "",
          number: Math.random()
        };
        axios
          .get(`${BASE_URL}/msmng/api/terminal/queryTerminal`, {
            params: queryData
          })
          .then(response => {
            console.log(response.data);
            let _this = this;
            let listDetails = response.data.data.terminals;
            console.log(listDetails.length);
            if (listDetails.length == 0) {
              let _this = this;
              _this.showList = false;
              _this.showQueryList = false;
              _this.showNothing = true;
              _this.termActiveNum = 0;
              _this.termTotalNum = 0;
            } else {
              let _this = this;
              _this.querymemberDeals = listDetails;
              console.log(_this.querymemberDeals);
              _this.termActiveNum = response.data.data.termActiveNum;
              _this.termTotalNum = response.data.data.termTotalNum;
              _this.showList = false;
              _this.showQueryList = true;
              _this.showNothing = false;
            }
          })
          .catch(function(err) {
            Toast(err.message);
          });
      }
    },
    sure() {
      let queryData = {
        qdcrmUserId: this.value,
        access_token: JSON.parse(window.localStorage.getItem("token"))
          .access_token,
        currentPage: "1",
        contionsLower: "on",
        termStyle: this.typeValue,
        contactPhone: "",
        number: Math.random()
      };
      axios
        .get(`${BASE_URL}/msmng/api/terminal/queryTerminal`, {
          params: queryData
        })
        .then(response => {
          console.log(response.data);
          let _this = this;
          let listDetails = response.data.data.terminals;
          console.log(listDetails.length);
          if (listDetails.length == 0) {
            let _this = this;
            _this.showList = false;
            _this.showQueryList = false;
            _this.showNothing = true;
            _this.termActiveNum = 0;
            _this.termTotalNum = 0;
          } else {
            let _this = this;
            _this.querymemberDeals = listDetails;
            console.log(_this.querymemberDeals);
            _this.termActiveNum = response.data.data.termActiveNum;
            _this.termTotalNum = response.data.data.termTotalNum;
            _this.showList = false;
            _this.showQueryList = true;
            _this.showNothing = false;
          }
        })
        .catch(function(err) {
          Toast(err.message);
        });
      this.showType = false;
      this.display = false;
      this.showThis = true;
    },
    queryTerminalDetail() {
      console.log(this.queryNO);
      let queryData = {
        qdcrmUserId: this.value,
        access_token: JSON.parse(window.localStorage.getItem("token"))
          .access_token,
        currentPage: "1",
        contionsLower: "on",
        termStyle: this.typeValue,
        contactPhone: this.queryNO,
        number: Math.random()
      };
      axios
        .get(`${BASE_URL}/msmng/api/terminal/queryTerminal`, {
          params: queryData
        })
        .then(response => {
          console.log(response.data);
          let _this = this;
          let listDetails = response.data.data.terminals;
          console.log(listDetails.length);
          if (listDetails.length == 0) {
            let _this = this;
            _this.showList = false;
            _this.showQueryList = false;
            _this.showNothing = true;
            _this.termActiveNum = 0;
            _this.termTotalNum = 0;
          } else {
            let _this = this;
            _this.querymemberDeals = listDetails;
            console.log(_this.querymemberDeals);
            _this.termActiveNum = response.data.data.termActiveNum;
            _this.termTotalNum = response.data.data.termTotalNum;
            _this.showList = false;
            _this.showQueryList = true;
            _this.showNothing = false;
          }
        })
        .catch(function(err) {
          Toast(err.message);
        });
    },
    Confirm() {
      let queryData = {
        qdcrmUserId: this.value,
        access_token: JSON.parse(window.localStorage.getItem("token"))
          .access_token,
        currentPage: "1",
        contionsLower: "on",
        termStyle: "2",
        contactPhone: "",
        number: Math.random()
      };
      console.log(this.value);
      axios
        .get(`${BASE_URL}/msmng/api/terminal/queryTerminal`, {
          params: queryData
        })
        .then(response => {
          console.log(response.data);
          let _this = this;
          let listDetails = response.data.data.terminals;
          console.log(listDetails.length);
          if (listDetails.length == 0) {
            let _this = this;
            _this.showList = false;
            _this.showQueryList = false;
            _this.showNothing = true;
            _this.termActiveNum = 0;
            _this.termTotalNum = 0;
          } else {
            let _this = this;
            _this.querymemberDeals = listDetails;
            console.log(_this.querymemberDeals);
            _this.termActiveNum = response.data.data.termActiveNum;
            _this.termTotalNum = response.data.data.termTotalNum;
            _this.showList = false;
            _this.showQueryList = true;
            _this.showNothing = false;
          }
        })
        .catch(function(err) {
          Toast(err.message);
        });
      this.showOrgan = false;
      this.defaultvalue = false;
      this.IndexText = true;
    },
    cancel() {
      this.showOrgan = false;
    },
    // 下拉刷新上拉加载
    init() {
      // 当前页数
      let data = {
        currentPage: this.pageNumber + 1
      };
      let self = this;
      queryTerminal(data)
        .then(response => {
          getRefreshToken();
          let res = response.data.data.terminals;
          console.log(res);
          // 用 data 里定义的空数组储存得到的数据
          self.deviceList = res;
          console.log(self.deviceList);
          // 储存总页数
          self.totalPage = response.data.data.paginator.pages;
          // 向数组中追加内容
          self.deviceList = self.deviceList.concat(res);
          // 取消刷新动画
          self.isLoading = false;
        })
        .catch({
          function(error) {
            Toast(response.message);
          }
        });
    },
    //下拉刷新
    onRefresh() {
      let self = this;
      setTimeout(() => {
        self.totalPage = 0;
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
      getRefreshToken();
      let self = this;
      setTimeout(() => {
        let data = this.$qs.stringify({
          currentPage: self.pageNumber + 1
        });
        window.sessionStorage.setItem("page", JSON.stringify(data));
        queryTerminal(data)
          .then(response => {
            console.log(response.data);
            let data = response.data.data;
            let res = data.terminals;
            console.log(res);
            self.totalPage = data.paginator.pages;
            console.log(self.totalPage);
            self.deviceList = self.deviceList.concat(res);
            self.loading = false;
            self.pageNumber++;
            self.termTotalNum = data.termTotalNum;
            self.termActiveNum = data.termActiveNum;
            self.valueLength = data.paginator.length;
            console.log(self.valueLength);
            if (self.pageNumber >= self.totalPage) {
              self.finished = true;
            } else {
              self.finished = false;
            }
            if (self.valueLength == 0) {
              self.showList = false;
              self.showNothing = true;
            }
          })
          .catch({
            function(error) {
              Toast(response.message);
            }
          });
      }, 500);
    }
  },
  mounted() {
    getRefreshToken();
    let queryData = {
      qdcrmUserId: JSON.parse(window.localStorage.getItem("userInfo"))
        .qdcrmUserId,
      access_token: JSON.parse(window.localStorage.getItem("token"))
        .access_token
    };
    axios
      .get(`${BASE_URL}/msmng/api/agent/getAgentTree`, {
        params: queryData
      })
      .then(response => {
        this.queryAgents = response.data.data;
        console.log(this.queryAgents);
      })
      .catch(function(err) {
        Toast(err.message);
      });
  }
};
</script>
<style lang="less" scoped>
@blue: #1c8cff;
/* 头部 */
.terminalInfo {
  background: #f5f5f5;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  input {
    background: rgba(0, 0, 0, 0);
    color: #fff;
  }
  .Cli{
    overflow: hidden;
  /*   white-space: nowrap; */
  }
  /* 代理商选择 */
  .select {
    width: 50%;
    height: 1rem;
    margin-left: 25%;
    margin-bottom: 1rem;
    margin-top: 1rem;
    border: none;
    border-top: 1px solid #1c8cff; /* no */
    border-bottom: 1px solid #1c8cff; /* no */
    background: #fff;
    outline: none;
    option {
      outline: none;
      border: 1px solid #1c8cff; /* no */
    }
  }
  /* 没有数据 */
  .nothing {
    width: 100%;
    position: absolute;
    top: 6.2rem;
    bottom: 0;
    text-align: center;
    img {
      margin-top: 2rem;
      width: 4rem;
    }
    p {
      margin-top: 0.5rem;
    }
  }
  /* 列表 */
  .listTop {
    li {
      width: 100%;
    }
  }
  .search {
    border: 0.014rem solid #fff;
    border-radius: 0.1rem;
    background: rgba(0, 0, 0, 0);
    height: 0.6rem;
    line-height: 0.6rem;
    width: 3.8rem;
    padding-left: 0.2rem;
    margin-left: 3rem;
    padding-right: 0.2rem;
    input {
      width: 3.4rem;
    }
    img {
      width: 0.4rem;
      display: block;
      margin-top: 0.1rem;
      float: right;
    }
  }
  .consume {
    width: 2rem;
    position: absolute;
    top: 0.55rem;
    right: 0.5rem;
  }
  .include {
    position: absolute;
    line-height: 0.7rem;
    top: -0.9rem;
    right: 0.5rem;
    z-index: 100;
    color: #fff;
  }
  .change {
    width: 2rem;
  }
  .listTal {
    width: 100%;
    height: auto;
    li {
      width: 90%;
      margin-left: 5%;
      height: 1.2rem;
      border-bottom: 1px solid #d9d9d9; /* no */
      text-align: center;
      line-height: 1.2rem;
      span {
        display: inline-block;
        width: 32.6%;
        height: 1.2rem;
        font-size: 0.35rem;
      }
      .YKT {
        color: #1c8cff;
        font-weight: 800;
      }
      .YTY,
      .YZX,
      .WKT {
        color: #e3383e;
        font-weight: 800;
      }
    }
    p {
      height: 2.5rem;
      line-height: 1rem;
      text-align: center;
      background: #f5f5f5;
    }
  }
}
.van-checkbox__icon--checked .van-icon {
  color: #1c8cff;
  font-size: 0.25rem;
  width: 0.35rem;
  height: 0.35rem;
}
.van-checkbox__icon--round .van-icon {
  width: 0.35rem;
  height: 0.35rem;
}
.van-icon-success::before {
  margin-top: 0.045rem;
}
.van-checkbox__label {
  font-size: 0.3rem;
}

.el-date-editor .el-range-input {
  color: #fff;
}
.el-input__inner:hover {
  color: #fff;
}
.el-range-editor.el-input__inner {
  margin-left: -0rem;
  width: 4.5rem;
}
</style>

<style lang="less">
.van-picker__columns {
  margin-bottom: -1.5rem;
  .van-picker-column {
    margin-top: -1rem;
  }
  .van-hairline--top-bottom {
    width: 30% !important;
    margin-left: 35%;
  }

  .van-hairline--top-bottom::after {
    border: 1px solid #1c8cff !important;
    border-left: none !important;
    border-right: none !important;
  }
  .van-picker__frame,
  .van-picker__loading .van-loading {
    top: 32%;
  }
}
</style>
