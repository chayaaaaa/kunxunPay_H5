<template>
  <div class="successedPages">
    <!-- ==============     录 入 成 功 页 面     =============== -->
    <p>代理商信息修改成功</p>
    <ul>
      <li class="user" @click="activateTheMerchants()">返回首页</li>
      <li class="business" @click="configBusiness()">返回商户管理</li>
    </ul>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
export default {
  name: "successedPages",
  data() {
    return {};
  },
  methods: {
    activateTheMerchants() {
      this.$router.push("/index");
    },
    configBusiness() {
      this.$router.push("/manger");
    }
  }
};
</script>
<style lang="less">
.successedPages {
  width: 100%;
  height: 100%;
  position: fixed;
  background: url("~@/assets/image/Manger/Agents/terminal_bg.png") no-repeat;
  background-size: 100% 100%;
  top: 0;
  bottom: 0rem;
  p {
    text-align: center;
    margin-top: 88%;
    color: #fff;
    font-size: 0.5rem;
  }
  ul {
    width: 100%;
    height: 1.2rem;
    text-align: center;
    display: flex;
    position: absolute;
    bottom: 2rem;
    li {
      width: 40%;
      height: 1.2rem;
      line-height: 1.2rem;
      border-radius: 0.2rem;
    }
    .user {
      background: #242e3e;
      margin-left: 5%;
      color: #fff;
    }
    .business {
      margin-left: 10%;
      background: #1c8cff;
      border: 1px solid #000; /* no */
    }
  }
}
</style>
