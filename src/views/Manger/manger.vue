<template>
  <div class="manger">
    <mt-header title="平台管理" absolute>
      <mt-button icon="back" @click="prev()" slot="left"></mt-button>
    </mt-header>
    <!-- ======= 用户信息  ======= -->
    <div class="userInfo">
      <div class="profilePhoto">
        <img src="@/assets/image/Manger/ic-headimg.png">
      </div>
      <div class="nameId">
        <div class="username">{{userInfo.name}}</div>
        <div class="userId">{{userInfo.merchantId}}</div>
      </div>
      <div class="userType">
        <img src="@/assets/image/Manger/ic-agent.png">
        <p v-if="username == 'OEM'">机构</p>
        <p v-if="username == 'PROVINCE'">省代理</p>
        <p v-if="username == 'CITY'">市代理</p>
        <p v-if="username == 'DISTRICT'">区县代理</p>
        <p v-if="username == 'AGENT'">代办点</p>
        <p v-if="username == 'INDUSTRY'">行业代理</p>
      </div>
    </div>

    <!-- =======  常用业务 ======= -->
    <div class="commonBusiness">
      <span>常用业务</span>
      <ul>
        <li>
          <img @click="jumpToAgentsProfit()" src="@/assets/image/Manger/ic-admin01.png">
        </li>
        <li>
          <img @click="jumpToAgentsTypeIn()" src="@/assets/image/Manger/ic-admin02.png">
        </li>
        <li>
          <img @click="toRemoveTerminal()" src="@/assets/image/Manger/ic-admin03.png">
        </li>
      </ul>
    </div>
    <!-- =======  所有业务  ======= -->
    <div class="allBusiness">
      <!-- 代理商管理 -->
      <span>所有业务</span>
      <mt-swipe :auto="0">
        <mt-swipe-item id="testtt">
          <ul class="Agent">
            <div class="dailishang">代理商管理</div>
            <li @click="jumpToAgents()">
              <img src="@/assets/image/Manger/ic-agent01.png">
              <p>代理查询</p>
            </li>
            <li @click="jumpToAgentsTypeIn()">
              <img src="@/assets/image/Manger/ic-agent02.png">
              <p>代理录入</p>
            </li>
            <li @click="jumpToAgentsProfit()">
              <img src="@/assets/image/Manger/ic-agent03.png">
              <p>代理利润</p>
            </li>
            <li @click="CAPION()">
              <img src="@/assets/image/Manger/ic-agent04.png">
              <p>商户查询</p>
            </li>
            <li @click="CAPION()">
              <img src="@/assets/image/Manger/ic-agent05.png">
              <p>商户录入</p>
            </li>
          </ul>
        </mt-swipe-item>
        <mt-swipe-item>
          <!-- 订单管理 -->
          <ul class="Agent">
            <div class="dailishang">订单管理</div>
            <li @click="toTradeOrder()">
              <img src="@/assets/image/Manger/ic-order01.png">
              <p>交易订单</p>
            </li>
            <li @click="toMemberDeals()">
              <img src="@/assets/image/Manger/ic-order02.png">
              <p>会员交易</p>
            </li>
            <li @click="toMemberInfo()">
              <img src="@/assets/image/Manger/ic-order03.png">
              <p>会员信息</p>
            </li>
            <li @click="tocashBack()">
              <img src="@/assets/image/Manger/ic-order04.png">
              <p>返现活动</p>
            </li>
          </ul>
        </mt-swipe-item>
        <mt-swipe-item>
          <!-- 终端管理 -->
          <ul class="Agent">
            <div class="dailishang">终端管理</div>
            <li class="FTU" @click="toTerminalInfo()">
              <img src="@/assets/image/Manger/ic-terminal01.png">
              <p>终端信息</p>
            </li>
            <li class="FTU" @click="toRemoveTerminal()">
              <img src="@/assets/image/Manger/ic-terminal02.png">
              <p>终端转移</p>
            </li>
          </ul>
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <!-- 小圆点 -->
    <!-- 季度业绩 -->
    <div class="quarterlyResults">
      <span>季度业绩</span>
      <!-- 交易 -->
      <div class="Quarterly">
        <div class="headline">交易</div>
        <li>
          <img src="@/assets/image/Manger/ic-pro01.png">分润
          <br>
          <span>{{profitAmount}}</span>
        </li>
        <li>
          <img src="@/assets/image/Manger/ic-pro02.png">交易笔数
          <br>
          <span>{{tradingCapacity}}</span>
        </li>
        <li class="border">
          <img src="@/assets/image/Manger/ic-pro03.png">交易额
          <br>
          <span>{{tradingAmount}}</span>
        </li>
      </div>
      <!-- 活跃用户 -->
      <div class="activeUser">
        <div class="headline">活跃用户</div>
        <li>
          <img src="@/assets/image/Manger/ic-pro04.png">活跃
          <br>
          <span>{{activeUserNumber}}</span>
        </li>
        <li>
          <img src="@/assets/image/Manger/ic-pro05.png">新增用户
          <br>
          <span>{{newUserNumber}}</span>
        </li>
        <li class="border">
          <img src="@/assets/image/Manger/ic-pro01.png">总用户数
          <br>
          <span>{{totalUserNumber}}</span>
        </li>
      </div>
      <!-- 终端 -->
      <div class="terminal">
        <div class="headline">终端</div>
        <li>
          <img src="@/assets/image/Manger/ic-pro06.png">激活
          <br>
          <span>{{activeTerminalsNumber}}</span>
        </li>
        <li>
          <img src="@/assets/image/Manger/ic-pro07.png">新增终端
          <br>
          <span>{{newTerminalsNumber}}</span>
        </li>
        <li class="border">
          <img src="@/assets/image/Manger/ic-pro01.png">终端总数
          <br>
          <span>{{totalTerminalsNumber}}</span>
        </li>
      </div>
    </div>
  </div>
