<template>
  <div class="settleaccount">
    <!-- =======================     结 算 信 息   ====================== -->
    <mt-header title="代 理 商 录 入" fixed>
      <mt-button icon="back" @click="prev()" slot="left"></mt-button>
    </mt-header>
    <!-- 结算信息 -->
    <div class="baseMsg">
      <p>
        <img src="@/assets/image/Manger/Agents/ic-baseMsg.png" @click="prev()">
        <span>结算信息（必填）</span>
      </p>
    </div>
    <ul class="listE" tag="listE">
      <li>
        开户名
        <input
          class="inputStyle"
          v-model="accountName"
          type="text"
          placeholder="请输入开户名"
          style="direction: rtl;"
        >
      </li>
      <li>
        开户账号
        <input
          class="inputStyle"
          type="text"
          v-model="accountId"
          placeholder="请输入开户账号"
          style="direction: rtl;"
        >
      </li>
      <li>开户省
        <el-select v-model="province" dir="rtl" id="province" @change="getProvinceValue(this)">
          <el-option
            v-for="prov in provinceList.provinceList"
            :key="prov.provinceCode"
            :label="prov.provinceName"
            :value="prov.provinceCode"
          ></el-option>
        </el-select>
      </li>
      <li>开户市
        <el-select v-model="city" id="province" dir="rtl" @change="getProvinceValue(this)">
          <el-option
            v-for="item in citys"
            :key="item.cityCode"
            :label="item.cityName"
            :value="item.cityCode"
          ></el-option>
        </el-select>
      </li>
      <li>开户银行
        <el-select v-model="bank" id="province" dir="rtl" @change="getProvinceValue(this)">
          <el-option
            v-for="prov in provinceList.bankList"
            :key="prov.bankCode"
            :label="prov.bankName"
            :value="prov.bankCode"
          ></el-option>
        </el-select>
      </li>
      <li>
        开户支行
        <select v-model="branch" id="BRANCH" @change="getProvinceValue(this)">
          <option value disabled selected class="option">请选择</option>
          <option
            v-for="item in branchs.bankBranchs"
            :key="item.bankBranchCode"
            :value="item.bankBranchCode"
            :label="item.bankBranchName"
          ></option>
        </select>
      </li>
      <li>对公/对私
        <el-select
          v-model="invoiceType"
          dir="rtl"
          placeholder="对公"
          @change="getProvinceValue(this)"
        >
          <el-option label="对公" value="1"></el-option>
          <el-option label="对私" value="2"></el-option>
        </el-select>
      </li>
    </ul>
    <el-button type="primary" class="btn" @click="showSuccessed()">提交</el-button>
    <!--   <successedPage v-show="showSuccessedPage == true"></successedPage> -->
    <!-- 代 理 录 入 成 功 页 面 -->
  </div>
