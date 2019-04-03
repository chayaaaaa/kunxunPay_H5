<template>
  <div class="withDraw">
    <!-- ===========   提 现 页 面   =========== -->
    <mt-header title="提 现" fixed>
      <mt-button icon="back" @click="prev()" class="header_left" slot="left"></mt-button>
      <mt-button slot="right" class="detail" @click="CAIPS()">进度查询</mt-button>
    </mt-header>
    <div class="content">
      <!-- ========  内 容  ======== -->
      <ul class="bankCard">
        <li>
          到账银行卡
          <span @click="showBankCards=true" v-if="showDef==true">{{this.message2}}</span>
          <span @click="showBankCards=true" v-if="showBankName==true">{{bankname}} ({{banknumber}})</span>
        </li>
        <li>
          资金类型
          <span class="sp" @click="showBankTypes=true">{{this.message}}</span>
        </li>
        <li>提现金额</li>
        <li>
          ￥
          <!-- 可提现金额 -->
          <input type="number" v-model="moneyCount" v-if="showHandleMoney==true">
          <!-- 全部提现 -->
          <input
            type="number"
            v-model="canBeWithdrawal"
            v-if="showAllMoney == true"
            @click="allMoneyWithdrawal()"
          >
        </li>
        <li>
          当前可提现余额 ￥{{canBeWithdrawal}}
          <span class="span" @click="allWithdrawal()">全部提现</span>
        </li>
        <button @click="startWithDraw()" v-if="showHandleMoney==true">提现</button>
        <button @click="startAllWithDraw()" v-if="showAllMoney == true">提现</button>
        <p>预计7个工作日内到账</p>
      </ul>
    </div>
    <!-- 提示框 -->
    <mt-popup v-model="showAlert" popup-transition="popup-fade">
      <div class="alertMsg">
        <div class="alertMsgText">密码错误</div>
        <div class="box alertMsgForgetPassword" @click="ForgetPassword()">忘记密码</div>
        <div class="box retry" @click="retry()">重试一次</div>
      </div>
    </mt-popup>
    <!-- 未设置支付密码提示框 -->
    <mt-popup v-model="showAlertPassword" popup-transition="popup-fade">
      <div class="alertMsg">
        <div class="alertMsgText">您还未设置支付密码~</div>
        <div class="box alertMsgForgetPassword" @click="goSetting()">去设置</div>
        <div class="box retry" @click="cancelSetting()">取消</div>
      </div>
    </mt-popup>
    <mt-popup v-model="showBankTypes" popup-transition="popup-fade">
      <!-- title -->
      <div class="title">选 择 资 金 类 型</div>
      <van-picker :columns="columns" @change="onChange" :default-index="0"/>
      <div class="box cancel" @click="cancel()">取消</div>
      <div class="box Confirm" @click="Confirm()">确认</div>
    </mt-popup>
    <van-popup
      v-model="showBankCards"
      position="bottom"
      id="popup"
      :overlay="true"
      @touchmove.prevent
      style="bottom:0rem;"
    >
      <ul class="showBankList">
        <li class="li1">
          <p>选择到账银行卡</p>
          <p>注意各行到账时间</p>
        </li>
        <div class="listBody">
          <li
            class="li2"
            v-for="(item,index) in list"
            :key="index"
            @click="getBankCardDetails(index,item)"
          >
            <span>
              <img :src="item.iconPath">
            </span>
            <span>{{item.bankName}}</span>
            <span>( {{item.cardNo}} )</span>
          </li>
        </div>
        <li class="li3" @click="addCards()">使用新卡提现</li>
      </ul>
    </van-popup>
    <van-popup v-model="show" position="bottom">
      <li class="plsPay">请输入支付密码</li>
      <li>{{this.message}}</li>
      <!-- 输入提现 -->
      <li id="getMoneyCount" v-if="showHandleMoney==true">￥ {{moneyCount}}</li>
      <!-- 全部提现 -->
      <li id="getMoneyCount" v-if="showAllMoney == true">￥ {{canBeWithdrawal}}</li>
      <li>额外扣除￥{{taxRate}}</li>
      <!-- 密码输入框 -->
      <van-password-input :value="value" @focus="showKeyboard = true"/>
      <!-- 数字键盘 -->
      <van-number-keyboard
        :show="show"
        theme="custom"
        close-button-text="完成"
        @close="showKeyBoard"
        @blur="show = false;"
        @input="onInput"
        @delete="onDelete"
        delete-button-text="删除"
      />
    </van-popup>
  </div>
