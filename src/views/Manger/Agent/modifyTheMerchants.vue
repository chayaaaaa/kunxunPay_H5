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
          <span>{{MerchantsType}}</span>
        </li>
        <li class="li">客户类型
          <el-select v-model="CustomerType" slot="CustomerType" dir="rtl" placeholder="个人">
            <el-option
              v-for="item in CustomerTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <li class="li">
          选择商户
          <input
            class="inputStyle"
            type="text"
            v-model="qdcrmUserId"
            placeholder="请选择商户"
            style="direction: rtl;"
            @click="showOrgan = true"
          >
        </li>
        <!-- 弹出层 -->
        <mt-popup v-model="showOrgan" popup-transition="popup-fade">
          <!-- title -->
          <div class="title">选 择 商 户</div>
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
          <span>待激活</span>
        </li>
      </ul>
    </div>
    <el-button type="primary" class="btn" @click="addAgent()">下一步</el-button>
  </div>
</template>
<script>
import "@/CSSFILE/tabbar.css";
import "@/CSSFILE/Order.css";
import "@/CSSFILE/force.css";
import { Toast, MessageBox } from "mint-ui";
import { checkToken, getRefreshToken, BASE_URL } from "@/api/api.js";
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
      sms: "", // 短信签名
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
      this.$router.push("/QueryAgent");
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
      getRefreshToken();
      let _this = this;
      let getDetails = window.localStorage.getItem("queryAgentDetails");
      _this.addAgentDetails = JSON.parse(getDetails);
      console.log(_this.addAgentDetails);
      console.log(_this.MerchantsType);

      if (!_this.CustomerType) {
        MessageBox("请选择客户类型");
        return;
      }
      if (!_this.MerchantsType) {
        MessageBox("请选择商户类型");
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
            let messageFirstPage = {
              merchantId: this.merchantCode, // 商户编号
              merType: this.CustomerType, // 客户类型
              areaType: this.MerchantsType, // 商户类型
              bizType: this.MerchantsType, // 商户类型
              merchantName: this.name, // 商户名称
              merchantStatus: this.status, // 商户状态
              qdcrmUserId: JSON.parse(window.localStorage.getItem("userInfo"))
                .qdcrmUserId, // 上级商户号
              smsSign: this.sms, // 短信签名
              contactName: this.Linkman, // 联系人
              mobile: this.LinkPhone, // 联系手机
              memo: "简化录入" // 备注（简化录入）
            };
            window.localStorage.setItem(
              "messageFirstPage",
              JSON.stringify(messageFirstPage)
            );
            this.$router.push("/modifySettleacCount");
          } else if (response.data.data == 0) {
            Toast(response.data.message);
          }
        })
        .catch(function(err) {
          Toast(err.message);
        });
    }
  },
  mounted() {
    getRefreshToken();
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
    this.sms = queryAgentDetailList.merchant.smsSign;
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

<style lang="less">
@blue: #1c8cff;
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
    border: 2px solid #1c8cff !important;
    border-left: none !important;
    border-right: none !important;
  }
  .van-picker__frame,
  .van-picker__loading .van-loading {
    top: 32%;
  }
}
.van-list__finished-text,
.van-list__loading-text {
  height: 2.5rem;
  line-height: 1rem;
}
/* toast */
.typeSelect_modifyTheMerchants {
  display: inline-block;
  margin-left: 60% !important;
  color: rgb(189, 189, 189);
}
input:disabled {
  background-color: rgb(255, 255, 255);
  color: #000;
}
.el-input.is-disabled .el-input__inner {
  background-color: rgb(255, 255, 255);
}
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
.el-select-dropdown {
  min-width: 2rem !important;
  left: 7rem !important;
}
.modifyTheMerchants {
  width: 100%;
  font-size: 0.4rem;
  position: absolute;
  top: 0;
  bottom: 0;
  background: #f5f5f5;
}
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
  line-height: 0.5rem;
}
.mint-botton-text {
  font-size: 0.3rem !important;
}
.mintui {
  font-size: 0.4rem;
}

/* 基本信息 */
.baseMsg {
  width: 100%;
  height: auto;
  line-height: 1rem;
  margin-top: 1.2rem;
  background: #fff;
  p {
    background: #f5f5f5;
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
    left: 1rem;
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
.el-input__inner {
  height: 0.7rem;
  font-size: 0.35rem;
  padding-right: 0rem !important;
}
.listEntry {
  width: 90%;
  height: auto;
  background: #fff;
  padding-left: 5%;
  .el-select {
    width: 4.5rem;
    height: 1.1rem;
    position: absolute;
    right: 1.5rem;
    color: #222222;
    border: none;

    .el-option {
      border: none;
    }
    .el-input__inner {
      line-height: 1.1rem;
      height: 1.1rem;
    }
    .el-select__caret {
      margin-left: -1.1rem;
    }
  }
  .li {
    border-bottom: 1px solid #ececec;
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
    .number {
      color: rgb(189, 189, 189);
    }
    span {
      display: inline-block;
      margin-left: 70%;
      color: rgb(189, 189, 189);
    }
  }
}
.btn {
  width: 80%;
  margin-top: 1rem;
  height: 1.1rem;
  margin-left: 10%;
  background: #1c8cff;
}
</style>
