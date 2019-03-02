<template>
  <div class="queryAgent">
    <!-- ==========================    代 理 信 息 页 面   ============================= -->
    <mt-header title="代理信息" fixed v-show="cur === 0" :class="{'curr':cur === 0}">
      <mt-button icon="back" @click="prev()" slot="left"></mt-button>
      <mt-button slot="right" @click="show = true">筛选</mt-button>
    </mt-header>
    <div class="listPage" v-if="showListPages==true">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div class="div">
          <van-loading type="spinner" size="40px"/>
        </div>
        <ul class="listTop_queryAgent" v-show="cur === 0" :class="{'curr':cur === 0}">
          <li>类型</li>
          <li>商户名</li>
          <li>联系人</li>
          <li>联系电话</li>
        </ul>
        <ul class="listTital" v-show="cur === 0" :class="{'curr':cur === 0}">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多数据了~"
            loading-text="加载中"
            @load="onLoad"
            :offset="30"
          >
            <li v-for="(item,index) in deviceList" :key="index" @click="toAgentDetails(index,item)">
              <span v-if="item.bizType=='O' || item.bizType=='o'">机构</span>
              <span v-if="item.bizType=='P'">省代理</span>
              <span v-if="item.bizType=='C'">市代理</span>
              <span v-if="item.bizType=='D'">区县代理</span>
              <span v-if="item.bizType=='A'">代办点</span>
              <span v-if="item.bizType=='I'">行业代理</span>
              <span>{{ item.merchantName }}</span>
              <span>{{ item.contactName }}</span>
              <span>{{ item.mobile.replace(/^(\d{3})(\d*)(\d{4})$/, function (a, b, c, d) { return b + c.replace(/\d/g, "*") + d; }) }}</span>
            </li>
          </van-list>
        </ul>
      </van-pull-refresh>
    </div>
    <!-- 搜索的数据 -->
    <li class="showThisLi" v-if="showQueryList==true">
      <ul class="listTop_queryAgent">
        <li>类型</li>
        <li>商户名</li>
        <li>联系人</li>
        <li>联系电话</li>
      </ul>
      <ul class="listTital">
        <li
          v-for="(item,index) in queryAgentDetail.list"
          :key="index"
          @click="toAgentDetails(index,item)"
        >
          <span v-if="item.bizType=='O' || item.bizType=='o'">机构</span>
          <span v-if="item.bizType=='P'">省代理</span>
          <span v-if="item.bizType=='C'">市代理</span>
          <span v-if="item.bizType=='D'">区县代理</span>
          <span v-if="item.bizType=='A'">代办点</span>
          <span v-if="item.bizType=='I'">行业代理</span>
          <span>{{ item.merchantName }}</span>
          <span>{{ item.contactName }}</span>
          <span>{{ item.mobile.replace(/^(\d{3})(\d*)(\d{4})$/, function (a, b, c, d) { return b + c.replace(/\d/g, "*") + d; }) }}</span>
        </li>
      </ul>
    </li>
    <!-- 没有数据时显示 -->
    <div class="nothing" v-if="nothing==true">
      <img src="@/assets/image/Manger/Trade/nothing.png">
      <p>未获取到数据，请重新设置查询条件</p>
    </div>
    <!-- ==========     弹 出  代 理 信 息 筛 选 模 态 框    ========== -->
    <div class="alertPage" v-if="show==true" @click="show=false" @touchmove.prevent></div>
    <transition name="slide-fade">
      <form class="innerPage" v-if="show==true" @touchmove.prevent>
        <ul>
          <li>
            <span>联系人</span>
            <input type="text" placeholder="请输入联系人" v-model="Linkman">
          </li>
          <li>
            <span>联系电话</span>
            <input type="number" placeholder="请输入联系电话" v-model="Linkphone">
          </li>
          <li>
            <span>商户号</span>
            <input type="text" placeholder="请输入商户号" v-model="MerchantNo">
          </li>
          <li>
            <span>商户名</span>
            <input type="text" placeholder="请输入商户名" v-model="MerchantName">
          </li>
        </ul>
        <!-- 代理状态 -->
        <div class="agenticState">
          <ul>
            <li>
              <span></span>
              <span>代理状态</span>
            </li>
            <el-radio-group v-model="state">
              <el-radio-button label="全部"></el-radio-button>
              <el-radio-button label="正常"></el-radio-button>
              <el-radio-button label="注销"></el-radio-button>
              <el-radio-button label="待激活"></el-radio-button>
            </el-radio-group>
          </ul>
          <ul>
            <li>
              <span></span>
              <span>代理类型</span>
            </li>
            <el-radio-group v-model="type">
              <el-radio-button label="全部" value="1"></el-radio-button>
              <el-radio-button label="省代"></el-radio-button>
              <el-radio-button label="市代"></el-radio-button>
              <el-radio-button label="代办"></el-radio-button>
              <el-radio-button label="行代"></el-radio-button>
              <el-radio-button label="区代"></el-radio-button>
            </el-radio-group>
          </ul>
        </div>
        <button type="reset" class="reset">重置</button>
        <button class="makeSure" @click="makeSureSumbit()">确定</button>
      </form>
    </transition>
    <!-- ==========        tabbar        ========== -->
    <div class="footer">
      <van-tabbar v-model="active">
        <van-tabbar-item @click="jumpToAgents()">
          <span>代理信息</span>
          <img slot="icon" slot-scope="props" :src="props.active ? icon.active : icon.normal">
        </van-tabbar-item>
        <van-tabbar-item @click="jumpToAgentsTypeIn()">
          <span>代理录入</span>
          <img slot="icon" slot-scope="props" :src="props.active ? icon.active2 : icon.normal2">
        </van-tabbar-item>
        <van-tabbar-item @click="jumpToAgentsProfit()">
          <span>代理利润</span>
          <img slot="icon" slot-scope="props" :src="props.active ? icon.active3 : icon.normal3">
        </van-tabbar-item>
        <van-tabbar-item @click="CAPION()">
          <span>商户信息</span>
          <img slot="icon" slot-scope="props" :src="props.active ? icon.active4 : icon.normal4">
        </van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>