</template>
<script>
import { PasswordInput, NumberKeyboard } from "vant";
import { Toast, MessageBox } from "mint-ui";
import { Popup, Picker } from "vant";
import md5 from "js-md5";
const axios = require("axios");
import "@/CSSFILE/alert.css";
import "@/CSSFILE/Order.css";
import {
  getConfigFee,
  checkToken,
  BASE_URL,
  showBankCardList,
  getCashDetails,
  queryDrawPermissions,
  checkPayPassword,
  queryPasswordExist
} from "@/api/api.js";
export default {
  name: "withDraw",
  data() {
    return {
      showBankTypes: false,
      showBankCards: false,
      value: "",
      showKeyboard: true,
      show: false,
      message: "请选择资金类型",
      message2: "请选择银行卡",
      columns: ["分润收益", "服务费返现", "激活奖励", "刷卡奖励"],
      list: [],
      allmoney: "",
      showHandleMoney: true,
      fixedFee: "", // 手续费
      bankname: "", // 银行卡名字
      banknumber: "", // 银行卡号码
      showDef: true, // 选择前的银行卡
      showBankName: false, // 选择后的银行卡
      withDrawType: "", // 提现类型
      moneyCount: "",
      canBeWithdrawal: "", // 可提现金额
      taxRate: "", // 税率
      money: "", // 资金信息
      showAllMoney: false,
      showAlert: false,
      withDraw: "", // 提现
      allWithDraw: "", // 全部提现
      itemNo: "", // 内部订单号
      showAlertPassword: false // 未设置支付密码
    };
  },

  methods: {
    prev() {
      history.go(-1);
    },
    onInput(key) {
      this.value = (this.value + key).slice(0, 6);
    },
    onDelete() {
      this.value = this.value.slice(0, this.value.length - 1);
    },
    // 关闭提现
    hideWithdraw() {
      this.allmoney = "";
    },
    // 去设置支付密码
    goSetting() {
      this.$router.push("/Setting");
    },
    // 取消设置
    cancelSetting() {
      this.showAlertPassword = false;
    },
    // 选择提现类型
    onChange(Picker, value, index) {
      this.message = value;
      switch (index) {
        // 分润收益
        case 0:
          this.withDrawType = 6;
          this.canBeWithdrawal = parseFloat(this.money.profitCanExtractAmount);
          this.taxRate = parseFloat(this.fixedFee.shareFee);
          break;
        // 服务费返现
        case 1:
          this.withDrawType = 7;
          this.canBeWithdrawal = parseFloat(this.money.dpositCanExtractAmount);
          this.taxRate = parseFloat(this.fixedFee.depositFee);
          break;
        // 激活奖励
        case 2:
          this.withDrawType = 9;
          this.canBeWithdrawal = parseFloat(this.money.mposCanExtractAmount);
          this.taxRate = parseFloat(this.fixedFee.mposFee);
          break;
        // 刷卡奖励
        case 3:
          this.withDrawType = 10;
          this.canBeWithdrawal = parseFloat(
            this.money.swipingCardCanExtractAmount
          );
          this.taxRate = parseFloat(this.fixedFee.swipeFee);
          break;
      }
      const rate = this.taxRate * 100;
      this.taxRate = parseFloat(
        (this.canBeWithdrawal * rate) / 100 + this.fixedFee.fixedFee
      ).toFixed(2);
    },
    // 全部提现
    allMoneyWithdrawal() {
      this.showAllMoney = false;
      this.showHandleMoney = true;
      this.moneyCount = "";
      console.log(this.canBeWithdrawal);
    },
    // 确认资金选择
    Confirm() {
      this.showBankTypes = false;
    },
    // 取消资金选择
    cancel() {
      this.showBankTypes = false;
    },
    // 点击获取银行与卡号
    getBankCardDetails(index, item) {
      this.bankname = item.bankName;
      this.banknumber = item.cardNo.substring(15);
      this.showDef = false;
      this.showBankName = true;
      this.showBankCards = false;
    },
    ForgetPassword() {
      this.$router.push("/forgetPWD");
    },
    retry() {
      this.showAlert = false;
      this.value = "";
      this.show = true;
    },
    // 输入提现
    startWithDraw() {
      this.value = "";
      console.log(this.withDrawType);
      console.log(this.bankname);
      if (!this.bankname) {
        Toast("请选择到账银行卡");
        return;
      }
      if (!this.withDrawType) {
        Toast("请选择资金类型");
        return;
      }
      if (parseFloat(this.moneyCount) < parseFloat(this.fixedFee)) {
        Toast("提现金额必须大于固定手续费");
        return;
      }
      if (parseFloat(this.moneyCount) > parseFloat(this.canBeWithdrawal)) {
        Toast("提现金额不可大于可提现金额");
        return;
      }
      queryPasswordExist()
        .then(response => {
          console.log(response.data);
          if (response.data.data == 1) {
            console.log(this.moneyCount);
            console.log(this.canBeWithdrawal);
            window.localStorage.setItem(
              "count",
              JSON.stringify(this.moneyCount)
            );
            if (this.withDrawType == 6) {
              queryDrawPermissions()
                .then(response => {
                  console.log(response.data.data);
                  if (response.data.data.meetCashNeeds != "1") {
                    Toast("分润收益大于1000元才能提现");
                    return;
                  }
                })
                .catch(function(error) {
                  console.log(error);
                });
            }
          } else {
            this.showAlertPassword = true;
          }
        })
        .catch(function(error) {
          console.log(error);
        });

      this.show = true;
    },
    // 全部提现
    startAllWithDraw() {
      this.value = "";
      if (!this.bankname) {
        Toast("请选择到账银行卡");
        return;
      }
      if (!this.withDrawType) {
        Toast("请选择资金类型");
        return;
      }
      if (parseFloat(this.moneyCount) < parseFloat(this.fixedFee)) {
        Toast("提现金额必须大于固定手续费");
        return;
      }
      if (parseFloat(this.moneyCount) > parseFloat(this.canBeWithdrawal)) {
        Toast("提现金额不可大于可提现金额");
        return;
      }
      queryPasswordExist().then(response => {
        console.log(response.data.data);
        if (response.data.data == 1) {
          window.localStorage.setItem(
            "countNumber",
            JSON.stringify(this.canBeWithdrawal)
          );

          if (this.withDrawType == 6) {
            queryDrawPermissions()
              .then(response => {
                console.log(response.data.data);
                if (response.data.data.meetCashNeeds != "1") {
                  Toast("分润收益大于1000元才能提现");
                  return;
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          }
        } else {
          this.showAlertPassword = true;
        }
      });

      this.show = true;
    },
    // 全部提现
    allWithdrawal() {
      this.showHandleMoney = false;
      this.showAllMoney = true;
    },
    // 提现进度查询
    CAIPS() {
      this.$router.push("/followUp");
    },
    // 跳转到添加银行卡
    addCards() {
      this.$router.push("/addBankCards");
    },
    showKeyBoard() {
      if (this.value.length != 6) {
        Toast("请输入6位数密码");
        return;
      }
      var params = new URLSearchParams();
      params.append(
        "access_token",
        JSON.parse(window.localStorage.getItem("token")).access_token
      );
      params.append(
        "qdcrmUserId",
        JSON.parse(window.localStorage.getItem("userInfo")).qdcrmUserId
      );
      params.append("payPassword", this.$md5(this.value));
      // 效验支付密码
      axios
        .post(`${BASE_URL}/msmng/api/paypassword/checkPayPassword`, params, {
          header: {
            "Access-Control-Allow-Origin": "*"
          }
        })
        .then(response => {
          this.moneyCount = "";
          console.log(response.data);
          if (response.data.data == 1) {
            if (this.showHandleMoney == true) {
              var params = new URLSearchParams();
              params.append(
                "access_token",
                JSON.parse(window.localStorage.getItem("token")).access_token
              );
              params.append(
                "qdcrmUserId",
                JSON.parse(window.localStorage.getItem("userInfo")).qdcrmUserId
              );
              params.append(
                "merchantId",
                JSON.parse(window.localStorage.getItem("userInfo")).merchantId
              );
              params.append("withdrawType", this.withDrawType); // 提现类型
              params.append("receipt", 0); // 是否提供发票 0否/1是
              params.append("bankcardNum", this.banknumber); // 银行卡号
              params.append("bankName", this.bankname); // 开户银行名
              params.append(
                "withdrawAmount",
                JSON.parse(window.localStorage.getItem("count"))
              ); // 输入提现金额
              console.log(this.moneyCount);
              params.append("payPassword", this.$md5(this.value)); // 密码
              params.append("number", Math.random());
              // 发起提现
              axios
                .post(
                  `${BASE_URL}/msmng/api/withdrawdeposit/doWithdrawDeposit`,
                  params,
                  {
                    header: {
                      "Access-Control-Allow-Origin": "*"
                    }
                  }
                )
                .then(response => {
                  console.log(response.data);
                  this.itemNo = response.data.data;
                  console.log(this.itemNo);
                  window.localStorage.setItem(
                    "itemNo",
                    JSON.stringify(this.itemNo)
                  );
                  this.$router.push("/withDrawSuccessPage");
                })
                .catch(function(error) {
                  console.log(error);
                });
              window.localStorage.removeItem("count");
            } else if (this.showAllMoney == true) {
              var params = new URLSearchParams();
              params.append(
                "access_token",
                JSON.parse(window.localStorage.getItem("token")).access_token
              );
              params.append(
                "qdcrmUserId",
                JSON.parse(window.localStorage.getItem("userInfo")).qdcrmUserId
              );
              params.append(
                "merchantId",
                JSON.parse(window.localStorage.getItem("userInfo")).merchantId
              );
              params.append("withdrawType", this.withDrawType); // 提现类型
              params.append("receipt", 0); // 是否提供发票 0否/1是
              params.append("bankcardNum", this.banknumber); // 银行卡号
              params.append("bankName", this.bankname); // 开户银行名
              params.append(
                "withdrawAmount",
                JSON.parse(window.localStorage.getItem("countNumber"))
              ); // 输入提现金额
              console.log(this.moneyCount);
              params.append("payPassword", this.$md5(this.value)); // 密码
              params.append("number", Math.random());
              // 发起提现
              axios
                .post(
                  `${BASE_URL}/msmng/api/withdrawdeposit/doWithdrawDeposit`,
                  params,
                  {
                    header: {
                      "Access-Control-Allow-Origin": "*"
                    }
                  }
                )
                .then(response => {
                  console.log(response.data);
                  this.itemNo = response.data.data;
                  console.log(this.itemNo);
                  window.localStorage.setItem(
                    "itemNo",
                    JSON.stringify(this.itemNo)
                  );
                  this.$router.push("/withDrawSuccessPage");
                })
                .catch(function(error) {
                  console.log(error);
                });
              console.log(this.itemNo);
              window.localStorage.removeItem("countNumber");
            }
          } else {
            this.showAlert = true;
          }
        })
        .catch(function(err) {
          Toast(err.message);
        });
    }
  },
  created() {
    checkToken();
    // 获取费率
    getConfigFee()
      .then(response => {
        console.log(response.data);
        // 平台固定手续费
        this.fixedFee = response.data.data;
        console.log(this.fixedFee);
      })
      .catch(function(error) {
        console.log(error);
      });
    // 银行卡列表
    showBankCardList()
      .then(response => {
        console.log(response.data);
        this.list = response.data.data;
      })
      .catch(function(error) {
        console.log(error);
      });
    // 获取可提现资金明细
    getCashDetails()
      .then(response => {
        console.log(response.data.data);
        this.money = response.data.data;
      })
      .catch(function(error) {
        console.log(error);
      });
  }
};
</script>
<style lang="less" scoped>
@blue: #1c8cff;
/* allPages */
.withDraw {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  background: #f5f5f5;
  .mint-popup {
    width: 80%;
    border-radius: 0.2rem;
    background: #fff;
  }
  .van-number-keyboard {
    height: 5rem;
    bottom: 3.75rem;
  }
  .van-popup--bottom {
    top: 1.5rem;
    bottom: 0rem;
    width: 100%;
    height: 100%;
    .van-password-input {
      margin-top: -3.5rem;
    }
    li {
      width: 90%;
      height: 1.2rem;
      text-align: center;
      line-height: 1.2rem;
      font-size: 0.45rem;
      margin: 0 auto;
    }
    .plsPay {
      border-bottom: 1px solid #d9d9d9; /* no */
    }
    li:nth-child(2) {
      border: none;
      font-size: 0.4rem;
      height: 1rem;
      line-height: 1rem;
    }
    li:nth-child(3) {
      border: none;
      height: 0.5rem;
      line-height: 0.5rem;
    }
    li:nth-child(4) {
      border: none;
      color: #606060;
      font-size: 0.3rem;
      height: 1rem;
      line-height: 1rem;
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
    font-size: 0.4rem;
  }
  .detail {
    font-size: 0.3rem;
    margin-right: 0.3rem;
    img {
      width: 0.5rem;
    }
  }
  .content {
    position: absolute;
    top: 1.2rem;
    width: 100%;
    height: 8rem;
    background: #fff;
    .bankCard {
      width: 100%;
      height: auto;
      li {
        width: 90%;
        height: 1rem;
        line-height: 1rem;
        margin: 0 auto;
        font-size: 0.4rem;
        span {
          margin-left: 1.5rem;
          color: #1c8cff;
        }
        .span {
          display: block;
          float: right;
          width: 2rem;
          height: 0.8rem;
          line-height: 0.8rem;
          text-align: center;
          border: 1px solid #1c8cff; /* no */
          margin-top: 0.3rem;
          border-radius: 5px; /* no */
        }
        .sp {
          margin-left: 1.9rem;
        }
      }
      li:nth-child(3) {
        height: 1rem;
        border-top: 1px solid #d9d9d9; /* no */
      }
      li:nth-child(4) {
        height: 1.2rem;
        border-bottom: 1px solid #d9d9d9; /* no */
        font-size: 0.6rem;
      }
      li:nth-child(5) {
        height: 1.5rem;
        line-height: 1.5rem;
        color: #606060;
      }
      button {
        width: 80%;
        height: 1rem;
        background: #1c8cff;
        border: none;
        color: #fff;
        border-radius: 5px; /* no */
        margin: 0 auto;
        position: absolute;
        left: 0;
        right: 0;
      }
      p {
        text-align: center;
        margin-top: 1.5rem;
        color: #606060;
      }
    }
  }
  // 到账银行卡
  #popup {
    position: fixed;
    bottom: 0rem !important;
    width: 100%;
    height: 100%;
    top: 9.5rem;
  }
  .showBankList {
    width: 100%;
    height: 7rem;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;

    .li1 {
      width: 100%;
      height: 1.2rem;
      border: none;
      border-bottom: 1px solid #d9d9d9;
      background: #fff;
      z-index: 900;
      p {
        line-height: 0.6rem;
        text-align: left;
        margin-left: 0.3rem;
        color: #606060;
      }
      p:nth-child(1) {
        font-size: 0.38rem;
        font-weight: 800;
        color: #222222;
      }
    }
    .listBody {
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 1;
      width: 100%;
      overflow: auto !important;
      -webkit-overflow-scrolling: touch !important;
      background: #f5f5f5;
      .li2 {
        width: 90%;
        height: 1.4rem;
        text-align: left;
        border: none;
        border-bottom: 1px solid #d9d9d9; /* no */
        margin-left: 5%;
        span {
          float: left;
          line-height: 1.4rem;
          font-size: 0.38rem;
          font-weight: 800;
          color: #222222;
          img {
            width: 60%;
            vertical-align: middle;
          }
        }
        span:nth-child(1) {
          float: left;
          width: 1.8rem;
          height: 1.4rem;
          line-height: 1.4rem;
          text-align: center;
        }
        span:nth-child(3) {
          margin-left: 0.3rem;
        }
      }
    }
    .li3 {
      width: 100%;
      height: 1.2rem !important;
      line-height: 1.2rem !important;
      font-size: 0.38rem;
      color: #222222;
      text-align: left;
      margin-left: 0.5rem;
      border: none;
    }
  }
}
.cancel {
  border-radius: 5px; /* no */
}
.Confirm {
  border-radius: 5px; /* no */
}
.van-hairline {
  width: 1rem !important;
  height: 1rem !important;
}
.alertMsg {
  width: 8rem;
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
.van-password-input__security {
  width: 75%;
  height: 1rem;
  margin: 3.5rem auto;
  border: 1px solid #d9d9d9; /* no */
}
</style>
<style lang="less">
.van-picker__toolbar {
  height: 1rem !important;
  line-height: 1rem !important;
}

.van-picker__columns .van-picker-column {
  margin-top: 0.2rem;
}
.van-picker__columns {
  margin-bottom: -1.5rem;
  height: 6rem !important;
}
.van-number-keyboard--custom .van-number-keyboard__body {
  width: 100%;
  position: absolute;
  bottom: 0;
  height: 5rem;
}
.van-key--big {
  height: 2.5rem !important;
  line-height: 2.5rem !important;
}
.van-number-keyboard__sidebar {
  height: 5rem !important;
}
</style>

