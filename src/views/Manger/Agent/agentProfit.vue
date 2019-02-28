<template>
  <div class="agentProfit">
    <!-- =============     代 理 利 润 页 面     =============== -->
    <mt-header title="代理利润" fixed>
      <mt-button icon="back" @click="prev()" slot="left"></mt-button>
      <mt-button slot="right" @click="show = true">筛选</mt-button>
    </mt-header>
    <!-- 初始化数据 -->
    <div class="listPages" v-if="showListPages==true">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <ul class="listTTop">
          <li>商户号</li>
          <li>商户名称</li>
          <li class="li">利润</li>
        </ul>
        <ul class="listTTal">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多数据了~"
            loading-text="加载中"
            @load="onLoad"
            :offset="30"
          >
            <li v-for="(item,index) in deviceList" :key="item.c" @click="toDetail(index,item)">
              <span>{{ item.merchantId }}</span>
              <span>{{ item.merchantName }}</span>
              <span class="span">{{ item.allProfit }}</span>
            </li>
          </van-list>
        </ul>
      </van-pull-refresh>
    </div>
    <!-- 搜索的数据 -->
    <li class="showThisLi" v-if="showQueryList==true">
      <ul class="listTTop">
        <li>商户号</li>
        <li>商户名称</li>
        <li class="li">利润</li>
      </ul>
      <ul class="listTTal">
        <li
          v-for="(item,key,index) in queryAgentDetail.dataResult"
          :key="item.c"
          @click="toDetail(index,item)"
        >
          <span>{{ item.merchantId }}</span>
          <span>{{ item.merchantName }}</span>
          <span class="span">{{ item.allProfit }}</span>
        </li>
        <p>没有更多数据了~</p>
      </ul>
    </li>
    <!-- 没有数据时显示 -->
    <div class="nothing" v-if="nothing==true">
      <img src="@/assets/image/Manger/Trade/nothing.png">
      <p>未获取到数据，请重新设置查询条件</p>
    </div>
    <!-- ==============        代 理 利 润 筛 选      ============== -->
    <!-- ==========     弹 出  代 理 信 息 筛 选 模 态 框    ========== -->
    <van-popup v-model="show" position="top" :overlay="true" overlay-class="overlaystyle">
      <el-form>
        <div class="block top">
          <span class="demonstration">交易开始时间</span>
          <el-date-picker
            v-model="stratTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </div>
        <div class="block">
          <span class="demonstration">交易结束时间</span>
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="endTime"
            align="center"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions1"
          ></el-date-picker>
        </div>
        <input type="reset" class="reset leftRight">
        <el-button class="ensure leftRight" type="primary" @click="requireList()">确 定</el-button>
      </el-form>
    </van-popup>
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
import "@/CSSFILE/alert.css";
import {
  queryAgentProfitDetails,
  getRefreshToken,
  BASE_URL
} from "@/api/api.js";
import { MessageBox, Toast } from "mint-ui";
import { PullRefresh, Loading, List } from "vant";
const axios = require("axios");
// 上拉刷新每次显示的数据
const loadNumUp = 10;
export default {
  name: "agentProfit",
  data() {
    return {
      active: 2,
      cur: 2,
      deviceList: [], //用于存放加载的数据
      totalPage: 0, // 总数page
      pageNumber: 0, // 当前页
      loading: false, //控制上拉加载的加载动画
      finished: false, //控制在页面往下移动到底部时是否调用接口获取数据
      isLoading: false, //控制下拉刷新的加载动画
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
      },
      dialogFormVisible: false, // 筛选栏的表单
      show: false,
      currentDate: new Date(),
      minDate: new Date(),
      cur: 2,
      active: 2,
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      stratTime: "", // 开始时间
      endTime: "" // 结束时间
    };
  },

  methods: {
    prev() {
      this.$router.go(-1);
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
      queryAgentProfitDetails(data)
        .then(response => {
          getRefreshToken();
          let res = response.data.dataResult;
          console.log(res);
          // 用 data 里定义的空数组储存得到的数据
          self.deviceList = res;
          console.log(self.deviceList);
          // 储存总页数
          self.totalPage = response.data.paginator.pages;
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
          page: self.pageNumber + 1
        });
        window.sessionStorage.setItem("page", JSON.stringify(data));
        queryAgentProfitDetails(data)
          .then(response => {
            console.log(response);
            let res = response.data.dataResult;
            console.log(res);
            self.totalPage = response.data.paginator.pages;
            self.deviceList = self.deviceList.concat(res);
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
    requireList() {
      /* *
       * * @params(startTime, endTime, qdcrmUserId, token)
       * *
       * */
      console.log(this.stratTime);
      console.log(this.endTime);
      let queryData = {
        qdcrmUserId: JSON.parse(window.localStorage.getItem("userInfo"))
          .qdcrmUserId,
        access_token: JSON.parse(window.localStorage.getItem("token"))
          .access_token,
        gmtStart: this.stratTime,
        gmtEnd: this.endTime,
        page: 1,
        number: Math.random()
      };
      axios
        .get(`${BASE_URL}/msmng/api/agent/queryAgentProfit`, {
          params: queryData
        })
        .then(response => {
          console.log(response.data);
          let _this = this;
          _this.queryAgentDetail = response.data.data;
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
    },
    toDetail(index, item) {
      this.$router.push({
        name: "checkedIn",
        params: {
          id: index,
          item: item
        }
      });
    }
  },
  mounted() {},
  /* 注册组件 */
  components: {}
};
</script>
<style lang="less">
@blue: #1c8cff;
/* 头部 */
/* ==============       header        ============= */
.mint-header {
  height: 1.2rem;
  font-size: 0.4rem;
  font-weight: 100;
  background: #1c8cff;
  padding-left: 5%;
  padding-right: 5%;
}
.mint-header-title {
  line-height: 1rem;
}
.mint-botton-text {
  font-size: 0.3rem !important;
}
.mintui {
  font-size: 0.4rem;
}
.agentProfit {
  background: #f5f5f5;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
}
input {
  background: rgba(0, 0, 0, 0);
  color: #fff;
}
/* 列表头部 */
.listTTop {
  width: 91%;
  height: 1.1rem;
  display: flex;
  flex-direction: row;
  text-align: center;
  line-height: 1.1rem;
  background: #fff;
  color: #1c8cff;
  font-size: 0.4rem;
  padding-left: 4.5%;
  padding-right: 4.5%;
  li {
    width: 39%;
    border-bottom: 1px solid #1c8cff; /* no */
  }
  .li {
    width: 40%;
  }
}
/* nothing */
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
/* 列表 */
.listPages {
  width: 100%;
  height: auto;
  position: absolute;
  top: 1.2rem;
  bottom: 1.5rem;
}
.listTTal {
  background: #fff;
  margin-bottom: 1.2rem;
  p {
    text-align: center;
    background: #f5f5f5;
    padding-top: 0.5rem;
  }
  li {
    width: 90%;
    height: 1.1rem;
    text-align: center;
    line-height: 1.1rem;
    border-bottom: 1px solid #d9d9d9; /* no */
    margin-left: 5%;
    span {
      display: inline-block;
      width: 31%;
    }
    .span {
      width: 31%;
      color: #e3383e;
    }
  }
}
/* ====================        弹 出 框         ======================== */
.van-overlay {
  top: 1.2rem !important;
}
.van-popup {
  height: 4.5rem;
  width: 100%;
  margin-top: 1.2rem;
  .leftRight {
    width: 38%;
    height: 1rem;
    margin-bottom: 0.5rem;
    margin-top: 0.3rem;
  }
  .reset {
    background: #d9d9d9;
    margin-left: 5%;
    margin-right: 9%;
  }
  .ensure {
    margin-right: 5%;
  }
  .el-input__inner {
    padding-left: 1rem;
    border: 1px solid #1c8cff; /* no */
    border-radius: 0.1rem;
    width: 75%;
    height: 0.7rem;
    background: url("~@/assets/image/icon_next.png") no-repeat right;
    background-position-x: 3.8rem;
    background-size: 0.3rem;
  }
  .top {
    margin-top: 0.5rem;
    margin-bottom: 0.3rem;
    .el-select {
      border: none;
      width: 2.9rem;
      margin-left: 0.4rem;
    }
  }
  .block {
    margin-bottom: 0.3rem;
  }
  .demonstration {
    display: inline-block;
    margin-right: 0.5rem;
    margin-left: 1rem;
  }
  .el-input__icon:after {
    content: "";
  }
  .el-icon-date:before {
    content: "";
  }
}
.el-icon-arrow-up:before {
  content: "";
}
.el-input__icon:after {
  content: "";
}
.listEntry .el-select .el-select__caret {
  margin-left: 0 !important;
}
</style>