<script>
import "@/CSSFILE/tabbar.css";
import agentTab from "@/components/agentTab.vue";
import { MessageBox, Toast } from "mint-ui";
import { PullRefresh, Loading, List } from "vant";
const axios = require("axios");
import {
  queryAgent,
  checkToken,
  getRefreshToken,
  BASE_URL
} from "@/api/api.js";
import qs from "qs";
// 上拉刷新每次显示的数据
const loadNumUp = 10;

export default {
  name: "queryAgent",
  data() {
    return {
      active: 0,
      cur: 0,
      count: 0,
      show: false,
      deviceList: [], //用于存放加载的数据
      totalPage: 0, // 总数page
      pageNumber: 0, // 当前页
      loading: false, //控制上拉加载的加载动画
      finished: false, //控制在页面往下移动到底部时是否调用接口获取数据
      isLoading: false, //控制下拉刷新的加载动画
      state: "", // 代理状态
      type: "", // 代理类型
      Linkman: "", // 联系人
      Linkphone: "", // 联系电话
      MerchantNo: "", // 商户号
      MerchantName: "", // 商户名
      queryAgentDetail: [], // 弹出框查询页数据
      valueLength: "", // 数据长度
      showListPages: true, // 原始数据
      showQueryList: false, // 查询数据
      nothing: false, // 没有数据
      /* tabbar */
      icon: {
        normal: require("@/assets/image/Manger/Agents/icon07.png"),
        active: require("@/assets/image/Manger/Agents/icon07_choice.png"),
        normal2: require("@/assets/image/Manger/Agents/icon08.png"),
        active2: require("@/assets/image/Manger/Agents/icon08_choice.png"),
        normal3: require("@/assets/image/Manger/Agents/icon09.png"),
        active3: require("@/assets/image/Manger/Agents/icon09_choice.png"),
        normal4: require("@/assets/image/Manger/Agents/icon10.png"),
        active4: require("@/assets/image/Manger/Agents/icon10_choice.png")
      }
    };
  },
  /* 注册组件 */
  components: {
    /* tabbar */
    agentTab
  },
  computed: {},
  created() {
    this.selected = this.$route.name;
  },
  methods: {
    prev() {
      this.$router.go(-1);
    },
    toAgentDetails(index, item) {
      this.$router.push({
        name: "AgentDetails",
        params: {
          id: index,
          item: item
        },
        query: {
          merchantId: item.merchantId,
          merchantName: item.merchantName,
          qdcrmUserId: item.qdcrmUserId
        }
      });
    },
    jumpToAgents() {
      this.$router.push("/QueryAgent");
    },
    jumpToAgentsTypeIn() {
      this.$router.push("/entry");
    },
    jumpToAgentsProfit() {
      this.$router.push("/agentProfit");
    },
    CAPION() {
      MessageBox("暂未开放");
    },
    // 下拉刷新上拉加载
    init() {
      // 当前页数
      let data = {
        page: this.pageNumber + 1
      };
      let self = this;
      queryAgent(data)
        .then(response => {
          getRefreshToken();
          let res = JSON.parse(response.data);
          console.log(res);
          // 用 data 里定义的空数组储存得到的数据
          self.deviceList = res.list;
          console.log(self.deviceList);
          // 储存总页数
          self.totalPage = res.paginator.pages;
          // 向数组中追加内容
          self.deviceList = self.deviceList.concat(res.list);
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
          page: self.pageNumber + 1
        });
        window.sessionStorage.setItem("page", JSON.stringify(data));
        queryAgent(data)
          .then(response => {
            let res = JSON.parse(response.data);
            self.totalPage = res.paginator.pages;
            self.deviceList = self.deviceList.concat(res.list);
            self.loading = false;
            self.pageNumber++;
            if (self.pageNumber >= self.totalPage) {
              self.finished = true;
            } else {
              self.finished = false;
            }
          })
          .catch({
            function(error) {
              Toast(response.message);
            }
          });
      }, 500);
    },
    // 查询商户
    makeSureSumbit() {
      // merchantId 商户号
      // mobile 手机号
      // merchantName 商户名
      // contactName 联系人
      // higherName
      // status  代理状态 0(正常) 1(注销) 2(待激活) 不传全部
      // bizType 代理类型如下
      // p 省代
      // C 市代理
      // A 代办点
      // I 行代理
      // D 区代理
      if (this.state == "全部") {
        this.state = "";
      } else if (this.state == "正常") {
        this.state = "0";
      } else if (this.state == "注销") {
        this.state = "1";
      } else if (this.state == "待激活") {
        this.state = "2";
      }
      if (this.type == "省代") {
        this.type = "P";
        console.log(this.type);
      } else if (this.type == "市代") {
        this.type = "C";
      } else if (this.type == "代办") {
        this.type = "A";
      } else if (this.type == "行代") {
        this.type = "I";
      } else if (this.type == "区代") {
        this.type = "D";
      } else if (this.type == "全部") {
        this.type = "";
      }
      let queryData = {
        qdcrmUserId: JSON.parse(window.localStorage.getItem("userInfo"))
          .qdcrmUserId,
        access_token: JSON.parse(window.localStorage.getItem("token"))
          .access_token,
        merchantId: this.MerchantNo,
        mobile: this.Linkphone,
        merchantName: this.MerchantName,
        contactName: this.Linkman,
        status: this.state,
        bizType: this.type,
        page: 1,
        number: Math.random()
      };
      axios
        .get(`${BASE_URL}/msmng/api/agent/queryAgent`, {
          params: queryData
        })
        .then(response => {
          console.log(response.data.data);
          let _this = this;
          _this.queryAgentDetail = JSON.parse(response.data.data);
          _this.valueLength = _this.queryAgentDetail.paginator;
          console.log(_this.queryAgentDetail);
          console.log(_this.valueLength);
          if (_this.valueLength.length == 0) {
            _this.showListPages = false;
            _this.show = false;
            _this.nothing = true;
          } else {
            _this.showListPages = false;
            _this.show = false;
            _this.showQueryList = true;
            _this.nothing = false;
          }
        })
        .catch(function(err) {
          Toast(err.message);
        });
    }
  }
};
</script>
<style lang="less">
@blue: #1c8cff;
/* 头部 */
/* 头部 */
.mint-header {
  height: 1.2rem;
  font-size: 0.5rem;
  font-weight: 100;
  background: @blue;
}
.mint-button {
  font-size: 0.35rem !important;
}
.header_left {
  margin-left: 0.3rem;
}
.mintui {
  font-size: 0.4rem;
}
.queryAgent {
  background: #f5f5f5;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  .listPage {
    width: 100%;
    height: auto;
  }
  .nothing {
    width: 100%;
    height: auto;
    text-align: center;
    img {
      width: 4rem;
      margin-top: 5rem;
      margin-bottom: 1rem;
    }
    p {
      font-size: 0.38rem;
    }
  }
  .div {
    width: 100%;
    height: 0.5rem;
    padding-left: 45%;
  }
}
/* toast */
.mint-msgbox {
  height: 4.5rem;
  border-radius: 0.2rem;
}
.mint-msgbox-header {
  height: 2.6rem;
  line-height: 2.6rem;
  border: none;
}
.mint-msgbox-title {
  font-size: 0.4rem;
  font-weight: 400;
}
.mint-msgbox-btns {
  height: 1rem;
  width: 80%;
  margin-left: 10%;
}
.mint-msgbox-confirm {
  background: #1c8cff;
  color: white;
  border-radius: 0.2rem;
}
/* 筛选框 */
.alertPage {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 300;
}
.innerPage {
  width: 85%;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  background: #fff;
  z-index: 400;
  ul {
    width: 100%;
    height: auto;
    margin-top: 0.5rem;
    margin-left: 0.5rem;
    li {
      width: 100%;
      height: 0.7rem;
      line-height: 0.7rem;
      margin: 0.5rem auto;
      span {
        display: inline-block;
        width: 2rem;
      }
      input {
        border: 1px solid @blue; /* no */
        border-radius: 5px; /* no */
        width: 4rem;
        padding-left: 0.5rem;
      }
    }
  }
  .agenticState {
    width: 100%;
    height: auto;
    ul {
      width: 90%;
      height: 3.5rem;
      border-bottom: 1px solid #d9d9d9;
      .el-radio-group {
        display: -webkit-flex; /* Safari */
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        height: 2.5rem;
      }
      .el-radio-button {
        height: 0.8rem;
        .el-radio-button__inner {
          border: none;
          background: #eaeaea;
          border-radius: 0px;
          width: 2.3rem;
          height: 0.8rem;
          line-height: 0.2rem;
        }
        .el-radio-button__orig-radio:checked + .el-radio-button__inner {
          background: @blue;
        }
      }
      li {
        width: 30%;
        height: 0.8rem;
        background: #eaeaea;
        text-align: center;
        line-height: 0.8rem;
        border-radius: 5px; /* no */
      }
      li:nth-child(1) {
        background: none;
        width: 100%;
        height: 0.5rem;
        line-height: 0.5rem;
        font-size: 0.4rem;
        text-align: left;
        span:nth-child(1) {
          width: 10px; /* no */
          height: 0.5rem;
          border-left: 2px solid #1c8cff; /* no */
          line-height: 0.5rem;
          float: left;
        }
        span:nth-child(2) {
          float: left;
        }
      }
    }
    ul:nth-child(2) {
      border: none;
    }
  }
  button {
    width: 40%;
    height: 1rem;
    position: absolute;
    bottom: 0;
    background: #000;
    border: none;
    background: #d9d9d9;
    font-size: 0.38rem;
    color: #606060;
  }
  .makeSure {
    right: 0;
    width: 60%;
    background: @blue;
    color: #fff;
  }
}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 1, 1);
}
.slide-fade-enter {
  transform: translateX(10rem);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(10rem);
}
/* 列表头部 */
.listTop_queryAgent {
  width: 100%;
  height: 1.1rem;
  position: fixed;
  top: 1.2rem;
  display: flex;
  flex-direction: row;
  text-align: center;
  line-height: 1.1rem;
  background: #fff;
  color: #1c8cff;
  padding-left: 4.5%;
  padding-right: 4.5%;
  li {
    width: 22.5%;
    border-bottom: 1px solid #1c8cff; /* no */
  }
}
/* 列表 */
.listTital {
  margin-top: 1.8rem;
  padding-left: 4%;
  padding-right: 4%;
  background: #fff;
  margin-bottom: 2rem;
  li {
    width: 100%;
    height: 1.1rem;
    text-align: center;
    line-height: 1.1rem;
    border-bottom: 1px solid #d9d9d9; /* no */
    span {
      display: inline-block;
      width: 24%;
      height: 1.1rem;
    }
  }
}
.showThisLi {
  margin-top: 2.3rem;
}
/* tabbar */
.tabbar {
  width: 100%;
  height: 1.3rem;
  background: #fff;
  position: fixed;
  bottom: 0;
  .mint-tabbar {
    height: 1.3rem;
    .mint-tab-item-label {
      font-size: 0.35rem;
    }
    .mint-tab-item-icon {
      width: 0.6rem;
      height: 0.6rem;
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
