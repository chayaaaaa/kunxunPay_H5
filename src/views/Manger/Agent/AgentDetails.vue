<template>
  <div class="AgentDetails">
    <!-- ==========   代 理 详 细 页 面   ========== -->
    <mt-header title="代理详情" fixed>
      <mt-button icon="back" @click="prev()" slot="left"></mt-button>
    </mt-header>
    <!-- ==========         选 项 卡         ========== -->
    <div class="AgentDetails_Tabbar">
      <ul>
        <li @click="current=0">
          <img src="@/assets/image/Manger/Agents/ic-agentDetails01.png">
          <p :class="{'curr' :current===0 }">基本信息</p>
          <span v-show="current==0"></span>
        </li>
        <li @click="current=1">
          <img src="@/assets/image/Manger/Agents/ic-agentDetails02.png">
          <p :class="{'curr' :current===1 }">结算信息</p>
          <span v-show="current==1"></span>
        </li>
        <li @click="current=2">
          <img src="@/assets/image/Manger/Agents/ic-agentDetails03.png">
          <p :class="{'curr' :current===2 }">业务配置</p>
          <span v-show="current==2"></span>
        </li>
      </ul>
    </div>
    <!-- 选 项 卡 内 容 -->
    <!-- 基本信息 -->
    <div class="baseMessage" v-if="current==0">
      <ul>
        <li>
          <span></span>
          <i v-if="biztype=='O' || biztype=='o'">商户类型：机构</i>
          <i v-if="biztype=='P'">商户类型：省代理</i>
          <i v-if="biztype=='C'">商户类型：市代理</i>
          <i v-if="biztype=='D'">商户类型：区县代理</i>
          <i v-if="biztype=='A'">商户类型：代办点</i>
          <i v-if="biztype=='I'">商户类型：行业代理</i>
        </li>
        <li>
          <span></span>
          客户类型：
          <b v-if="merType==1">个人</b>
          <b v-if="merType==2">企业</b>
          <b v-if="merType==3">大客户</b>
          <b v-if="merType==4">机构</b>
        </li>
        <li>
          <span></span>
          短信签名：{{smsSign}}
        </li>
        <li>
          <span></span>
          商户编号：{{merchantId}}
        </li>
        <li>
          <span></span>
          商户名称：{{merchantName}}
        </li>
        <li>
          <span></span>
          联系人：{{contactName}}
        </li>
        <li>
          <span></span>
          联系电话：{{mobile}}
        </li>
        <li>
          <span></span>
          商户状态：
          <b v-if="status=='0'">正常</b>
          <b v-if="status=='1'">注销</b>
          <b v-if="status=='2'">待激活</b>
        </li>
      </ul>
    </div>
    <!-- 结算信息 -->
    <div class="settleMessage" v-if="current==1 && accountHolder != ''">
      <ul>
        <li>
          <span></span>
          开户名：{{accountHolder}}
        </li>
        <li>
          <span></span>
          开户省：{{provinceCode}}
        </li>
        <li>
          <span></span>
          开户市：{{cityCode}}
        </li>
        <li>
          <span></span>
          开户银行：{{bankCode}}
        </li>
        <li>
          <span></span>
          <i v-if="mark==1">对公/对私：对公</i>
          <i v-if="mark==2">对公/对私：对私</i>
        </li>
        <li>
          <span></span>
          开户支行：{{bankBranchCode}}
        </li>
        <li>
          <span></span>
          开户账号：{{card}}
        </li>
      </ul>
    </div>
    <div class="settleMessage other" v-if="current==1 && accountHolder == ''">
      <img src="@/assets/image/Manger/Trade/nothing.png">
      <p>未设置结算信息</p>
    </div>
    <!-- 业务配置 -->
    <div class="BusinessConfiguration_body" v-if="current==2">
      <ul class="ul" v-for="(item,index) in configList" :key="index">
        <li>
          {{item.bizName}}
          <span v-if="item.isAdd==1">已开启</span>
          <span v-else>已关闭</span>
        </li>
        <!-- 配置详情 -->
        <div class="configDetail" v-if="item.isAdd==1">
          <ul class="configList" v-for="val in item.businessModel" :key="val.a">
            <li>
              <img src="@/assets/image/Manger/Agents/ic-ICcard.png">
              {{item.bizName}}
            </li>
            <li>
              <span>工作日费率</span>
              <p>
                <span class="input">{{val.fixed}}</span>
                <b>+</b>
                <span class="input">{{val.percent}}</span>
                <i>%</i>
              </p>
            </li>
            <li>
              <span>节假日费率</span>
              <p>
                <span class="input">{{val.holidayFixed}}</span>
                <b>+</b>
                <span class="input">{{val.holidayPercent}}</span>
                <i>%</i>
              </p>
            </li>
            <li>
              <span>交易限额</span>
              <p>
                <span class="input">{{val.caps}}</span>
                <b>－</b>
                <span class="in input">{{val.limits}}</span>
              </p>
            </li>
            <li>
              <span>代理工作日(结算价)</span>
              <p>
                <span class="input">{{val.overallFixedRatio}}</span>
                <b>+</b>
                <span class="input">{{val.overallProfitRatio}}</span>
                <i>%</i>
              </p>
            </li>
            <li>
              <span>代理节假日(结算价)</span>
              <p>
                <span class="input">{{val.overallHolidayFixed}}</span>
                <b>+</b>
                <span class="input">{{val.overallHolidayPercent}}</span>
                <i>%</i>
              </p>
            </li>
          </ul>
        </div>
      </ul>
    </div>
    <!-- 底部路由 -->
    <div class="bottom" @click="current=4">
      <img src="@/assets/image/Manger/Agents/more.png">
    </div>
    <!-- 弹出框 -->
    <div class="BouncedPage" v-if="current===4" @touchmove.prevent>
      <!-- 显示时间 -->
      <div class="showTime">
        <span class="month">{{ timeDate | day }}</span>
        <span class="week">{{ timeDate | week }}</span>
        <span class="day">{{ timeDate | year }}</span>
      </div>
      <!-- logo -->
      <div class="logo">
        <img src="@/assets/image/Manger/Agents/M7 .png">
        <b>M7
          <br>创造财富
          <br>享受生活
        </b>
        <img class="img" src="@/assets/image/Manger/Agents/logo.png">
      </div>
      <!-- 选择业务 -->
      <div class="choose_Business">
        <ul>
          <li @click="activateTheMerchants()" v-if="merchantStatus == 2">
            <img src="@/assets/image/Manger/Agents/ic-Mer.png">
            <p>激活商户</p>
          </li>
          <li @click="resetPWD()" v-if="merchantStatus != 2">
            <img src="@/assets/image/Manger/Agents/ic-reset.png">
            <p>重置密码</p>
          </li>
          <li @click="toBusinessConfiguration()">
            <img src="@/assets/image/Manger/Agents/ic-set.png">
            <p>业务配置</p>
          </li>
          <li @click="ModifyTheMerchants()">
            <img src="@/assets/image/Manger/Agents/ic-change.png">
            <p>修改商户</p>
          </li>
          <li @click="detailMerchants()" v-if="merchantStatus == 2 ">
            <img src="@/assets/image/Manger/Agents/del.png">
            <p>删除商户</p>
          </li>
          <li @click="toretrunDeposit()">
            <img src="@/assets/image/Manger/Agents/ic-withdraw.png">
            <p>服务费设置</p>
          </li>
          <li @click="toMPOSactivity()">
            <img src="@/assets/image/Manger/Agents/ic-MPOS.png">
            <p>MPOS活动</p>
          </li>
        </ul>
      </div>
      <div class="close" @click="current=0">×</div>
    </div>
  </div>
