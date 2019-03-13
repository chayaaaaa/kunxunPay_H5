<template>
  <div class="BusinessConfiguration">
    <!-- ============   业 务 配 置 页 面   =========== -->
    <div class="header">
      <img class="header_left" @click="prev()" src="@/assets/image/Manger/Agents/icn_back@2x.png">
      业务配置
    </div>
    <p class="BusinessConfiguration_title">
      <img src="@/assets/image/Manger/Agents/ic-pos.png">
      {{merchantId}}-{{merchantName}}
    </p>
    <div class="BusinessConfiguration_body">
      <ul v-for="(item,index) in configList" :key="index">
        <li>
          {{item.bizName}}
          <div class="switch" @click="showDetail($event,item)">
            <img src="@/assets/image/Manger/off.png" v-if="item.isAdd == 0">
            <img src="@/assets/image/Manger/on.png" v-else>
          </div>
        </li>
        <!-- 配置详情 -->
        <div class="configDetail" v-if="item.isAdd == 1">
          <form>
            <ul class="configList" id="configList" v-for="val in item.businessModel" :key="val.a">
              <li>
                <img src="@/assets/image/Manger/Agents/ic-ICcard.png">
                {{item.bizName}}
              </li>
              <li>
                <span>工作日费率</span>
                <p>
                  <input type="number" value="联系人" v-model="val.fixed" disabled>
                  <b>+</b>
                  <input type="number" v-model="val.percent" disabled>
                  %
                </p>
              </li>
              <li>
                <span>节假日费率</span>
                <p>
                  <input type="number" v-model="val.holidayFixed" disabled>
                  <b>+</b>
                  <input type="number" v-model="val.holidayPercent" disabled>
                  %
                </p>
              </li>
              <li>
                <span>交易限额</span>
                <p>
                  <input type="number" v-model="val.caps" disabled>
                  <b>－</b>
                  <input class="input" type="number" v-model="val.limits" disabled>
                </p>
              </li>
              <li>
                <span>代理工作日(结算价)</span>
                <p>
                  <input type="number" v-model="val.overallFixedRatio">
                  <b>+</b>
                  <input type="number" v-model="val.overallProfitRatio">
                  %
                </p>
              </li>
              <li>
                <span>代理节假日(结算价)</span>
                <p>
                  <input type="number" v-model="val.overallHolidayFixed">
                  <b>+</b>
                  <input type="number" v-model="val.overallHolidayPercent">
                  %
                </p>
              </li>
            </ul>
          </form>
        </div>
      </ul>
      <!-- 空隙 -->
      <li class="kongxi"></li>
    </div>
    <div class="btn_BusinessConfiguration">
      <button @click="commit()">提交</button>
    </div>
    <div class="configSuccessed" v-if="success==true" @touchmove.prevent>
      <p>业务配置成功，即时生效</p>
      <ul>
        <li @click="backIndex()">返回首页</li>
        <li @click="backManger()">返回商户管理</li>
      </ul>
    </div>
  </div>