</template>
<script>
import { MessageBox, Toast } from "mint-ui";
import { getData, checkToken, getRefreshToken } from "@/api/api.js";
export default {
  name: "manger",
  data() {
    return {
      username: JSON.parse(window.localStorage.getItem("userInfo")).areaType,
      userInfo: JSON.parse(window.localStorage.getItem("userInfo")),
      quarterlyResults: [],
      profitAmount: "", //分润
      tradingCapacity: "", //交易笔数
      tradingAmount: "", //交易额（万元）
      activeUserNumber: "", //活跃
      newUserNumber: "", //新增用户
      totalUserNumber: "", //用户总数
      activeTerminalsNumber: "", //激活
      newTerminalsNumber: "", // 新增终端
      totalTerminalsNumber: "" //终端总数
    };
  },
  methods: {
    prev() {
      this.$router.push("/index");
    },
    // 代理商管理
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
    // 终端管理
    toTerminalInfo() {
      this.$router.push("/terminalInfo");
    },
    toRemoveTerminal() {
      this.$router.push("/removeTerminal");
    },
    // 订单管理
    toTradeOrder() {
      this.$router.push("/tradeOrder");
    },
    toMemberDeals() {
      this.$router.push("/memberDeal");
    },
    toMemberInfo() {
      this.$router.push("/memberInfo");
    },
    tocashBack() {
      this.$router.push("/cashBack");
    }
  },
  created() {
    getData()
      .then(response => {
        getRefreshToken();
        console.log(response);
        console.log(response.data);
        var a = this;
        if (response.data == null) {
          a.profitAmount = 0; // 分润
          a.tradingCapacity = 0; //交易笔数
          a.tradingAmount = 0; //交易额（万元）
          a.activeUserNumber = 0; //活跃
          a.newUserNumber = 0; //新增用户
          a.totalUserNumber = 0; //用户总数
          a.activeTerminalsNumber = 0; //激活
          a.newTerminalsNumber = 0; // 新增终端
          a.totalTerminalsNumber = 0; //终端总数
        } else {
          a.quarterlyResults = response.data;
          console.log(a.quarterlyResults);
          a.profitAmount = a.quarterlyResults.profitAmount; // 分润
          a.tradingCapacity = a.quarterlyResults.tradingCapacity; //交易笔数
          a.tradingAmount = a.quarterlyResults.tradingAmount; //交易额（万元）
          a.activeUserNumber = a.quarterlyResults.activeUserNumber; //活跃
          a.newUserNumber = a.quarterlyResults.newUserNumber; //新增用户
          a.totalUserNumber = a.quarterlyResults.totalUserNumber; //用户总数
          a.activeTerminalsNumber = a.quarterlyResults.activeTerminalsNumber; //激活
          a.newTerminalsNumber = a.quarterlyResults.newTerminalsNumber; // 新增终端
          a.totalTerminalsNumber = a.quarterlyResults.totalTerminalsNumber; //终端总数
        }
      })
      .catch({
        function(error) {
          Toast(response.message);
        }
      });
  }
};
</script>
<style lang="less">
@blue: #1c8cff;
.manger {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
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
}
.mint-msgbox-btns {
  height: 1rem;
  width: 80%;
  margin-left: 10%;
}
.mint-msgbox-confirm {
  background: @blue;
  color: white;
  border-radius: 0.2rem;
}
/* 头部 */
.mint-header {
  width: 100%;
  position: fixed;
  top: 0;
  height: 1.2rem;
  font-size: 0.5rem;
  font-weight: 100;
  background: @blue;
  z-index: 999;
}
.mintui {
  font-size: 0.4rem;
}
/* ===========  用户信息  ============ */
.userInfo {
  width: 100%;
  height: 3rem;
    margin-top: 1.2rem;
  .profilePhoto {
    width: 30%;
    height: 3rem;
    float: left;
    img {
      width: 2rem;
      height: 2rem;
      margin-top: 0.5rem;
      margin-left: 0.5rem;
    }
  }
  .nameId {
    width: 55%;
    height: 1.8rem;
    float: left;
    padding-top: 0.7rem;
    text-align: left;
    line-height: 0.7rem;
    font-size: 0.35rem;
    .username {
      font-weight: 800;
    }
  }
  .userType {
    width: 15%;
    float: left;
    height: 2.5rem;
    text-align: center;
    img {
      width: 60%;
      margin-top: 0.9rem;
    }
    p {
      margin-top: 0.05rem;
    }
  }
}

