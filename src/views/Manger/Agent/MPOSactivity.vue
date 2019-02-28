<template>
  <div class="MPOSactivity">
    <!-- ==========  MPOS 活 动 页 面  ========== -->
    <div class="header">
      <img class="header_left" @click="prev()" src="@/assets/image/Manger/Agents/icn_back@2x.png">
      MPOS活动
    </div>
    <p>
      <img src="@/assets/image/Manger/Agents/ic-pos.png">CX00001-创鑫机构
    </p>
    <div class="MPOSactivity_body">
      <ul>
        <li>激活奖励
          <van-switch
            size="15px"
            v-model="checked"
            inactive-color="#D9D9D9"
            active-color="#1c8cff"
          />
        </li>
        <li class="li">
          金额
          <span id>元</span>
          <input id="input" type="number" placeholder="请输入金额">
        </li>
      </ul>
      <ul class="ul">
        <li>周期任务奖励
          <van-switch
            size="15px"
            v-model="check"
            inactive-color="#D9D9D9"
            active-color="#1c8cff"
          />
        </li>
        <li>
          第一期周期奖励金额
          <span id>元</span>
          <input id="input" type="number" placeholder="请输入金额">
        </li>
        <li>
          第二期周期奖励金额
          <span id>元</span>
          <input id="input" type="number" placeholder="请输入金额">
        </li>
        <li>
          第三期周期奖励金额
          <span id>元</span>
          <input id="input" type="number" placeholder="请输入金额">
        </li>
        <li>
          第四期周期奖励金额
          <span id>元</span>
          <input id="input" type="number" placeholder="请输入金额">
        </li>
        <li>
          第五期周期奖励金额
          <span id>元</span>
          <input id="input" type="number" placeholder="请输入金额">
        </li>
        <li>
          第六期周期奖励金额
          <span id>元</span>
          <input id="input" type="number" placeholder="请输入金额">
        </li>
      </ul>
    </div>
    <button @click="save()">保存</button>
  </div>
</template>
<script>
import { MessageBox } from "mint-ui";
export default {
  name: "MPOSactivity",
  data() {
    return {
      checked: false,
      check: false
    };
  },
  methods: {
    prev() {
      this.$router.go(-1);
    },
    save() {
      MessageBox("上级商户未配置业务！");
    }
  }
};
</script>
<style lang="less" scoped>
@blue: #1c8cff;
// allPages
.MPOSactivity {
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
  .MPOSactivity_body {
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
      .li {
        border: none;
      }
    }
    .ul {
      margin-top: 0.5rem;
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
  font-weight: 400;
}
.mint-msgbox-btns {
  height: 1rem;
  width: 80%;
  margin-left: 10%;
}
.mint-msgbox-confirm {
  background: #1c8cff;
  color: white;
  border-radius: 0.2rem;
}
</style>

