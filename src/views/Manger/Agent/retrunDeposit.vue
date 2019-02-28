<template>
  <div class="retrunDeposit">
    <!-- ==========  押 金 返 现 页 面  ========== -->
    <div class="header">
      <img class="header_left" @click="prev()" src="@/assets/image/Manger/Agents/icn_back@2x.png">
      业务配置
    </div>
    <p>
      <img src="@/assets/image/Manger/Agents/ic-pos.png">CX00001-创鑫机构
    </p>
    <div class="retrunDeposit_body">
      <ul>
        <li>押金返现
          <van-switch
            size="15px"
            v-model="checked"
            active-color="#D9D9D9"
            inactive-color="#1c8cff"
          />
        </li>
        <li>
          金额
          <span id>元</span>
          <input id="input" type="number" placeholder="请输入金额">
        </li>
      </ul>
    </div>
    <button>保存</button>
  </div>
</template>
<script>
export default {
  name: "retrunDeposit",
  data() {
    return {
      checked: false,
    };
  },
  methods: {
    prev() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less" scoped>
@blue: #1c8cff;
// allPages
.retrunDeposit {
  background: #f5f5f5;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  /* 头部 */
    .header {
    height: 1.2rem;
    font-size: 0.4rem;
    font-weight: 100;
    background: @blue;
    color: #fff;
    text-align: center;
    line-height: 1.2rem;
    font-weight: 500;
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
    img {
      vertical-align: middle;
      width: 0.5rem;
      margin-right: 0.2rem;
    }
  }
  .retrunDeposit_body {
    position: absolute;
    width: 100%;
    top: 2.4rem;
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
  }
  button {
    position: absolute;
    bottom: 1rem;
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
</style>
<style lang="less">
.mint-header-title {
  overflow: visible;
}
.mintui {
  font-size: 0.4rem;
}
</style>