/* ===========  常用业务  ============ */
.commonBusiness {
  width: 100%;
  height: 3rem;
  span {
    margin-left: 0.5rem;
    font-size: 0.4rem;
  }
  ul {
    width: 96%;
    height: 2.5rem;
    margin: 0 auto;
    li {
      width: 31%;
      height: 1.7rem;
      float: left;
      margin: 0.25rem 0.1rem;
      img {
        width: 100%;
      }
    }
  }
}
/* ==========  所有业务  ========== */
.allBusiness {
  width: 100%;
  height: 5.5rem;
  span {
    margin-left: 0.5rem;
    font-size: 0.4rem;
  }
  .mint-swipe {
    margin-top: 0.3rem;
    .mint-swipe-indicators {
      .mint-swipe-indicator {
        opacity: 1;
        background: #e0e0e0;
      }
      .is-active {
        background: #1c8cff;
        width: 0.3rem;
        height: 0.08rem;
        border-radius: 0.2rem;
      }
    }
  }
  .Agent {
    margin: 0.2rem auto;
    width: 80%;
    height: 4.5rem;
    box-shadow: 0px 3px 10px rgba(199, 227, 255, 0.75);
    display: flex;
    flex-wrap: wrap;
    text-align: center;
    .dailishang {
      width: 100%;
      height: 1rem;
      text-align: left;
      line-height: 1.2rem;
      color: #1483f5;
      font-size: 0.4rem;
      margin-left: 0.5rem;
    }
    li {
      width: 1.5rem;
      height: 1.5rem;
      margin: 0.1rem 0.5rem;
      img {
        width: 0.85rem;
      }
      p {
        margin-top: 0rem;
        font-size: 0.35rem;
      }
    }
    .FTU {
      margin-top: -1.5rem;
    }
  }
}

/* =========   季度业绩   ========= */
.quarterlyResults {
  width: 100%;
  height: auto;
  list-style: none;
  margin-top: 0.5rem;
  span {
    margin-left: 0.5rem;
    font-size: 0.4rem;
  }
  li {
    width: 2.45rem;
    height: 1.5rem;
    float: left;
    text-align: center;
    margin-top: 0.2rem;
    border-right: 1px solid #d9d9d9;
    font-size: 0.3rem;
    vertical-align: middle;
    span {
      color: red;
      line-height: 1rem;
      font-weight: 700;
    }
    img {
      width: 0.4rem;
      line-height: 0.5rem;
      margin-right: 0.1rem;
      vertical-align: middle;
    }
  }
  .border {
    border: none;
  }
  .headline {
    width: 2rem;
    height: 0.7rem;
    background: #12d685;
    margin-top: -0.2rem;
    margin-left: 38%;
    border-radius: 0.1rem;
    text-align: center;
    line-height: 0.7rem;
    color: #fff;
    font-size: 0.4rem;
  }

  /* =========   交易  ========= */
  .Quarterly {
    margin: 0.2rem 1.25rem;
    width: 75%;
    height: 2.5rem;
    box-shadow: 0px 3px 10px rgba(199, 227, 255, 0.75);
    position: absolute;
    li {
      width: 33%;
    }
  }
  /* =========   活跃用户  ========= */
  .activeUser {
    margin: 0.2rem 1.25rem;
    width: 75%;
    height: 2.5rem;
    box-shadow: 0px 3px 10px rgba(199, 227, 255, 0.75);
    position: absolute;
    margin-top: 3.5rem;
    .headline {
      background: #ffb112;
    }
    li {
      width: 33%;
    }
  }
  /* =========   终端  ========= */
  .terminal {
    margin: 0.2rem 1.25rem;
    width: 75%;
    height: 2.5rem;
    box-shadow: 0px 3px 10px rgba(199, 227, 255, 0.75);
    position: absolute;
    margin-top: 7rem;
    margin-bottom: 2rem;
    .headline {
      background: #1c8cff;
    }
    li {
      width: 33%;
    }
  }
}
</style>
