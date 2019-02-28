<template>
<div class="outBox">
    <div class="submitSuccessPage">
      <mt-header title="实 名 认 证" fixed>
      </mt-header>
      <img src="@/assets/image/Mine/Identification/loading.png">
      <p class="p1">实名认证已提交</p>
      <p>认证中......请耐心等待</p>
      <li @click="again()">返回首页</li>
    </div>
    </div>
</template>
<script>
export default {
  name: "submitSuccessPage",
  data() {
    return {};
  },
  methods: {
    again() {
      this.$router.push("/index");
    }
  }
};
</script>
<style lang="less" scoped>
@blue: #1c8cff;
/* 头部 */
.mint-header {
  height: 1.2rem;
  font-size: 0.5rem;
  font-weight: 100;
  background: @blue;
}
.header_left{
    margin-left: 0.3rem;
}
.outBox{
  width: 100%;
  height: 100%;
  background: #fff;
  position: absolute;
  top: 0;
  bottom: 0;
}
.submitSuccessPage {
  width: 100%;
  height: 8rem;
  background: url("~@/assets/image/Mine/Identification/bj.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  text-align: center;
  color: #fff;
  z-index: 500;
  .sucImg {
    width: 60%;
  }
  img {
    display: block;
    width: 3rem;
    height: 3rem;
    margin: 2rem auto;
  }
  .mint-header {
    background: none;
  }
  p {
    width: 100%;
    height: 0.5rem;
  }
  .p1 {
    margin-top: -1.5rem;
    font-size: 0.6rem;
    margin-bottom: 0.3rem;
  }
  li {
    width: 95%;
    height: 1.2rem;
    line-height: 1.2rem;
    background: #1c8cff;
    border-radius: 5px; /* no */
    color: #fff;
    position: absolute;
    bottom: -2rem;
    left: 0;
    right: 0;
    margin: 0 auto;
    font-size: 0.4rem;
    span {
      display: block;
      float: right;
    }
  }
  .li2 {
    width: 95%;
    height: 1.2rem;
    position: absolute;
    bottom: -1.3rem;
    background: #fff;
    border-radius: 0;
    border-bottom: 1px solid #d9d9d9; /* no */
    color: #000;
    text-align: left;
  }
  .li3 {
    width: 95%;
    height: 1.2rem;
    position: absolute;
    bottom: -2.6rem;
    background: #fff;
    border-radius: 0;
    color: #000;
    text-align: left;
    border-bottom: 1px solid #d9d9d9; /* no */
  }
}
</style>
