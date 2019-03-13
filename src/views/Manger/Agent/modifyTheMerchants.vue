<template>
  <div class="modifyTheMerchants">
    <!-- ===============    代 理 录 入 页 面   =============== -->
    <mt-header title="修改代理商信息" fixed>
      <mt-button icon="back" @click="prev()" slot="left"></mt-button>
    </mt-header>
    <!-- =======================     结 算 信 息   ====================== -->
    <header v-show="cur === 4" :class="{'curr':cur===4}">
      代 理 商 录 入
      <img src="@/assets/image/Manger/Agents/icn_back@2x.png" @click="prev()">
    </header>
    <!-- 基本信息 -->
    <div class="baseMsg">
      <p>
        <img src="@/assets/image/Manger/Agents/ic-baseMsg.png">
        <span>基本信息（必填）</span>
      </p>
      <ul class="listEntry" tag="listEntry">
        <li class="li">
          商户类型
          <span class="spanLI">{{MerchantsType}}</span>
        </li>
        <li class="li">
          客户类型
          <select v-model="CustomerType">
            <option selected="selected" value disabled>请选择</option>
            <option
              v-for="item in CustomerTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >{{item.label}}</option>
          </select>
        </li>
        <li class="li">
          所属上级
          <input
            class="inputStyle"
            type="text"
            v-model="qdcrmUserId"
            placeholder="请选择所属上级"
            style="direction: rtl;"
            @click="showOrgan = true"
            onfocus="this.blur()"
          >
        </li>
        <!-- 弹出层 -->
        <mt-popup v-model="showOrgan" popup-transition="popup-fade">
          <!-- title -->
          <div class="title">选 择 所 属 上 级</div>
          <van-picker :columns="queryAgents" @change="onChange"/>
          <div class="box cancel" @click="cancel()">取消</div>
          <div class="box Confirm" @click="Confirm()">确认</div>
        </mt-popup>
        <li class="li">
          短信签名
          <input
            class="inputStyle"
            type="text"
            v-model="sms"
            placeholder="请输入短信签名"
            style="direction: rtl;"
            disabled
          >
        </li>
        <li class="li">
          商户编号
          <input
            class="inputStyle number"
            type="text"
            v-model="merchantCode"
            placeholder="请输入短信签名"
            style="direction: rtl;"
            disabled
          >
        </li>
        <li class="li">
          商户名称
          <input
            class="inputStyle"
            type="text"
            v-model="name"
            placeholder="请输入商户名称"
            style="direction: rtl;"
          >
        </li>
        <li class="li">
          联系人
          <input
            class="inputStyle"
            v-model="Linkman"
            type="text"
            placeholder="请输入联系人"
            style="direction: rtl;"
          >
        </li>
        <li class="li">
          联系电话
          <input
            class="inputStyle"
            v-model="LinkPhone"
            type="tel"
            placeholder="请输入联系电话"
            style="direction: rtl;"
          >
        </li>
        <li class="li">
          商户状态
          <span class="spanLI">待激活</span>
        </li>
      </ul>
    </div>
    <button class="btn" @click="addAgent()">提交</button>
  </div>