</template>
<script>
import { checkToken, BASE_URL } from "@/api/api.js";
import { MessageBox, Toast } from "mint-ui";
const axios = require("axios");
export default {
  name: "BusinessConfiguration",
  data() {
    return {
      current: 0,
      // 上一步带过来的数据
      qdcrmUserId: "",
      merchantName: "",
      merchantId: "",
      // 业务配置
      configList: [],
      success: false,
      Msg: []
    };
  },
  methods: {
    prev() {
      this.$router.go(-1);
    },
    backIndex() {
      this.$router.push("/index");
    },
    backManger() {
      this.$router.push("/manger");
    },
    showDetail(e, num) {
      var el = e.target;
      if (num.isAdd == 1) {
        num.isAdd = 0;
      } else {
        num.isAdd = 1;
      }
    },
    // 提交配置信息
    commit() {
      // 遍历
      this.configList.forEach(function(item, i) {
        if (item.isAdd == 1) {
          var Msg = [
            {
              bizCode: item.bizCode,
              bizName: item.bizName,
              bol: "T",
              businessId: item.businessId,
              passageCode: item.passageCode,
              profitType: "1",
              items: [
                {
                  caps: item.businessModel[0].caps,
                  limits: item.businessModel[0].limits,
                  distributionId: "",
                  fixed: item.businessModel[0].fixed,
                  percent: item.businessModel[0].percent,
                  holidayFixed: item.businessModel[0].holidayFixed,
                  holidayPercent: item.businessModel[0].holidayPercent,
                  intervalId: item.businessModel[0].intervalID,
                  overallFixedRatio: item.businessModel[0].overallFixedRatio,
                  overallProfitRatio: item.businessModel[0].overallProfitRatio,
                  overallHolidayFixed:
                    item.businessModel[0].overallHolidayFixed,
                  overallHolidayPercent:
                    item.businessModel[0].overallHolidayPercent,
                  posType: "0",
                  profitPattern: "4",
                  userType: "0",
                  profitType: "1",
                  bizCode: item.bizCode,
                  bizName: item.bizName,
                  businessId: item.businessId,
                  passageCode: item.passageCode
                }
              ]
            }
          ];
          window.localStorage.setItem("msg", JSON.stringify(Msg));
          //工作日固定值
          if (
            parseFloat(item.businessModel[0].fixed) <
            parseFloat(item.businessModel[0].overallFixedRatio)
          ) {
            Toast(
              "数据配置有误:工作日收费固定值必须大于结算价固定值.\n产品名称:" +
                item.bizName
            );
            return false;
          }
          //工作日收费比例
          if (
            parseFloat(item.businessModel[0].percent) <
            parseFloat(item.businessModel[0].overallProfitRatio)
          ) {
            Toast(
              "数据配置有误:工作日收费固定值必须大于结算价固定值.\n产品名称:" +
                item.bizName
            );
            return false;
          }
          //节假日固定值
          if (
            parseFloat(item.businessModel[0].holidayFixed) <
            parseFloat(item.businessModel[0].overallHolidayFixed)
          ) {
            Toast(
              "数据配置有误:节假日收费固定值必须大于结算价固定值.\n产品名称:" +
                item.bizName
            );
            return false;
          }
          //节假日收费比例
          if (
            parseFloat(item.businessModel[0].holidayPercent) <
            parseFloat(item.businessModel[0].overallHolidayPercent)
          ) {
            Toast(
              "数据配置有误:节假日收费比例必须大于结算价收费比例.\n产品名称:" +
                item.bizName
            );
            return false;
          } else {
            return true;
          }
          var localqdcrmUserId = JSON.parse(
            window.localStorage.getItem("userInfo")
          ).qdcrmUserId;
          var agentqdcrmUserId = JSON.parse(window.localStorage.getItem("qd"));
          if (agentqdcrmUserId == localqdcrmUserId) {
            Toast("不能配置自身业务");
            return;
          }
        } else {
          var Msg = [
            {
              bizCode: item.bizCode,
              bol: "F"
            }
          ];
        }
      });
      var msgData = JSON.parse(window.localStorage.getItem("msg"));
      console.log(msgData);
      var params = new URLSearchParams();
      params.append(
        "access_token",
        JSON.parse(window.localStorage.getItem("token")).access_token
      );
      params.append(
        "qdcrmUserId",
        JSON.parse(window.localStorage.getItem("qd"))
      );
      params.append("templateId", "");
      params.append("bizType", this.merchantName);
      params.append("business", JSON.stringify(msgData));
      // 提交修改配置数据
      axios
        .post(`${BASE_URL}/msmng/api/agent/updateAgentBiz`, params, {
          header: {
            "Access-Control-Allow-Origin": "*"
          }
        })
        .then(response => {
          console.log(response.data);
          if (response.data.code == 200) {
            console.log(response.data);
            window.localStorage.removeItem("qd");
          } else {
            console(response.data.message);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
      window.localStorage.removeItem("msg");
      this.success = true;
    }
  },
  created() {
    checkToken();
    this.merchantId = JSON.parse(
      window.localStorage.getItem("agentDetails")
    ).merchantId;
    this.merchantName = JSON.parse(
      window.localStorage.getItem("agentDetails")
    ).merchantName;
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
        console.log(response.data);
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
.BusinessConfiguration {
  background: #f5f5f5;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  input:disabled {
    background: #fff;
    color: #d9d9d9;
  }
  /* 头部 */
  .header {
    width: 100%;
    height: 1.2rem;
    font-size: 0.4rem;
    font-weight: 100;
    background: @blue;
    color: #fff;
    text-align: center;
    line-height: 1.2rem;
    font-weight: 500;
    position: fixed;
    top: 0;
    z-index: 400;
  }
  .header_left {
    width: 0.4rem;
    position: absolute;
    left: 0.5rem;
    top: 0.45rem;
  }
  p {
    color: @blue;
    line-height: 1.2rem;
    margin-left: 0.5rem;
    font-size: 0.38rem;
    margin-top: 1.2rem;
    img {
      vertical-align: middle;
      width: 0.5rem;
      margin-right: 0.2rem;
    }
  }
  .BusinessConfiguration_body {
    position: absolute;
    width: 100%;
    .switch {
      width: 1rem;
      height: 1.2rem;
      float: right;
      img {
        width: 80%;
        vertical-align: middle;
      }
    }
    ul {
      width: 100%;
      height: auto;
      background: #fff;
      li {
        width: 90%;
        height: 1.2rem;
        margin: 0 auto;
        line-height: 1.2rem;
        border-bottom: 1px solid #d9d9d9; /* no */
        font-size: 0.38rem;
        .van-switch {
          float: right;
          margin-top: 0.4rem;
        }
        span {
          display: block;
          float: right;
        }
        #input {
          float: right;
          width: 2.2rem;
        }
      }
    }
    .configDetail {
      width: 100%;
      height: 6rem;
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
            margin: 0;
            color: #000;
            input {
              width: 1.7rem;
              height: 0.65rem;
              line-height: 0.65rem;
              border: 1px solid #07a0e4; /* no */
              border-radius: 5px; /* no */
              text-align: center;
            }
            b {
              color: #07a0e4;
              font-size: 0.5rem;
            }
            .input {
              width: 2rem;
            }
          }
        }
        li:nth-child(1) {
          width: 95%;
          background: #f5f5f5;
          padding-left: 0.5rem;
          color: #1c8cff;
        }
      }
    }
    .kongxi {
      width: 100%;
      height: 3rem;
    }
  }
  .btn_BusinessConfiguration {
    width: 100%;
    height: 1.5rem;
    position: fixed;
    bottom: 0rem;
    text-align: center;
    button {
      width: 90%;
      height: 1rem;
      margin: 0 auto;
      left: 0;
      right: 0;
      border: none;
      background: #1c8cff;
      border-radius: 5px; /* no */
      color: #fff;
      font-size: 0.37rem;
    }
  }
}
.configSuccessed {
  position: fixed;
  width: 100%;
  top: 0rem;
  bottom: 0;
  background: url("~@/assets/image/Manger/Agents/terminal_bg.png") no-repeat;
  background-size: 100% 100%;
  z-index: 800;
  p {
    width: 50%;
    font-size: 0.45rem;
    color: #fff;
    position: absolute;
    top: 47.3%;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
  ul {
    width: 100%;
    height: 2rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: absolute;
    bottom: 1.5rem;
    li {
      width: 30%;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
      background: #242e3e;
      border-radius: 5px; /* no */
      color: #fff;
      font-size: 0.35rem;
    }
    li:nth-child(2) {
      background: NONE;
      border: 1px solid #242e3e; /* no */
      color: #242e3e;
    }
  }
}
</style>