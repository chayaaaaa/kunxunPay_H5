<template>
  <div class="removeTerminal">
    <!-- ============    终 端 转 移 页 面    =========== -->
    <mt-header title="终 端 转 移" fixed>
      <mt-button icon="back" @click="prev()" slot="left"></mt-button>
    </mt-header>
    <div class="listOut" v-if="showDefault==true">
      <form>
        <div class="removeTerminal_List">
          <mt-field label="前缀" placeholder="请输入终端序列号前缀" v-model="prefix"></mt-field>
          <mt-field label="起始串号" placeholder="请输入终端序列号起始串号" v-model="start"></mt-field>
          <mt-field label="结束串号" placeholder="请输入终端序列号结束串号" v-model="end"></mt-field>
          <mt-field label="后缀" placeholder="请输入终端序列号后缀" v-model="postfix"></mt-field>
        </div>
        <li class="Cli change">
          <span>转移商户</span>
          <span v-if="defaultvalue == true" @click="showOrgan = true">
            {{showText}}
            <span class="down">﹀</span>
          </span>
          <span v-if="IndexText == true" @click="showOrgan = true">{{showIndexText}}</span>
        </li>
        <div class="bg_btn">
          <button class="btn rst" type="reset">重置</button>
          <button class="btn sure" type="submit" @click="submitMsg()">确定</button>
        </div>
      </form>
      <!-- 弹出层 -->
      <mt-popup v-model="showOrgan" popup-transition="popup-fade">
        <!-- title -->
        <div class="title">选 择 商 户</div>
        <select
          class="select"
          v-model="optionValue"
          :label-in-value="true"
          @change="getIdValue($event)"
          id="optionText"
        >
          <option selected="selected" disabled="disabled" style="display: none" value>请选择代理商</option>
          <option
            v-for="(item,index) in queryAgents"
            :key="index"
            :value="item.id"
            :label="item.text"
          >{{item.text}}</option>
        </select>
        <div class="box cancel" @click="cancel()">取消</div>
        <div class="box Confirm" @click="Confirm()">确认</div>
      </mt-popup>
    </div>
    <!-- 提交成功 -->
    <div class="showsuccessPage" v-if="showsuccessPage==false">
      <p>终端转移申请成功</p>
      <li>
        <span class="backHome" @click="goBackHome()">返回首页</span>
        <span class="backManger" @click="goToManger()">返回商户管理</span>
      </li>
    </div>
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
import "@/CSSFILE/tabbar.css";
import "@/CSSFILE/Order.css";
import "@/CSSFILE/force.css";
import { MessageBox, Toast } from "mint-ui";
const axios = require("axios");
import qs from "qs";
import {
  shiftTerminal,
  checkToken,
  getRefreshToken,
  BASE_URL
} from "@/api/api.js";
export default {
  name: "removeTerminal",
  data() {
    return {
      active: 1,
      // 前缀
      prefix: "",
      // 起始串号
      start: "",
      // 结束串号
      end: "",
      // 后缀
      postfix: "",
      /* 选择弹框 */
      showOrgan: false,
      // 显示提交成功页面
      current: 0,
      showsuccessPage: true, // 提交页面
      // 选择器
      optionValue: "",
      showText: JSON.parse(window.localStorage.getItem("userInfo")).name, // 显示总代理
      queryAgents: [], // 储存代理商数据
      value: "", // 代理商
      showIndexText: "", //选择代理商名称
      IndexText: false, // 选择的
      defaultvalue: true, // 默认打开
      showDefault: true,
      /* tabbar */
      icon: {
        normal: require("@/assets/image/Manger/terminal/icon05.png"),
        active: require("@/assets/image/Manger/terminal/icon05_choice.png"),
        normal2: require("@/assets/image/Manger/terminal/icon06.png"),
        active2: require("@/assets/image/Manger/terminal/icon06_choice.png")
      }
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
      Toast(`当前值：${value}, 当前索引：${index}`);
    },
    Confirm() {
      this.showOrgan = false;
      this.defaultvalue = false;
      this.IndexText = true;
    },
    cancel() {
      this.showOrgan = false;
    },
    goBackHome() {
      this.$router.push("/index");
    },
    goToManger() {
      this.$router.push("/manger");
    },
    submitMsg() {
      if (!this.prefix) {
        MessageBox("请输入前缀");
        return;
      }
      if (!this.start) {
        MessageBox("请输入起始串号");
        return;
      }
      if (!this.end) {
        MessageBox("请输入结束串号");
        return;
      }
      if (!this.postfix) {
        MessageBox("请输入后缀");
        return;
      }
      if (!this.optionValue) {
        MessageBox("请选择商户");
        return;
      }
      // 提交数据
      var params = new URLSearchParams();
      params.append(
        "qdcrmUserId",
        JSON.parse(window.localStorage.getItem("userInfo")).qdcrmUserId
      );
      params.append(
        "access_token",
        JSON.parse(window.localStorage.getItem("token")).access_token
      );
      params.append("startPosId", this.start);
      params.append("endPosId", this.end);
      params.append("posBaseId", this.prefix);
      params.append("posSuffixId", this.postfix);
      params.append("number", Math.random());
      getRefreshToken();
      shiftTerminal(params)
        .then(response => {
          console.log(response);
          this.showsuccessPage = false;
          this.showDefault = false;
        })
        .catch(function() {
          Toast(err.message);
        });
    },
    getIdValue(event) {
      this.value = event.target.value;
      console.log(this.value);
      var myselect = document.getElementById("optionText");
      var index = myselect.selectedIndex; // selectedIndex代表的是你所选中项的index
      this.showIndexText = myselect.options[index].text;
      console.log(this.showIndexText);
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
.removeTerminal {
  background: #f5f5f5;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
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
.Cli{
  padding-left: 0rem;
}
.listOut {
  position: absolute;
  top: 1rem;
  width: 100%;
  height: auto;
  background: #fff;
  font-size: 0.4rem;
  .removeTerminal_List {
    width: 90%;
    margin: 0 auto;
    .mint-field {
      height: 1rem;
    }
  }
  .change {
    width: 88%;
    height: 0.5rem;
    line-height: 1.3rem;
    color: #9b9b9b;
    background: #fff;
    border-top: 1px solid #D9D9D9;/* no */
    margin-left: 0.75rem;
    span:nth-child(1) {
      color: #000;
    }
    span:nth-child(2) {
      display: block;
      float: right;
    }
  }
  .bg_btn {
    margin-top: 1rem;
    width: 100%;
    height: 3rem;
    background: #f5f5f5;
    .btn {
      width: 30%;
      height: 1rem;
      border: none;
      border-radius: 5px; /* no */
      margin-top: 2rem;
    }
    .rst {
      margin-left: 15%;
      margin-right: 10%;
      background: @blue;
      color: #fff;
    }
    .sure {
      background: #fff;
      border: 1px solid @blue; /* no */
      color: @blue;
    }
  }
}
.showsuccessPage {
  width: 100%;
  position: absolute;
  top: 1.2rem;
  bottom: 0;
  background: url("~@/assets/image/Manger/Agents/terminal_bg.png") no-repeat;
  background-size: 100% 100%;
  z-index: 300;
  p {
    width: 100%;
    text-align: center;
    color: #fff;
    font-size: 0.5rem;
    position: absolute;
    top: 50%;
    bottom: 50%;
  }
  li {
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    position: absolute;
    bottom: 2rem;
  }
  span {
    display: inline-block;
    border-radius: 0.1rem; /* no */
    width: 30%;
    height: 1rem;
  }
  .backHome {
    margin-right: 15%;
    background: #242e3e;
    color: #fff;
  }
  .backManger {
    border: 1px solid #242e3e; /* no */
    color: #242e3e;
  }
}
</style>

<style lang="less">
@blue: #1c8cff;
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
</style>