</template>
<script>
import "@/CSSFILE/tabbar.css";
import "@/CSSFILE/Order.css";
import "@/CSSFILE/force.css";
import { Toast, MessageBox } from "mint-ui";
import { checkToken, BASE_URL } from "@/api/api.js";
const axios = require("axios");
export default {
  name: "modifyTheMerchants",
  data() {
    return {
      cur: 0,
      /*=========================        基 本 信 息        ======================== */
      /* Superior: "", //所属上级 */
      MerchantsType: "", //商户类型
      CustomerType: "", //客户类型
      sms: "【创鑫钱包】", // 短信签名
      merchantCode: "", // 商户编号
      name: "", // 商户名称
      Linkman: "", // 联系人
      LinkPhone: "", // 联系电话
      status: "2", // 商户状态
      addAgentDetails: [], // 获取代理详情
      showAddDetails: false, // 显示下一步
      qdcrmUserId: "", // 所属上级商户号
      queryAgents: [], // 储存代理商数据
      showOrgan: false,
      /* ========     代理录入基本信息下拉框    ======== */
      // 客户类型下拉框
      CustomerTypes: [
        {
          value: "1",
          label: "个人"
        },
        {
          value: "2",
          label: "企业"
        },
        {
          value: "3",
          label: "大客户"
        },
        {
          value: "4",
          label: "机构"
        }
      ]
    };
  },

  methods: {
    prev() {
      this.$router.go(-1);
    },
    Confirm() {
      this.showOrgan = false;
    },
    cancel() {
      this.showOrgan = false;
    },
    onChange(picker, value, index) {
      this.qdcrmUserId = value.text;
      this.value = value.id;
      console.log(this.value);
      console.log(this.qdcrmUserId);
      console.log(index);
    },
    addAgent() {
      checkToken();
      let _this = this;
      let getDetails = window.localStorage.getItem("queryAgentDetails");
      _this.addAgentDetails = JSON.parse(getDetails);
      console.log(_this.addAgentDetails);
      console.log(_this.MerchantsType);

      if (!_this.CustomerType) {
        MessageBox("请选择客户类型");
        return;
      }
      if (!_this.qdcrmUserId) {
        MessageBox("请选择所属上级");
        return;
      }
      if (!_this.sms) {
        MessageBox("请输入短信签名");
        return;
      }
      if (_this.merchantCode.length < 8) {
        MessageBox("请输入以字母开头的8位数编号");
        return;
      }
      if (_this.merchantCode) {
        var char = _this.merchantCode.slice(0, 1);
        var regs = /^[A-Z-a-z]$/;
        if (!regs.test(char)) {
          MessageBox("请输入以字母开头的8位数编号");
          return;
        }
      }
      if (!_this.name) {
        MessageBox("请输入联系人");
        return;
      }
      if (!_this.LinkPhone) {
        MessageBox("请输入联系电话");
        return;
      }
      if (!/^1(3|4|5|7|8)\d{9}$/.test(_this.LinkPhone)) {
        MessageBox("手机号码格式有误，请重填");
        return;
      }
      // 发起验证请求
      axios
        .get(
          `${BASE_URL}/msmng/api/agent/checkMerchantId?merchantId=${
            this.merchantCode
          }&access_token=${
            JSON.parse(window.localStorage.getItem("token")).access_token
          }`,
          {
            params: {}
          }
        )
        .then(response => {
          console.log(response.data);
          if (response.data.code == 200) {
            this.showAddDetails = true;
            let merchant = JSON.stringify({
              merchantId: this.merchantCode, // 商户编号
              merType: this.CustomerType, // 客户类型
              areaType: this.MerchantsType, // 商户类型
              merchantName: this.name, // 商户名称
              merchantStatus: this.status, // 商户状态
              smsSign: this.sms, // 短信签名
              qdcrmUserId: this.value,
              merchantAddress: "",
              fax: "",
              merchantZipCode: "",
              merchantMemo: "",
              industry0: "",
              industry1: "",
              customerId: ""
            });
            let contact = JSON.stringify({
              contactName: this.Linkman, // 联系人
              mobile: this.LinkPhone, // 联系手机
              memo: "简化录入", // 备注（简化录入）
              email: "",
              phone: "",
              department: "",
              position: "",
              qq: "",
              address: ""
            });
            let bank = JSON.stringify({
              provinceCode: "", //省码
              cityCode: "", // 城市
              bankCode: "", // 银行码
              mark: "", // 对公对私
              accountHolder: "", // 开户名
              card: "", // 开户账号
              paySystemLine: "",
              areaCode: "",
              cardType: 1,
              bankBranchCode: "" // 开户支行
            });
            var params = new URLSearchParams();
            params.append(
              "access_token",
              JSON.parse(window.localStorage.getItem("token")).access_token
            );
            params.append("merchant", merchant);
            params.append("contact", contact);
            params.append("bank", bank);
            params.append("number", Math.random());

            let res = {
              qdcrmUserId: this.value,
              merchantId: this.value,
              merchantName: this.name
            };
            console.log(res);
            window.localStorage.setItem("agentDetails", JSON.stringify(res));
            axios
              .post(`${BASE_URL}/msmng/api/agent/addAgent`, params, {
                header: {
                  "Access-Control-Allow-Origin": "*"
                }
              })
              .then(response => {
                console.log(response);
                this.$router.push("/successedPage");
              })
              .catch(function(err) {
                Toast(err.data.message);
              });
          } else if (response.data.data == 0) {
            Toast(response.data.message);
          }
        })
        .catch(function(err) {
          Toast(err.message);
        });
    }
  },
  created() {
    checkToken();
    let res = JSON.parse(window.localStorage.getItem("agentDetails"));
    let queryAgentDetailList = JSON.parse(
      window.localStorage.getItem("AgentDetailList")
    );
    console.log(res);
    this.MerchantsType = res.bizType;
    console.log(this.MerchantsType);
    if (this.MerchantsType == "o" || this.MerchantsType == "O") {
      this.MerchantsType = "机构";
    }
    if (this.MerchantsType == "P") {
      this.MerchantsType = "省代理";
    }
    if (this.MerchantsType == "C") {
      this.MerchantsType = "市代理";
    }
    if (this.MerchantsType == "D") {
      this.MerchantsType = "区县代理";
    }
    if (this.MerchantsType == "A") {
      this.MerchantsType = "代办点";
    }
    if (this.MerchantsType == "I") {
      this.MerchantsType = "行业代理";
    }
    /*     this.sms = queryAgentDetailList.merchant.smsSign; */
    this.LinkPhone = queryAgentDetailList.contact.mobile;
    this.merchantCode = res.merchantId;
    this.name = res.merchantName;
    this.Linkman = res.contactName;
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
select {
  /*很关键：将默认的select选择框样式清除*/
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  /*将背景改为红色*/
  border: none;
  float: right;
  width: 1.5rem;
  text-align: center;
  height: 1.2rem;
  direction: rtl;
  font-size: 0.35rem;
}
/*清除ie的默认选择框样式清除，隐藏下拉箭头*/
select::-ms-expand {
  display: none;
}
.van-picker__columns {
  margin-bottom: -1.5rem;
  height: 6rem !important;
  .van-picker-column {
    margin-top: -1rem;
  }
  .van-hairline--top-bottom {
    width: 0 !important;
  }
}
textarea:disabled,
input:disabled {
  background: #fff;
}
/* 头部 */
.mint-header {
  width: 100%;
  position: fixed;
  top: 0;
  height: 1.2rem;
  font-size: 0.5rem;
  font-weight: 100;
  background: #1c8cff;
  z-index: 999;
}
.modifyTheMerchants {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  .baseMsg {
    width: 100%;
    height: 100%;
    margin-top: 1.2rem;
    p {
      background: #f5f5f5;
      height: 1rem;
      line-height: 1rem;
    }
    img {
      width: 0.5rem;
      height: 0.5rem;
      margin-left: 0.4rem;
      vertical-align: middle;
    }
    span {
      color: #1c8cff;
      display: inline-block;
      position: absolute;
      font-size: 0.36rem;
    }
    li {
      width: 90%;
      height: 1.2rem;
      margin-left: 5%;
      line-height: 1.2rem;
      color: #222222;
      font-size: 0.38rem;
      background: #fff;
    }
  }
  .listEntry {
    width: 95%;
    height: auto;
    background: #fff;
    padding-left: 5%;
    .spanLI{
      width: 2rem;
      display:inline-block;
      margin-left:55%;
      color: #bdbdbd;
    }
    .li {
      border-bottom: 1px solid #ececec;
      select {
        border: none;
        appearance: none;
        -moz-appearance: none; /* Firefox */
        -webkit-appearance: none; /* Safari 和 Chrome */
        background: transparent;
        outline: none;
        background-size: 0.5rem;
        margin-right: 0.5rem;
        option {
          color: #000 !important;
        }
      }
    }
    li {
      width: 90%;
      height: 1.2rem;
      line-height: 1.2rem;
      color: #222222;
      font-size: 0.38rem;
      input {
        border: none;
      }
      .inputStyle {
        border: none;
        width: 50%;
        height: 1rem;
        position: absolute;
        float: right;
        right: 1rem;
        font-size: 0.35rem;
        line-height: 1rem;
      }
      .span_enter {
        display: inline-block;
        color: rgb(189, 189, 189);
        margin-left: 5.5rem;
      }
    }
  }
  .btn {
    border: none;
    color: #fff;
    width: 80%;
    height: 1.1rem;
    background: #1c8cff;
    border-radius: 0.15rem;
    position: absolute;
    left: 0;
    right: 0;
    margin: 0.5rem auto;
  }
}
</style>