</template>
<script>
import {
  checkToken,
  getRefreshToken,
  queryAgentDetails,
  queryAgentBiz,
  BASE_URL
} from "@/api/api.js";
import { Toast } from "mint-ui";
import commonJS from "@/JS/commonJS.js";
const axios = require("axios");
var padDate = function(va) {
  va = va < 10 ? "0" + va : va;
  return va;
};
export default {
  inject: ["reload"],
  name: "AgentDetails",
  data() {
    return {
      current: 0,
      merchantStatus: "", // 用户激活业务状态
      activeName: "1", // 当前时间
      timeDate: new Date(),
      id: "",
      itemList: "", // 传递过来的数据
      biztype: "", // 商户类型
      contactName: "", // 商户名称
      mobile: "", // 手机
      merchantName: "", // 联系人
      status: "", // 状态
      merchantId: "", // 商户编号
      smsSign: "", // 短信签名
      merType: "", // 客户类型
      qdcrmUserId: "",
      checked: true,
      // 结算信息
      accountHolder: "", // 开户名
      provinceCode: "", // 开户省
      cityCode: "", // 开户市
      bankCode: "", // 开户银行
      mark: "", // 对公对私
      bankBranchCode: "", // 开户支行
      card: "", // 开户账号
      // 业务配置
      configList: [],
      access_token: JSON.parse(window.localStorage.getItem("token"))
        .access_token
    };
  },
  filters: {
    year: function(val) {
      var value = new Date(val);
      var year = value.getFullYear();
      var month = padDate(value.getMonth() + 1);
      return month + "/" + year;
    },
    day: function(val) {
      var value = new Date(val);
      var day = padDate(value.getDate());
      return day;
    },
    week: function(val) {
      var value = new Date(val).getDay();
      var week = value; //获取当前星期X(0-6,0代表星期天)
      if (week == 1) {
        week = "星期一";
      } else if (week == 2) {
        week = "星期二";
      } else if (week == 3) {
        week = "星期三";
      } else if (week == 4) {
        week = "星期四";
      } else if (week == 5) {
        week = "星期五";
      } else if (week == 6) {
        week = "星期六";
      } else if (week == 0) {
        week = "星期日";
      }
      return week;
    }
  },
  methods: {
    prev() {
      this.$router.go(-1);
    },
    // 押金返现
    toretrunDeposit() {
      this.$router.push({
        name: "retrunDeposit",
        params: {
          item: this.qdcrmUserId,
          name: this.merchantName,
          merchantId: this.merchantId
        }
      });
    },
    // 到业务配置
    toBusinessConfiguration() {
      this.$router.push({
        name: "BusinessConfiguration",
        params: {
          item: this.qdcrmUserId,
          name: this.merchantName,
          merchantId: this.merchantId
        }
      });
    },
    // 重置密码
    resetPWD() {
      var params = new URLSearchParams();
      params.append("access_token", this.access_token);
      params.append("merchantId", this.merchantId);
      params.append("number", Math.random());
      axios
        .post(`${BASE_URL}/msmng/api/agent/resetAgentPwd`, params, {
          header: {
            "Access-Control-Allow-Origin": "*"
          }
        })
        .then(response => {
          console.log(response.data);
          Toast(response.data.message);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 激活商户
    activateTheMerchants() {
      console.log(this.merchantStatus);
      if (this.merchantStatus == 2) {
        var params = new URLSearchParams();
        params.append("access_token", this.access_token);
        params.append("merchantId", this.merchantId);
        params.append("number", Math.random());
        axios
          .post(`${BASE_URL}/msmng/api/agent/activateAgent`, params, {
            header: {
              "Access-Control-Allow-Origin": "*"
            }
          })
          .then(response => {
            console.log(response.data);
            Toast(response.data.message);
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        Toast("账号已激活");
      }
    },
    // 修改商户
    ModifyTheMerchants(type, id) {
      this.$router.push({
        name: "modifyTheMerchants",
        params: {
          type: this.biztype, //商户类型
          id: this.merchantId // 商户编号
        }
      });
    },
    // MPOS活动
    toMPOSactivity() {
      this.$router.push({
        name: "MPOSactivity",
        params: {
          item: this.qdcrmUserId,
          name: this.merchantName,
          merchantId: this.merchantId
        },
        query: {
          id: this.merchantId,
          merchantName: this.merchantName
        }
      });
    },
    // 删除商户
    detailMerchants() {
      var params = new URLSearchParams();
      params.append("access_token", this.access_token);
      params.append("merchantId", this.merchantId);
      params.append("number", Math.random());
      axios
        .post(`${BASE_URL}/msmng/api/agent/deleteAgent`, params, {
          header: {
            "Access-Control-Allow-Origin": "*"
          }
        })
        .then(response => {
          console.log(response.data);
          if (response.data.code == 200) {
            Toast("删除商户成功");
            setTimeout(() => {
              this.$router.push("/QueryAgent");
            }, 200);
          } else {
            Toast(response.data.message);
          }
        })
        .catch(function(err) {
          Toast(err.data.message);
        });
    }
  },
  created() {
    getRefreshToken();
    let queryData = {
      merchantId: JSON.parse(window.localStorage.getItem("agentDetails"))
        .merchantId,
      access_token: JSON.parse(window.localStorage.getItem("token"))
        .access_token,
      number: Math.random()
    };
    // 代理商户详情
    axios
      .get(`${BASE_URL}/msmng/api/agent/queryAgentDetails`, {
        params: queryData
      })
      .then(response => {
        console.log(response.data);
        let queryAgentDetailList = response.data.data;
        console.log(queryAgentDetailList);
        this.smsSign = queryAgentDetailList.merchant.smsSign;
        console.log(this.smsSign);
        this.merType = queryAgentDetailList.merchant.merType;
        this.accountHolder = queryAgentDetailList.bank.accountHolder;
        this.provinceCode = queryAgentDetailList.bank.provinceCode;
        this.cityCode = queryAgentDetailList.bank.cityCode;
        this.bankCode = queryAgentDetailList.bank.bankCode;
        this.mark = queryAgentDetailList.bank.mark;
        this.bankBranchCode = queryAgentDetailList.bank.bankBranchCode;
        this.card = queryAgentDetailList.bank.card;
        this.merchantStatus = queryAgentDetailList.merchant.status; // 激活状态 0[正常] 1[注销] 2[待激活]
        this.biztype = queryAgentDetailList.merchant.areaType;
        this.contactName = queryAgentDetailList.contact.contactName;
        this.mobile = queryAgentDetailList.contact.mobile.replace(
          /^(\d{3})(\d*)(\d{4})$/,
          function(a, b, c, d) {
            return b + c.replace(/\d/g, "*") + d;
          }
        );
        this.merchantName = queryAgentDetailList.merchant.name;
        this.status = queryAgentDetailList.merchant.status;
        this.merchantId = queryAgentDetailList.merchant.merchantId;
        this.qdcrmUserId = queryAgentDetailList.merchant.qdcrmUserId;
        window.localStorage.setItem(
          "AgentDetailList",
          JSON.stringify(queryAgentDetailList)
        );
      })
      .catch(function(error) {
        console.log(error);
      });
    // 业务配置数据
    let data = {
      qdcrmUserId: JSON.parse(window.localStorage.getItem("agentDetails"))
        .qdcrmUserId,
      access_token: JSON.parse(window.localStorage.getItem("token"))
        .access_token,
      number: Math.random()
    };
    axios
      .get(`${BASE_URL}/msmng/api/agent/queryAgentBiz`, {
        params: data
      })
      .then(response => {
        let re = JSON.parse(response.data.data);
        console.log(re);
        this.configList = re.list;
        console.log(this.configList);
      })
      .catch(function(error) {
        console.log(error);
      });
  }
};
</script>
<style lang="less" scoped>
@blue: #1c8cff;
// allPages
.AgentDetails {
  background: #f5f5f5;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
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
  // 选项卡
  .AgentDetails_Tabbar {
    width: 100%;
    height: auto;
    margin-top: 1.2rem;
    background: #fff;
    ul {
      display: flex;
      justify-content: space-around;
      text-align: center;
      width: 100%;
      height: 2.35rem;
      margin-bottom: 0.5rem;
      li {
        width: 20%;
        height: 2.5rem;
        img {
          width: 1.2rem;
          margin-top: 0.3rem;
        }
        p {
          margin-top: 0.2rem;
        }
        .curr {
          color: #1c8cff;
        }
        span {
          display: inline-block;
          width: 0.8rem;
          height: 0.05rem;
          background: #1c8cff;
        }
      }
    }
  }
  // 基本信息
  .baseMessage {
    width: 100%;
    height: 4rem;
    background: #fff;
    margin-top: 0.5rem;

    ul {
      width: 90%;
      height: 4rem;
      margin: 0 auto;
      li {
        width: 50%;
        height: 1rem;
        line-height: 1rem;
        float: left;
        font-size: 0.35rem;
        white-space: nowrap;
        overflow: hidden;
        i {
          font-style: normal;
        }
        span {
          display: inline-block;
          width: 7px; /* no */
          height: 7px; /* no */
          background: #1c8cff;
          border-radius: 7px; /* no */
          margin-right: 0.1rem;
        }
        b {
          color: #1c8cff;
        }
      }
    }
  }
  // 结算信息
  .settleMessage {
    width: 95%;
    height: 5.5rem;
    margin: 0.5rem auto;
    background: url("~@/assets/image/Manger/Agents/bj.png") no-repeat;
    background-size: 100% 100%;
    ul {
      padding-top: 0.3rem;
      width: 90%;
      height: 5.5rem;
      margin: 0rem auto;
      li {
        width: 50%;
        height: 0.9rem;
        line-height: 0.9rem;
        float: left;
        font-size: 0.35rem;
        color: #fff;
        i {
          font-style: normal;
        }
        span {
          display: inline-block;
          width: 7px; /* no */
          height: 7px; /* no */
          background: #fff;
          border-radius: 7px; /* no */
          margin-right: 0.1rem;
        }
        b {
          color: #1c8cff;
        }
      }
      li:nth-child(1) {
        width: 100%;
      }
      li:nth-child(3) {
        margin-left: 0.8rem;
        width: 40%;
      }
      li:nth-child(5) {
        margin-left: 0.8rem;
        width: 40%;
      }
      li:nth-child(6) {
        width: 100%;
      }
      li:nth-child(7) {
        width: 100%;
      }
    }
  }
  .other {
    background: none;
    img {
      width: 30%;
      display: block;
      margin: 2rem auto;
      margin-bottom: 0.5rem;
    }
    p {
      text-align: center;
      font-size: 0.4rem;
    }
  }
  // 业务配置
  .i {
    width: 100%;
    height: 8rem;
    background: #fff;
    margin-top: 0.3rem;
  }
  .BusinessConfiguration_body {
    width: 100%;
    height: auto;
    margin-bottom: 3rem;
    .ul {
      width: 100%;
      height: auto;
      background: #fff;
      li {
        width: 90%;
        height: 1.2rem;
        margin: 0rem auto;
        line-height: 1.2rem;
        border-bottom: 1px solid #d9d9d9; /* no */
        font-size: 0.38rem;
        margin-bottom: 0;
        span {
          display: block;
          float: right;
        }
        #input {
          float: right;
          width: 2.2rem;
        }
      }

      .configDetail {
        width: 100%;
        height: auto;
        background: #fff;
        .configList {
          width: 100%;
          height: auto;
          li {
            width: 90%;
            height: 1rem;
            line-height: 1rem;
            border: none;
            font-size: 0.35rem;
            img {
              width: 0.55rem;
              vertical-align: middle;
            }
            span {
              float: left;
            }
            p {
              width: 55%;
              height: 1rem;
              line-height: 1rem;
              float: right;
              color: #000;
              .input {
                width: 1.7rem;
                height: 0.65rem;
                line-height: 0.65rem;
                border: 1px solid #07a0e4; /* no */
                border-radius: 5px; /* no */
                text-align: center;
                margin-right: 0.1rem;
                margin-left: 0.1rem;
                margin-top: 0.1rem;
              }

              b {
                color: #07a0e4;
                font-size: 0.5rem;
                line-height: 1rem;
                float: left;
              }
              i {
                font-style: normal;
              }
              .in {
                width: 2rem;
              }
            }
          }
          li:nth-child(1) {
            width: 95%;
            background: #f5f5f5;
            padding-left: 0.5rem;
            color: #1c8cff;
            margin-top: 0;
          }
        }
      }
    }
  }
  // 底部
  .bottom {
    width: 1.5rem;
    height: 1.5rem;
    margin: 0 auto;
    left: 0;
    right: 0;
    position: fixed;
    bottom: 0.5rem;
    img {
      width: 100%;
    }
  }
  // 弹出框
  .BouncedPage {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    background: #fff;
    z-index: 1000;
    .showTime {
      width: 3rem;
      height: 1.5rem;
      margin-top: 1rem;
      margin-left: 1rem;
      float: left;
      .month {
        display: block;
        float: left;
        font-size: 1.1rem;
        font-weight: 300;
        margin-right: 0.3rem;
      }
      .week {
        display: block;
        float: left;
        font-size: 0.4rem;
        margin-top: 0.1rem;
        font-weight: 300;
        margin-bottom: 0.1rem;
      }
      .day {
        font-size: 0.4rem;
        color: #606060;
      }
    }
    .logo {
      width: 3.1rem;
      height: 3rem;
      padding-top: 1rem;
      float: right;
      margin-right: 1rem;
      img {
        width: 1.2rem;
        float: left;
        margin-right: 0.2rem;
      }
      b {
        display: block;
        float: left;
        margin-top: 0.8rem;
        font-size: 0.35rem;
        line-height: 0.45rem;
        font-weight: bold;
      }
      .img {
        width: 0.6rem;
        position: absolute;
        right: 1.15rem;
      }
    }
    .choose_Business {
      width: 90%;
      height: 5.5rem;
      margin: 0 auto;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 2rem;
      border-bottom: 1px solid #d9d9d9; /* no */
      ul {
        width: 100%;
        height: 5.5rem;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        align-items: center;
        text-align: center;
        li {
          width: 25%;
          height: 1.5rem;
          margin-bottom: 0.5rem;
          img {
            width: 60%;
          }
          p {
            margin-top: 0.3rem;
            color: #606060;
            font-size: 0.35rem;
          }
        }
      }
    }
    .close {
      width: 1.5rem;
      font-size: 1.5rem;
      font-weight: 200;
      color: #a1a1a1;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      margin: 0.5rem auto;
      text-align: center;
    }
  }
}
</style>
<style lang="less">
.mint-toast {
  width: 90%;
}
.mint-toast-text {
  text-align: left;
}
</style>