</template>
<script>
import successedPage from "@/views/Manger/Agent/successedPage.vue";
import {
  checkToken,
  getRefreshToken,
  getProvince,
  getCitylist,
  getbankBranchList,
  BASE_URL,
  addAgent
} from "@/api/api.js";
const axios = require("axios");
import qs from "qs";
import { Toast, MessageBox } from "mint-ui";
export default {
  inject: ["reload"],
  name: "settleaccount",
  data() {
    return {
      /*  =======================       结 算 信 息       =======================  */
      accountName: "", // 开户名
      accountId: "", // 开户账号
      city: "", // 开户市
      bank: "", // 开户银行
      branch: "", // 开户支行
      invoiceType: "", // 发票类型 对公/对私
      cur: 0,
      province: "",
      provinceList: [],
      branchs: [],
      showSuccessedPage: false,
      // 客户类型下拉框
      provinces: [], // 开户省
      citys: [], // 开户市
      banks: [], // 开户地区

      MerchantsType: JSON.parse(window.localStorage.getItem("messageFirstPage"))
        .areaType, //商户类型
      CustomerType: JSON.parse(window.localStorage.getItem("messageFirstPage"))
        .merType, //客户类型
      sms: JSON.parse(window.localStorage.getItem("messageFirstPage")).smsSign, // 短信签名
      merchantCode: JSON.parse(window.localStorage.getItem("messageFirstPage"))
        .merchantId, // 商户编号
      name: JSON.parse(window.localStorage.getItem("messageFirstPage"))
        .merchantName, // 商户名称
      Linkman: JSON.parse(window.localStorage.getItem("messageFirstPage"))
        .contactName, // 联系人
      LinkPhone: JSON.parse(window.localStorage.getItem("messageFirstPage"))
        .mobile, // 联系电话
      status: "2", // 商户状态
      qdcrmUserId: JSON.parse(window.localStorage.getItem("userInfo"))
        .qdcrmUserId // 所属上级商户号
    };
  },
  methods: {
    prev() {
      this.$router.go(-1);
    },
    getProvinceValue() {
      let provinceCode = {
        access_token: JSON.parse(window.localStorage.getItem("token"))
          .access_token,
        provinceCode: this.province
      };
      console.log(provinceCode);
      // 获取城市
      axios
        .get(`${BASE_URL}/msmng/api/bankcard/getCityList`, {
          params: provinceCode
        })
        .then(response => {
          console.log(response);
          let that = this;
          let cit = JSON.parse(response.data.data);
          console.log(cit);
          that.citys = cit.cityList;
          // 获取开户支行
          let bankCode = {
            access_token: JSON.parse(window.localStorage.getItem("token"))
              .access_token,
            provinceCode: this.province,
            cityCode: this.city,
            bankCode: this.bank
          };
          axios
            .get(`${BASE_URL}/msmng/api/bankcard/getBranchList`, {
              params: bankCode
            })
            .then(response => {
              console.log(response);
              let self = this;
              self.branchs = JSON.parse(response.data.data);
              console.log(self.branchs);
            })
            .catch(function(err) {
              Toast(err.message);
            });
        })
        .catch(function(err) {
          Toast(err.message);
        });
    },
    showSuccessed() {
      if (!this.accountName) {
        Toast("请输入开户名");
        return;
      }
      if (!this.accountId) {
        Toast("请输入账号");
        return;
      }
      let merchant = JSON.stringify({
        merchantId: this.merchantCode, // 商户编号
        merType: this.CustomerType, // 客户类型
        areaType: this.MerchantsType, // 商户类型
        merchantName: this.name, // 商户名称
        merchantStatus: this.status, // 商户状态
        smsSign: this.sms, // 短信签名
        qdcrmUserId: JSON.parse(window.localStorage.getItem("userInfo"))
          .qdcrmUserId,
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
        provinceCode: this.province, //省码
        cityCode: this.city, // 城市
        bankCode: this.bank, // 银行码
        mark: this.invoiceType, // 对公对私
        accountHolder: this.accountName, // 开户名
        card: this.accountId, // 开户账号
        paySystemLine: "",
        areaCode: "",
        cardType: 1,
        bankBranchCode: this.branch // 开户支行
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
    }
  },
  mounted() {
    /*   this.reload(); */
    getProvince()
      .then(response => {
        console.log(response);
        let that = this;
        that.provinceList = JSON.parse(response.data);
        that.banks = that.provinceList.bankList;
      })
      .catch(resp => {
        Toast(resp.message);
      });
  }
};
</script>
<style lang="less">
@blue: #1c8cff;
.settleaccount {
  width: 100%;
  font-size: 0.4rem;
  position: absolute;
  top: 0;
  bottom: 0;
  background: #f5f5f5;
  .baseMsg {
    margin-top: 1.2rem;
    width: 100%;
    height: 1.2rem;
    line-height: 1.2rem;
    img {
      width: 0.4rem;
      vertical-align: middle;
    }
    p {
      font-size: 0.38rem;
      color: @blue;
      margin-left: 0.5rem;
    }
  }
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
  line-height: 1rem;
}
.mint-botton-text {
  font-size: 0.3rem !important;
}
.mintui {
  font-size: 0.4rem;
}
/*  ==    代 理 录 入 基 本 信 息    == */

.el-input__inner {
  height: 0.7rem;
  font-size: 0.35rem;
  padding-right: 0rem !important;
  /*   margin-right: 0.7rem; */
  line-height: 0.7rem;
}
.el-select__caret {
  margin-right: -0.8rem;
  height: 0.7rem;
  margin-top: 0.2rem;
}
.el-select-dropdown {
  min-width: 0.5rem !important;
  left: 6.5rem !important;
}
#BRANCH {
  float: right;
  margin-top: 0.35rem;
  border: none;
  width: 5.5rem;
  outline: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  direction: rtl;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  font-size: 0.35rem;
  /* color: #d9d9d9; */
  color: #222 !important;
  margin-right: 1rem;
}

.listE {
  width: 100%;
  height: auto;
  background: #fff;
  padding-left: 5%;
  .el-select {
    width: 3.5rem;
    height: 1rem;
    position: absolute;
    right: 1.5rem;
    color: #222222;
    /*   border: none; */

    .el-option {
      border: none;
    }
  }
  li {
    width: 90%;
    height: 1.2rem;
    border-bottom: 1px solid #ececec;
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
